
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const http = require('http');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

app.set('io', io);

// Routes
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok', message: 'LuminaDine Backend Operational' }));

// Socket.io for Real-Time Updates
io.on('connection', (socket) => {
  console.log('Admin connected:', socket.id);
  socket.on('disconnect', () => console.log('Admin disconnected'));
});

// Database connection
const PORT = process.env.PORT || 5001;

// Start server first so API is reachable
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/restaurant')
  .then(() => console.log('MongoDB Connected Successfully!'))
  .catch(err => {
    console.error('MongoDB Connection Error. Please check your Atlas IP Whitelist or credentials:', err.message);
  });
