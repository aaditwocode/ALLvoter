/**
 * Test MongoDB Atlas Connection
 * This will test your Atlas connection specifically
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Force use of Atlas URL (not local)
const mongoURL = process.env.MONGODB_URL;

console.log('🧪 Testing MongoDB Atlas Connection');
console.log('===================================\n');

if (!mongoURL) {
  console.error('❌ ERROR: MONGODB_URL not found in .env file');
  process.exit(1);
}

// Display connection info (hiding credentials)
const displayURL = mongoURL.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
console.log('📝 Connection String:', displayURL);
console.log('');

// Check if database name is in the connection string
const urlParts = mongoURL.split('?');
const baseUrl = urlParts[0];
const hasDatabase = baseUrl.includes('/') && !baseUrl.endsWith('/') && baseUrl.split('/').length > 3;

if (!hasDatabase) {
  console.warn('⚠️  WARNING: Database name not specified in connection string!');
  console.warn('   Adding default database name: allvoter\n');
  
  // Add database name if missing
  let updatedURL = mongoURL;
  if (updatedURL.includes('mongodb+srv://')) {
    // For mongodb+srv://, add database before the query string
    const hostnameEnd = updatedURL.indexOf('.mongodb.net');
    if (hostnameEnd > 0) {
      const beforeQuery = updatedURL.substring(0, hostnameEnd + 12); // +12 for '.mongodb.net'
      const queryPart = updatedURL.substring(hostnameEnd + 12);
      if (queryPart.startsWith('/')) {
        // Already has a path, check if it's just /
        if (queryPart === '/' || queryPart.startsWith('/?')) {
          updatedURL = beforeQuery + '/allvoter' + (queryPart.startsWith('/?') ? queryPart.substring(1) : queryPart);
        } else {
          updatedURL = mongoURL; // Already has database name
        }
      } else if (queryPart.startsWith('?')) {
        updatedURL = beforeQuery + '/allvoter' + queryPart;
      } else {
        updatedURL = beforeQuery + '/allvoter';
      }
    }
  }
  
  console.log('📝 Updated URL:', updatedURL.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
  console.log('💡 To fix permanently, update your .env file:\n');
  console.log('   MONGODB_URL=' + updatedURL + '\n');
  
  // Use updated URL for testing
  var testURL = updatedURL;
} else {
  var testURL = mongoURL;
}

// MongoDB connection options
const mongoOptions = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  retryWrites: true,
  w: 'majority',
};

console.log('🔗 Attempting to connect to MongoDB Atlas...');
console.log('⏳ Please wait (this may take 10-15 seconds)...\n');

mongoose.connect(testURL, mongoOptions)
  .then(() => {
    console.log('✅ SUCCESS! Connected to MongoDB Atlas!\n');
    console.log('📊 Connection Details:');
    console.log('   - Database:', mongoose.connection.name);
    console.log('   - Host:', mongoose.connection.host);
    console.log('   - Ready State: Connected');
    console.log('');
    
    return mongoose.connection.db.admin().ping();
  })
  .then((result) => {
    console.log('✅ Database ping successful:', result);
    console.log('\n🎉 Your MongoDB Atlas connection is working perfectly!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Update your .env file with the corrected connection string (if database was missing)');
    console.log('   2. Remove MONGODB_URL_LOCAL if you want to use Atlas exclusively');
    console.log('   3. Start your server with: npm start\n');
    
    mongoose.connection.close();
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ CONNECTION FAILED!\n');
    console.error('Error:', err.message);
    console.error('\n🔍 Troubleshooting:\n');
    
    if (err.message.includes('authentication') || err.message.includes('bad auth')) {
      console.error('❌ Authentication Error:');
      console.error('   • Check username and password in connection string');
      console.error('   • If password has special characters, URL-encode them:');
      console.error('     @ → %40, # → %23, : → %3A, % → %25, / → %2F');
      console.error('   • Verify user exists in Atlas → Database Access\n');
    } else if (err.message.includes('timeout') || err.message.includes('ETIMEDOUT')) {
      console.error('❌ Connection Timeout:');
      console.error('   • Check Network Access in Atlas → Add your IP address');
      console.error('   • For testing, you can use "Allow Access from Anywhere" (0.0.0.0/0)');
      console.error('   • Ensure your cluster is fully created (wait a few minutes)\n');
    } else if (err.message.includes('ENOTFOUND')) {
      console.error('❌ Hostname Error:');
      console.error('   • Verify cluster hostname is correct');
      console.error('   • Copy connection string directly from Atlas → Connect button\n');
    } else {
      console.error('❌ Connection Error:');
      console.error('   • Verify connection string format');
      console.error('   • Check Atlas cluster status');
      console.error('   • Review error details above\n');
    }
    
    process.exit(1);
  });

