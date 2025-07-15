const mongoose = require('mongoose');
require('dotenv').config();

const mongoURL = process.env.MONGODB_URL;

if (!mongoURL) {
  throw new Error("MONGODB_URL is not set in environment variables!");
}

mongoose.connect(mongoURL)
  .then(() => console.log('✅ Connected to MongoDB server'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit if DB connection fails
  });

const db = mongoose.connection;

db.on('error', (err) => console.error('MongoDB connection error:', err));
db.on('disconnected', () => console.log('⚠️ MongoDB disconnected'));

module.exports = db;