const express = require('express');
const router = express.Router();
const {
  getAllPurchaseOrders,
  updateOrderStatus,
} = require('../controllers/ReceivingController');

// GET all purchase orders
router.get('/', getAllPurchaseOrders);

// PUT to update status
router.put('/:id/status', updateOrderStatus);

module.exports = router;
