import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// 🔐 LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ msg: 'Server error during login' });
  }
});

// 🔐 REGISTER
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const hashedPwd = await bcrypt.hash(password, 10);

    const newUser = await User.create({ email, password: hashedPwd });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: newUser._id, email: newUser.email } });
  } catch (err) {
    console.error('❌ Register error:', err.message);
    res.status(500).json({ msg: 'Server error during registration' });
  }
});

export default router;