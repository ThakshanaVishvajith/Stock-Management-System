const express = require('express');
const router = express.Router();
const {
  createSalesOrder,
  getAllSalesOrders,
  updateSalesOrder,
  deleteSalesOrder,
  generateSalesOrderCode
} = require('../controllers/salesOrderController');

const { protect } = require('../middleware/authMiddleware');



router.get('/generate-code', async (req, res) => {
  try {
    const code = await generateSalesOrderCode();
    res.json({ code });
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate code' });
  }
});

// Allow admin and sales_rep to manage sales orders
router.use(protect(['admin', 'sales_rep']));

router.post('/', createSalesOrder);
router.get('/', getAllSalesOrders);
router.put('/:id', updateSalesOrder);
router.delete('/:id', deleteSalesOrder);

module.exports = router;
