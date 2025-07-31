import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { getCurrentUser } from './store/slices/authSlice';
import ProtectedRoute from './components/ProtectedRoute';

// Import pages directly
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import CreateAssessment from './pages/CreateAssessment';
import UsersPage from './pages/UsersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import QuestionsPage from './pages/QuestionsPage';
import AssessmentDetail from './pages/AssessmentDetail';
import TakeExam from './pages/TakeExam';
import ExamResult from './pages/ExamResult';
import AdminExamMonitoring from './pages/AdminExamMonitoring';
import GenerateQuestions from './pages/GenerateQuestions';
import TestTemplates from './pages/TestTemplates';
import ManageCategories from './pages/ManageCategories';

// Simple theme configuration
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// App content component to use hooks
function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/assessments/create" 
          element={
            <ProtectedRoute>
              <CreateAssessment />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users" 
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/questions" 
          element={
            <ProtectedRoute>
              <QuestionsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/assessments/:id" 
          element={
            <ProtectedRoute>
              <AssessmentDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/exam/:id" 
          element={
            <ProtectedRoute>
              <TakeExam />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/exam/:id/result" 
          element={
            <ProtectedRoute>
              <ExamResult />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/monitoring" 
          element={
            <ProtectedRoute>
              <AdminExamMonitoring />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/questions/generate" 
          element={
            <ProtectedRoute>
              <GenerateQuestions />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/assessments/templates" 
          element={
            <ProtectedRoute>
              <TestTemplates />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/questions/categories" 
          element={
            <ProtectedRoute>
              <ManageCategories />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
