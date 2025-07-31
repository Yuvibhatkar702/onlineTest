import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Warning,
  Timer,
  Assessment,
  Security,
  Home,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const ExamResult = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [result, setResult] = useState(null);
  const [showViolations, setShowViolations] = useState(false);

  useEffect(() => {
    // Get result from navigation state or load from API
    if (location.state?.result) {
      setResult(location.state.result);
    } else {
      // Load result from API (mock data for now)
      loadExamResult();
    }
  }, [id, location.state]);

  const loadExamResult = async () => {
    try {
      // Mock result data - replace with actual API call
      const mockResult = {
        examId: id,
        examTitle: "JavaScript Fundamentals Test",
        studentName: "Student User",
        score: 35,
        totalMarks: 50,
        passingMarks: 25,
        percentage: 70,
        passed: true,
        timeSpent: 1800, // 30 minutes in seconds
        submittedAt: new Date().toISOString(),
        violations: [
          {
            id: 1,
            message: "Exam started",
            timestamp: "10:00:15",
            questionNumber: 1
          },
          {
            id: 2,
            message: "Tab switched or window minimized",
            timestamp: "10:15:30",
            questionNumber: 5
          }
        ],
        tabSwitchCount: 1,
        warningCount: 1,
        questionsAnswered: 10,
        totalQuestions: 10,
        correctAnswers: 7,
        incorrectAnswers: 3,
        status: 'completed'
      };
      setResult(mockResult);
    } catch (error) {
      console.error('Failed to load exam result:', error);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: 'success' };
    if (percentage >= 80) return { grade: 'A', color: 'success' };
    if (percentage >= 70) return { grade: 'B', color: 'info' };
    if (percentage >= 60) return { grade: 'C', color: 'warning' };
    if (percentage >= 50) return { grade: 'D', color: 'warning' };
    return { grade: 'F', color: 'error' };
  };

  if (!result) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <LinearProgress sx={{ width: '300px' }} />
        </Box>
      </Container>
    );
  }

  const { grade, color } = getGrade(result.percentage);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
        <Box sx={{ mb: 2 }}>
          {result.passed ? (
            <CheckCircle sx={{ fontSize: 60, color: 'success.main' }} />
          ) : (
            <Cancel sx={{ fontSize: 60, color: 'error.main' }} />
          )}
        </Box>
        
        <Typography variant="h4" gutterBottom>
          {result.passed ? 'Congratulations!' : 'Better Luck Next Time'}
        </Typography>
        
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {result.examTitle}
        </Typography>
        
        <Alert 
          severity={result.passed ? 'success' : 'error'} 
          sx={{ mt: 2, display: 'inline-block' }}
        >
          {result.passed ? 'You have passed the exam!' : 'You did not meet the passing criteria.'}
        </Alert>
      </Paper>

      {/* Score Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary" gutterBottom>
                {result.score}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                out of {result.totalMarks}
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                Total Score
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color={`${color}.main`} gutterBottom>
                {result.percentage}%
              </Typography>
              <Chip 
                label={grade} 
                color={color} 
                size="small" 
              />
              <Typography variant="h6" sx={{ mt: 1 }}>
                Percentage
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="success.main" gutterBottom>
                {result.correctAnswers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                out of {result.totalQuestions}
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                Correct
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Timer sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h6">
                {formatTime(result.timeSpent)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Time Spent
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Results */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
              Exam Details
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Questions Answered
                </Typography>
                <Typography variant="body1">
                  {result.questionsAnswered} / {result.totalQuestions}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Passing Score
                </Typography>
                <Typography variant="body1">
                  {result.passingMarks} marks
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Submitted At
                </Typography>
                <Typography variant="body1">
                  {new Date(result.submittedAt).toLocaleString()}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip 
                  label={result.status} 
                  color={result.status === 'completed' ? 'success' : 'warning'}
                  size="small"
                />
              </Grid>
            </Grid>

            {/* Score Breakdown */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Score Breakdown
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Correct Answers</Typography>
                  <Typography variant="body2">{result.correctAnswers} questions</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(result.correctAnswers / result.totalQuestions) * 100}
                  color="success"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Incorrect Answers</Typography>
                  <Typography variant="body2">{result.incorrectAnswers} questions</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(result.incorrectAnswers / result.totalQuestions) * 100}
                  color="error"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
                Security Report
              </Typography>
              <Button
                size="small"
                onClick={() => setShowViolations(!showViolations)}
                startIcon={showViolations ? <VisibilityOff /> : <Visibility />}
              >
                {showViolations ? 'Hide' : 'Show'} Details
              </Button>
            </Box>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color={result.warningCount > 0 ? 'warning.main' : 'success.main'}>
                    {result.warningCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Warnings
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color={result.tabSwitchCount > 0 ? 'error.main' : 'success.main'}>
                    {result.tabSwitchCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tab Switches
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {result.warningCount === 0 && result.tabSwitchCount === 0 && (
              <Alert severity="success" sx={{ mb: 2 }}>
                No security violations detected. Great job following the exam rules!
              </Alert>
            )}

            {(result.warningCount > 0 || result.tabSwitchCount > 0) && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Security violations were detected during your exam. This may affect your final score.
              </Alert>
            )}

            {showViolations && (
              <Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Violation Log:
                </Typography>
                <List dense>
                  {result.violations.map((violation) => (
                    <ListItem key={violation.id} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Warning fontSize="small" color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary={violation.message}
                        secondary={`${violation.timestamp} - Q${violation.questionNumber}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Actions */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          variant="contained"
          startIcon={<Home />}
          onClick={() => navigate('/dashboard')}
          size="large"
        >
          Return to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default ExamResult;
