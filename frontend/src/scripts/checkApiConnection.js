// This script checks if the frontend can connect to the backend
console.log('Checking API connection...');
console.log('API URL:', process.env.REACT_APP_API_URL);

// Check if the API URL is defined
if (!process.env.REACT_APP_API_URL) {
  console.error('API URL is not defined. Please check your .env file.');
  process.exit(1);
}

// Try to connect to the backend
fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'shourya@etherealthreads.com',
    password: 'EtherealAdmin@123'
  }),
})
  .then(response => {
    console.log('Response status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Response data:', data);
    if (data.success && data.user && data.user.role === 'admin') {
      console.log('✅ API connection successful!');
      console.log('Admin login test successful!');
    } else {
      console.log('❌ API connection successful, but admin login failed.');
      console.log('Response:', data);
    }
  })
  .catch(error => {
    console.error('❌ API connection failed:', error.message);
    console.log('\nTroubleshooting steps:');
    console.log('1. Make sure the backend server is running (npm run dev in the backend directory)');
    console.log('2. Check if the API URL is correct in your .env file');
    console.log('3. Check if there are any CORS issues');
    console.log('4. Check if there are any network issues');
  }); 