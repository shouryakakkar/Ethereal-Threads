const mongoose = require('mongoose');
const Product = require('../models/Product');
const products = require('../data/products');
require('dotenv').config();

const seedProducts = async () => {
  try {
    // Log connection attempt with masked URI
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ethereal-threads';
    const maskedUri = mongoUri.replace(/(mongodb:\/\/[^:]+):([^@]+)@/, '$1:****@');
    console.log(`Connecting to MongoDB at: ${maskedUri}`);

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ethereal-threads');
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    await Product.insertMany(products);
    console.log('Added sample products');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts(); 