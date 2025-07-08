import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  company: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: String, default: 'applied' },
  deadline: { type: Date },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);