const fs = require('fs');
const path = require('path');

const dirs = [
  'controllers', 'models', 'routes', 'middleware', 'services', 'utils'
];

dirs.forEach(dir => {
  fs.mkdirSync(path.join(__dirname, '..', 'backend', dir), { recursive: true });
});

const serverJs = `
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

// Routes
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok', message: 'LuminaDine Backend Operational' }));

// Socket.io for Real-Time Updates
io.on('connection', (socket) => {
  console.log('Admin connected:', socket.id);
  socket.on('disconnect', () => console.log('Admin disconnected'));
});

// Database
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/restaurant').then(() => {
  console.log('MongoDB Connected');
  server.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
}).catch(err => console.log(err));
`;

fs.writeFileSync(path.join(__dirname, '..', 'backend', 'server.js'), serverJs);

const orderModel = `
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: String,
  items: Array,
  totalAmount: Number,
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
`;
fs.writeFileSync(path.join(__dirname, '..', 'backend', 'models', 'Order.js'), orderModel);

console.log("Backend scaffolding complete.");
