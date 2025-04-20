const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    console.log('Retrieved products:', products.map(p => ({ name: p.name, image: p.image })));
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Get a single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, category, stock } = req.body;
    console.log('Request body:', req.body);
    console.log('File details:', req.file);
    console.log('Headers:', req.headers);

    // Validate required fields
    if (!name || !price || !description || !category || !stock) {
      console.log('Missing required fields:', {
        name: !name,
        price: !price,
        description: !description,
        category: !category,
        stock: !stock
      });
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        details: {
          name: !name,
          price: !price,
          description: !description,
          category: !category,
          stock: !stock
        }
      });
    }

    // Handle image path
    let imagePath = null;
    if (req.file) {
      // Store the path with the correct prefix
      imagePath = `/images/products/${req.file.filename}`;
      console.log('Image upload successful:', {
        originalName: req.file.originalname,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: imagePath
      });
    } else {
      console.log('No file uploaded with request');
      return res.status(400).json({
        success: false,
        message: 'Image is required for new products'
      });
    }

    const product = new Product({
      name,
      price,
      description,
      category,
      stock,
      image: imagePath
    });

    console.log('Attempting to save product:', product);
    const savedProduct = await product.save();
    console.log('Product saved successfully:', savedProduct);

    res.status(201).json({
      success: true,
      data: savedProduct
    });
  } catch (error) {
    console.error('Error creating product:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, category, stock } = req.body;
    const updateData = { 
      name, 
      price: parseFloat(price), 
      description, 
      category, 
      stock: parseInt(stock) 
    };

    if (req.file) {
      // Store the path with the correct prefix
      updateData.image = `/images/products/${req.file.filename}`;
      console.log('Updated image path:', updateData.image);
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
}; 