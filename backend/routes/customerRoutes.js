const express = require('express');
const router = express.Router();
const {
    addCustomer,
    getCustomers,
    updateCustomer,
    deleteCustomer
} = require('../controllers/CustomerController');

const { protect } = require('../middleware/authMiddleware');

// All customer routes accessible to admin and sales_rep
router.use(protect(['admin', 'sales_rep']));

router.post('/', addCustomer);
router.get('/', getCustomers);
router.get('/customers', getCustomers);
router.get('/:id', getCustomers);
router.get('/customer/:id', getCustomers);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;