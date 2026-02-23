const express = require('express');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const skillsController = require('../controllers/skillsController');

const router = express.Router();

// Rate limiter: max 20 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

// Store file in memory so we can pass the buffer directly to pdf-parse
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed.'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});

// POST /api/skills/extract – upload PDF and extract skills
router.post('/extract', apiLimiter, upload.single('cv'), (req, res) => skillsController.extract(req, res));

// GET /api/skills – retrieve last saved skills
router.get('/', apiLimiter, (req, res) => skillsController.getSkills(req, res));

// GET /api/skills/download – download ZIP report (JSON + HTML)
router.get('/download', apiLimiter, (req, res) => skillsController.download(req, res));

module.exports = router;
