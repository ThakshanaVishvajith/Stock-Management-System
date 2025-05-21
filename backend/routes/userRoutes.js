const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  getAllUsers,
  deleteUser,
  updateUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect(['admin', 'stock_manager', 'sales_rep']), getMe);

// Admin user management routes
router.get('/all', protect(['admin']), getAllUsers);
router.delete('/:id', protect(['admin']), deleteUser);
router.put('/:id', protect(['admin']), updateUser);

module.exports = router;
