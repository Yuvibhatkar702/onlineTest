const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Question = require('../models/Question');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all questions
// @route   GET /api/questions
// @access  Private
router.get('/', protect, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('type').optional().isIn(['multiple_choice', 'single_choice', 'true_false', 'short_answer', 'essay']).withMessage('Invalid question type'),
  query('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty level')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    // Non-admin users can only see their own questions or public ones
    if (req.user.role !== 'admin') {
      query.$or = [
        { createdBy: req.user._id },
        { isPublic: true }
      ];
    }

    // Add filters
    if (req.query.type) query.type = req.query.type;
    if (req.query.difficulty) query.difficulty = req.query.difficulty;
    if (req.query.category) query.category = req.query.category;
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    const questions = await Question.find(query)
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Question.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        questions,
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

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('createdBy', 'firstName lastName');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && 
        question.createdBy._id.toString() !== req.user._id.toString() && 
        !question.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        question
      }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Create question
// @route   POST /api/questions
// @access  Private (Instructor/Admin)
router.post('/', protect, authorize('instructor', 'admin'), [
  body('type')
    .isIn(['multiple_choice', 'single_choice', 'true_false', 'short_answer', 'essay', 'fill_blank'])
    .withMessage('Invalid question type'),
  body('question')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Question must be between 10 and 2000 characters'),
  body('options')
    .optional()
    .isArray({ min: 2 })
    .withMessage('Choice questions must have at least 2 options'),
  body('correctAnswers')
    .optional()
    .isArray()
    .withMessage('Correct answers must be an array'),
  body('points')
    .optional()
    .isNumeric({ min: 0 })
    .withMessage('Points must be a positive number'),
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Invalid difficulty level')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const questionData = {
      ...req.body,
      createdBy: req.user._id,
      organization: req.user.organization
    };

    const question = await Question.create(questionData);

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: {
        question
      }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private (Owner/Admin)
router.put('/:id', protect, async (req, res, next) => {
  try {
    let question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && 
        question.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      data: {
        question
      }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private (Owner/Admin)
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && 
        question.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Question.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully'
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Bulk create questions
// @route   POST /api/questions/bulk
// @access  Private (Instructor/Admin)
router.post('/bulk', protect, authorize('instructor', 'admin'), [
  body('questions')
    .isArray({ min: 1 })
    .withMessage('Questions array is required')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const questions = req.body.questions.map(q => ({
      ...q,
      createdBy: req.user._id,
      organization: req.user.organization
    }));

    const createdQuestions = await Question.insertMany(questions);

    res.status(201).json({
      success: true,
      message: `${createdQuestions.length} questions created successfully`,
      data: {
        questions: createdQuestions
      }
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
