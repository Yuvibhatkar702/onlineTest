import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request with token:', config.url, token.substring(0, 20) + '...'); // Debug log
    } else {
      console.log('Request without token:', config.url); // Debug log
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),
};

export const assessmentsAPI = {
  getAll: (params) => api.get('/assessments', { params }),
  getById: (id) => api.get(`/assessments/${id}`),
  create: (data) => api.post('/assessments', data),
  update: (id, data) => api.put(`/assessments/${id}`, data),
  delete: (id) => api.delete(`/assessments/${id}`),
  duplicate: (id) => api.post(`/assessments/${id}/duplicate`),
  publish: (id) => api.patch(`/assessments/${id}/publish`),
  archive: (id) => api.patch(`/assessments/${id}/archive`),
  getStatistics: (id) => api.get(`/assessments/${id}/statistics`),
  addCollaborator: (id, email, permissions) => 
    api.post(`/assessments/${id}/collaborators`, { email, permissions }),
  removeCollaborator: (id, collaboratorId) => 
    api.delete(`/assessments/${id}/collaborators/${collaboratorId}`),
  updateCollaborator: (id, collaboratorId, permissions) => 
    api.put(`/assessments/${id}/collaborators/${collaboratorId}`, { permissions }),
  getResults: (id, params) => api.get(`/assessments/${id}/results`, { params }),
  exportResults: (id, format) => api.get(`/assessments/${id}/export/${format}`),
  getAnalytics: (id) => api.get(`/assessments/${id}/analytics`),
};

export const questionsAPI = {
  getAll: (params) => api.get('/questions', { params }),
  getById: (id) => api.get(`/questions/${id}`),
  create: (data) => api.post('/questions', data),
  update: (id, data) => api.put(`/questions/${id}`, data),
  delete: (id) => api.delete(`/questions/${id}`),
  bulkImport: (data) => api.post('/questions/bulk-import', data),
  bulkDelete: (ids) => api.delete('/questions/bulk-delete', { data: { ids } }),
  getCategories: () => api.get('/questions/categories'),
  getTags: () => api.get('/questions/tags'),
  search: (query) => api.get(`/questions/search?q=${encodeURIComponent(query)}`),
};

export const resultsAPI = {
  getAll: (params) => api.get('/results', { params }),
  getById: (id) => api.get(`/results/${id}`),
  submit: (assessmentId, answers) => 
    api.post(`/results/${assessmentId}/submit`, { answers }),
  getMyResults: (params) => api.get('/results/my-results', { params }),
  getAssessmentResults: (assessmentId, params) => 
    api.get(`/results/assessment/${assessmentId}`, { params }),
  updateGrade: (id, grade, feedback) => 
    api.put(`/results/${id}/grade`, { grade, feedback }),
  exportResults: (assessmentId, format) => 
    api.get(`/results/export/${assessmentId}/${format}`),
  getDetailedAnalysis: (id) => api.get(`/results/${id}/analysis`),
};

export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  bulkInvite: (emails, role) => api.post('/users/bulk-invite', { emails, role }),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  getStatistics: (id) => api.get(`/users/${id}/statistics`),
  exportUsers: (format) => api.get(`/users/export/${format}`),
};

export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getAssessmentAnalytics: (id) => api.get(`/analytics/assessments/${id}`),
  getUserAnalytics: (id) => api.get(`/analytics/users/${id}`),
  getOrganizationAnalytics: () => api.get('/analytics/organization'),
  getReports: (params) => api.get('/analytics/reports', { params }),
  generateReport: (type, params) => api.post(`/analytics/reports/${type}`, params),
  exportAnalytics: (type, format) => api.get(`/analytics/export/${type}/${format}`),
};

export const aiAPI = {
  generateQuestions: (prompt, type, count) => 
    api.post('/ai/generate-questions', { prompt, type, count }),
  improveQuestion: (question, requirements) => 
    api.post('/ai/improve-question', { question, requirements }),
  analyzeAnswers: (answers) => api.post('/ai/analyze-answers', { answers }),
  generateFeedback: (answer, correctAnswer) => 
    api.post('/ai/generate-feedback', { answer, correctAnswer }),
  detectCheating: (sessionData) => api.post('/ai/detect-cheating', sessionData),
  generateReport: (data, type) => api.post('/ai/generate-report', { data, type }),
};

export const uploadAPI = {
  uploadFile: (file, type = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  uploadMultiple: (files, type = 'general') => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('type', type);
    return api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteFile: (fileId) => api.delete(`/upload/${fileId}`),
  getFileInfo: (fileId) => api.get(`/upload/${fileId}`),
};

export default api;
