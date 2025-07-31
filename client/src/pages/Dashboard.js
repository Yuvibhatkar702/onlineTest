import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Avatar,
  Paper,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import {
  Add,
  Assessment,
  People,
  Analytics,
  TrendingUp,
  Schedule,
  CheckCircle,
  Warning,
  MoreVert,
  PlayArrow,
  Security,
  AutoAwesome
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssessments } from '../store/slices/assessmentsSlice';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading: authLoading } = useSelector((state) => state.auth);
  const { assessments = [], loading } = useSelector((state) => state.assessments);
  
  const [dashboardStats, setDashboardStats] = useState({
    totalAssessments: 0,
    activeAssessments: 0,
    totalParticipants: 0,
    avgCompletionRate: 0,
    recentActivity: []
  });

  // Move useEffect before any conditional returns - this fixes the React Hooks rules-of-hooks error
  useEffect(() => {
    // Only fetch assessments if user is authenticated and token exists
    // Add a small delay to ensure token is properly set
    if (isAuthenticated && localStorage.getItem('token')) {
      const timer = setTimeout(() => {
        dispatch(fetchAssessments({ limit: 10, sort: '-updatedAt' }));
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [dispatch, isAuthenticated]);

  // Show loading while authenticating
  if (authLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
          Loading Dashboard...
        </Typography>
      </Box>
    );
  }

  // If not authenticated, let ProtectedRoute handle the redirect
  if (!isAuthenticated) {
    return null;
  }

  // Mock data for charts
  const activityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Assessments Taken',
        data: [12, 19, 8, 15, 22, 18, 25],
        borderColor: 'rgb(102, 126, 234)',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const performanceData = {
    labels: ['Excellent', 'Good', 'Average', 'Below Average'],
    datasets: [
      {
        data: [35, 28, 22, 15],
        backgroundColor: [
          '#4CAF50',
          '#2196F3',
          '#FF9800',
          '#F44336',
        ],
        borderWidth: 0,
      },
    ],
  };

  const completionData = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [
      {
        data: [68, 22, 10],
        backgroundColor: ['#4CAF50', '#FF9800', '#9E9E9E'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const quickStats = [
    {
      title: 'Total Assessments',
      value: assessments.length || '0',
      icon: <Assessment sx={{ fontSize: 40 }} />,
      color: '#2196F3',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Active Participants',
      value: '1,234',
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#4CAF50',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Completion Rate',
      value: '87%',
      icon: <CheckCircle sx={{ fontSize: 40 }} />,
      color: '#FF9800',
      change: '+3%',
      trend: 'up'
    },
    {
      title: 'Average Score',
      value: '82.5',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: '#9C27B0',
      change: '+5%',
      trend: 'up'
    }
  ];

  const recentAssessments = (assessments || []).slice(0, 5);

  const upcomingDeadlines = [
    { name: 'Mid-term Exam', date: '2024-02-15', participants: 45 },
    { name: 'Quiz Chapter 5', date: '2024-02-18', participants: 32 },
    { name: 'Final Project', date: '2024-02-22', participants: 28 },
  ];

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {getGreeting()}, {user?.firstName || 'User'}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your assessments today.
          </Typography>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {quickStats.map((stat, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: stat.color,
                        width: 56,
                        height: 56,
                        mr: 2
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h4" component="div" fontWeight="bold">
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip
                      label={stat.change}
                      size="small"
                      color={stat.trend === 'up' ? 'success' : 'error'}
                      sx={{ fontSize: '0.75rem' }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      vs last month
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Recent Activity Chart */}
          <Grid item xs={12} lg={8}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" component="h2">
                    Activity Overview
                  </Typography>
                  <IconButton>
                    <MoreVert />
                  </IconButton>
                </Box>
                <Box sx={{ height: 300 }}>
                  <Line data={activityData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Performance Distribution */}
          <Grid item xs={12} lg={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  Performance Distribution
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Doughnut data={performanceData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Available Exams (For Students) */}
          {user?.role === 'student' && (
            <Grid item xs={12} lg={6}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" component="h2">
                      Available Exams
                    </Typography>
                    <Chip label="2 Active" color="success" size="small" />
                  </Box>
                  
                  <Box>
                    {[
                      {
                        id: 1,
                        title: "JavaScript Fundamentals Test",
                        duration: "60 minutes",
                        questions: 10,
                        deadline: "2024-01-20",
                        status: "available"
                      },
                      {
                        id: 2,
                        title: "React Advanced Concepts",
                        duration: "90 minutes", 
                        questions: 15,
                        deadline: "2024-01-25",
                        status: "available"
                      }
                    ].map((exam) => (
                      <Paper
                        key={exam.id}
                        elevation={0}
                        sx={{
                          p: 2,
                          mb: 2,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {exam.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {exam.duration} • {exam.questions} questions
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Deadline: {new Date(exam.deadline).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            startIcon={<PlayArrow />}
                            size="small"
                            onClick={() => navigate(`/exam/${exam.id}`)}
                          >
                            Take Exam
                          </Button>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Admin Monitoring (For Admins/Teachers) */}
          {(user?.role === 'admin' || user?.role === 'teacher') && (
            <Grid item xs={12} lg={6}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" component="h2">
                      Exam Monitoring
                    </Typography>
                    <Chip label="2 Live" color="error" size="small" />
                  </Box>
                  
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Security sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                    <Typography variant="body1" gutterBottom>
                      Monitor active exams and student behavior
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Real-time proctoring and violation detection
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Security />}
                      onClick={() => navigate('/admin/monitoring')}
                      size="large"
                    >
                      Open Monitoring Dashboard
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Recent Assessments */}
          <Grid item xs={12} lg={6}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" component="h2">
                    Recent Assessments
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/assessments/create')}
                    size="small"
                  >
                    Create New
                  </Button>
                </Box>
                
                {loading ? (
                  <LinearProgress />
                ) : recentAssessments.length > 0 ? (
                  <Box>
                    {recentAssessments.map((assessment) => (
                      <Paper
                        key={assessment._id}
                        elevation={0}
                        sx={{
                          p: 2,
                          mb: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'action.hover'
                          }
                        }}
                        onClick={() => navigate(`/assessments/${assessment._id}`)}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {assessment.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {assessment.description?.substring(0, 100)}...
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                              <Chip
                                label={assessment.status}
                                size="small"
                                color={assessment.status === 'published' ? 'success' : 'default'}
                                sx={{ mr: 1 }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {assessment.questions?.length || 0} questions
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Assessment sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No assessments yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Create your first assessment to get started
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => navigate('/assessments/create')}
                    >
                      Create Assessment
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Upcoming Deadlines */}
          <Grid item xs={12} lg={6}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" component="h2">
                    Upcoming Deadlines
                  </Typography>
                  <IconButton>
                    <MoreVert />
                  </IconButton>
                </Box>
                
                <Box>
                  {upcomingDeadlines.map((deadline, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        mb: 1,
                        bgcolor: 'action.hover',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Schedule sx={{ color: 'warning.main', mr: 2 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {deadline.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {deadline.participants} participants
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(deadline.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Completion Status */}
          <Grid item xs={12} lg={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  Completion Status
                </Typography>
                <Box sx={{ height: 250 }}>
                  <Doughnut data={completionData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} lg={8}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      startIcon={<Add />}
                      onClick={() => navigate('/assessments/create')}
                      sx={{ py: 2 }}
                    >
                      Create Assessment
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      startIcon={<AutoAwesome />}
                      onClick={() => navigate('/questions/generate')}
                      sx={{ py: 2 }}
                    >
                      Generate Questions
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      startIcon={<Assessment />}
                      onClick={() => navigate('/assessments/templates')}
                      sx={{ py: 2 }}
                    >
                      Use Templates
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      startIcon={<Analytics />}
                      onClick={() => navigate('/analytics')}
                      sx={{ py: 2 }}
                    >
                      View Analytics
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
