const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const assessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Assessment title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  type: {
    type: String,
    enum: ['quiz', 'test', 'exam', 'survey'],
    default: 'quiz'
  },
  questions: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    order: {
      type: Number,
      required: true
    },
    points: {
      type: Number,
      default: 1
    },
    required: {
      type: Boolean,
      default: true
    }
  }],
  settings: {
    // Timing settings
    timeLimit: {
      enabled: {
        type: Boolean,
        default: false
      },
      duration: {
        type: Number, // in minutes
        min: [1, 'Duration must be at least 1 minute']
      },
      showTimer: {
        type: Boolean,
        default: true
      },
      autoSubmit: {
        type: Boolean,
        default: true
      }
    },
    
    // Question settings
    questionSettings: {
      showAll: {
        type: Boolean,
        default: false
      },
      allowBacktrack: {
        type: Boolean,
        default: true
      },
      randomizeOrder: {
        type: Boolean,
        default: false
      },
      randomizeOptions: {
        type: Boolean,
        default: false
      },
      questionsPerPage: {
        type: Number,
        default: 1,
        min: [1, 'Must show at least 1 question per page']
      }
    },
    
    // Attempt settings
    attempts: {
      unlimited: {
        type: Boolean,
        default: false
      },
      maxAttempts: {
        type: Number,
        default: 1,
        min: [1, 'Must allow at least 1 attempt']
      },
      cooldownPeriod: {
        type: Number, // in minutes
        default: 0
      }
    },
    
    // Access settings
    access: {
      type: {
        type: String,
        enum: ['public', 'private', 'password', 'link_only'],
        default: 'private'
      },
      password: String,
      accessCode: {
        type: String,
        default: () => Math.random().toString(36).substring(2, 8).toUpperCase()
      },
      allowedDomains: [String],
      ipRestrictions: [String]
    },
    
    // Security settings
    security: {
      preventCheating: {
        type: Boolean,
        default: true
      },
      fullScreen: {
        type: Boolean,
        default: false
      },
      disableRightClick: {
        type: Boolean,
        default: false
      },
      disableCopyPaste: {
        type: Boolean,
        default: false
      },
      lockdownBrowser: {
        type: Boolean,
        default: false
      },
      proctoring: {
        enabled: {
          type: Boolean,
          default: false
        },
        webcam: {
          type: Boolean,
          default: false
        },
        screenShare: {
          type: Boolean,
          default: false
        }
      }
    },
    
    // Results settings
    results: {
      showScore: {
        type: Boolean,
        default: true
      },
      showCorrectAnswers: {
        type: Boolean,
        default: false
      },
      showExplanations: {
        type: Boolean,
        default: false
      },
      showAfterSubmission: {
        type: Boolean,
        default: true
      },
      allowReview: {
        type: Boolean,
        default: true
      },
      emailResults: {
        type: Boolean,
        default: false
      }
    },
    
    // Grading settings
    grading: {
      passingScore: {
        type: Number,
        default: 60,
        min: [0, 'Passing score cannot be negative'],
        max: [100, 'Passing score cannot exceed 100']
      },
      gradingMethod: {
        type: String,
        enum: ['percentage', 'points', 'letter'],
        default: 'percentage'
      },
      penaltyForIncorrect: {
        type: Number,
        default: 0,
        min: [0, 'Penalty cannot be negative']
      },
      partialCredit: {
        type: Boolean,
        default: false
      }
    }
  },
  
  // Scheduling
  schedule: {
    startDate: Date,
    endDate: Date,
    timezone: {
      type: String,
      default: 'UTC'
    },
    gracePeriod: {
      type: Number, // in minutes
      default: 0
    }
  },
  
  // Metadata
  category: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  instructions: {
    type: String,
    trim: true,
    maxlength: [5000, 'Instructions cannot exceed 5000 characters']
  },
  
  // Analytics
  analytics: {
    totalAttempts: {
      type: Number,
      default: 0
    },
    completedAttempts: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    averageTime: {
      type: Number,
      default: 0
    },
    passRate: {
      type: Number,
      default: 0
    }
  },
  
  // Status and ownership
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'scheduled'],
    default: 'draft'
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
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'admin'],
      default: 'viewer'
    },
    permissions: [{
      type: String,
      enum: ['view', 'edit', 'delete', 'manage_results', 'manage_settings']
    }]
  }],
  
  // Versioning
  version: {
    type: Number,
    default: 1
  },
  parentAssessment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment'
  },
  
  isTemplate: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better performance
assessmentSchema.index({ createdBy: 1 });
assessmentSchema.index({ status: 1 });
assessmentSchema.index({ type: 1 });
assessmentSchema.index({ category: 1 });
assessmentSchema.index({ tags: 1 });
assessmentSchema.index({ 'settings.access.accessCode': 1 });
assessmentSchema.index({ organization: 1 });
assessmentSchema.index({ createdAt: -1 });
assessmentSchema.index({ 'schedule.startDate': 1, 'schedule.endDate': 1 });

// Text search index
assessmentSchema.index({
  title: 'text',
  description: 'text',
  category: 'text',
  tags: 'text'
});

// Virtual for total points
assessmentSchema.virtual('totalPoints').get(function() {
  return this.questions.reduce((total, q) => total + (q.points || 1), 0);
});

// Virtual for question count
assessmentSchema.virtual('questionCount').get(function() {
  return this.questions.length;
});

// Virtual for estimated duration
assessmentSchema.virtual('estimatedDuration').get(function() {
  // Rough estimate: 1 minute per question for simple questions
  const baseTime = this.questions.length * 1;
  const timeLimitFactor = this.settings.timeLimit.enabled ? 
    this.settings.timeLimit.duration : baseTime * 2;
  return Math.min(timeLimitFactor, baseTime * 3);
});

// Virtual for availability status
assessmentSchema.virtual('isAvailable').get(function() {
  if (this.status !== 'published') return false;
  
  const now = new Date();
  const startDate = this.schedule.startDate;
  const endDate = this.schedule.endDate;
  
  if (startDate && now < startDate) return false;
  if (endDate && now > endDate) return false;
  
  return true;
});

// Virtual for URL-friendly slug
assessmentSchema.virtual('slug').get(function() {
  return this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
});

// Pre-save middleware
assessmentSchema.pre('save', function(next) {
  // Ensure access code is unique and not empty
  if (!this.settings.access.accessCode) {
    this.settings.access.accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  
  // Set status to scheduled if start date is in future
  if (this.schedule.startDate && this.schedule.startDate > new Date() && this.status === 'published') {
    this.status = 'scheduled';
  }
  
  // Validate time settings
  if (this.settings.timeLimit.enabled && !this.settings.timeLimit.duration) {
    return next(new Error('Duration is required when time limit is enabled'));
  }
  
  // Validate password settings
  if (this.settings.access.type === 'password' && !this.settings.access.password) {
    return next(new Error('Password is required for password-protected assessments'));
  }
  
  next();
});

// Method to check if user can take assessment
assessmentSchema.methods.canUserTakeAssessment = function(userId, userAttempts = 0) {
  // Check if published and available
  if (!this.isAvailable) {
    return { canTake: false, reason: 'Assessment is not available' };
  }
  
  // Check attempt limits
  if (!this.settings.attempts.unlimited && userAttempts >= this.settings.attempts.maxAttempts) {
    return { canTake: false, reason: 'Maximum attempts reached' };
  }
  
  return { canTake: true };
};

// Method to validate access credentials
assessmentSchema.methods.validateAccess = function(credentials = {}) {
  const { accessCode, password, domain, ip } = credentials;
  
  switch (this.settings.access.type) {
    case 'public':
      return { isValid: true };
    
    case 'link_only':
      return { isValid: true }; // Just having the link is enough
    
    case 'password':
      if (!password || password !== this.settings.access.password) {
        return { isValid: false, reason: 'Invalid password' };
      }
      return { isValid: true };
    
    case 'private':
      if (!accessCode || accessCode !== this.settings.access.accessCode) {
        return { isValid: false, reason: 'Invalid access code' };
      }
      
      // Check domain restrictions
      if (this.settings.access.allowedDomains.length > 0 && domain) {
        const isAllowedDomain = this.settings.access.allowedDomains.some(
          allowedDomain => domain.endsWith(allowedDomain)
        );
        if (!isAllowedDomain) {
          return { isValid: false, reason: 'Domain not allowed' };
        }
      }
      
      // Check IP restrictions
      if (this.settings.access.ipRestrictions.length > 0 && ip) {
        if (!this.settings.access.ipRestrictions.includes(ip)) {
          return { isValid: false, reason: 'IP address not allowed' };
        }
      }
      
      return { isValid: true };
    
    default:
      return { isValid: false, reason: 'Unknown access type' };
  }
};

// Method to get assessment for taking (without answers)
assessmentSchema.methods.getForTaking = function() {
  const assessment = this.toObject();
  
  // Remove sensitive information
  delete assessment.settings.access.password;
  delete assessment.analytics;
  
  // Populate questions without correct answers
  // This will be handled in the controller with proper population
  
  return assessment;
};

// Method to update analytics
assessmentSchema.methods.updateAnalytics = function(result) {
  this.analytics.totalAttempts += 1;
  
  if (result.completed) {
    this.analytics.completedAttempts += 1;
    
    // Update average score
    const totalScore = this.analytics.averageScore * (this.analytics.completedAttempts - 1) + result.score;
    this.analytics.averageScore = totalScore / this.analytics.completedAttempts;
    
    // Update average time
    if (result.timeSpent) {
      const totalTime = this.analytics.averageTime * (this.analytics.completedAttempts - 1) + result.timeSpent;
      this.analytics.averageTime = totalTime / this.analytics.completedAttempts;
    }
    
    // Update pass rate
    const passed = result.score >= this.settings.grading.passingScore;
    const totalPassed = this.analytics.passRate * (this.analytics.completedAttempts - 1) / 100;
    this.analytics.passRate = ((totalPassed + (passed ? 1 : 0)) / this.analytics.completedAttempts) * 100;
  }
  
  return this.save();
};

// Method to duplicate assessment
assessmentSchema.methods.duplicate = function(userId, title) {
  const duplicated = new this.constructor(this.toObject());
  duplicated._id = new mongoose.Types.ObjectId();
  duplicated.title = title || `${this.title} (Copy)`;
  duplicated.createdBy = userId;
  duplicated.parentAssessment = this._id;
  duplicated.version = 1;
  duplicated.status = 'draft';
  duplicated.settings.access.accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  duplicated.analytics = {
    totalAttempts: 0,
    completedAttempts: 0,
    averageScore: 0,
    averageTime: 0,
    passRate: 0
  };
  duplicated.isNew = true;
  
  return duplicated;
};

// Transform output
assessmentSchema.methods.toJSON = function() {
  const assessment = this.toObject();
  assessment.id = assessment._id;
  return assessment;
};

module.exports = mongoose.model('Assessment', assessmentSchema);
