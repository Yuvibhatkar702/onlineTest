const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Question type is required'],
    enum: ['multiple_choice', 'single_choice', 'true_false', 'short_answer', 'essay', 'fill_blank', 'matching', 'ordering']
  },
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
    maxlength: [2000, 'Question cannot exceed 2000 characters']
  },
  options: [{
    text: {
      type: String,
      required: true,
      trim: true
    },
    isCorrect: {
      type: Boolean,
      default: false
    },
    explanation: {
      type: String,
      trim: true
    }
  }],
  correctAnswers: [{
    type: String,
    trim: true
  }],
  explanation: {
    type: String,
    trim: true,
    maxlength: [1000, 'Explanation cannot exceed 1000 characters']
  },
  points: {
    type: Number,
    default: 1,
    min: [0, 'Points cannot be negative']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  category: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'video', 'audio', 'document']
    },
    url: String,
    publicId: String,
    filename: String,
    size: Number
  }],
  timeLimit: {
    type: Number, // in seconds
    min: [0, 'Time limit cannot be negative']
  },
  hints: [{
    text: String,
    penaltyPoints: {
      type: Number,
      default: 0
    }
  }],
  feedback: {
    correct: {
      type: String,
      trim: true
    },
    incorrect: {
      type: String,
      trim: true
    }
  },
  metadata: {
    source: String,
    author: String,
    reference: String,
    keywords: [String],
    learningObjectives: [String]
  },
  statistics: {
    timesUsed: {
      type: Number,
      default: 0
    },
    correctAnswers: {
      type: Number,
      default: 0
    },
    incorrectAnswers: {
      type: Number,
      default: 0
    },
    averageTime: {
      type: Number,
      default: 0
    },
    difficultyRating: {
      type: Number,
      default: 0
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organization: {
    type: String,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  version: {
    type: Number,
    default: 1
  },
  parentQuestion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }
}, {
  timestamps: true
});

// Indexes for better performance
questionSchema.index({ createdBy: 1 });
questionSchema.index({ type: 1 });
questionSchema.index({ category: 1 });
questionSchema.index({ difficulty: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ isPublic: 1 });
questionSchema.index({ organization: 1 });
questionSchema.index({ createdAt: -1 });

// Text search index
questionSchema.index({
  question: 'text',
  'options.text': 'text',
  category: 'text',
  tags: 'text'
});

// Virtual for answer count
questionSchema.virtual('answerCount').get(function() {
  return this.statistics.correctAnswers + this.statistics.incorrectAnswers;
});

// Virtual for success rate
questionSchema.virtual('successRate').get(function() {
  const total = this.answerCount;
  return total > 0 ? (this.statistics.correctAnswers / total) * 100 : 0;
});

// Pre-save middleware for validation
questionSchema.pre('save', function(next) {
  // Validate multiple choice questions have at least 2 options
  if (['multiple_choice', 'single_choice'].includes(this.type) && this.options.length < 2) {
    return next(new Error('Multiple choice questions must have at least 2 options'));
  }
  
  // Ensure at least one correct answer for choice questions
  if (['multiple_choice', 'single_choice', 'true_false'].includes(this.type)) {
    const hasCorrectAnswer = this.options.some(option => option.isCorrect);
    if (!hasCorrectAnswer) {
      return next(new Error('At least one option must be marked as correct'));
    }
  }
  
  // Validate single choice questions have exactly one correct answer
  if (this.type === 'single_choice') {
    const correctCount = this.options.filter(option => option.isCorrect).length;
    if (correctCount !== 1) {
      return next(new Error('Single choice questions must have exactly one correct answer'));
    }
  }
  
  // Validate true/false questions have exactly 2 options
  if (this.type === 'true_false' && this.options.length !== 2) {
    return next(new Error('True/false questions must have exactly 2 options'));
  }
  
  next();
});

// Method to check if answer is correct
questionSchema.methods.checkAnswer = function(userAnswer) {
  switch (this.type) {
    case 'multiple_choice':
      const correctOptionIds = this.options
        .filter(option => option.isCorrect)
        .map(option => option._id.toString());
      
      if (!Array.isArray(userAnswer)) return false;
      
      return correctOptionIds.length === userAnswer.length &&
             correctOptionIds.every(id => userAnswer.includes(id));
    
    case 'single_choice':
    case 'true_false':
      const correctOption = this.options.find(option => option.isCorrect);
      return correctOption && correctOption._id.toString() === userAnswer;
    
    case 'short_answer':
      if (!Array.isArray(this.correctAnswers) || this.correctAnswers.length === 0) {
        return false;
      }
      
      const normalizedAnswer = userAnswer.toLowerCase().trim();
      return this.correctAnswers.some(answer => 
        answer.toLowerCase().trim() === normalizedAnswer
      );
    
    case 'fill_blank':
      if (!Array.isArray(userAnswer) || !Array.isArray(this.correctAnswers)) {
        return false;
      }
      
      return userAnswer.length === this.correctAnswers.length &&
             userAnswer.every((answer, index) => 
               this.correctAnswers[index] &&
               answer.toLowerCase().trim() === this.correctAnswers[index].toLowerCase().trim()
             );
    
    default:
      return false; // Essay questions need manual grading
  }
};

// Method to get correct answer(s)
questionSchema.methods.getCorrectAnswer = function() {
  switch (this.type) {
    case 'multiple_choice':
      return this.options.filter(option => option.isCorrect);
    
    case 'single_choice':
    case 'true_false':
      return this.options.find(option => option.isCorrect);
    
    case 'short_answer':
    case 'fill_blank':
      return this.correctAnswers;
    
    default:
      return null;
  }
};

// Method to update statistics
questionSchema.methods.updateStatistics = function(isCorrect, timeSpent) {
  this.statistics.timesUsed += 1;
  
  if (isCorrect) {
    this.statistics.correctAnswers += 1;
  } else {
    this.statistics.incorrectAnswers += 1;
  }
  
  if (timeSpent) {
    const totalTime = this.statistics.averageTime * (this.statistics.timesUsed - 1) + timeSpent;
    this.statistics.averageTime = totalTime / this.statistics.timesUsed;
  }
  
  // Calculate difficulty rating based on success rate
  const successRate = this.successRate;
  if (successRate >= 80) {
    this.statistics.difficultyRating = 1; // Easy
  } else if (successRate >= 60) {
    this.statistics.difficultyRating = 2; // Medium
  } else {
    this.statistics.difficultyRating = 3; // Hard
  }
  
  return this.save();
};

// Method to duplicate question
questionSchema.methods.duplicate = function(userId) {
  const duplicated = new this.constructor(this.toObject());
  duplicated._id = new mongoose.Types.ObjectId();
  duplicated.createdBy = userId;
  duplicated.parentQuestion = this._id;
  duplicated.version = 1;
  duplicated.statistics = {
    timesUsed: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    averageTime: 0,
    difficultyRating: 0
  };
  duplicated.isNew = true;
  
  return duplicated;
};

// Transform output
questionSchema.methods.toJSON = function() {
  const question = this.toObject();
  question.id = question._id;
  return question;
};

module.exports = mongoose.model('Question', questionSchema);
