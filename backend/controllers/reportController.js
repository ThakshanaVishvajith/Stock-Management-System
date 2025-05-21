const SalesOrder = require('../models/SalesOrder');
const PurchaseOrder = require('../models/PurchaseOrder');
const Product = require('../models/Product');
const PDFDocument = require('pdfkit');

// 🔍 Generate sales report (filterable)
exports.getSalesReport = async (req, res) => {
  const { customerName } = req.query;
  const filter = customerName ? { customerName: new RegExp(customerName, 'i') } : {};
  const orders = await SalesOrder.find(filter);
  res.json(orders);
};

// 📄 Export sales report as PDF
exports.getSalesReportPDF = async (req, res) => {
  const orders = await SalesOrder.find();
  const doc = new PDFDocument();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="sales_report.pdf"');
  doc.pipe(res);

  doc.fontSize(18).text('Sales Report', { align: 'center' }).moveDown();

  orders.forEach((order, index) => {
    doc.fontSize(12).text(`${index + 1}. Customer: ${order.customerName}`);
    order.items.forEach(item => {
      doc.text(`   - ${item.name} x ${item.quantity}`);
    });
    doc.text(`   Status: ${order.status}`).moveDown();
  });

  doc.end();
};

// 🧾 Generate invoice for a sales order
exports.getSalesInvoice = async (req, res) => {
  const order = await SalesOrder.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="invoice_${order._id}.pdf"`);
  doc.pipe(res);

  doc.fontSize(20).text('Sales Invoice', { align: 'center' }).moveDown();
  doc.text(`Customer: ${order.customerName}`);
  doc.text(`Status: ${order.status}`).moveDown();
  order.items.forEach(item => {
    doc.text(`${item.name} x ${item.quantity}`);
  });

  doc.end();
};

// 📦 Reorder report (low stock)
exports.getReorderReport = async (req, res) => {
  const products = await Product.find({ $expr: { $lt: ['$quantity', '$reorderLevel'] } });
  res.json(products);
};
