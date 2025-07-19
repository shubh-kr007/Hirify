import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  user: {
    type: String, // Change from ObjectId to String for Clerk user IDs
    required: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['applied', 'interview', 'offer', 'rejected', 'withdrawn'],
    default: 'applied'
  },
  deadline: {
    type: Date
  },
  jobDescription: {
    type: String
  },
  notes: {
    type: String
  },
  applicationUrl: {
    type: String
  },
  salary: {
    type: String
  },
  location: {
    type: String
  },
  keywords: [{
    type: String
  }],
  matchScore: {
    type: Number,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

const Job = mongoose.model('Job', jobSchema);
export default Job;