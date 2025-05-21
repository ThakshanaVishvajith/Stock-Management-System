const express = require('express');
const router = express.Router();
const { getCompany, updateCompany } = require('../controllers/companyController');
const { protect } = require('../middleware/authMiddleware');

// ...existing code...
router.use(protect(['admin', 'stock_manager', 'sales_rep'])); // Add all roles that need access
// ...existing code...

// Get company details
// ...existing code...
// ...existing code...
router.get('/', protect(['admin', 'stock_manager', 'sales_rep']), getCompany);
// ...existing code...
// ...existing code...

// Update company details
router.put('/', protect(['admin']), updateCompany);

module.exports = router;