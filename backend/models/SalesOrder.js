const mongoose = require('mongoose');

const salesOrderSchema = new mongoose.Schema({
  salesordercode: { type: String, required: true, unique: true }, // <-- Add this
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }, // optional, if you want reference
  customerName: { type: String, required: true },
  customerPhone: { type: String },
  deliveryAddress: { type: String },
  currency: { type: String },
  paymentTerms: { type: String },
  salesOrderDate: { type: Date }, // <-- Add this
  requiredDate: { type: Date },   // <-- Add this
  salesDiscount: { type: Number, default: 0 },
  subTotal: { type: Number, default: 0 }, // <-- Add this
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      productName: String,
      productCode: String,
      description: String,
      sellingPrice: Number,
      quantity: Number,
      amount: Number
    }
  ],
  status: { type: String, enum: ['completed', 'cancelled'], default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SalesOrder', salesOrderSchema);