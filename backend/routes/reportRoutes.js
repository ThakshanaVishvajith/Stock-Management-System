const express = require('express');
const router = express.Router();
const {
  getSalesReport,
  getSalesReportPDF,
  getSalesInvoice,
  getReorderReport
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.get('/sales', protect(['admin', 'sales_rep']), getSalesReport);
router.get('/sales/pdf', protect(['admin']), getSalesReportPDF);
router.get('/sales/:id/invoice', protect(['admin', 'sales_rep']), getSalesInvoice);
router.get('/reorder', protect(['admin', 'stock_manager']), getReorderReport);

module.exports = router;
