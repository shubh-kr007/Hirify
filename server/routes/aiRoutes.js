import express from 'express';
import { body } from 'express-validator';
import {
  extractKeywords,
  analyzeMatch,
  getResumeSuggestions
} from '../controllers/aiController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Test route to check API key
router.get('/test', async (req, res) => {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(503).json({ message: 'OpenRouter API key not configured' });
    }
    
    const OpenAI = require('openai');
    const client = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
    });
    
    const completion = await client.chat.completions.create({
      model: "deepseek/deepseek-chat",
      messages: [{ role: "user", content: "Say hello" }],
      max_tokens: 10
    });
    
    res.json({ 
      message: 'API key works!', 
      response: completion.choices[0].message.content 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'API key test failed', 
      error: error.message 
    });
  }
});

// Routes
router.post('/extract-keywords', 
  body('jobDescription').notEmpty().withMessage('Job description is required'),
  extractKeywords
);

router.post('/analyze-match',
  body('jobId').notEmpty().withMessage('Job ID is required'),
  analyzeMatch
);

router.get('/resume-suggestions', getResumeSuggestions);

export default router;