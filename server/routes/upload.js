const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images, documents, audio, and video files
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|mp3|mp4|avi|wav/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  }
});

// @desc    Upload file
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // In a real application, you would upload to Cloudinary or AWS S3
    // For now, we'll simulate a successful upload
    const fileData = {
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: `/uploads/${Date.now()}-${req.file.originalname}`, // Simulated URL
      publicId: `upload_${Date.now()}` // Simulated public ID
    };

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: fileData
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
