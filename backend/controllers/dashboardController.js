const PurchaseOrder = require('../models/PurchaseOrder');
const SalesOrder = require('../models/SalesOrder');
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const User = require('../models/User');

// ✅ Admin dashboard
exports.getAdminDashboard = async (req, res) => {
  const totalPurchaseOrders = await PurchaseOrder.countDocuments();
  const totalSalesOrders = await SalesOrder.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalSuppliers = await Supplier.countDocuments();
  const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });

  const totalReturns = 1;
  const totalBO = 4;
  const totalReceiving = 6;

  res.json({
    totalPurchaseOrders,
    totalSalesOrders,
    totalProducts,
    totalSuppliers,
    totalUsers,
    totalReturns,
    totalBO,
    totalReceiving
  });
};

// ✅ Stock Manager dashboard
exports.getStockManagerDashboard = async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const totalSuppliers = await Supplier.countDocuments();
  const totalPurchaseOrders = await PurchaseOrder.countDocuments();

  res.json({
    totalProducts,
    totalSuppliers,
    totalPurchaseOrders,
  });
};

// ✅ Sales Rep dashboard
exports.getSalesRepDashboard = async (req, res) => {
  const totalSalesOrders = await SalesOrder.countDocuments();
  const totalProducts = await Product.countDocuments();

  res.json({
    totalSalesOrders,
    totalProducts,
  });
};
