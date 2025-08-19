import express from 'express';
import { body } from 'express-validator';
import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getStats
} from '../controllers/jobController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const jobValidation = [
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('role').trim().notEmpty().withMessage('Role is required'),
  body('status').optional().isIn(['applied', 'interview', 'offer', 'rejected', 'withdrawn']),
  body('deadline').optional({ checkFalsy: true }).isISO8601().toDate(),
  body('applicationUrl').optional({ checkFalsy: true }).isURL().withMessage('Please enter a valid URL')
];

// All routes require authentication
router.use(auth);

// Routes
router.get('/', getJobs);
router.get('/stats', getStats);
router.get('/:id', getJob);
router.post('/', jobValidation, createJob);
router.put('/:id', jobValidation, updateJob);
router.delete('/:id', deleteJob);

export default router;