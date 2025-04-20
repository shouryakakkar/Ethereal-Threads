const express = require('express');
const router = express.Router();
const { createMessage, getAllMessages, updateMessageStatus } = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

// Public route - Submit contact form
router.post('/', createMessage);

// Protected routes - Admin only
router.get('/', protect, authorize('admin'), getAllMessages);
router.patch('/:id/status', protect, authorize('admin'), updateMessageStatus);

module.exports = router; 