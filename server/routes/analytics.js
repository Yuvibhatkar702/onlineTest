const express = require('express');
const Assessment = require('../models/Assessment');
const Result = require('../models/Result');
const Question = require('../models/Question');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res, next) => {
  try {
    let analytics = {};

    if (req.user.role === 'admin') {
      // Admin dashboard - system-wide analytics
      analytics = {
        totalUsers: await User.countDocuments(),
        totalAssessments: await Assessment.countDocuments(),
        totalQuestions: await Question.countDocuments(),
        totalResults: await Result.countDocuments(),
        recentActivity: await Result.find()
          .populate('assessment', 'title')
          .populate('user', 'firstName lastName')
          .sort({ createdAt: -1 })
          .limit(10)
          .select('assessment user score.percentage createdAt'),
        userGrowth: await User.aggregate([
          {
            $group: {
              _id: {
                month: { $month: '$createdAt' },
                year: { $year: '$createdAt' }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } },
          { $limit: 12 }
        ])
      };
    } else if (req.user.role === 'instructor') {
      // Instructor dashboard
      const myAssessments = await Assessment.find({ createdBy: req.user._id });
      const assessmentIds = myAssessments.map(a => a._id);

      analytics = {
        myAssessments: myAssessments.length,
        myQuestions: await Question.countDocuments({ createdBy: req.user._id }),
        totalResponses: await Result.countDocuments({ assessment: { $in: assessmentIds } }),
        averageScore: await Result.aggregate([
          { $match: { assessment: { $in: assessmentIds } } },
          { $group: { _id: null, avgScore: { $avg: '$score.percentage' } } }
        ]),
        recentResults: await Result.find({ assessment: { $in: assessmentIds } })
          .populate('assessment', 'title')
          .populate('user', 'firstName lastName')
          .sort({ createdAt: -1 })
          .limit(10)
          .select('assessment user score.percentage createdAt')
      };
    } else {
      // Student dashboard
      analytics = {
        testsCompleted: await Result.countDocuments({ user: req.user._id, status: 'completed' }),
        averageScore: await Result.aggregate([
          { $match: { user: req.user._id, status: 'completed' } },
          { $group: { _id: null, avgScore: { $avg: '$score.percentage' } } }
        ]),
        recentResults: await Result.find({ user: req.user._id })
          .populate('assessment', 'title type')
          .sort({ createdAt: -1 })
          .limit(10)
          .select('assessment score.percentage createdAt status')
      };
    }

    res.status(200).json({
      success: true,
      data: analytics
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Get assessment analytics
// @route   GET /api/analytics/assessments/:id
// @access  Private
router.get('/assessments/:id', protect, async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && 
        assessment.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const results = await Result.find({ assessment: req.params.id, status: 'completed' });

    const analytics = {
      overview: {
        totalAttempts: results.length,
        averageScore: results.length > 0 ? 
          results.reduce((sum, r) => sum + r.score.percentage, 0) / results.length : 0,
        passRate: results.length > 0 ? 
          (results.filter(r => r.score.passed).length / results.length) * 100 : 0,
        averageTime: results.length > 0 ? 
          results.reduce((sum, r) => sum + (r.sessionInfo.timeSpent || 0), 0) / results.length : 0
      },
      scoreDistribution: this.getScoreDistribution(results),
      questionAnalysis: await this.getQuestionAnalysis(req.params.id),
      timeAnalysis: this.getTimeAnalysis(results)
    };

    res.status(200).json({
      success: true,
      data: analytics
    });

  } catch (error) {
    next(error);
  }
});

// Helper function to get score distribution
function getScoreDistribution(results) {
  const ranges = {
    '0-20': 0,
    '21-40': 0,
    '41-60': 0,
    '61-80': 0,
    '81-100': 0
  };

  results.forEach(result => {
    const score = result.score.percentage;
    if (score <= 20) ranges['0-20']++;
    else if (score <= 40) ranges['21-40']++;
    else if (score <= 60) ranges['41-60']++;
    else if (score <= 80) ranges['61-80']++;
    else ranges['81-100']++;
  });

  return ranges;
}

// Helper function to get question analysis
async function getQuestionAnalysis(assessmentId) {
  const results = await Result.find({ assessment: assessmentId, status: 'completed' })
    .populate('answers.question');

  const questionStats = {};

  results.forEach(result => {
    result.answers.forEach(answer => {
      const questionId = answer.question._id.toString();
      
      if (!questionStats[questionId]) {
        questionStats[questionId] = {
          question: answer.question.question,
          type: answer.question.type,
          totalAnswers: 0,
          correctAnswers: 0,
          averageTime: 0
        };
      }

      questionStats[questionId].totalAnswers++;
      if (answer.isCorrect) {
        questionStats[questionId].correctAnswers++;
      }
      questionStats[questionId].averageTime += answer.timeSpent || 0;
    });
  });

  // Calculate final averages
  Object.values(questionStats).forEach(stat => {
    stat.successRate = (stat.correctAnswers / stat.totalAnswers) * 100;
    stat.averageTime = stat.averageTime / stat.totalAnswers;
  });

  return questionStats;
}

// Helper function to get time analysis
function getTimeAnalysis(results) {
  const times = results.map(r => r.sessionInfo.timeSpent || 0).filter(t => t > 0);
  
  if (times.length === 0) {
    return { min: 0, max: 0, average: 0, median: 0 };
  }

  times.sort((a, b) => a - b);
  
  return {
    min: times[0],
    max: times[times.length - 1],
    average: times.reduce((sum, t) => sum + t, 0) / times.length,
    median: times[Math.floor(times.length / 2)]
  };
}

module.exports = router;
