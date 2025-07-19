import express from 'express';
import { body } from 'express-validator';
import auth from '../middleware/auth.js';

const router = express.Router();

// Since we're using Clerk, we don't need traditional register/login routes
// But we can create a route to get user info or sync user data

// Get current user info (for testing Clerk auth)
router.get('/me', auth, async (req, res) => {
  try {
    // With Clerk, user info comes from the token
    res.json({ 
      userId: req.userId,
      message: 'Authentication successful' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test route to verify auth is working
router.get('/test', auth, (req, res) => {
  res.json({ 
    message: 'Auth is working!', 
    userId: req.userId 
  });
});

export default router;