import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  Card,
  CardContent,
  Chip,
  IconButton
} from '@mui/material';
import {
  Warning,
  Visibility,
  VisibilityOff,
  Lock,
  Security,
  Timer,
  ExitToApp
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const TakeExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Exam state
  const [exam, setExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Security state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [violations, setViolations] = useState([]);
  const [warningCount, setWarningCount] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [proctoring, setProctoring] = useState({
    cameraAccess: false,
    screenRecording: false,
    audioMonitoring: false
  });
  
  // Warning dialogs
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [showTermination, setShowTermination] = useState(false);
  
  // Refs
  const examRef = useRef(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const warningTimeoutRef = useRef(null);

  // Security monitoring effects
  useEffect(() => {
    if (!examStarted) return;

    // Prevent right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault();
      addViolation('Attempted to access context menu');
    };

    // Prevent key combinations
    const handleKeyDown = (e) => {
      // Prevent F12, Ctrl+Shift+I, Ctrl+U, etc.
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 'U') ||
        (e.ctrlKey && e.key === 's') ||
        (e.ctrlKey && e.key === 'S') ||
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        addViolation(`Attempted to use prohibited key combination: ${e.key}`);
      }
    };

    // Monitor tab visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => prev + 1);
        addViolation('Tab switched or window minimized');
        showWarningDialog('You switched tabs or minimized the window. This is not allowed during the exam.');
      }
    };

    // Monitor mouse leave (potential tab switch)
    const handleMouseLeave = () => {
      addViolation('Mouse left the exam window');
    };

    // Prevent text selection
    const handleSelectStart = (e) => {
      e.preventDefault();
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('selectstart', handleSelectStart);

    // Disable copy/paste
    document.addEventListener('copy', (e) => {
      e.preventDefault();
      addViolation('Attempted to copy content');
    });
    
    document.addEventListener('paste', (e) => {
      e.preventDefault();
      addViolation('Attempted to paste content');
    });

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('selectstart', handleSelectStart);
    };
  }, [examStarted]);

  // Fullscreen monitoring
  useEffect(() => {
    if (!examStarted) return;

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );

      setIsFullscreen(isCurrentlyFullscreen);

      if (!isCurrentlyFullscreen && examStarted && !examSubmitted) {
        addViolation('Exited fullscreen mode');
        showWarningDialog('You must remain in fullscreen mode during the exam.');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [examStarted, examSubmitted]);

  // Timer countdown
  useEffect(() => {
    if (!examStarted || examSubmitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, examSubmitted, timeLeft]);

  // Load exam data
  useEffect(() => {
    loadExam();
  }, [id]);

  const loadExam = async () => {
    try {
      setLoading(true);
      // Mock exam data - replace with actual API call
      const mockExam = {
        id: id,
        title: "JavaScript Fundamentals Test",
        description: "Test your knowledge of JavaScript basics",
        timeLimit: 30, // minutes
        totalMarks: 50,
        passingMarks: 25,
        instructions: "Answer all questions. You cannot go back once you move to the next question.",
        settings: {
          shuffleQuestions: true,
          shuffleOptions: true,
          showResults: false,
          allowRetake: false,
          proctoring: true,
          lockdown: true,
          preventCopyPaste: true,
          showCorrectAnswers: false,
          randomQuestions: false
        },
        questions: [
          {
            id: 1,
            question: "What is the correct way to declare a variable in JavaScript?",
            type: "multiple-choice",
            options: [
              "var myVar = 5;",
              "variable myVar = 5;",
              "v myVar = 5;",
              "declare myVar = 5;"
            ],
            correctAnswer: 0,
            marks: 5
          },
          {
            id: 2,
            question: "Which of the following is NOT a JavaScript data type?",
            type: "multiple-choice",
            options: [
              "String",
              "Boolean",
              "Float",
              "Object"
            ],
            correctAnswer: 2,
            marks: 5
          },
          {
            id: 3,
            question: "What does '===' operator do in JavaScript?",
            type: "multiple-choice",
            options: [
              "Assigns a value",
              "Compares values only",
              "Compares values and types",
              "Creates a new variable"
            ],
            correctAnswer: 2,
            marks: 5
          }
        ]
      };
      
      setExam(mockExam);
      setTimeLeft(mockExam.timeLimit * 60); // Convert to seconds
    } catch (error) {
      console.error('Failed to load exam:', error);
    } finally {
      setLoading(false);
    }
  };

  const addViolation = (violation) => {
    const timestamp = new Date().toLocaleTimeString();
    const newViolation = {
      id: Date.now(),
      message: violation,
      timestamp,
      questionNumber: currentQuestion + 1
    };
    
    setViolations(prev => [...prev, newViolation]);
    setWarningCount(prev => prev + 1);

    // Auto-terminate after 3 violations
    if (warningCount >= 2) {
      setShowTermination(true);
    }
  };

  const showWarningDialog = (message) => {
    setWarningMessage(message);
    setShowWarning(true);
    
    // Auto-hide warning after 5 seconds
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(false);
    }, 5000);
  };

  const enterFullscreen = async () => {
    try {
      if (examRef.current) {
        if (examRef.current.requestFullscreen) {
          await examRef.current.requestFullscreen();
        } else if (examRef.current.mozRequestFullScreen) {
          await examRef.current.mozRequestFullScreen();
        } else if (examRef.current.webkitRequestFullscreen) {
          await examRef.current.webkitRequestFullscreen();
        } else if (examRef.current.msRequestFullscreen) {
          await examRef.current.msRequestFullscreen();
        }
      }
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
    }
  };

  const startProctoring = async () => {
    if (!exam?.settings?.proctoring) return;

    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Start recording (for proctoring)
      if (MediaRecorder.isTypeSupported('video/webm')) {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.start();
      }

      setProctoring({
        cameraAccess: true,
        screenRecording: true,
        audioMonitoring: true
      });
    } catch (error) {
      console.error('Failed to start proctoring:', error);
      showWarningDialog('Camera access is required for this proctored exam.');
    }
  };

  const startExam = async () => {
    // Enter fullscreen
    await enterFullscreen();
    
    // Start proctoring if enabled
    if (exam?.settings?.proctoring) {
      await startProctoring();
    }
    
    setExamStarted(true);
    addViolation('Exam started');
  };

  const handleAnswerChange = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleAutoSubmit = () => {
    addViolation('Exam auto-submitted due to time expiry');
    submitExam();
  };

  const submitExam = async () => {
    try {
      setExamSubmitted(true);
      
      // Calculate score
      let score = 0;
      exam.questions.forEach(question => {
        if (answers[question.id] === question.correctAnswer) {
          score += question.marks;
        }
      });

      // Stop proctoring
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }

      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }

      // Submit exam data (replace with actual API call)
      const examResult = {
        examId: exam.id,
        answers,
        score,
        totalMarks: exam.totalMarks,
        violations,
        timeSpent: (exam.timeLimit * 60) - timeLeft,
        tabSwitchCount,
        warningCount
      };

      console.log('Exam submitted:', examResult);
      
      // Navigate to results page
      navigate(`/exam-result/${exam.id}`, { 
        state: { 
          result: examResult,
          passed: score >= exam.passingMarks 
        } 
      });
    } catch (error) {
      console.error('Failed to submit exam:', error);
    }
  };

  const terminateExam = () => {
    addViolation('Exam terminated due to multiple violations');
    submitExam();
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <LinearProgress sx={{ width: '300px' }} />
        </Box>
      </Container>
    );
  }

  if (!exam) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Exam not found or access denied.</Alert>
      </Container>
    );
  }

  // Pre-exam instructions
  if (!examStarted) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            {exam.title}
          </Typography>
          
          <Typography variant="body1" paragraph>
            {exam.description}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Exam Instructions:
            </Typography>
            <Typography variant="body2" paragraph>
              {exam.instructions}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Chip label={`Time Limit: ${exam.timeLimit} minutes`} color="primary" sx={{ mr: 1 }} />
              <Chip label={`Total Questions: ${exam.questions.length}`} color="secondary" sx={{ mr: 1 }} />
              <Chip label={`Total Marks: ${exam.totalMarks}`} color="success" />
            </Box>
          </Box>

          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
              Exam Security Rules:
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>You must remain in fullscreen mode during the exam</li>
              <li>Tab switching or window minimization is prohibited</li>
              <li>Right-click and keyboard shortcuts are disabled</li>
              <li>Copy/paste operations are blocked</li>
              <li>Your screen activity will be monitored</li>
              <li>Camera access is required for proctoring</li>
              <li>Multiple violations will result in exam termination</li>
            </ul>
          </Alert>

          {exam.settings.proctoring && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="subtitle2">
                This is a proctored exam. Your camera and microphone will be accessed to ensure exam integrity.
              </Typography>
            </Alert>
          )}

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={startExam}
              startIcon={<Lock />}
              sx={{ minWidth: 200 }}
            >
              Start Secure Exam
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Exam interface
  const currentQ = exam.questions[currentQuestion];
  
  return (
    <div ref={examRef} style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        {/* Exam Header */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{exam.title}</Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Timer */}
              <Chip
                icon={<Timer />}
                label={formatTime(timeLeft)}
                color={timeLeft < 300 ? 'error' : 'primary'}
                variant="outlined"
              />
              
              {/* Violation counter */}
              <Chip
                icon={<Warning />}
                label={`Warnings: ${warningCount}`}
                color={warningCount > 0 ? 'warning' : 'default'}
                variant="outlined"
              />
              
              {/* Proctoring status */}
              {exam.settings.proctoring && (
                <Chip
                  icon={<Visibility />}
                  label="Monitored"
                  color="secondary"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
          
          {/* Progress bar */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Question {currentQuestion + 1} of {exam.questions.length}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={((currentQuestion + 1) / exam.questions.length) * 100} 
            />
          </Box>
        </Paper>

        {/* Question */}
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Question {currentQuestion + 1}
          </Typography>
          
          <Typography variant="body1" paragraph>
            {currentQ.question}
          </Typography>

          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              value={answers[currentQ.id] ?? ''}
              onChange={(e) => handleAnswerChange(currentQ.id, parseInt(e.target.value))}
            >
              {currentQ.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={index}
                  control={<Radio />}
                  label={option}
                  sx={{ mb: 1 }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>

        {/* Navigation */}
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              {currentQuestion === exam.questions.length - 1 ? (
                <Button
                  variant="contained"
                  color="success"
                  onClick={submitExam}
                  startIcon={<ExitToApp />}
                >
                  Submit Exam
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNextQuestion}
                >
                  Next Question
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Proctoring video (hidden) */}
        {exam.settings.proctoring && (
          <video
            ref={videoRef}
            autoPlay
            muted
            style={{ display: 'none' }}
          />
        )}
      </Container>

      {/* Warning Dialog */}
      <Dialog open={showWarning} onClose={() => setShowWarning(false)}>
        <DialogTitle>
          <Warning color="warning" sx={{ mr: 1, verticalAlign: 'middle' }} />
          Exam Violation Warning
        </DialogTitle>
        <DialogContent>
          <Typography>{warningMessage}</Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Multiple violations will result in automatic exam termination.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWarning(false)} variant="contained">
            I Understand
          </Button>
        </DialogActions>
      </Dialog>

      {/* Termination Dialog */}
      <Dialog open={showTermination} disableEscapeKeyDown>
        <DialogTitle>
          <Warning color="error" sx={{ mr: 1, verticalAlign: 'middle' }} />
          Exam Terminated
        </DialogTitle>
        <DialogContent>
          <Typography>
            Your exam has been terminated due to multiple security violations.
            Your responses have been recorded and will be reviewed.
          </Typography>
          <Alert severity="error" sx={{ mt: 2 }}>
            Final Score: Based on answered questions only
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={terminateExam} variant="contained" color="error">
            Exit Exam
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TakeExam;
