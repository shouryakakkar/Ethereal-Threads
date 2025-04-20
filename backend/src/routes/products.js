const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const Product = require('../models/Product');
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Debug route to check product data
router.get('/debug', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      count: products.length,
      products: products.map(p => ({
        name: p.name,
        image: p.image
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Public routes
router.get('/', getAllProducts);

// Protected admin routes
router.post('/', protect, admin, upload.single('image'), createProduct);
router.put('/:id', protect, admin, upload.single('image'), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router; 