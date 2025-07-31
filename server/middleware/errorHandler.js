const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = {
      success: false,
      message,
      statusCode: 404
    };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    let message = 'Duplicate field value entered';
    
    // Extract field name from error
    if (err.keyValue) {
      const field = Object.keys(err.keyValue)[0];
      const value = err.keyValue[field];
      
      if (field === 'email') {
        message = `Email '${value}' is already registered`;
      } else {
        message = `${field} '${value}' already exists`;
      }
    }
    
    error = {
      success: false,
      message,
      statusCode: 400
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    error = {
      success: false,
      message: 'Validation Error',
      errors: messages,
      statusCode: 400
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      success: false,
      message: 'Invalid token',
      statusCode: 401
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      success: false,
      message: 'Token has expired',
      statusCode: 401
    };
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = {
      success: false,
      message: 'File size too large',
      statusCode: 400
    };
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = {
      success: false,
      message: 'Unexpected file field',
      statusCode: 400
    };
  }

  // Rate limiting errors
  if (err.status === 429) {
    error = {
      success: false,
      message: 'Too many requests, please try again later',
      statusCode: 429
    };
  }

  // MongoDB connection errors
  if (err.name === 'MongoNetworkError' || err.name === 'MongooseServerSelectionError') {
    error = {
      success: false,
      message: 'Database connection error',
      statusCode: 503
    };
  }

  // OpenAI API errors
  if (err.response && err.response.status === 429) {
    error = {
      success: false,
      message: 'AI service rate limit exceeded. Please try again later.',
      statusCode: 429
    };
  }

  if (err.response && err.response.status === 401) {
    console.error('OpenAI API Key Error:', err.response.data);
    error = {
      success: false,
      message: 'AI service authentication error',
      statusCode: 500
    };
  }

  // Cloudinary errors
  if (err.http_code) {
    error = {
      success: false,
      message: 'File upload service error',
      statusCode: 500
    };
  }

  // Custom application errors
  if (err.isOperational) {
    error = {
      success: false,
      message: err.message,
      statusCode: err.statusCode || 500
    };
  }

  // Socket.io errors
  if (err.type === 'TransportError') {
    error = {
      success: false,
      message: 'Real-time connection error',
      statusCode: 500
    };
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Response format
  const response = {
    success: false,
    message,
    ...(error.errors && { errors: error.errors }),
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      originalError: err.name 
    })
  };

  // Send different responses based on environment
  if (process.env.NODE_ENV === 'production') {
    // In production, don't expose sensitive error details
    if (statusCode === 500) {
      response.message = 'Something went wrong. Please try again later.';
    }
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
