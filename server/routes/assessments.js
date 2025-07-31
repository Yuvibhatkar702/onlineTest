const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Assessment = require('../models/Assessment');
const Question = require('../models/Question');
const Result = require('../models/Result');
const { protect, authorize, checkAssessmentAccess, canTakeAssessment } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all assessments
// @route   GET /api/assessments
// @access  Private
router.get('/', protect, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['draft', 'published', 'archived', 'scheduled']).withMessage('Invalid status'),
  query('type').optional().isIn(['quiz', 'test', 'exam', 'survey']).withMessage('Invalid type')
], async (req, res, next) => {
  try {
    // Check validation errors
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

    // Admin can see all assessments, others only their own
    if (req.user.role !== 'admin') {
      query.createdBy = req.user._id;
    }

    // Add filters
    if (req.query.status) query.status = req.query.status;
    if (req.query.type) query.type = req.query.type;
    if (req.query.category) query.category = req.query.category;
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    const assessments = await Assessment.find(query)
      .populate('createdBy', 'firstName lastName email')
      .select('-questions.question') // Don't populate full questions for list view
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Assessment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        assessments,
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

// @desc    Get single assessment
// @route   GET /api/assessments/:id
// @access  Private
router.get('/:id', protect, checkAssessmentAccess('view'), async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email')
      .populate({
        path: 'questions.question',
        select: 'type question options correctAnswers explanation points difficulty category tags attachments'
      });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        assessment
      }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Create assessment
// @route   POST /api/assessments
// @access  Private (Instructor/Admin)
router.post('/', protect, authorize('instructor', 'admin'), [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('type')
    .optional()
    .isIn(['quiz', 'test', 'exam', 'survey'])
    .withMessage('Invalid assessment type'),
  body('questions')
    .isArray({ min: 1 })
    .withMessage('Assessment must have at least one question')
], async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const assessmentData = {
      ...req.body,
      createdBy: req.user._id,
      organization: req.user.organization
    };

    // Validate questions exist
    if (req.body.questions && req.body.questions.length > 0) {
      const questionIds = req.body.questions.map(q => q.question);
      const existingQuestions = await Question.find({ _id: { $in: questionIds } });
      
      if (existingQuestions.length !== questionIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more questions not found'
        });
      }
    }

    const assessment = await Assessment.create(assessmentData);

    // Update user statistics
    await req.user.updateStatistics('testCreated');

    res.status(201).json({
      success: true,
      message: 'Assessment created successfully',
      data: {
        assessment
      }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Update assessment
// @route   PUT /api/assessments/:id
// @access  Private (Owner/Admin)
router.put('/:id', protect, checkAssessmentAccess('edit'), [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters')
], async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const assessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: 'Assessment updated successfully',
      data: {
        assessment
      }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Delete assessment
// @route   DELETE /api/assessments/:id
// @access  Private (Owner/Admin)
router.delete('/:id', protect, checkAssessmentAccess('delete'), async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Check if there are any results
    const resultsCount = await Result.countDocuments({ assessment: req.params.id });
    if (resultsCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete assessment with existing results. Archive it instead.'
      });
    }

    await Assessment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Assessment deleted successfully'
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Take assessment (get questions for taking)
// @route   GET /api/assessments/:id/take
// @access  Public/Private
router.get('/:id/take', canTakeAssessment, async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate({
        path: 'questions.question',
        select: 'type question options explanation points difficulty attachments timeLimit hints -correctAnswers'
      });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Remove correct answers from questions
    const assessmentForTaking = assessment.getForTaking();

    res.status(200).json({
      success: true,
      data: {
        assessment: assessmentForTaking,
        userAttempts: req.userAttempts
      }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Submit assessment answers
// @route   POST /api/assessments/:id/submit
// @access  Public/Private
router.post('/:id/submit', canTakeAssessment, [
  body('answers')
    .isArray({ min: 1 })
    .withMessage('Answers array is required'),
  body('sessionInfo')
    .optional()
    .isObject()
    .withMessage('Session info must be an object')
], async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { answers, sessionInfo, anonymousUser } = req.body;
    const assessment = req.assessment;

    // Create result record
    const resultData = {
      assessment: assessment._id,
      answers: [],
      attemptNumber: req.userAttempts + 1,
      sessionInfo: {
        startTime: sessionInfo?.startTime || new Date(),
        endTime: new Date(),
        ...sessionInfo
      },
      status: 'completed'
    };

    // Add user info
    if (req.user) {
      resultData.user = req.user._id;
    } else if (anonymousUser) {
      resultData.anonymousUser = anonymousUser;
    }

    // Process answers
    let totalPoints = 0;
    let earnedPoints = 0;

    for (const answer of answers) {
      const questionId = answer.question;
      const userAnswer = answer.answer;

      // Find the question
      const question = await Question.findById(questionId);
      if (!question) {
        continue;
      }

      // Check if answer is correct
      const isCorrect = question.checkAnswer(userAnswer);
      const questionPoints = assessment.questions.find(q => 
        q.question.toString() === questionId
      )?.points || 1;

      totalPoints += questionPoints;
      if (isCorrect) {
        earnedPoints += questionPoints;
      }

      resultData.answers.push({
        question: questionId,
        answer: userAnswer,
        isCorrect,
        points: isCorrect ? questionPoints : 0,
        timeSpent: answer.timeSpent || 0
      });

      // Update question statistics
      await question.updateStatistics(isCorrect, answer.timeSpent);
    }

    // Calculate final score
    const result = new Result(resultData);
    result.calculateScore(assessment);

    await result.save();

    // Update assessment analytics
    await assessment.updateAnalytics({
      completed: true,
      score: result.score.percentage,
      timeSpent: result.sessionInfo.timeSpent
    });

    // Update user statistics
    if (req.user) {
      await req.user.updateStatistics('testTaken');
      await req.user.updateStatistics('score', result.score.percentage);
    }

    res.status(201).json({
      success: true,
      message: 'Assessment submitted successfully',
      data: {
        result: {
          id: result._id,
          score: result.score,
          passed: result.score.passed,
          timeSpent: result.sessionInfo.timeSpent,
          submittedAt: result.submittedAt
        }
      }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Get assessment results
// @route   GET /api/assessments/:id/results
// @access  Private (Owner/Admin)
router.get('/:id/results', protect, checkAssessmentAccess('manage_results'), [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const results = await Result.find({ assessment: req.params.id })
      .populate('user', 'firstName lastName email')
      .populate('assessment', 'title type')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Result.countDocuments({ assessment: req.params.id });

    const summaries = results.map(result => result.getSummary());

    res.status(200).json({
      success: true,
      data: {
        results: summaries,
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

module.exports = router;
