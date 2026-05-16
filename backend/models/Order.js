
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: String,
  items: Array,
  totalAmount: Number,
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
