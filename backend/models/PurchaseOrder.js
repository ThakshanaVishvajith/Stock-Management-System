const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({
  scode: { type: String, required: true }, // Supplier code (from Supplier.scode)
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  purchasecode: { type: String, required: true,unique:true }, // Purchase order code  
  supplierInvoiceDate: { type: Date, required: true }, // Supplier's invoice date
  deliveryName: { type: String, required: true }, // Person receiving delivery
  orderDate: { type: Date, required: true },
  deliveryDate: { type: Date },
  scurrency: { type: String, required: true }, // Currency code (from Supplier.scurrency)
  spaymentdescription: { type: String, required: true }, // Payment terms (from Supplier.spaymentdescription)
  sbankname: { type: String, required: true },
  sbankaccount: { type: String, required: true },

  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // optional link
      name: { type: String, required: true }, // product name
      pcode: { type: String, required: true }, // product code
      description: { type: String }, // product description
      quantity: { type: Number, required: true, min: 1 },
      purchaseprice: { type: Number, required: true },
      amount: { type: Number, required: true }, // quantity * purchaseprice
      taxRate: { type: Number, default: 0 }, // tax % (e.g. 5, 10)
      purchaseTotal: { type: Number, required: true } // amount + tax
    }
  ],

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

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
