const express = require('express');
const { body, validationResult } = require('express-validator');
const Question = require('../models/Question');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Generate questions using AI
// @route   POST /api/ai/generate-questions
// @access  Private (Instructor/Admin)
router.post('/generate-questions', protect, authorize('instructor', 'admin'), [
  body('content')
    .optional()
    .trim()
    .isLength({ min: 50 })
    .withMessage('Content must be at least 50 characters long'),
  body('topic')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Topic must be between 3 and 100 characters'),
  body('questionCount')
    .isInt({ min: 1, max: 20 })
    .withMessage('Question count must be between 1 and 20'),
  body('questionType')
    .isIn(['multiple_choice', 'single_choice', 'true_false', 'short_answer', 'mixed'])
    .withMessage('Invalid question type'),
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Invalid difficulty level')
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

    const { content, topic, questionCount, questionType, difficulty = 'medium' } = req.body;

    if (!content && !topic) {
      return res.status(400).json({
        success: false,
        message: 'Either content or topic must be provided'
      });
    }

    // Simulate AI-generated questions (replace with actual OpenAI API call)
    const generatedQuestions = [];

    for (let i = 0; i < questionCount; i++) {
      let question;

      if (questionType === 'mixed') {
        const types = ['multiple_choice', 'single_choice', 'true_false', 'short_answer'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        question = generateSampleQuestion(randomType, topic || 'General Knowledge', difficulty, i + 1);
      } else {
        question = generateSampleQuestion(questionType, topic || 'General Knowledge', difficulty, i + 1);
      }

      generatedQuestions.push(question);
    }

    res.status(200).json({
      success: true,
      message: `Generated ${questionCount} questions successfully`,
      data: {
        questions: generatedQuestions,
        metadata: {
          source: content ? 'content' : 'topic',
          questionType,
          difficulty,
          generatedAt: new Date()
        }
      }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Save AI-generated questions
// @route   POST /api/ai/save-questions
// @access  Private (Instructor/Admin)
router.post('/save-questions', protect, authorize('instructor', 'admin'), [
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
      organization: req.user.organization,
      metadata: {
        ...q.metadata,
        source: 'AI Generated',
        generatedAt: new Date()
      }
    }));

    const savedQuestions = await Question.insertMany(questions);

    res.status(201).json({
      success: true,
      message: `${savedQuestions.length} questions saved successfully`,
      data: {
        questions: savedQuestions
      }
    });

  } catch (error) {
    next(error);
  }
});

// Helper function to generate sample questions
function generateSampleQuestion(type, topic, difficulty, index) {
  const questionTemplates = {
    multiple_choice: {
      question: `Which of the following best describes ${topic}? (Question ${index})`,
      options: [
        { text: `Option A for ${topic}`, isCorrect: true },
        { text: `Option B for ${topic}`, isCorrect: false },
        { text: `Option C for ${topic}`, isCorrect: false },
        { text: `Option D for ${topic}`, isCorrect: false }
      ],
      explanation: `This is the explanation for the ${topic} question.`
    },
    single_choice: {
      question: `What is the most important aspect of ${topic}? (Question ${index})`,
      options: [
        { text: `Primary aspect of ${topic}`, isCorrect: true },
        { text: `Secondary aspect of ${topic}`, isCorrect: false },
        { text: `Tertiary aspect of ${topic}`, isCorrect: false }
      ],
      explanation: `The primary aspect is the most important for ${topic}.`
    },
    true_false: {
      question: `${topic} is an important concept in modern education. (Question ${index})`,
      options: [
        { text: 'True', isCorrect: true },
        { text: 'False', isCorrect: false }
      ],
      explanation: `Yes, ${topic} is indeed important in modern education.`
    },
    short_answer: {
      question: `Define ${topic} in your own words. (Question ${index})`,
      correctAnswers: [topic, `${topic} definition`, `What is ${topic}`],
      explanation: `${topic} can be defined as an important concept in its field.`
    }
  };

  const template = questionTemplates[type];
  
  return {
    type,
    question: template.question,
    options: template.options || [],
    correctAnswers: template.correctAnswers || [],
    explanation: template.explanation,
    difficulty,
    category: topic,
    tags: ['AI Generated', topic, difficulty],
    points: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3,
    metadata: {
      aiGenerated: true,
      topic,
      difficulty,
      generatedAt: new Date()
    }
  };
}

// @desc    Improve existing question with AI
// @route   POST /api/ai/improve-question/:id
// @access  Private (Owner/Admin)
router.post('/improve-question/:id', protect, async (req, res, next) => {
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

    // Simulate AI improvement (replace with actual AI logic)
    const improvements = {
      suggestions: [
        'Consider making the question more specific',
        'Add more distractors to increase difficulty',
        'Include an image or diagram for better understanding',
        'Simplify the language for better accessibility'
      ],
      improvedVersion: {
        ...question.toObject(),
        question: `${question.question} (AI Improved)`,
        explanation: `${question.explanation} This explanation has been enhanced by AI.`,
        metadata: {
          ...question.metadata,
          aiImproved: true,
          improvedAt: new Date()
        }
      }
    };

    res.status(200).json({
      success: true,
      message: 'Question analysis completed',
      data: improvements
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
