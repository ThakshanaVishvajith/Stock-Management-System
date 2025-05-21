const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const stockController = require('../controllers/stockController');

// Product CRUD
router.post('/', productController.addProduct);
router.get('/', productController.getProducts);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Stock endpoints (handled by stockController)
router.get('/stock', stockController.getStock); // GET /api/stock/stock?name=...&supplier=...
router.put('/stock/:id', stockController.updateStock); // PUT /api/stock/stock/:id

// Filter by supplier
router.get('/supplier/:supplierId', productController.getProductsBySupplier);

// Reorder list
router.get('/reorder/list', productController.reorderList);

module.exports = router;