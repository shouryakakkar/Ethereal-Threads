// This script checks if the backend server is running and accessible from the frontend
console.log('Checking backend server...');
console.log('API URL:', process.env.REACT_APP_API_URL);

// Check if the API URL is defined
if (!process.env.REACT_APP_API_URL) {
  console.error('API URL is not defined. Please check your .env file.');
  process.exit(1);
}

// Try to connect to the backend
fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
  method: 'HEAD',
  headers: {
    'Content-Type': 'application/json',
  },
})
  .then(response => {
    console.log('Response status:', response.status);
    if (response.ok) {
      console.log('✅ Backend server is running and accessible!');
    } else {
      console.log('❌ Backend server is running but returned an error status:', response.status);
    }
  })
  .catch(error => {
    console.error('❌ Backend server is not accessible:', error.message);
    console.log('\nTroubleshooting steps:');
    console.log('1. Make sure the backend server is running (npm run dev in the backend directory)');
    console.log('2. Check if the API URL is correct in your .env file');
    console.log('3. Check if there are any CORS issues');
    console.log('4. Check if there are any network issues');
  }); 