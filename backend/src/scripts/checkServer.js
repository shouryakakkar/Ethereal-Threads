require('dotenv').config();
const http = require('http');

// Function to check if the server is running
const checkServer = async () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: process.env.PORT || 5000,
      path: '/api/auth/login',
      method: 'HEAD'
    };

    const req = http.request(options, (res) => {
      console.log(`Server status: ${res.statusCode}`);
      if (res.statusCode >= 200 && res.statusCode < 300) {
        resolve(true);
      } else {
        resolve(false);
      }
    });

    req.on('error', (error) => {
      console.error('Error checking server:', error.message);
      resolve(false);
    });

    req.end();
  });
};

// Function to check MongoDB connection
const checkMongoDB = async () => {
  try {
    const mongoose = require('mongoose');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ethereal-threads');
    console.log('MongoDB connection successful');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    return false;
  }
};

// Main function
const main = async () => {
  console.log('Checking backend server configuration...');
  
  // Check environment variables
  console.log('Environment variables:');
  console.log(`PORT: ${process.env.PORT || 5000}`);
  // Mask the MongoDB URI for logging
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ethereal-threads';
  const maskedUri = mongoUri.replace(/(mongodb:\/\/[^:]+):([^@]+)@/, '$1:****@');
  console.log(`MONGODB_URI: ${maskedUri}`);
  console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? 'Set' : 'Not set'}`);
  
  // Check MongoDB connection
  const mongoConnected = await checkMongoDB();
  
  // Check server
  const serverRunning = await checkServer();
  
  console.log('\nDiagnostic Summary:');
  console.log(`MongoDB Connection: ${mongoConnected ? '✅ Connected' : '❌ Failed'}`);
  console.log(`Server Status: ${serverRunning ? '✅ Running' : '❌ Not running'}`);
  
  if (!mongoConnected || !serverRunning) {
    console.log('\nRecommendations:');
    if (!mongoConnected) {
      console.log('- Check your MongoDB connection string in .env file');
      console.log('- Make sure MongoDB is running on your system');
    }
    if (!serverRunning) {
      console.log('- Start the server with: npm run dev');
      console.log('- Check if the port is already in use');
    }
  } else {
    console.log('\n✅ Backend server is properly configured and running');
  }
};

main().catch(console.error); 