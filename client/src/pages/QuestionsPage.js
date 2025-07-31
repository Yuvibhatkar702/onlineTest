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
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  FormGroup,
  Divider,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge
} from '@mui/material';
import {
  ArrowBack,
  Search,
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  FilterList,
  HelpOutline,
  QuizOutlined,
  Category,
  School,
  ExpandMore,
  Clear,
  Check,
  Close
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const QuestionsPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [addQuestionDialog, setAddQuestionDialog] = useState(false);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const [newQuestion, setNewQuestion] = useState({
    type: 'multiple-choice',
    category: '',
    difficulty: 'medium',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    tags: []
  });

  const categories = [
    'Programming',
    'JavaScript',
    'React',
    'Node.js',
    'Database',
    'HTML/CSS',
    'Python',
    'Data Structures',
    'Algorithms',
    'System Design'
  ];

  useEffect(() => {
    // Mock questions data - replace with API call
    const mockQuestions = [
      {
        id: 1,
        type: 'multiple-choice',
        category: 'JavaScript',
        difficulty: 'medium',
        question: 'What is the correct way to declare a variable in JavaScript?',
        options: ['var x = 5;', 'variable x = 5;', 'v x = 5;', 'declare x = 5;'],
        correctAnswer: 0,
        explanation: 'The var keyword is used to declare variables in JavaScript.',
        tags: ['variables', 'syntax'],
        createdAt: '2024-01-15',
        usageCount: 45
      },
      {
        id: 2,
        type: 'true-false',
        category: 'React',
        difficulty: 'easy',
        question: 'React components must always return a single element.',
        correctAnswer: false,
        explanation: 'React components can return fragments or arrays of elements.',
        tags: ['components', 'jsx'],
        createdAt: '2024-01-16',
        usageCount: 32
      },
      {
        id: 3,
        type: 'multiple-choice',
        category: 'Database',
        difficulty: 'hard',
        question: 'Which SQL clause is used to filter records?',
        options: ['SELECT', 'WHERE', 'ORDER BY', 'GROUP BY'],
        correctAnswer: 1,
        explanation: 'The WHERE clause is used to filter records in SQL queries.',
        tags: ['sql', 'queries'],
        createdAt: '2024-01-17',
        usageCount: 28
      },
      {
        id: 4,
        type: 'multiple-answer',
        category: 'Programming',
        difficulty: 'medium',
        question: 'Which of the following are programming paradigms?',
        options: ['Object-Oriented', 'Functional', 'Procedural', 'Declarative'],
        correctAnswers: [0, 1, 2, 3],
        explanation: 'All listed options are valid programming paradigms.',
        tags: ['paradigms', 'concepts'],
        createdAt: '2024-01-18',
        usageCount: 19
      }
    ];
    
    setQuestions(mockQuestions);
    setFilteredQuestions(mockQuestions);
  }, []);

  useEffect(() => {
    let filtered = questions.filter(question => {
      const matchesSearch = question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
      const matchesType = selectedType === 'all' || question.type === selectedType;
      
      return matchesSearch && matchesCategory && matchesDifficulty && matchesType;
    });
    
    setFilteredQuestions(filtered);
  }, [questions, searchQuery, selectedCategory, selectedDifficulty, selectedType]);

  const handleMenuClick = (event, question) => {
    setAnchorEl(event.currentTarget);
    setSelectedQuestion(question);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedQuestion(null);
  };

  const handleAddQuestion = () => {
    const question = {
      id: Math.max(...questions.map(q => q.id)) + 1,
      ...newQuestion,
      createdAt: new Date().toISOString().split('T')[0],
      usageCount: 0
    };
    
    setQuestions([...questions, question]);
    resetNewQuestion();
    setAddQuestionDialog(false);
  };

  const resetNewQuestion = () => {
    setNewQuestion({
      type: 'multiple-choice',
      category: '',
      difficulty: 'medium',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      tags: []
    });
  };

  const handleDeleteQuestion = () => {
    setQuestions(questions.filter(q => q.id !== selectedQuestion.id));
    setDeleteDialog(false);
    handleMenuClose();
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'multiple-choice': return 'primary';
      case 'true-false': return 'info';
      case 'multiple-answer': return 'secondary';
      case 'short-answer': return 'success';
      default: return 'default';
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Question Bank
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setAddQuestionDialog(true)}
          >
            Add Question
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={selectedDifficulty}
                label="Difficulty"
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={selectedType}
                label="Type"
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                <MenuItem value="true-false">True/False</MenuItem>
                <MenuItem value="multiple-answer">Multiple Answer</MenuItem>
                <MenuItem value="short-answer">Short Answer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Typography variant="body2" color="text.secondary">
              {filteredQuestions.length} question(s) found
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Questions List */}
      <Grid container spacing={3}>
        {filteredQuestions.map((question) => (
          <Grid item xs={12} key={question.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Chip
                        label={question.type.replace('-', ' ')}
                        color={getTypeColor(question.type)}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={question.difficulty}
                        color={getDifficultyColor(question.difficulty)}
                        size="small"
                      />
                      <Chip
                        label={question.category}
                        size="small"
                        variant="outlined"
                      />
                      <Badge badgeContent={question.usageCount} color="primary">
                        <QuizOutlined sx={{ ml: 2 }} />
                      </Badge>
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {question.question}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      {question.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={`#${tag}`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Created: {question.createdAt}
                    </Typography>
                  </Box>
                  <IconButton onClick={(e) => handleMenuClick(e, question)}>
                    <MoreVert />
                  </IconButton>
                </Box>
                
                {/* Question Preview */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="body2">Preview Question</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {question.type === 'multiple-choice' && (
                      <List dense>
                        {question.options.map((option, index) => (
                          <ListItem key={index}>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  {index === question.correctAnswer ? (
                                    <Check color="success" sx={{ mr: 1 }} />
                                  ) : (
                                    <Close color="error" sx={{ mr: 1 }} />
                                  )}
                                  {option}
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                    
                    {question.type === 'true-false' && (
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Correct Answer: {question.correctAnswer ? 'True' : 'False'}
                        </Typography>
                      </Box>
                    )}
                    
                    {question.type === 'multiple-answer' && (
                      <List dense>
                        {question.options.map((option, index) => (
                          <ListItem key={index}>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  {question.correctAnswers.includes(index) ? (
                                    <Check color="success" sx={{ mr: 1 }} />
                                  ) : (
                                    <Close color="error" sx={{ mr: 1 }} />
                                  )}
                                  {option}
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                    
                    {question.explanation && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          <HelpOutline sx={{ fontSize: '1rem', mr: 1 }} />
                          Explanation: {question.explanation}
                        </Typography>
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
                
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => setPreviewDialog(true)}>
          <Visibility sx={{ mr: 1 }} /> Preview
        </MenuItem>
        <MenuItem onClick={() => console.log('Edit question')}>
          <Edit sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => setDeleteDialog(true)} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Add Question Dialog */}
      <Dialog open={addQuestionDialog} onClose={() => setAddQuestionDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Question</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Question Type</InputLabel>
                <Select
                  value={newQuestion.type}
                  label="Question Type"
                  onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                >
                  <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                  <MenuItem value="true-false">True/False</MenuItem>
                  <MenuItem value="multiple-answer">Multiple Answer</MenuItem>
                  <MenuItem value="short-answer">Short Answer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newQuestion.category}
                  label="Category"
                  onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={newQuestion.difficulty}
                  label="Difficulty"
                  onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                >
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Question"
                multiline
                rows={3}
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
              />
            </Grid>
            
            {newQuestion.type === 'multiple-choice' && (
              <>
                {newQuestion.options.map((option, index) => (
                  <Grid item xs={12} key={index}>
                    <TextField
                      fullWidth
                      label={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                    />
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <FormControl>
                    <Typography variant="body2" sx={{ mb: 1 }}>Correct Answer:</Typography>
                    <RadioGroup
                      value={newQuestion.correctAnswer}
                      onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: parseInt(e.target.value) })}
                    >
                      {newQuestion.options.map((option, index) => (
                        <FormControlLabel
                          key={index}
                          value={index}
                          control={<Radio />}
                          label={`Option ${index + 1}`}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </>
            )}
            
            {newQuestion.type === 'true-false' && (
              <Grid item xs={12}>
                <FormControl>
                  <Typography variant="body2" sx={{ mb: 1 }}>Correct Answer:</Typography>
                  <RadioGroup
                    value={newQuestion.correctAnswer}
                    onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value === 'true' })}
                  >
                    <FormControlLabel value={true} control={<Radio />} label="True" />
                    <FormControlLabel value={false} control={<Radio />} label="False" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Explanation (Optional)"
                multiline
                rows={2}
                value={newQuestion.explanation}
                onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setAddQuestionDialog(false);
            resetNewQuestion();
          }}>
            Cancel
          </Button>
          <Button onClick={handleAddQuestion} variant="contained">
            Add Question
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Question</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this question? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteQuestion} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QuestionsPage;
