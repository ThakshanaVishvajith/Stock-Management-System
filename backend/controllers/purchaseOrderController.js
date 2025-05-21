const mongoose = require('mongoose');
const PurchaseOrder = require('../models/PurchaseOrder');
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

// 🔧 Helper: Generate unique purchase order code
const generatePurchaseOrderCode = async () => {
  const count = await PurchaseOrder.countDocuments();
  const nextNumber = count + 1;
  return `PU-${nextNumber.toString().padStart(6, '0')}`;
};

// 🔧 Helper: Adjust stock (increase or decrease)
const adjustProductStock = async (productId, quantityChange) => {
  const product = await Product.findById(productId);
  if (product) {
    product.stock = (product.stock || 0) + Number(quantityChange);
    await product.save();
  }
};

// ✅ Create Purchase Order
exports.createPurchaseOrder = async (req, res) => {
  const {
    supplier,
    supplierInvoiceDate,
    deliveryName,
    orderDate,
    deliveryDate,
    scurrency,
    spaymentdescription,
    sbankname,
    sbankaccount,
    items
  } = req.body;

  if (!supplier || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Supplier and items are required' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const purchasecode = await generatePurchaseOrderCode();

    const purchaseOrderData = {
      purchasecode,
       scode: req.body.scode,
      supplier,
      supplierInvoiceDate,
      deliveryName,
      orderDate,
      deliveryDate,
      scurrency,
      spaymentdescription,
      sbankname,
      sbankaccount,
      items: items.map(item => ({
        product: item.product,
        name: item.name,
        pcode: item.pcode,
        description: item.description,
        quantity: item.quantity,
        purchaseprice: item.purchaseprice,
        amount: item.amount,
        taxRate: item.taxRate,
        purchaseTotal: item.purchaseTotal
      }))
    };

    const order = await PurchaseOrder.create([purchaseOrderData], { session });

    // Increase product stock
    

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(order[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
};

// ✅ Update Purchase Order
exports.updatePurchaseOrder = async (req, res) => {
  const { id } = req.params;
  const {
    supplier,
    items,
    supplierInvoiceDate,
    deliveryName,
    orderDate,
    deliveryDate,
    scurrency,
    spaymentdescription,
    sbankname,
    sbankaccount,
    status // <-- Accept status from request
  } = req.body;

  if (!supplier || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Supplier and items are required' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const oldOrder = await PurchaseOrder.findById(id);
    if (!oldOrder) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Order not found' });
    }

    // Reverse old stock ONLY if oldOrder.status === 'completed'
    if (oldOrder.status === 'completed') {
      for (const item of oldOrder.items) {
        await adjustProductStock(item.product, -item.quantity);
      }
    }

    // Update order
    const updatedOrder = await PurchaseOrder.findByIdAndUpdate(
      id,
      {
        supplier,
        items,
        supplierInvoiceDate,
        deliveryName,
        orderDate,
        deliveryDate,
        scurrency,
        spaymentdescription,
        sbankname,
        sbankaccount,
        status // <-- Save new status
      },
      { new: true, session }
    );

    // Apply new stock ONLY if new status is 'completed'
    if (oldOrder.status !== 'completed' && status === 'completed') {
      for (const item of items) {
        await adjustProductStock(item.product, item.quantity);
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.json(updatedOrder);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Failed to update order', error: err.message });
  }
};

// ✅ Get All Purchase Orders
exports.getAllPurchaseOrders = async (req, res) => {
  try {
    const orders = await PurchaseOrder.find()
      .populate('supplier', 'name company')
      .populate('items.product', 'name pcode');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load orders', error: err.message });
  }
};

// ✅ Delete Purchase Order
exports.deletePurchaseOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await PurchaseOrder.findById(req.params.id);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Order not found' });
    }

    // Revert product stock
    for (const item of order.items) {
      await adjustProductStock(item.product, -item.quantity);
    }

    await PurchaseOrder.findByIdAndDelete(req.params.id, { session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: 'Purchase order deleted and stock reverted' });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Failed to delete order', error: err.message });
  }
};


