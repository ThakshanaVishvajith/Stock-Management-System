const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getStockManagerDashboard,
  getSalesRepDashboard
} = require('../controllers/dashboardController');


const { protect } = require('../middleware/authMiddleware');

router.get('/admin', protect(['admin']), getAdminDashboard);
router.get('/stock-manager', protect(['stock_manager']), getStockManagerDashboard);
router.get('/sales-rep', protect(['sales_rep']), getSalesRepDashboard);

module.exports = router;
