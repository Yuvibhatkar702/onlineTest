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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Badge,
  Switch,
  FormControlLabel,
  TextField,
  InputAdornment,
  Tooltip,
  Tab,
  Tabs,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Visibility,
  Warning,
  Security,
  Block,
  CheckCircle,
  Cancel,
  Search,
  FilterList,
  MoreVert,
  Assessment,
  People,
  Timer,
  VideoCall,
  VolumeUp,
  Screenshot,
  TabOutlined,
  Computer,
  LocationOn,
  NetworkCheck
} from '@mui/icons-material';
import { styled } from '@mui/material';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const AdminExamMonitoring = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [liveExams, setLiveExams] = useState([]);
  const [examSessions, setExamSessions] = useState([]);
  const [violations, setViolations] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewStudentDialog, setViewStudentDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [proctorEnabled, setPoctorEnabled] = useState(true);

  useEffect(() => {
    loadExamData();
    // Set up real-time updates
    const interval = setInterval(loadExamData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadExamData = async () => {
    // Mock data - replace with actual API calls
    const mockLiveExams = [
      {
        id: 1,
        title: "JavaScript Fundamentals",
        startTime: "2024-01-15 10:00",
        duration: 120,
        activeStudents: 15,
        totalStudents: 20,
        violationCount: 3,
        status: 'active'
      },
      {
        id: 2,
        title: "React Advanced Concepts",
        startTime: "2024-01-15 14:00",
        duration: 90,
        activeStudents: 8,
        totalStudents: 12,
        violationCount: 1,
        status: 'active'
      }
    ];

    const mockSessions = [
      {
        id: 1,
        examId: 1,
        studentName: "John Doe",
        studentEmail: "john@example.com",
        startTime: "2024-01-15 10:05",
        currentQuestion: 5,
        totalQuestions: 10,
        violations: 2,
        tabSwitches: 1,
        warnings: 1,
        status: 'active',
        ipAddress: "192.168.1.100",
        browserInfo: "Chrome 120.0",
        cameraEnabled: true,
        microphoneEnabled: true,
        fullscreenActive: true,
        lastActivity: new Date().toISOString()
      },
      {
        id: 2,
        examId: 1,
        studentName: "Jane Smith",
        studentEmail: "jane@example.com",
        startTime: "2024-01-15 10:03",
        currentQuestion: 7,
        totalQuestions: 10,
        violations: 0,
        tabSwitches: 0,
        warnings: 0,
        status: 'active',
        ipAddress: "192.168.1.101",
        browserInfo: "Firefox 121.0",
        cameraEnabled: true,
        microphoneEnabled: true,
        fullscreenActive: true,
        lastActivity: new Date().toISOString()
      }
    ];

    const mockViolations = [
      {
        id: 1,
        examId: 1,
        studentName: "John Doe",
        violationType: "Tab Switch",
        timestamp: "2024-01-15 10:15:30",
        questionNumber: 3,
        severity: "high",
        description: "Student switched to another tab/window"
      },
      {
        id: 2,
        examId: 1,
        studentName: "John Doe",
        violationType: "Fullscreen Exit",
        timestamp: "2024-01-15 10:20:15",
        questionNumber: 4,
        severity: "medium",
        description: "Student exited fullscreen mode"
      }
    ];

    setLiveExams(mockLiveExams);
    setExamSessions(mockSessions);
    setViolations(mockViolations);
  };

  const handleTerminateSession = async (sessionId) => {
    try {
      // API call to terminate session
      console.log('Terminating session:', sessionId);
      // Update local state
      setExamSessions(prev => 
        prev.map(session => 
          session.id === sessionId 
            ? { ...session, status: 'terminated' }
            : session
        )
      );
    } catch (error) {
      console.error('Failed to terminate session:', error);
    }
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setViewStudentDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'terminated': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const filteredSessions = examSessions.filter(session =>
    session.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const TabPanel = ({ children, value, index }) => (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Exam Monitoring Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Real-time monitoring and control of active examinations
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Assessment sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">{liveExams.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Live Exams
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <People sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">
                    {examSessions.filter(s => s.status === 'active').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Students
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Warning sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">{violations.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Violations
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Security sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={proctorEnabled}
                        onChange={(e) => setPoctorEnabled(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Proctoring"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Live Sessions" />
            <Tab label="Violations" />
            <Tab label="Exam Overview" />
          </Tabs>
        </Box>

        {/* Live Sessions Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <TextField
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              startIcon={<FilterList />}
              onClick={(e) => setFilterAnchorEl(e.currentTarget)}
            >
              Filter
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Violations</TableCell>
                  <TableCell>Proctoring</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StyledBadge
                          color={session.status === 'active' ? 'success' : 'error'}
                          variant="dot"
                        >
                          <Avatar sx={{ mr: 2 }}>
                            {session.studentName.charAt(0)}
                          </Avatar>
                        </StyledBadge>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {session.studentName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {session.studentEmail}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          Question {session.currentQuestion} of {session.totalQuestions}
                        </Typography>
                        <Box sx={{ width: 100, mt: 1 }}>
                          <Box
                            sx={{
                              height: 4,
                              bgcolor: 'grey.300',
                              borderRadius: 2,
                              overflow: 'hidden'
                            }}
                          >
                            <Box
                              sx={{
                                height: '100%',
                                bgcolor: 'primary.main',
                                width: `${(session.currentQuestion / session.totalQuestions) * 100}%`,
                                transition: 'width 0.3s ease'
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        label={session.status}
                        color={getStatusColor(session.status)}
                        size="small"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {session.violations > 0 && (
                          <Chip
                            label={`${session.violations} violations`}
                            color="error"
                            size="small"
                          />
                        )}
                        {session.tabSwitches > 0 && (
                          <Tooltip title="Tab switches">
                            <Chip
                              icon={<TabOutlined />}
                              label={session.tabSwitches}
                              color="warning"
                              size="small"
                            />
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title={session.cameraEnabled ? "Camera Active" : "Camera Inactive"}>
                          <VideoCall color={session.cameraEnabled ? 'success' : 'disabled'} />
                        </Tooltip>
                        <Tooltip title={session.microphoneEnabled ? "Microphone Active" : "Microphone Inactive"}>
                          <VolumeUp color={session.microphoneEnabled ? 'success' : 'disabled'} />
                        </Tooltip>
                        <Tooltip title={session.fullscreenActive ? "Fullscreen Active" : "Fullscreen Inactive"}>
                          <Computer color={session.fullscreenActive ? 'success' : 'error'} />
                        </Tooltip>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewStudent(session)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Terminate Session">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleTerminateSession(session.id)}
                            disabled={session.status !== 'active'}
                          >
                            <Block />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Violations Tab */}
        <TabPanel value={activeTab} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Violation Type</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Question</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {violations.map((violation) => (
                  <TableRow key={violation.id}>
                    <TableCell>{violation.studentName}</TableCell>
                    <TableCell>
                      <Chip
                        label={violation.violationType}
                        color={getSeverityColor(violation.severity)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(violation.timestamp).toLocaleTimeString()}</TableCell>
                    <TableCell>Q{violation.questionNumber}</TableCell>
                    <TableCell>
                      <Chip
                        label={violation.severity}
                        color={getSeverityColor(violation.severity)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{violation.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Exam Overview Tab */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            {liveExams.map((exam) => (
              <Grid item xs={12} md={6} key={exam.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {exam.title}
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Active Students
                        </Typography>
                        <Typography variant="h6">
                          {exam.activeStudents} / {exam.totalStudents}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Violations
                        </Typography>
                        <Typography variant="h6" color={exam.violationCount > 0 ? 'error.main' : 'success.main'}>
                          {exam.violationCount}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Start Time
                        </Typography>
                        <Typography variant="body1">
                          {exam.startTime}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Duration
                        </Typography>
                        <Typography variant="body1">
                          {exam.duration} minutes
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={exam.status}
                        color={getStatusColor(exam.status)}
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Paper>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
      >
        <MenuItem onClick={() => setFilterAnchorEl(null)}>Active Sessions</MenuItem>
        <MenuItem onClick={() => setFilterAnchorEl(null)}>With Violations</MenuItem>
        <MenuItem onClick={() => setFilterAnchorEl(null)}>Camera Issues</MenuItem>
        <MenuItem onClick={() => setFilterAnchorEl(null)}>All Sessions</MenuItem>
      </Menu>

      {/* Student Details Dialog */}
      <Dialog 
        open={viewStudentDialog} 
        onClose={() => setViewStudentDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Student Exam Details
        </DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Student Information
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Name"
                        secondary={selectedStudent.studentName}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Email"
                        secondary={selectedStudent.studentEmail}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Start Time"
                        secondary={selectedStudent.startTime}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LocationOn />
                      </ListItemIcon>
                      <ListItemText
                        primary="IP Address"
                        secondary={selectedStudent.ipAddress}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Computer />
                      </ListItemIcon>
                      <ListItemText
                        primary="Browser"
                        secondary={selectedStudent.browserInfo}
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Exam Progress
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Current Question"
                        secondary={`${selectedStudent.currentQuestion} of ${selectedStudent.totalQuestions}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Violations"
                        secondary={selectedStudent.violations}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Tab Switches"
                        secondary={selectedStudent.tabSwitches}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Warnings"
                        secondary={selectedStudent.warnings}
                      />
                    </ListItem>
                  </List>
                  
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Proctoring Status
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<VideoCall />}
                      label={selectedStudent.cameraEnabled ? "Camera Active" : "Camera Inactive"}
                      color={selectedStudent.cameraEnabled ? "success" : "error"}
                    />
                    <Chip
                      icon={<VolumeUp />}
                      label={selectedStudent.microphoneEnabled ? "Mic Active" : "Mic Inactive"}
                      color={selectedStudent.microphoneEnabled ? "success" : "error"}
                    />
                    <Chip
                      icon={<Computer />}
                      label={selectedStudent.fullscreenActive ? "Fullscreen" : "Windowed"}
                      color={selectedStudent.fullscreenActive ? "success" : "warning"}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewStudentDialog(false)}>
            Close
          </Button>
          <Button 
            color="error" 
            onClick={() => {
              if (selectedStudent) {
                handleTerminateSession(selectedStudent.id);
              }
              setViewStudentDialog(false);
            }}
          >
            Terminate Session
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminExamMonitoring;
