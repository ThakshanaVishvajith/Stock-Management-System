// models/Supplier.js
const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  scode: { type: String, required: true, unique: true }, // Unique supplier code
  scurrency: { type: String, required: true },
  sbankname: { type:String,required:true},
  sbankaccount:{type:String,required:true},
  spaymentdescription:{type:String,required:true},// Currency used by the supplier
  company: String,
  email: String,
  phone: String,
  address: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // 🔗 Linked products
}, {
  timestamps: true,
});

module.exports = mongoose.model('Supplier', supplierSchema);
