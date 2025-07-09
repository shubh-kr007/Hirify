import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

// ✅ Initialize Express before using it
const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/ai', aiRoutes); // ✅ now properly placed

// ✅ Optional health check
app.get('/', (req, res) => {
  res.send('🎉 Backend API is running');
});

// ✅ Connect DB and Launch
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () =>
      console.log('✅ Backend running at http://localhost:5000')
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
  import './utils/emailReminder.js'; // ☝️ Auto-runs the cron job