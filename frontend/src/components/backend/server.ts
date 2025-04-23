import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
const app = express();
const port = 5501;
// Middleware
app.use(cors());
app.use(express.json());
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/fullstack-ts-app')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));
// Define routes
app.get('/', (req, res) => {
  res.send('Hello from the server!');
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

import User from './user';
// POST: Add a new user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const user = new User({ name, email, age });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});
// GET: Fetch all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});