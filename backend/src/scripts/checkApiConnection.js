require('dotenv').config();
const http = require('http');

// Function to check if the server is running
const checkServer = async () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: process.env.PORT || 8080,
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

// Function to test admin login
const testAdminLogin = async () => {
  return new Promise((resolve, reject) => {
    const adminCredentials = {
      email: 'shourya@etherealthreads.com',
      password: 'EtherealAdmin@123'
    };
    
    const data = JSON.stringify(adminCredentials);
    
    const options = {
      hostname: 'localhost',
      port: process.env.PORT || 8080,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          console.log('Login response:', parsedData);
          
          if (res.statusCode === 200 && parsedData.success && parsedData.user && parsedData.user.role === 'admin') {
            console.log('✅ Admin login successful!');
            console.log('Token:', parsedData.token);
            console.log('User:', parsedData.user);
            resolve(true);
          } else {
            console.log('❌ Admin login failed!');
            console.log('Status code:', res.statusCode);
            console.log('Response:', parsedData);
            resolve(false);
          }
        } catch (error) {
          console.error('Error parsing response:', error);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.error('Error testing admin login:', error.message);
      resolve(false);
    });

    req.write(data);
    req.end();
  });
};

// Main function
const main = async () => {
  console.log('Checking backend server configuration...');
  
  // Check environment variables
  console.log('Environment variables:');
  console.log(`PORT: ${process.env.PORT || 8080}`);
  // Mask the MongoDB URI for logging
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ethereal-threads';
  const maskedUri = mongoUri.replace(/(mongodb:\/\/[^:]+):([^@]+)@/, '$1:****@');
  console.log(`MONGODB_URI: ${maskedUri}`);
  console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? 'Set' : 'Not set'}`);
  
  // Check server
  const serverRunning = await checkServer();
  
  if (serverRunning) {
    console.log('\n✅ Backend server is running and accessible!');
    
    // Test admin login
    console.log('\nTesting admin login...');
    const loginSuccessful = await testAdminLogin();
    
    if (loginSuccessful) {
      console.log('\n✅ Admin login is working correctly!');
    } else {
      console.log('\n❌ Admin login is not working correctly.');
      console.log('\nTroubleshooting steps:');
      console.log('1. Check if the admin user exists in the database');
      console.log('2. Check if the admin user has the correct role');
      console.log('3. Check if the password is correct');
      console.log('4. Check the server logs for any errors');
    }
  } else {
    console.log('\n❌ Backend server is not running or not accessible.');
    console.log('\nTroubleshooting steps:');
    console.log('1. Start the server with: npm run dev');
    console.log('2. Check if the port is already in use');
    console.log('3. Check if there are any network issues');
  }
};

main().catch(console.error); 