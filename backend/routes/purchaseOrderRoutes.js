// routes/purchaseOrderRoutes.js
const express = require('express');
const router = express.Router();
const {
  createPurchaseOrder,
  getAllPurchaseOrders,
  updatePurchaseOrder,
  deletePurchaseOrder
} = require('../controllers/purchaseOrderController');

const { protect } = require('../middleware/authMiddleware');

// ✅ FIX: Allow both 'admin' and 'stock_manager' roles
router.use(protect(['admin', 'stock_manager']));

router.post('/', createPurchaseOrder);
router.get('/', getAllPurchaseOrders);
router.put('/:id', updatePurchaseOrder);
router.delete('/:id', deletePurchaseOrder);

module.exports = router;
