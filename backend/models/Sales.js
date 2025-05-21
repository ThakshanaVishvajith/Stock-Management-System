const mongoose = require('mongoose');

const salesOrderSchema = new mongoose.Schema({
  salesordercode: { type: String, required: true, unique: true }, // Sales order code
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  customerName: { type: String, required: true },
  customerPhone: { type: String },
  deliveryAddress: { type: String },
  currency: { type: String },
  paymentTerms: { type: String },

  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      productName: { type: String, required: true },
      productCode: { type: String, required: true },
      description: { type: String },
      sellingPrice: { type: Number, required: true },
      quantity: { type: Number, required: true, min: 1 },
      amount: { type: Number, required: true } // quantity * sellingPrice
    }
  ],

  salesDiscount: { type: Number, default: 0 }, // Discount on the order
  salesOrderDate: { type: Date, required: true }, // Date of sales order
  requiredDate: { type: Date }, // Date order is required
  subTotal: { type: Number, required: true }, // Sum before discount

  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SalesOrder', salesOrderSchema);