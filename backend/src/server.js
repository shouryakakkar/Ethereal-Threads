const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const contactRoutes = require('./routes/contactRoutes');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : '*', // Allow all origins during development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

app.use(express.json());

// Define the base paths for static files
const publicPath = path.join(__dirname, '../public');
const imagesPath = path.join(publicPath, 'images');
const productsPath = path.join(imagesPath, 'products');

// Ensure the products directory exists
if (!fs.existsSync(productsPath)) {
  fs.mkdirSync(productsPath, { recursive: true });
  console.log('Created products directory:', productsPath);
}

// Serve static files from the public directory with logging
app.use('/images', (req, res, next) => {
  console.log('Static file request:', req.url);
  console.log('Looking in:', path.join(__dirname, '../public/images', req.url));
  next();
}, express.static(path.join(__dirname, '../public/images')));

// Serve static images from the static directory
app.use('/api/images/static', (req, res, next) => {
  console.log('Static image request:', req.url);
  console.log('Looking in:', path.join(__dirname, '../public/images/static', req.url));
  next();
}, express.static(path.join(__dirname, '../public/images/static')));

// Also serve images from the API URL for compatibility
app.use('/api/images', (req, res, next) => {
  console.log('API image request:', req.url);
  console.log('Looking in:', path.join(__dirname, '../public/images', req.url));
  next();
}, express.static(path.join(__dirname, '../public/images')));

// Log all available image files on startup
try {
  console.log('Products directory path:', productsPath);
  const images = fs.readdirSync(productsPath);
  console.log('Available images in products directory:', images);
} catch (error) {
  console.error('Error reading products directory:', error);
}

// Add a route to serve images directly with better error handling
app.get('/api/images/:filename', (req, res) => {
  const imagePath = path.join(productsPath, req.params.filename);
  console.log('Attempting to serve image from:', imagePath);
  
  if (fs.existsSync(imagePath)) {
    console.log('Found image, serving:', imagePath);
    return res.sendFile(imagePath);
  }
  
  // List available files in the directory for debugging
  const files = fs.readdirSync(productsPath);
  console.log('Available files in directory:', files);
  console.error('Image not found:', imagePath);
  return res.status(404).json({ error: 'Image not found' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Add a root route handler
app.get('/', (req, res) => {
  res.json({
    message: 'Ethereal Threads API is running',
    version: '1.0.0',
    endpoints: [
      '/api/auth',
      '/api/products',
      '/api/contact',
      '/api/cart',
      '/api/orders',
      '/api/users'
    ]
  });
});

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ethereal-threads';

// Set mongoose options
mongoose.set('strictQuery', false);
mongoose.set('bufferTimeoutMS', 30000);
mongoose.set('debug', true); // Enable mongoose debug mode

// Connect to MongoDB with retry logic
const connectWithRetry = async () => {
  try {
    // Set global mongoose options
    mongoose.set('strictQuery', false);
    mongoose.set('bufferTimeoutMS', 30000);
    mongoose.set('debug', true);
    
    console.log('Connecting to MongoDB...');
    console.log('Mongoose version:', mongoose.version);
    console.log('Node.js version:', process.version);

    const options = {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      retryWrites: true,
      retryReads: true
    };

    console.log('Connection options:', options);

    // Add connection attempt logging
    console.log('Attempting to connect to MongoDB...');
    const startTime = Date.now();

    await mongoose.connect(mongoUri, options);

    const endTime = Date.now();
    console.log(`Connection attempt took ${endTime - startTime}ms`);

    // Verify the connection
    const db = mongoose.connection;
    
    db.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      console.log('Error name:', err.name);
      console.log('Error code:', err.code);
      console.log('Error message:', err.message);
      console.log('Stack trace:', err.stack);
      
      if (err.name === 'MongoNetworkError' || err.name === 'MongoTimeoutError') {
        console.log('Network error detected. Attempting to reconnect...');
        setTimeout(connectWithRetry, 5000);
      }
    });

    db.on('connecting', () => {
      console.log('MongoDB connecting...');
    });

    db.on('connected', () => {
      console.log('MongoDB connected!');
    });

    db.on('disconnecting', () => {
      console.log('MongoDB disconnecting...');
    });

    db.on('disconnected', () => {
      console.log('MongoDB disconnected!');
      console.log('Attempting to reconnect...');
      setTimeout(connectWithRetry, 5000);
    });

    db.once('open', () => {
      console.log('✅ Connected to MongoDB successfully!');
      console.log('Database name:', db.name);
      console.log('Host:', db.host);
      console.log('Port:', db.port);
      console.log('Connection state:', db.readyState);
      console.log('MongoDB driver version:', mongoose.connection.client.topology.s.description);
    });

  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('Error name:', error.name);
    console.log('Error code:', error.code);
    console.log('Error message:', error.message);
    console.log('Stack trace:', error.stack);
    console.log('\nTroubleshooting steps:');
    console.log('1. Check your internet connection');
    console.log('2. Verify your MongoDB Atlas cluster is running');
    console.log('3. Check if your IP address is whitelisted in MongoDB Atlas');
    console.log('4. Try using a different network (mobile hotspot or VPN)');
    console.log('5. Check if MongoDB Atlas is experiencing any outages');
    console.log('\nRetrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

// Add global error handler for unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

// Add SIGINT handler for graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
});

connectWithRetry();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 