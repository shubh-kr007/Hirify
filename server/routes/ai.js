import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import axios from 'axios';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/analyze-resume', upload.single('resume'), async (req, res) => {
  const { jobDescription } = req.body;

  if (!req.file || !jobDescription) {
    return res.status(400).json({ msg: 'Missing resume or job description' });
  }

  try {
    const resumeText = (await pdfParse(req.file.buffer)).text;

    const prompt = `
Compare this resume to the job description.

✅ Resume:
${resumeText.slice(0, 4000)}

🎯 Job Description:
${jobDescription}

Respond with:
- Match score (0–100)
- Top 3 resume improvement suggestions
- Missing keywords
- Short two-sentence summary
`;

    const openRouterURL = 'https://openrouter.ai/api/v1/chat/completions';

    const response = await axios.post(
      openRouterURL,
      {
        model: "deepseek/deepseek-chat-v3-0324:free", // ✅ OpenRouter DeepSeek Model
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173', // Optional: your frontend
          'X-Title': 'Resume-AI', // Optional: name to show in OpenRouter usage
        },
      }
    );

    const result = response.data.choices[0].message.content;
    res.json({ result });

  } catch (err) {
    console.error('❌ AI Error:', err.response?.data || err.message);
    res.status(500).json({ msg: 'AI request failed' });
  }
});

export default router;