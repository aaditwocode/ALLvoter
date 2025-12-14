const mongoose = require('mongoose');
require('dotenv').config();

// Try local MongoDB first, then fallback to Atlas
const mongoURL = process.env.MONGODB_URL_LOCAL || process.env.MONGODB_URL || process.env.MONGODB_URI;

if (!mongoURL) {
  console.error('❌ MongoDB connection string not found!');
  console.error('💡 Please set MONGODB_URL, MONGODB_URL_LOCAL, or MONGODB_URI in your .env file');
  console.error('💡 For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/database');
  throw new Error("MONGODB_URL, MONGODB_URL_LOCAL, or MONGODB_URI must be set in environment variables!");
}

// MongoDB connection options optimized for Atlas
const mongoOptions = {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  connectTimeoutMS: 10000, // Give up initial connection after 10s
  retryWrites: true, // Retry failed writes
  w: 'majority', // Write concern
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 5, // Maintain at least 5 socket connections
  maxIdleTimeMS: 30000, // Close connections after 30s of inactivity
};

console.log('🔗 Attempting to connect to MongoDB...');
console.log('📝 Connection URL:', mongoURL.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs

mongoose.connect(mongoURL, mongoOptions)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('💡 Troubleshooting tips:');
    console.error('   1. Check your MongoDB connection string format');
    console.error('   2. For Atlas: Ensure your IP is whitelisted in Network Access');
    console.error('   3. For Atlas: Verify username/password are correct');
    console.error('   4. Check internet connectivity');
    console.error('   5. Verify MongoDB service is running (for local)');
    process.exit(1); // Exit if DB connection fails
  });

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
  if (err.message.includes('authentication')) {
    console.error('💡 Authentication failed. Check your username and password.');
  } else if (err.message.includes('timeout')) {
    console.error('💡 Connection timeout. Check your network or MongoDB Atlas IP whitelist.');
  }
});

db.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected. Attempting to reconnect...');
});

db.on('reconnected', () => {
  console.log('✅ MongoDB reconnected successfully!');
});

// Handle process termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 MongoDB connection closed due to app termination');
  process.exit(0);
});

module.exports = db;