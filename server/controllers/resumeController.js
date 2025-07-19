import Resume from '../models/Resume.js';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import mongoose from 'mongoose';

// Parse resume content
const parseResume = async (file) => {
  try {
    let text = '';
    
    if (file.mimetype === 'application/pdf') {
      // Parse PDF
      const data = await pdfParse(file.buffer);
      text = data.text;
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Parse DOCX
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      text = result.value;
    } else {
      throw new Error('Unsupported file type');
    }
    
    // Clean up text
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
  } catch (error) {
    console.error('Error parsing file:', error);
    throw new Error('Failed to parse resume file');
  }
};

// Upload resume
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }
    
    // Parse resume content
    const content = await parseResume(req.file);
    
    // Save or update resume
    const resume = await Resume.findOneAndUpdate(
      { user: req.userId },
      {
        fileName: req.file.originalname,
        fileType: req.file.originalname.split('.').pop().toLowerCase(),
        content: content,
        user: req.userId
      },
      { upsert: true, new: true }
    );
    
    res.json({
      message: 'Resume uploaded successfully',
      resume: {
        id: resume._id,
        fileName: resume.fileName,
        uploadedAt: resume.updatedAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading resume: ' + error.message });
  }
};

// Get user's resume
export const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.userId });
    
    if (!resume) {
      return res.status(404).json({ message: 'No resume found' });
    }
    
    res.json(resume);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete resume
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ user: req.userId });
    
    if (!resume) {
      return res.status(404).json({ message: 'No resume found' });
    }
    
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
console.log('Available models:', mongoose.modelNames());