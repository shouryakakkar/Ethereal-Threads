const https = require('https');
const fs = require('fs');
const path = require('path');

// API URL
const API_URL = 'https://ethereal-threads-backend.onrender.com';

// Images to test
const images = [
  '/api/images/static/logo.png',
  '/api/images/static/hero-image.jpeg',
  '/api/images/static/testimonial-1.jpg',
  '/api/images/static/testimonial-2.jpg',
  '/api/images/static/testimonial-3.jpg',
  '/api/images/static/placeholder-image.jpg'
];

// Function to check if an image is accessible
function checkImage(imagePath) {
  return new Promise((resolve, reject) => {
    const url = `${API_URL}${imagePath}`;
    console.log(`Checking image: ${url}`);
    
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        console.log(`✅ Image accessible: ${imagePath} (${res.statusCode})`);
        resolve(true);
      } else {
        console.error(`❌ Image not accessible: ${imagePath} (${res.statusCode})`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.error(`❌ Error checking image: ${imagePath}`, err.message);
      resolve(false);
    });
  });
}

// Check all images
async function checkAllImages() {
  console.log('Checking all images...');
  
  for (const image of images) {
    await checkImage(image);
  }
  
  console.log('All checks completed.');
}

// Run the checks
checkAllImages(); 