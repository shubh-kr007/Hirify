import express from 'express';
import Job from '../models/Job.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// ➕ Add new job
router.post('/', auth, async (req, res) => {
  const { company, role, status, deadline } = req.body;

  try {
    const job = await new Job({
      user: req.user.id,
      company,
      role,
      status,
      deadline
    }).save();

    res.status(201).json(job);
  } catch (err) {
    console.error('❌ Add Job error:', err.message);
    res.status(500).json({ msg: 'Server error adding job' });
  }
});

// 🧾 Get all jobs for user
router.get('/', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error('❌ Fetch Jobs error:', err.message);
    res.status(500).json({ msg: 'Server error fetching jobs' });
  }
});

// ❌ Delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!job) return res.status(404).json({ msg: 'Job not found' });
    res.json({ msg: 'Job deleted' });
  } catch (err) {
    console.error('❌ Delete error:', err.message);
    res.status(500).json({ msg: 'Server error deleting job' });
  }
});

// ✏ Update
router.put('/:id', auth, async (req, res) => {
  const { company, role, status, deadline } = req.body;

  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { company, role, status, deadline },
      { new: true }
    );

    if (!job) return res.status(404).json({ msg: 'Job not found' });

    res.json(job);
  } catch (err) {
    console.error('❌ Update error:', err.message);
    res.status(500).json({ msg: 'Server error updating job' });
  }
});

export default router;