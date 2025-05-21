// controllers/ReceivingController.js
const PurchaseOrder = require('../models/PurchaseOrder');
const Product = require('../models/Product');

// Get all purchase orders (for receiving page)
exports.getAllPurchaseOrders = async (req, res) => {
  try {
    const orders = await PurchaseOrder.find()
      .populate('supplier', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};


const adjustProductStock = async (productId, quantityChange) => {
  const product = await Product.findById(productId);
  if (product) {
    product.stock = (product.stock || 0) + Number(quantityChange);
    await product.save();
  }
};





// Update order status
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['pending', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const order = await PurchaseOrder.findById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Only update stock if changing from not completed to completed
    if (order.status !== 'completed' && status === 'completed') {
      for (const item of order.items) {
        await adjustProductStock(item.product, item.quantity);
      }
    }

    // Update the order status
    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};
// In your receiving controller
exports.getReceivingOrders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;

  const filter = {};
  if (status) filter.status = status;

  const total = await PurchaseOrder.countDocuments(filter);
 const orders = await PurchaseOrder.find(filter)
  .populate('supplier', 'name')
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();

orders.forEach(order => {
  if (!Array.isArray(order.items)) order.items = [];
});

  res.json({
    orders,
    total,
    totalPages: Math.ceil(total / limit),
    page
  });
};