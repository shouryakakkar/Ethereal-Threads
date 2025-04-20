const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  saveShippingAddress,
  getShippingAddresses,
  setDefaultAddress
} = require('../controllers/userController');

// Shipping address routes
router.post('/shipping-address', protect, saveShippingAddress);
router.get('/shipping-addresses', protect, getShippingAddresses);
router.put('/shipping-address/:addressId/default', protect, setDefaultAddress);

module.exports = router; 