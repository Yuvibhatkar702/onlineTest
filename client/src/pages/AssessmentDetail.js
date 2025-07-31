import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Alert
} from '@mui/material';
import {
  ArrowBack,
  PlayArrow,
  Edit,
  Delete,
  Share,
  MoreVert,
  Assessment,
  People,
  Timer,
  Star,
  TrendingUp,
  TrendingDown,
  Visibility,
  Download,
  DateRange,
  School,
  Check,
  Close,
  Warning
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

const AssessmentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [shareDialog, setShareDialog] = useState(false);

  useEffect(() => {
    // Mock assessment data - replace with API call
    const mockAssessment = {
      id: parseInt(id),
      title: 'JavaScript Fundamentals Quiz',
      description: 'Test your knowledge of JavaScript basics including variables, functions, and control structures.',
      category: 'Programming',
      difficulty: 'medium',
      timeLimit: 30,
      totalQuestions: 15,
      passingScore: 70,
      isPublic: true,
      status: 'published',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      createdBy: {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'JD'
      },
      statistics: {
        totalAttempts: 234,
        completionRate: 89.3,
        averageScore: 78.5,
        passRate: 67.5,
        averageTime: 22.5
      },
      recentAttempts: [
        {
          id: 1,
          user: { name: 'Alice Johnson', email: 'alice@example.com' },
          score: 85,
          completedAt: '2024-01-30 14:30',
          timeSpent: 25,
          status: 'passed'
        },
        {
          id: 2,
          user: { name: 'Bob Smith', email: 'bob@example.com' },
          score: 92,
          completedAt: '2024-01-30 13:15',
          timeSpent: 28,
          status: 'passed'
        },
        {
          id: 3,
          user: { name: 'Carol Davis', email: 'carol@example.com' },
          score: 65,
          completedAt: '2024-01-30 12:45',
          timeSpent: 30,
          status: 'failed'
        },
        {
          id: 4,
          user: { name: 'David Wilson', email: 'david@example.com' },
          score: 78,
          completedAt: '2024-01-30 11:20',
          timeSpent: 26,
          status: 'passed'
        }
      ],
      questions: [
        {
          id: 1,
          type: 'multiple-choice',
          question: 'What is the correct way to declare a variable in JavaScript?',
          options: ['var x = 5;', 'variable x = 5;', 'v x = 5;', 'declare x = 5;'],
          correctAnswer: 0,
          difficulty: 'easy'
        },
        {
          id: 2,
          type: 'multiple-choice',
          question: 'Which method is used to add an element to the end of an array?',
          options: ['append()', 'push()', 'add()', 'insert()'],
          correctAnswer: 1,
          difficulty: 'medium'
        },
        {
          id: 3,
          type: 'true-false',
          question: 'JavaScript is a statically typed language.',
          correctAnswer: false,
          difficulty: 'easy'
        }
      ],
      analytics: {
        scoreDistribution: [
          { range: '0-20', count: 5 },
          { range: '21-40', count: 12 },
          { range: '41-60', count: 28 },
          { range: '61-80', count: 89 },
          { range: '81-100', count: 100 }
        ],
        weeklyAttempts: [
          { week: 'Week 1', attempts: 45 },
          { week: 'Week 2', attempts: 52 },
          { week: 'Week 3', attempts: 38 },
          { week: 'Week 4', attempts: 67 }
        ]
      }
    };
    
    setAssessment(mockAssessment);
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteAssessment = () => {
    // Mock delete - replace with API call
    console.log('Deleting assessment...');
    setDeleteDialog(false);
    handleMenuClose();
    navigate('/dashboard');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed': return 'success';
      case 'failed': return 'error';
      case 'in-progress': return 'info';
      default: return 'default';
    }
  };

  if (!assessment) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h4">
                {assessment.title}
              </Typography>
              <Chip
                label={assessment.status}
                color={assessment.status === 'published' ? 'success' : 'warning'}
                variant="outlined"
              />
              <Chip
                label={assessment.difficulty}
                color={getDifficultyColor(assessment.difficulty)}
                size="small"
              />
            </Box>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {assessment.description}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem' }}>
                  {assessment.createdBy.avatar}
                </Avatar>
                <Typography variant="body2" color="text.secondary">
                  Created by {assessment.createdBy.name}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Created: {assessment.createdAt}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Updated: {assessment.updatedAt}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={() => console.log('Take assessment')}
            >
              Take Assessment
            </Button>
            <IconButton onClick={handleMenuClick}>
              <MoreVert />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Assessment />
                </Avatar>
                <Typography variant="h6" color="text.secondary">
                  Total Attempts
                </Typography>
              </Box>
              <Typography variant="h4">{assessment.statistics.totalAttempts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <Timer />
                </Avatar>
                <Typography variant="h6" color="text.secondary">
                  Completion Rate
                </Typography>
              </Box>
              <Typography variant="h4">{assessment.statistics.completionRate}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <Star />
                </Avatar>
                <Typography variant="h6" color="text.secondary">
                  Average Score
                </Typography>
              </Box>
              <Typography variant="h4">{assessment.statistics.averageScore}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <School />
                </Avatar>
                <Typography variant="h6" color="text.secondary">
                  Pass Rate
                </Typography>
              </Box>
              <Typography variant="h4">{assessment.statistics.passRate}%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Assessment Details */}
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>Assessment Configuration</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">Category</Typography>
              <Typography variant="h6">{assessment.category}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">Time Limit</Typography>
              <Typography variant="h6">{assessment.timeLimit} minutes</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">Total Questions</Typography>
              <Typography variant="h6">{assessment.totalQuestions}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">Passing Score</Typography>
              <Typography variant="h6">{assessment.passingScore}%</Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Detailed Tabs */}
      <Paper>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Recent Attempts" />
          <Tab label="Questions" />
          <Tab label="Analytics" />
        </Tabs>

        {/* Tab 1: Recent Attempts */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Recent Attempts</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Time Spent</TableCell>
                    <TableCell>Completed At</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assessment.recentAttempts.map((attempt) => (
                    <TableRow key={attempt.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">
                            {attempt.user.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {attempt.user.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6" color="primary">
                            {attempt.score}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={attempt.score}
                            sx={{ width: 60, height: 8 }}
                            color={attempt.score >= assessment.passingScore ? 'success' : 'error'}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={attempt.status}
                          color={getStatusColor(attempt.status)}
                          size="small"
                          icon={attempt.status === 'passed' ? <Check /> : <Close />}
                        />
                      </TableCell>
                      <TableCell>{attempt.timeSpent} min</TableCell>
                      <TableCell>{attempt.completedAt}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => console.log('View details')}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Tab 2: Questions */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Questions ({assessment.questions.length})</Typography>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => console.log('Edit questions')}
              >
                Edit Questions
              </Button>
            </Box>
            <List>
              {assessment.questions.map((question, index) => (
                <React.Fragment key={question.id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="subtitle1">
                              {index + 1}. {question.question}
                            </Typography>
                            <Chip
                              label={question.type.replace('-', ' ')}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={question.difficulty}
                              color={getDifficultyColor(question.difficulty)}
                              size="small"
                            />
                          </Box>
                          {question.options && (
                            <Box sx={{ ml: 2 }}>
                              {question.options.map((option, optIndex) => (
                                <Typography
                                  key={optIndex}
                                  variant="body2"
                                  color={optIndex === question.correctAnswer ? 'success.main' : 'text.secondary'}
                                  sx={{ mb: 0.5 }}
                                >
                                  {String.fromCharCode(65 + optIndex)}. {option}
                                  {optIndex === question.correctAnswer && ' ✓'}
                                </Typography>
                              ))}
                            </Box>
                          )}
                          {question.type === 'true-false' && (
                            <Typography
                              variant="body2"
                              color="success.main"
                              sx={{ ml: 2 }}
                            >
                              Correct Answer: {question.correctAnswer ? 'True' : 'False'} ✓
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < assessment.questions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}

        {/* Tab 3: Analytics */}
        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Performance Analytics</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Score Distribution</Typography>
                    {assessment.analytics.scoreDistribution.map((item) => (
                      <Box key={item.range} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">{item.range}%</Typography>
                          <Typography variant="body2">{item.count} users</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(item.count / assessment.statistics.totalAttempts) * 100}
                          sx={{ height: 8 }}
                        />
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Key Metrics</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Average Time Spent
                      </Typography>
                      <Typography variant="h5">
                        {assessment.statistics.averageTime} minutes
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUp color="success" />
                        <Typography variant="body2">
                          Best Score: 95% (Top 10%)
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingDown color="error" />
                        <Typography variant="body2">
                          Lowest Score: 15% (Needs attention)
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => console.log('Edit assessment')}>
          <Edit sx={{ mr: 1 }} /> Edit Assessment
        </MenuItem>
        <MenuItem onClick={() => setShareDialog(true)}>
          <Share sx={{ mr: 1 }} /> Share Assessment
        </MenuItem>
        <MenuItem onClick={() => console.log('Download results')}>
          <Download sx={{ mr: 1 }} /> Download Results
        </MenuItem>
        <MenuItem onClick={() => setDeleteDialog(true)} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} /> Delete Assessment
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Assessment</DialogTitle>
        <DialogContent>
          <Alert severity="warning">
            Are you sure you want to delete "{assessment.title}"? 
            This will permanently remove the assessment and all associated data. This action cannot be undone.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteAssessment} color="error" variant="contained">
            Delete Assessment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialog} onClose={() => setShareDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Share Assessment</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Share this assessment with others using the link below:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              p: 2,
              bgcolor: 'grey.100',
              borderRadius: 1,
              fontFamily: 'monospace',
              wordBreak: 'break-all'
            }}
          >
            https://testportal.com/assessment/{assessment.id}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialog(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              navigator.clipboard.writeText(`https://testportal.com/assessment/${assessment.id}`);
              console.log('Link copied!');
            }}
          >
            Copy Link
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AssessmentDetail;
