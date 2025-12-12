const mongoose = require('mongoose');
require('dotenv').config();

// Try local MongoDB first, then fallback to Atlas
const mongoURL = process.env.MONGODB_URL_LOCAL || process.env.MONGODB_URL;

if (!mongoURL) {
  throw new Error("MONGODB_URL or MONGODB_URL_LOCAL must be set in environment variables!");
}

console.log('🔗 Attempting to connect to MongoDB...');
mongoose.connect(mongoURL)
  .then(() => console.log('✅ Connected to MongoDB server'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('💡 Tip: Check your MongoDB connection string or ensure MongoDB is running');
    process.exit(1); // Exit if DB connection fails
  });

const db = mongoose.connection;

db.on('error', (err) => console.error('MongoDB connection error:', err));
db.on('disconnected', () => console.log('⚠️ MongoDB disconnected'));

module.exports = db;