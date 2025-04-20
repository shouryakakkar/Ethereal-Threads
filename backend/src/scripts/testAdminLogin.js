require('dotenv').config();
const http = require('http');

// Admin credentials from createAdmin.js
const adminCredentials = {
  email: 'shourya@etherealthreads.com',
  password: 'EtherealAdmin@123'
};

// Function to test admin login
const testAdminLogin = async () => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(adminCredentials);
    
    const options = {
      hostname: 'localhost',
      port: process.env.PORT || 5000,
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
  console.log('Testing admin login...');
  console.log('Using credentials:');
  console.log(`Email: ${adminCredentials.email}`);
  console.log(`Password: ${adminCredentials.password}`);
  
  const success = await testAdminLogin();
  
  if (!success) {
    console.log('\nTroubleshooting steps:');
    console.log('1. Make sure the backend server is running (npm run dev)');
    console.log('2. Verify that the admin user exists in the database');
    console.log('3. Check if the admin user has the correct role');
    console.log('4. Verify that the password is correct');
    console.log('5. Check the server logs for any errors');
  }
};

main().catch(console.error); 