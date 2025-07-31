import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab
} from '@mui/material';
import {
  AutoAwesome,
  ExpandMore,
  Add,
  Edit,
  Delete,
  Save,
  Clear,
  Psychology,
  QuestionAnswer,
  Category,
  Timer,
  School,
  Science,
  Computer,
  Business,
  Language,
  Calculate
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const GenerateQuestions = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  
  // Form states
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [questionTypes, setQuestionTypes] = useState({
    multipleChoice: true,
    trueFalse: false,
    shortAnswer: false,
    essay: false
  });
  const [customPrompt, setCustomPrompt] = useState('');
  const [includeExplanations, setIncludeExplanations] = useState(true);

  const categories = [
    { value: 'programming', label: 'Programming', icon: <Computer /> },
    { value: 'mathematics', label: 'Mathematics', icon: <Calculate /> },
    { value: 'science', label: 'Science', icon: <Science /> },
    { value: 'business', label: 'Business', icon: <Business /> },
    { value: 'language', label: 'Language Arts', icon: <Language /> },
    { value: 'general', label: 'General Knowledge', icon: <School /> }
  ];

  const difficultyLevels = [
    { value: 'beginner', label: 'Beginner', color: 'success' },
    { value: 'intermediate', label: 'Intermediate', color: 'warning' },
    { value: 'advanced', label: 'Advanced', color: 'error' }
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate AI question generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockQuestions = Array.from({ length: questionCount }, (_, index) => ({
        id: index + 1,
        question: `Sample question ${index + 1} about ${topic}?`,
        type: 'multiple-choice',
        options: [
          'Option A - Correct answer',
          'Option B - Incorrect',
          'Option C - Incorrect', 
          'Option D - Incorrect'
        ],
        correctAnswer: 0,
        explanation: `This is the explanation for question ${index + 1} about ${topic}.`,
        difficulty: difficulty,
        category: category,
        points: difficulty === 'beginner' ? 1 : difficulty === 'intermediate' ? 2 : 3
      }));
      
      setGeneratedQuestions(mockQuestions);
      setActiveTab(1); // Switch to results tab
    } catch (error) {
      console.error('Failed to generate questions:', error);
      alert('Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuestions = async () => {
    try {
      // Save questions to database
      console.log('Saving questions:', generatedQuestions);
      alert('Questions saved successfully!');
      navigate('/questions');
    } catch (error) {
      console.error('Failed to save questions:', error);
      alert('Failed to save questions. Please try again.');
    }
  };

  const handleEditQuestion = (questionId) => {
    // Edit question logic
    console.log('Edit question:', questionId);
  };

  const handleDeleteQuestion = (questionId) => {
    setGeneratedQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const TabPanel = ({ children, value, index }) => (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          <AutoAwesome sx={{ mr: 2, verticalAlign: 'middle' }} />
          AI Question Generator
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Generate intelligent questions using AI based on your topic and requirements
        </Typography>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Generate Questions" />
            <Tab label={`Generated Questions (${generatedQuestions.length})`} />
          </Tabs>
        </Box>

        {/* Generate Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Question Parameters
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Topic/Subject"
                        placeholder="e.g., JavaScript ES6 Features, Calculus Derivatives, World War II"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          label="Category"
                        >
                          {categories.map((cat) => (
                            <MenuItem key={cat.value} value={cat.value}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {cat.icon}
                                <Typography sx={{ ml: 1 }}>{cat.label}</Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Difficulty Level</InputLabel>
                        <Select
                          value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value)}
                          label="Difficulty Level"
                        >
                          {difficultyLevels.map((level) => (
                            <MenuItem key={level.value} value={level.value}>
                              <Chip label={level.label} color={level.color} size="small" />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography gutterBottom>
                        Number of Questions: {questionCount}
                      </Typography>
                      <Slider
                        value={questionCount}
                        onChange={(e, newValue) => setQuestionCount(newValue)}
                        min={1}
                        max={20}
                        marks
                        valueLabelDisplay="auto"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Question Types
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6} md={3}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={questionTypes.multipleChoice}
                                onChange={(e) => setQuestionTypes(prev => ({
                                  ...prev,
                                  multipleChoice: e.target.checked
                                }))}
                              />
                            }
                            label="Multiple Choice"
                          />
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={questionTypes.trueFalse}
                                onChange={(e) => setQuestionTypes(prev => ({
                                  ...prev,
                                  trueFalse: e.target.checked
                                }))}
                              />
                            }
                            label="True/False"
                          />
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={questionTypes.shortAnswer}
                                onChange={(e) => setQuestionTypes(prev => ({
                                  ...prev,
                                  shortAnswer: e.target.checked
                                }))}
                              />
                            }
                            label="Short Answer"
                          />
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={questionTypes.essay}
                                onChange={(e) => setQuestionTypes(prev => ({
                                  ...prev,
                                  essay: e.target.checked
                                }))}
                              />
                            }
                            label="Essay"
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Custom Instructions (Optional)"
                        placeholder="Add any specific requirements or context for question generation..."
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={includeExplanations}
                            onChange={(e) => setIncludeExplanations(e.target.checked)}
                          />
                        }
                        label="Include explanations for correct answers"
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<AutoAwesome />}
                      onClick={handleGenerate}
                      disabled={loading || !topic.trim()}
                    >
                      {loading ? 'Generating...' : 'Generate Questions'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Clear />}
                      onClick={() => {
                        setTopic('');
                        setCategory('');
                        setCustomPrompt('');
                        setGeneratedQuestions([]);
                      }}
                    >
                      Clear
                    </Button>
                  </Box>

                  {loading && (
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress />
                      <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                        AI is generating your questions...
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <Psychology sx={{ mr: 1, verticalAlign: 'middle' }} />
                    AI Features
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <QuestionAnswer color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Smart Question Generation"
                        secondary="AI creates relevant questions based on your topic"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Category color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Automatic Categorization"
                        secondary="Questions are automatically tagged and categorized"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Timer color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Difficulty Adjustment"
                        secondary="Questions adapt to your selected difficulty level"
                      />
                    </ListItem>
                  </List>

                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Pro Tip:</strong> Be specific with your topic for better question quality. 
                      Example: "React Hooks useEffect" instead of just "React".
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Generated Questions Tab */}
        <TabPanel value={activeTab} index={1}>
          {generatedQuestions.length > 0 ? (
            <Box>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Generated Questions ({generatedQuestions.length})
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveQuestions}
                >
                  Save All Questions
                </Button>
              </Box>

              {generatedQuestions.map((question, index) => (
                <Accordion key={question.id} sx={{ mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Typography sx={{ flexGrow: 1 }}>
                        Question {index + 1}: {question.question}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
                        <Chip
                          label={question.difficulty}
                          color={
                            question.difficulty === 'beginner' ? 'success' :
                            question.difficulty === 'intermediate' ? 'warning' : 'error'
                          }
                          size="small"
                        />
                        <Chip label={`${question.points} pts`} size="small" />
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        <Typography variant="subtitle2" gutterBottom>
                          Question:
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {question.question}
                        </Typography>

                        <Typography variant="subtitle2" gutterBottom>
                          Options:
                        </Typography>
                        <List dense>
                          {question.options.map((option, optIndex) => (
                            <ListItem key={optIndex}>
                              <ListItemText
                                primary={`${String.fromCharCode(65 + optIndex)}. ${option}`}
                                sx={{
                                  color: optIndex === question.correctAnswer ? 'success.main' : 'inherit'
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>

                        {question.explanation && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Explanation:
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {question.explanation}
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Button
                            startIcon={<Edit />}
                            onClick={() => handleEditQuestion(question.id)}
                            size="small"
                          >
                            Edit
                          </Button>
                          <Button
                            startIcon={<Delete />}
                            color="error"
                            onClick={() => handleDeleteQuestion(question.id)}
                            size="small"
                          >
                            Delete
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <AutoAwesome sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No questions generated yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Use the "Generate Questions" tab to create AI-powered questions
              </Typography>
              <Button
                variant="contained"
                onClick={() => setActiveTab(0)}
              >
                Start Generating
              </Button>
            </Box>
          )}
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default GenerateQuestions;
