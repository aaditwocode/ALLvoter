const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();

const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

const PORT = process.env.PORT || 3000;

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    database: db.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the ALLvoter Voting App API' });
});

// Import routers
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const electionRoutes = require('./routes/electionRoutes');
const geminiRoutes = require('./routes/geminiRoutes'); // <--- Kept this

// Use routers
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);
app.use('/election', electionRoutes);
app.use('/gemini', geminiRoutes); // <--- This activates the route

// 404 handler (Must be after routes)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start server
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`✅ Server listening on port ${PORT}`);
  });
};

if (db.readyState === 1) {
  startServer();
} else {
  db.once('connected', startServer);
  db.once('error', () => process.exit(1));
}