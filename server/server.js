import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

// Optional root route for health check
app.get('/', (req, res) => {
  res.send('🎉 Backend API is running');
});

// Connect DB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () =>
      console.log('✅ Backend running at http://localhost:5000')
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });