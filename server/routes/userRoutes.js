// server/routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const protect = require('../middleware/auth'); // Import the protect middleware

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
router.post('/register', async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      fullName,
      email,
      password, // Password will be hashed by pre-save hook
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        token: generateToken(user._id), // Generate JWT on successful registration
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id, 
        fullName: user.fullName,
        email: user.email,
        token: generateToken(user._id), // Generate JWT on successful login
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user profile (example of a protected route)
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    // req.user.id is available thanks to the `protect` middleware
    const user = await User.findById(req.user.id).select('-password'); // Exclude password field
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;