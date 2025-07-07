import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Init
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Route Test
app.get('/', (req, res) => {
  res.send('Server is working!');
});

// Listen
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
  })
  .catch(err => console.log('Mongo Error:', err));