const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Ethereal Threads API is running (simplified version)',
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

// Mock API routes
app.get('/api/products', (req, res) => {
  res.json([
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 },
    { id: 3, name: 'Product 3', price: 300 }
  ]);
});

app.get('/api/auth', (req, res) => {
  res.json({ message: 'Auth endpoints are available' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Simplified server is running on port ${PORT}`);
}); 