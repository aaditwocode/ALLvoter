/**
 * MongoDB Connection Test Script
 * This script tests your MongoDB Atlas connection without starting the full server
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Get MongoDB URL from environment
const mongoURL = process.env.MONGODB_URL_LOCAL || process.env.MONGODB_URL || process.env.MONGODB_URI;

console.log('🧪 MongoDB Connection Test Script');
console.log('================================\n');

if (!mongoURL) {
  console.error('❌ ERROR: MongoDB connection string not found!');
  console.error('\n💡 Please set one of these in your .env file:');
  console.error('   - MONGODB_URL');
  console.error('   - MONGODB_URI');
  console.error('   - MONGODB_URL_LOCAL\n');
  process.exit(1);
}

// Display connection info (hiding credentials)
const displayURL = mongoURL.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
console.log('📝 Connection String:', displayURL);
console.log('');

// MongoDB connection options optimized for Atlas
const mongoOptions = {
  serverSelectionTimeoutMS: 10000, // 10 seconds for testing
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  retryWrites: true,
  w: 'majority',
};

console.log('🔗 Attempting to connect to MongoDB...');
console.log('⏳ Please wait...\n');

mongoose.connect(mongoURL, mongoOptions)
  .then(() => {
    console.log('✅ SUCCESS! Connected to MongoDB successfully!\n');
    console.log('📊 Connection Details:');
    console.log('   - Database:', mongoose.connection.name);
    console.log('   - Host:', mongoose.connection.host);
    console.log('   - Port:', mongoose.connection.port || 'Default');
    console.log('   - Ready State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected');
    console.log('');
    
    // Test a simple operation
    console.log('🧪 Testing database operation...');
    return mongoose.connection.db.admin().ping();
  })
  .then((result) => {
    console.log('✅ Database ping successful:', result);
    console.log('\n🎉 Your MongoDB Atlas connection is working perfectly!');
    console.log('✅ You can now start your server with: npm start\n');
    
    // Close connection
    mongoose.connection.close();
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ CONNECTION FAILED!\n');
    console.error('Error:', err.message);
    console.error('\n🔍 Troubleshooting Guide:\n');
    
    if (err.message.includes('authentication')) {
      console.error('❌ AUTHENTICATION ERROR:');
      console.error('   1. Check your username and password in the connection string');
      console.error('   2. Make sure special characters in password are URL-encoded');
      console.error('   3. Verify the database user exists in MongoDB Atlas');
      console.error('   4. Check if the user has proper permissions\n');
    } else if (err.message.includes('timeout') || err.message.includes('ETIMEDOUT')) {
      console.error('❌ CONNECTION TIMEOUT:');
      console.error('   1. Check your internet connection');
      console.error('   2. Verify your IP address is whitelisted in MongoDB Atlas');
      console.error('      → Go to: Network Access → Add IP Address');
      console.error('      → You can use "Allow Access from Anywhere" (0.0.0.0/0) for testing');
      console.error('   3. Check if the cluster is still being created (wait a few minutes)');
      console.error('   4. Verify firewall settings\n');
    } else if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
      console.error('❌ DNS/HOSTNAME ERROR:');
      console.error('   1. Check your connection string format');
      console.error('   2. Verify the cluster hostname is correct');
      console.error('   3. Make sure you copied the full connection string from Atlas\n');
    } else if (err.message.includes('bad auth') || err.message.includes('Authentication failed')) {
      console.error('❌ AUTHENTICATION FAILED:');
      console.error('   1. Double-check your username and password');
      console.error('   2. Password may contain special characters - ensure they are URL-encoded');
      console.error('   3. Try resetting your database user password in Atlas\n');
    } else {
      console.error('❌ UNKNOWN ERROR:');
      console.error('   1. Verify your connection string format:');
      console.error('      mongodb+srv://username:password@cluster.mongodb.net/database');
      console.error('   2. Check MongoDB Atlas cluster status');
      console.error('   3. Review the error message above for specific details\n');
    }
    
    console.error('📚 MongoDB Atlas Setup Checklist:');
    console.error('   ✅ Cluster created and running');
    console.error('   ✅ Database user created (Database Access)');
    console.error('   ✅ IP address whitelisted (Network Access)');
    console.error('   ✅ Connection string copied correctly');
    console.error('   ✅ Database name specified in connection string\n');
    
    process.exit(1);
  });

