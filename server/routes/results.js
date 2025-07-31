const express = require('express');
const Result = require('../models/Result');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user results
// @route   GET /api/results
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    // Non-admin users can only see their own results
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }

    const results = await Result.find(query)
      .populate('assessment', 'title type category')
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Result.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        results: results.map(result => result.getSummary()),
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Get single result
// @route   GET /api/results/:id
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('assessment', 'title type settings')
      .populate('user', 'firstName lastName email')
      .populate({
        path: 'answers.question',
        select: 'type question options correctAnswers explanation'
      });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && 
        result.user && 
        result.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        result
      }
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
