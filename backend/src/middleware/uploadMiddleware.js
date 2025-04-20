const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the base path for images
const imagesBasePath = path.join(__dirname, '../../public/images');
const productsPath = path.join(imagesBasePath, 'products');

// Ensure the products directory exists
if (!fs.existsSync(productsPath)) {
  fs.mkdirSync(productsPath, { recursive: true });
  console.log('Created products directory:', productsPath);
}

console.log('Upload middleware initialized with products path:', productsPath);
console.log('Current directory:', __dirname);
console.log('Directory contents:', fs.readdirSync(productsPath));

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Upload request received:', {
      body: req.body,
      file: {
        fieldname: file.fieldname,
        originalname: file.originalname,
        mimetype: file.mimetype
      }
    });
    console.log('Uploading file to directory:', productsPath);
    
    // Verify directory exists and is writable
    try {
      fs.accessSync(productsPath, fs.constants.W_OK);
      console.log('Products directory is writable');
    } catch (error) {
      console.error('Products directory access error:', error);
      return cb(new Error('Cannot write to products directory'));
    }
    
    cb(null, productsPath);
  },
  filename: function (req, file, cb) {
    // Create a unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    console.log('Generated filename:', filename);
    
    // Log the complete file path that will be used
    const fullPath = path.join(productsPath, filename);
    console.log('Full file path will be:', fullPath);
    
    cb(null, filename);
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  console.log('Processing file:', file.originalname, 'MIME type:', file.mimetype);
  if (file.mimetype.startsWith('image')) {
    console.log('File accepted:', file.originalname);
    cb(null, true);
  } else {
    console.log('File rejected:', file.originalname);
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

module.exports = upload; 