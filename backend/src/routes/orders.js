const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  createOrder, 
  getUserOrders, 
  getOrderDetails 
} = require('../controllers/orderController');

// Create a new order
router.post('/create', protect, createOrder);

// Get all orders for a user
router.get('/user-orders', protect, getUserOrders);

// Get specific order details
router.get('/:orderId', protect, getOrderDetails);

module.exports = router; 