const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'stock_manager', 'sales_rep'], default: 'sales_rep' }
});

module.exports = mongoose.model('User', userSchema);
