import OpenAI from 'openai';
import Job from '../models/Job.js';
import Resume from '../models/Resume.js';

// Function to get OpenRouter client (created fresh each time to ensure env vars are loaded)
const getOpenRouterClient = () => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is not configured');
  }
  
  return new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': 'http://localhost:5173',
      'X-Title': 'AI Job Tracker',
    }
  });
};

// Extract keywords from job description
export const extractKeywords = async (req, res) => {
  try {
    console.log('Extract keywords called');
    console.log('OpenRouter API Key available:', !!process.env.OPENROUTER_API_KEY);
    
    const deepseek = getOpenRouterClient();
    const { jobDescription } = req.body;
    
    if (!jobDescription) {
      return res.status(400).json({ message: 'Job description is required' });
    }
    
    console.log('Making API call to DeepSeek...');
    
    const completion = await deepseek.chat.completions.create({
      model: "deepseek/deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that extracts key skills and requirements from job descriptions."
        },
        {
          role: "user",
          content: `Extract the top 10 required skills from this job description. Return only the skills as a JSON array of strings:\n\n${jobDescription}`
        }
      ],
      temperature: 0.3,
      max_tokens: 200
    });
    
    console.log('API response received');
    
    const keywords = JSON.parse(completion.choices[0].message.content);
    res.json({ keywords });
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    res.status(500).json({ 
      message: 'Error extracting keywords', 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
};

// Analyze resume against job description
export const analyzeMatch = async (req, res) => {
  try {
    console.log('Analyze match called for user:', req.userId);
    console.log('OpenRouter API Key available:', !!process.env.OPENROUTER_API_KEY);
    
    const deepseek = getOpenRouterClient();
    const { jobId } = req.body;
    
    // Get job and resume
    const [job, resume] = await Promise.all([
      Job.findOne({ _id: jobId, user: req.userId }),
      Resume.findOne({ user: req.userId })
    ]);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    if (!resume) {
      return res.status(404).json({ message: 'Please upload a resume first' });
    }
    
    console.log('Making API call to analyze match...');
    
    const completion = await deepseek.chat.completions.create({
      model: "deepseek/deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are an expert career advisor who analyzes resumes against job descriptions. Always respond with valid JSON."
        },
        {
          role: "user",
          content: `Compare this resume and job description. Return a JSON object with:
          - score: match percentage (0-100)
          - improvements: array of 3 specific improvement suggestions
          - missingKeywords: array of important keywords missing from resume
          - summary: brief 2-3 sentence summary
          
          Resume: ${resume.content}
          
          Job Description: ${job.jobDescription}`
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });
    
    console.log('Match analysis response received');
    
    const analysis = JSON.parse(completion.choices[0].message.content);
    
    // Update job with match score
    job.matchScore = analysis.score;
    await job.save();
    
    res.json(analysis);
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    res.status(500).json({ 
      message: 'Error analyzing match', 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
};

// Get resume improvement suggestions
// Get resume improvement suggestions
export const getResumeSuggestions = async (req, res) => {
  try {
    console.log('Get resume suggestions called for user:', req.userId);
    console.log('OpenRouter API Key available:', !!process.env.OPENROUTER_API_KEY);
    
    const deepseek = getOpenRouterClient();
    const resume = await Resume.findOne({ user: req.userId });
    
    if (!resume) {
      return res.status(404).json({ message: 'Please upload a resume first' });
    }
    
    console.log('Resume found, content length:', resume.content.length);
    console.log('Making API call to get suggestions...');
    
    const completion = await deepseek.chat.completions.create({
      model: "deepseek/deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer. You MUST respond with valid JSON only. No additional text, explanations, or formatting. Just the JSON array."
        },
        {
          role: "user",
          content: `Analyze this resume and provide exactly 5 improvement suggestions. Respond with ONLY a JSON array in this exact format:

[
  {
    "title": "Suggestion Title",
    "description": "Detailed description of the improvement"
  }
]

Resume to analyze:
${resume.content.substring(0, 2000)}

Remember: Respond with ONLY the JSON array, no other text.`
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });
    
    let rawResponse = completion.choices[0].message.content.trim();
    console.log('Raw AI response:', rawResponse);
    
    // Clean up the response to extract JSON
    let cleanedResponse = rawResponse;
    
    // Remove any markdown code blocks
    cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Remove any text before the first [
    const firstBracket = cleanedResponse.indexOf('[');
    if (firstBracket > 0) {
      cleanedResponse = cleanedResponse.substring(firstBracket);
    }
    
    // Remove any text after the last ]
    const lastBracket = cleanedResponse.lastIndexOf(']');
    if (lastBracket !== -1 && lastBracket < cleanedResponse.length - 1) {
      cleanedResponse = cleanedResponse.substring(0, lastBracket + 1);
    }
    
    console.log('Cleaned response:', cleanedResponse);
    
    let suggestions;
    try {
      suggestions = JSON.parse(cleanedResponse);
      
      // Validate the structure
      if (!Array.isArray(suggestions)) {
        throw new Error('Response is not an array');
      }
      
      // Ensure each suggestion has title and description
      suggestions = suggestions.map((suggestion, index) => ({
        title: suggestion.title || `Suggestion ${index + 1}`,
        description: suggestion.description || 'No description provided'
      }));
      
      console.log('Successfully parsed suggestions:', suggestions.length);
      
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.log('Failed to parse response:', cleanedResponse);
      
      // Fallback: Create suggestions from the raw text
      suggestions = [
        {
          title: "Resume Analysis Complete",
          description: "The AI analyzed your resume but the response format needs adjustment. Here's what was suggested: " + rawResponse.substring(0, 200) + "..."
        },
        {
          title: "General Improvement",
          description: "Consider strengthening your action verbs, quantifying achievements, and tailoring content to job descriptions."
        },
        {
          title: "Format Enhancement",
          description: "Ensure consistent formatting, clear section headers, and professional presentation throughout your resume."
        }
      ];
    }
    
    res.json({ suggestions });
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    res.status(500).json({ 
      message: 'Error getting suggestions', 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
};