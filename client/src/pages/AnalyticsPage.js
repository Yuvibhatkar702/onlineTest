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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tabs,
  Tab
} from '@mui/material';
import {
  ArrowBack,
  TrendingUp,
  TrendingDown,
  Assessment,
  People,
  Timer,
  School,
  Star,
  Assignment,
  EmojiEvents,
  Analytics as AnalyticsIcon,
  Download,
  DateRange
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('30days');
  const [tabValue, setTabValue] = useState(0);
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalAssessments: 0,
      totalUsers: 0,
      completionRate: 0,
      averageScore: 0
    },
    trends: [],
    topAssessments: [],
    recentActivity: []
  });

  useEffect(() => {
    // Mock analytics data - replace with API call
    const mockData = {
      overview: {
        totalAssessments: 156,
        totalUsers: 1247,
        completionRate: 87.5,
        averageScore: 82.3,
        assessmentsCreated: 23,
        activeUsers: 892,
        totalAttempts: 3456,
        passRate: 78.9
      },
      monthlyTrends: [
        { month: 'Jan', assessments: 15, users: 234, avgScore: 78 },
        { month: 'Feb', assessments: 18, users: 289, avgScore: 81 },
        { month: 'Mar', assessments: 22, users: 356, avgScore: 79 },
        { month: 'Apr', assessments: 19, users: 401, avgScore: 83 },
        { month: 'May', assessments: 25, users: 456, avgScore: 85 },
        { month: 'Jun', assessments: 28, users: 512, avgScore: 82 }
      ],
      topAssessments: [
        {
          id: 1,
          title: 'JavaScript Fundamentals',
          attempts: 345,
          avgScore: 85.2,
          completionRate: 92.1,
          category: 'Programming'
        },
        {
          id: 2,
          title: 'React Components Quiz',
          attempts: 289,
          avgScore: 78.9,
          completionRate: 88.5,
          category: 'Frontend'
        },
        {
          id: 3,
          title: 'Database Design Basics',
          attempts: 234,
          avgScore: 81.7,
          completionRate: 85.3,
          category: 'Database'
        },
        {
          id: 4,
          title: 'Python Data Structures',
          attempts: 198,
          avgScore: 83.4,
          completionRate: 90.1,
          category: 'Programming'
        }
      ],
      userPerformance: [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          assessmentsTaken: 15,
          avgScore: 92.3,
          trend: 'up'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          assessmentsTaken: 12,
          avgScore: 88.7,
          trend: 'up'
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike@example.com',
          assessmentsTaken: 8,
          avgScore: 76.2,
          trend: 'down'
        }
      ],
      recentActivity: [
        {
          id: 1,
          type: 'assessment_completed',
          user: 'John Doe',
          assessment: 'JavaScript Fundamentals',
          score: 85,
          timestamp: '2 hours ago'
        },
        {
          id: 2,
          type: 'assessment_created',
          user: 'Jane Smith',
          assessment: 'Advanced React Patterns',
          timestamp: '4 hours ago'
        },
        {
          id: 3,
          type: 'user_registered',
          user: 'Mike Wilson',
          timestamp: '6 hours ago'
        },
        {
          id: 4,
          type: 'assessment_completed',
          user: 'Sarah Davis',
          assessment: 'Python Basics',
          score: 92,
          timestamp: '8 hours ago'
        }
      ]
    };
    
    setAnalyticsData(mockData);
  }, [timeframe]);

  const StatCard = ({ title, value, change, icon, color = 'primary' }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: `${color}.main`, mr: 2 }}>
            {icon}
          </Avatar>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {value}
        </Typography>
        {change && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {change > 0 ? (
              <TrendingUp color="success" sx={{ mr: 1 }} />
            ) : (
              <TrendingDown color="error" sx={{ mr: 1 }} />
            )}
            <Typography
              variant="body2"
              color={change > 0 ? 'success.main' : 'error.main'}
            >
              {Math.abs(change)}% from last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const getActivityIcon = (type) => {
    switch (type) {
      case 'assessment_completed': return <Assignment />;
      case 'assessment_created': return <EmojiEvents />;
      case 'user_registered': return <People />;
      default: return <AnalyticsIcon />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'assessment_completed': return 'success';
      case 'assessment_created': return 'primary';
      case 'user_registered': return 'info';
      default: return 'default';
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const exportReport = () => {
    // Mock export functionality
    console.log('Exporting analytics report...');
  };

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Analytics Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Timeframe</InputLabel>
              <Select
                value={timeframe}
                label="Timeframe"
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <MenuItem value="7days">Last 7 days</MenuItem>
                <MenuItem value="30days">Last 30 days</MenuItem>
                <MenuItem value="90days">Last 90 days</MenuItem>
                <MenuItem value="1year">Last year</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={exportReport}
            >
              Export Report
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Assessments"
            value={analyticsData.overview.totalAssessments}
            change={12.5}
            icon={<Assessment />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={analyticsData.overview.totalUsers?.toLocaleString()}
            change={8.3}
            icon={<People />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completion Rate"
            value={`${analyticsData.overview.completionRate}%`}
            change={3.2}
            icon={<Timer />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Average Score"
            value={`${analyticsData.overview.averageScore}%`}
            change={-1.8}
            icon={<Star />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Detailed Analytics Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Assessment Performance" />
          <Tab label="User Analytics" />
          <Tab label="Recent Activity" />
        </Tabs>

        {/* Tab 1: Assessment Performance */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Top Performing Assessments
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Assessment</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Attempts</TableCell>
                    <TableCell>Avg Score</TableCell>
                    <TableCell>Completion Rate</TableCell>
                    <TableCell>Performance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analyticsData.topAssessments?.map((assessment) => (
                    <TableRow key={assessment.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {assessment.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={assessment.category}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{assessment.attempts}</TableCell>
                      <TableCell>{assessment.avgScore}%</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={assessment.completionRate}
                            sx={{ width: 60, height: 8 }}
                          />
                          <Typography variant="body2">
                            {assessment.completionRate}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {assessment.avgScore >= 80 ? (
                          <Chip
                            label="Excellent"
                            color="success"
                            size="small"
                            icon={<TrendingUp />}
                          />
                        ) : assessment.avgScore >= 70 ? (
                          <Chip
                            label="Good"
                            color="primary"
                            size="small"
                          />
                        ) : (
                          <Chip
                            label="Needs Improvement"
                            color="warning"
                            size="small"
                            icon={<TrendingDown />}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Tab 2: User Analytics */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Top Performing Users
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>User</TableCell>
                        <TableCell>Assessments Taken</TableCell>
                        <TableCell>Average Score</TableCell>
                        <TableCell>Trend</TableCell>
                        <TableCell>Performance</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analyticsData.userPerformance?.map((user) => (
                        <TableRow key={user.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar>
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2">
                                  {user.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {user.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>{user.assessmentsTaken}</TableCell>
                          <TableCell>
                            <Typography variant="h6" color="primary">
                              {user.avgScore}%
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {user.trend === 'up' ? (
                              <TrendingUp color="success" />
                            ) : (
                              <TrendingDown color="error" />
                            )}
                          </TableCell>
                          <TableCell>
                            <LinearProgress
                              variant="determinate"
                              value={user.avgScore}
                              sx={{ width: 100, height: 8 }}
                              color={user.avgScore >= 80 ? 'success' : user.avgScore >= 70 ? 'primary' : 'warning'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      User Statistics
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Active Users
                      </Typography>
                      <Typography variant="h5">
                        {analyticsData.overview.activeUsers}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Total Attempts
                      </Typography>
                      <Typography variant="h5">
                        {analyticsData.overview.totalAttempts?.toLocaleString()}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Pass Rate
                      </Typography>
                      <Typography variant="h5" color="success.main">
                        {analyticsData.overview.passRate}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tab 3: Recent Activity */}
        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Recent Platform Activity
            </Typography>
            <List>
              {analyticsData.recentActivity?.map((activity) => (
                <ListItem key={activity.id} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: `${getActivityColor(activity.type)}.main` }}>
                      {getActivityIcon(activity.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box>
                        {activity.type === 'assessment_completed' && (
                          <Typography variant="body1">
                            <strong>{activity.user}</strong> completed "{activity.assessment}" 
                            with a score of <strong>{activity.score}%</strong>
                          </Typography>
                        )}
                        {activity.type === 'assessment_created' && (
                          <Typography variant="body1">
                            <strong>{activity.user}</strong> created new assessment "{activity.assessment}"
                          </Typography>
                        )}
                        {activity.type === 'user_registered' && (
                          <Typography variant="body1">
                            <strong>{activity.user}</strong> joined the platform
                          </Typography>
                        )}
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {activity.timestamp}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default AnalyticsPage;
