const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - require authentication
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Check for token in cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Token is invalid. User not found.'
        });
      }
      
      // Check if user account is locked
      if (user.isLocked) {
        return res.status(423).json({
          success: false,
          message: 'Account is temporarily locked due to too many failed login attempts.'
        });
      }
      
      // Check if user is active
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Account has been deactivated. Please contact support.'
        });
      }
      
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid.'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      error: error.message
    });
  }
};

// Optional authentication - user may or may not be logged in
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (user && user.isActive && !user.isLocked) {
          req.user = user;
        }
      } catch (error) {
        // Token is invalid, but that's okay for optional auth
        req.user = null;
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};

// Authorize roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authentication required.'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not authorized to access this resource.`
      });
    }
    
    next();
  };
};

// Check if user owns resource or is admin
exports.ownerOrAdmin = (resourceModel, resourceIdParam = 'id', ownerField = 'createdBy') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. Authentication required.'
        });
      }
      
      // Admin can access everything
      if (req.user.role === 'admin') {
        return next();
      }
      
      const resourceId = req.params[resourceIdParam];
      const resource = await resourceModel.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found.'
        });
      }
      
      // Check if user owns the resource
      const ownerId = resource[ownerField];
      if (ownerId && ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only access your own resources.'
        });
      }
      
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error during authorization',
        error: error.message
      });
    }
  };
};

// Check assessment access permissions
exports.checkAssessmentAccess = (permission = 'view') => {
  return async (req, res, next) => {
    try {
      const Assessment = require('../models/Assessment');
      const assessmentId = req.params.id || req.params.assessmentId;
      
      const assessment = await Assessment.findById(assessmentId);
      
      if (!assessment) {
        return res.status(404).json({
          success: false,
          message: 'Assessment not found.'
        });
      }
      
      // Admin can access everything
      if (req.user && req.user.role === 'admin') {
        req.assessment = assessment;
        return next();
      }
      
      // Owner can access everything
      if (req.user && assessment.createdBy.toString() === req.user._id.toString()) {
        req.assessment = assessment;
        return next();
      }
      
      // Check collaborator permissions
      if (req.user && assessment.collaborators && assessment.collaborators.length > 0) {
        const collaborator = assessment.collaborators.find(
          c => c.user.toString() === req.user._id.toString()
        );
        
        if (collaborator) {
          const hasPermission = collaborator.permissions.includes(permission) ||
                               collaborator.role === 'admin';
          
          if (hasPermission) {
            req.assessment = assessment;
            return next();
          }
        }
      }
      
      // For taking assessments, check if it's published and accessible
      if (permission === 'take') {
        if (assessment.status === 'published' && assessment.isAvailable) {
          req.assessment = assessment;
          return next();
        }
      }
      
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
      
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error during permission check',
        error: error.message
      });
    }
  };
};

// Validate email verification
exports.requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }
  
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required. Please verify your email address.',
      emailVerificationRequired: true
    });
  }
  
  next();
};

// Organization access control
exports.checkOrganizationAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }
  
  // Admin can access all organizations
  if (req.user.role === 'admin') {
    return next();
  }
  
  const requestedOrganization = req.params.organization || req.body.organization;
  
  // Users can only access their own organization's data
  if (requestedOrganization && req.user.organization !== requestedOrganization) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your organization\'s data.'
    });
  }
  
  next();
};

// Check if user can take assessment (attempts, timing, etc.)
exports.canTakeAssessment = async (req, res, next) => {
  try {
    const Assessment = require('../models/Assessment');
    const Result = require('../models/Result');
    
    const assessmentId = req.params.id || req.params.assessmentId;
    const assessment = await Assessment.findById(assessmentId);
    
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found.'
      });
    }
    
    // Check if assessment is available
    const availabilityCheck = assessment.canUserTakeAssessment(req.user?._id);
    if (!availabilityCheck.canTake) {
      return res.status(403).json({
        success: false,
        message: availabilityCheck.reason
      });
    }
    
    // Check user's attempt count
    let userAttempts = 0;
    if (req.user) {
      userAttempts = await Result.countDocuments({
        assessment: assessmentId,
        user: req.user._id,
        status: { $in: ['completed', 'submitted'] }
      });
    }
    
    const attemptCheck = assessment.canUserTakeAssessment(req.user?._id, userAttempts);
    if (!attemptCheck.canTake) {
      return res.status(403).json({
        success: false,
        message: attemptCheck.reason,
        attemptsUsed: userAttempts,
        maxAttempts: assessment.settings.attempts.maxAttempts
      });
    }
    
    req.assessment = assessment;
    req.userAttempts = userAttempts;
    next();
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during assessment access check',
      error: error.message
    });
  }
};

module.exports = exports;
