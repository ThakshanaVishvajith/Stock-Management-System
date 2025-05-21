const express = require('express');
const router = express.Router();
const {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  updateStock,
  reorderList,
  getProductsBySupplier 
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

// ✅ Allow both admin and stock_manager sales  to access all routes
router.use(protect(['admin', 'stock_manager','sales_rep']));  // <--- this must stay here and be correct

router.get('/', getProducts);
router.post('/', addProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.patch('/:id/stock', updateStock);
router.get('/reorder/list', reorderList);

// ...existing code...

router.get('/:id', require('../controllers/productController').getProductById);

// ...existing code...




module.exports = router;
