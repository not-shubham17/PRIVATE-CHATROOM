const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const initializeSocket = require('./socket');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Environment variables
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || '*'; // Allow all for dev, restrict in prod

// Middleware
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

// Initialize Socket.io with CORS
const io = socketio(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

// Run Socket Logic
initializeSocket(io);

// Basic Health Check
app.get('/', (req, res) => {
  res.send('SecureRoom Server is running');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});