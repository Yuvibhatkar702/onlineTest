const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  assessment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true // Allow null for anonymous users
  },
  // Anonymous user info (when user is not registered)
  anonymousUser: {
    firstName: String,
    lastName: String,
    email: String,
    organization: String
  },
  attemptNumber: {
    type: Number,
    required: true,
    min: [1, 'Attempt number must be at least 1']
  },
  
  // Test session info
  sessionInfo: {
    startTime: {
      type: Date,
      required: true,
      default: Date.now
    },
    endTime: Date,
    timeSpent: {
      type: Number, // in seconds
      min: [0, 'Time spent cannot be negative']
    },
    ipAddress: String,
    userAgent: String,
    browser: String,
    device: String,
    location: {
      country: String,
      city: String,
      timezone: String
    }
  },
  
  // Answers
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    answer: mongoose.Schema.Types.Mixed, // Can be string, array, or object depending on question type
    isCorrect: {
      type: Boolean,
      required: true
    },
    points: {
      type: Number,
      default: 0
    },
    timeSpent: {
      type: Number, // in seconds
      default: 0
    },
    attempts: {
      type: Number,
      default: 1
    },
    hintsUsed: [{
      hintIndex: Number,
      timestamp: Date
    }],
    flagged: {
      type: Boolean,
      default: false
    },
    confidence: {
      type: Number,
      min: [1, 'Confidence must be between 1 and 5'],
      max: [5, 'Confidence must be between 1 and 5']
    }
  }],
  
  // Scoring
  score: {
    raw: {
      type: Number,
      required: true,
      min: [0, 'Raw score cannot be negative']
    },
    percentage: {
      type: Number,
      required: true,
      min: [0, 'Percentage cannot be negative'],
      max: [100, 'Percentage cannot exceed 100']
    },
    points: {
      total: {
        type: Number,
        required: true
      },
      earned: {
        type: Number,
        required: true
      }
    },
    grade: String, // Letter grade (A, B, C, etc.)
    passed: {
      type: Boolean,
      required: true
    }
  },
  
  // Status
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned', 'timed_out', 'submitted'],
    default: 'in_progress'
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  submittedAt: Date,
  
  // Security and monitoring
  securityEvents: [{
    type: {
      type: String,
      enum: [
        'tab_switch', 'window_blur', 'right_click', 'copy_attempt', 
        'paste_attempt', 'fullscreen_exit', 'suspicious_activity',
        'multiple_tabs', 'console_opened', 'inspect_element'
      ]
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    details: mongoose.Schema.Types.Mixed
  }],
  cheatingScore: {
    type: Number,
    default: 0,
    min: [0, 'Cheating score cannot be negative'],
    max: [100, 'Cheating score cannot exceed 100']
  },
  flaggedForReview: {
    type: Boolean,
    default: false
  },
  
  // Progress tracking
  progress: {
    currentQuestion: {
      type: Number,
      default: 0
    },
    questionsAnswered: {
      type: Number,
      default: 0
    },
    questionsSkipped: {
      type: Number,
      default: 0
    },
    questionsFlagged: {
      type: Number,
      default: 0
    }
  },
  
  // Review and feedback
  review: {
    reviewed: {
      type: Boolean,
      default: false
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: Date,
    comments: String,
    adjustedScore: Number
  },
  
  // Additional metadata
  metadata: {
    assessmentVersion: Number,
    questionOrder: [String], // Array of question IDs in the order they were presented
    randomSeed: String, // For reproducible randomization
    browser: String,
    screenResolution: String,
    assessmentTitle: String, // Snapshot of assessment title
    category: String,
    tags: [String]
  },
  
  // Certificate info (if applicable)
  certificate: {
    issued: {
      type: Boolean,
      default: false
    },
    certificateId: String,
    issuedAt: Date,
    validUntil: Date,
    downloadUrl: String
  }
}, {
  timestamps: true
});

// Compound indexes for better performance
resultSchema.index({ assessment: 1, user: 1 });
resultSchema.index({ assessment: 1, attemptNumber: 1 });
resultSchema.index({ user: 1, createdAt: -1 });
resultSchema.index({ assessment: 1, status: 1 });
resultSchema.index({ assessment: 1, 'score.percentage': -1 });
resultSchema.index({ 'sessionInfo.startTime': 1 });
resultSchema.index({ flaggedForReview: 1 });
resultSchema.index({ cheatingScore: -1 });

// Virtual for full name (anonymous or registered user)
resultSchema.virtual('fullName').get(function() {
  if (this.user && this.user.firstName && this.user.lastName) {
    return `${this.user.firstName} ${this.user.lastName}`;
  } else if (this.anonymousUser) {
    return `${this.anonymousUser.firstName || ''} ${this.anonymousUser.lastName || ''}`.trim();
  }
  return 'Anonymous User';
});

// Virtual for email (anonymous or registered user)
resultSchema.virtual('email').get(function() {
  if (this.user && this.user.email) {
    return this.user.email;
  } else if (this.anonymousUser && this.anonymousUser.email) {
    return this.anonymousUser.email;
  }
  return null;
});

// Virtual for correct answers count
resultSchema.virtual('correctAnswersCount').get(function() {
  return this.answers.filter(answer => answer.isCorrect).length;
});

// Virtual for incorrect answers count
resultSchema.virtual('incorrectAnswersCount').get(function() {
  return this.answers.filter(answer => !answer.isCorrect).length;
});

// Virtual for average time per question
resultSchema.virtual('averageTimePerQuestion').get(function() {
  if (this.answers.length === 0) return 0;
  const totalTime = this.answers.reduce((sum, answer) => sum + (answer.timeSpent || 0), 0);
  return totalTime / this.answers.length;
});

// Virtual for completion rate
resultSchema.virtual('completionRate').get(function() {
  if (!this.assessment || !this.assessment.questions) return 0;
  const totalQuestions = this.assessment.questions.length || this.answers.length;
  return totalQuestions > 0 ? (this.answers.length / totalQuestions) * 100 : 0;
});

// Pre-save middleware
resultSchema.pre('save', function(next) {
  // Calculate progress
  this.progress.questionsAnswered = this.answers.length;
  this.progress.questionsFlagged = this.answers.filter(a => a.flagged).length;
  
  // Update completion status
  if (this.status === 'completed' || this.status === 'submitted') {
    this.isCompleted = true;
    if (!this.submittedAt) {
      this.submittedAt = new Date();
    }
    if (!this.sessionInfo.endTime) {
      this.sessionInfo.endTime = new Date();
    }
    
    // Calculate total time spent
    if (this.sessionInfo.startTime && this.sessionInfo.endTime) {
      this.sessionInfo.timeSpent = Math.floor(
        (this.sessionInfo.endTime - this.sessionInfo.startTime) / 1000
      );
    }
  }
  
  // Calculate cheating score based on security events
  this.calculateCheatingScore();
  
  next();
});

// Method to calculate cheating score
resultSchema.methods.calculateCheatingScore = function() {
  let score = 0;
  
  this.securityEvents.forEach(event => {
    switch (event.type) {
      case 'tab_switch':
      case 'window_blur':
        score += 5;
        break;
      case 'copy_attempt':
      case 'paste_attempt':
        score += 10;
        break;
      case 'fullscreen_exit':
        score += 15;
        break;
      case 'console_opened':
      case 'inspect_element':
        score += 20;
        break;
      case 'multiple_tabs':
        score += 25;
        break;
      case 'suspicious_activity':
        score += 30;
        break;
    }
  });
  
  // Cap at 100
  this.cheatingScore = Math.min(score, 100);
  
  // Flag for review if score is high
  if (this.cheatingScore >= 50) {
    this.flaggedForReview = true;
  }
};

// Method to add security event
resultSchema.methods.addSecurityEvent = function(type, details = {}, severity = 'medium') {
  this.securityEvents.push({
    type,
    details,
    severity,
    timestamp: new Date()
  });
  
  this.calculateCheatingScore();
  return this.save();
};

// Method to calculate final score
resultSchema.methods.calculateScore = function(assessment) {
  let totalPoints = 0;
  let earnedPoints = 0;
  
  this.answers.forEach(answer => {
    const question = assessment.questions.find(q => 
      q.question.toString() === answer.question.toString()
    );
    
    if (question) {
      const questionPoints = question.points || 1;
      totalPoints += questionPoints;
      
      if (answer.isCorrect) {
        earnedPoints += questionPoints;
      } else if (assessment.settings.grading.penaltyForIncorrect > 0) {
        earnedPoints -= (questionPoints * assessment.settings.grading.penaltyForIncorrect / 100);
      }
    }
  });
  
  // Ensure earned points is not negative
  earnedPoints = Math.max(0, earnedPoints);
  
  this.score = {
    raw: earnedPoints,
    percentage: totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0,
    points: {
      total: totalPoints,
      earned: earnedPoints
    },
    passed: false
  };
  
  // Determine if passed
  this.score.passed = this.score.percentage >= assessment.settings.grading.passingScore;
  
  // Calculate letter grade
  this.score.grade = this.calculateLetterGrade(this.score.percentage);
  
  return this.score;
};

// Method to calculate letter grade
resultSchema.methods.calculateLetterGrade = function(percentage) {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};

// Method to get summary for instructor
resultSchema.methods.getSummary = function() {
  return {
    id: this._id,
    fullName: this.fullName,
    email: this.email,
    score: this.score,
    timeSpent: this.sessionInfo.timeSpent,
    completedAt: this.submittedAt,
    status: this.status,
    attemptNumber: this.attemptNumber,
    cheatingScore: this.cheatingScore,
    flaggedForReview: this.flaggedForReview,
    progress: this.progress
  };
};

// Method to get detailed analysis
resultSchema.methods.getDetailedAnalysis = function() {
  const analysis = {
    performance: {
      correctAnswers: this.correctAnswersCount,
      incorrectAnswers: this.incorrectAnswersCount,
      accuracy: this.answers.length > 0 ? 
        (this.correctAnswersCount / this.answers.length) * 100 : 0,
      averageTimePerQuestion: this.averageTimePerQuestion
    },
    strengths: [],
    weaknesses: [],
    recommendations: []
  };
  
  // Analyze by question categories/tags
  const categoryPerformance = {};
  
  this.answers.forEach(answer => {
    // This would need to be populated with question data
    // Implementation depends on how categories are stored
  });
  
  return analysis;
};

// Transform output
resultSchema.methods.toJSON = function() {
  const result = this.toObject();
  result.id = result._id;
  return result;
};

module.exports = mongoose.model('Result', resultSchema);
