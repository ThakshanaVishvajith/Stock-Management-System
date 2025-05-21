const express = require('express');
const router = express.Router();
const {
  addSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController');

const { protect } = require('../middleware/authMiddleware');

// Only stock_manager can manage suppliers
router.use(protect(['stock_manager', 'admin',]));

router.post('/', addSupplier);
router.get('/', getSuppliers);
router.put('/:id', updateSupplier);
router.delete('/:id', deleteSupplier);




module.exports = router;
