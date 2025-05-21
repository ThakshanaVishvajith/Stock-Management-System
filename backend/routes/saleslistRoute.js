const express = require('express');
const router = express.Router();
const { getAllSalesOrders } = require('../controllers/salesOrderController');
const { protect } = require('../middleware/authMiddleware');

// Only admin can access sales list
router.get('/', protect(['admin']), getAllSalesOrders);

module.exports = router;