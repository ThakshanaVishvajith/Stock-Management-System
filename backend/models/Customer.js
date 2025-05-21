const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    customertype: { type: String },
    email: { type: String },
    deliveryaddress: { type: String },
    currency: { type: String },
    bankaccount: { type: String },
    bankname: { type: String },
    paymentterms: { type: String },
    customers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Customer', customerSchema);


