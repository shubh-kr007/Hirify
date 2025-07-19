import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  user: {
    type: String, // Change from ObjectId to String for Clerk user IDs
    required: true,
    unique: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['pdf', 'docx'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  skills: [{
    type: String
  }],
  lastAnalyzed: {
    type: Date
  }
}, {
  timestamps: true
});

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;