import express from 'express';
import multer from 'multer';
import auth from '../middleware/auth.js';
import { uploadResume, getResume, deleteResume } from '../controllers/resumeController.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|docx/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = file.mimetype === 'application/pdf' || 
                    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'));
    }
  }
});

// All routes require authentication
router.use(auth);

// Routes
router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getResume);
router.delete('/', deleteResume);

export default router;