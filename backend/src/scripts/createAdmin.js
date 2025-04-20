require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

// Admin credentials
const adminUser = {
  name: 'Admin Shourya Kakkar',
  email: 'shourya@etherealthreads.com',
  password: 'EtherealAdmin@123',
  role: 'admin'
};

// Log connection attempt with masked URI
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ethereal-threads';
const maskedUri = mongoUri.replace(/(mongodb:\/\/[^:]+):([^@]+)@/, '$1:****@');
console.log(`Connecting to MongoDB at: ${maskedUri}`);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ethereal-threads')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Check if admin already exists
      const existingAdmin = await User.findOne({ email: adminUser.email });
      
      if (existingAdmin) {
        console.log('Admin user already exists');
        process.exit(0);
      }
      
      // Create admin user
      const admin = await User.create(adminUser);
      console.log('Admin user created successfully:', admin.email);
      process.exit(0);
    } catch (error) {
      console.error('Error creating admin user:', error);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 