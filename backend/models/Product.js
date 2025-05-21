// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pcode: { type: String, required: true, unique: true },
  description: { type: String },
  pbrand: { type: String },
  pcolor: { type: String },
  psize: { type: String },
  pweight: { type: String },
  pdimensions: { type: String },
  category: { type: String },
  purchaseprice: { type: Number, required: true },
  sellingprice: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true }, // 🔗 link to supplier
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
