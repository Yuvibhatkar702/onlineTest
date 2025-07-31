const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.method} ${req.originalUrl}' not found`,
    availableEndpoints: {
      auth: [
        'POST /api/auth/register',
        'POST /api/auth/login',
        'POST /api/auth/logout',
        'GET /api/auth/me',
        'POST /api/auth/forgot-password',
        'POST /api/auth/reset-password',
        'POST /api/auth/verify-email'
      ],
      users: [
        'GET /api/users/profile',
        'PUT /api/users/profile',
        'GET /api/users',
        'GET /api/users/:id',
        'PUT /api/users/:id',
        'DELETE /api/users/:id'
      ],
      assessments: [
        'GET /api/assessments',
        'POST /api/assessments',
        'GET /api/assessments/:id',
        'PUT /api/assessments/:id',
        'DELETE /api/assessments/:id',
        'POST /api/assessments/:id/take',
        'GET /api/assessments/:id/results'
      ],
      questions: [
        'GET /api/questions',
        'POST /api/questions',
        'GET /api/questions/:id',
        'PUT /api/questions/:id',
        'DELETE /api/questions/:id',
        'POST /api/questions/bulk',
        'POST /api/questions/import'
      ],
      results: [
        'GET /api/results',
        'POST /api/results',
        'GET /api/results/:id',
        'PUT /api/results/:id',
        'DELETE /api/results/:id'
      ],
      analytics: [
        'GET /api/analytics/assessments/:id',
        'GET /api/analytics/users/:id',
        'GET /api/analytics/dashboard',
        'GET /api/analytics/reports/:type'
      ],
      ai: [
        'POST /api/ai/generate-questions',
        'POST /api/ai/improve-question',
        'POST /api/ai/analyze-results'
      ],
      upload: [
        'POST /api/upload/image',
        'POST /api/upload/document',
        'POST /api/upload/media',
        'DELETE /api/upload/:publicId'
      ]
    }
  });
};

module.exports = notFound;
