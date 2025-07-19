// Load env vars FIRST - before ANY other imports
import dotenv from 'dotenv';
dotenv.config();

// Verify environment variables are loaded immediately
console.log('=== Environment Variables Check ===');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set ✓' : 'Not set ✗');
console.log('OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? 'Set ✓' : 'Not set ✗');
console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'Set ✓' : 'Not set ✗');
console.log('CLERK_SECRET_KEY:', process.env.CLERK_SECRET_KEY ? 'Set ✓' : 'Not set ✗');
console.log('=====================================');

// Now import everything else AFTER env vars are confirmed loaded
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cron from 'node-cron';
import connectDB from './config/db.js';
import { sendDeadlineReminders } from './utils/emailService.js';

// Import models to register them with Mongoose
import './models/User.js';
import './models/Job.js';
import './models/Resume.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

// Debug: Check which models are registered
console.log('Available models:', mongoose.modelNames());

// Initialize express
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'your-production-domain.com' 
    : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/ai', aiRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AI Job Tracker API is running',
    env: {
      openrouter: !!process.env.OPENROUTER_API_KEY,
      sendgrid: !!process.env.SENDGRID_API_KEY,
      clerk: !!process.env.CLERK_SECRET_KEY,
      mongodb: !!process.env.MONGODB_URI
    }
  });
});

// Schedule email reminders only if SendGrid is configured
if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.')) {
  cron.schedule('0 9 * * *', async () => {
    console.log('Running deadline reminder job...');
    await sendDeadlineReminders();
  });
} else {
  console.log('Email reminders disabled - SendGrid not configured properly');
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('🚀 AI Job Tracker API is ready!');
  
  // Final environment check
  console.log('Final env check - OpenRouter API Key:', process.env.OPENROUTER_API_KEY ? 'Available' : 'Missing');
});