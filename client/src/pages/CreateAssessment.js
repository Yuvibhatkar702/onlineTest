import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ArrowBack,
  Add,
  Delete,
  Preview,
  Save,
  Publish,
  AutoAwesome
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createAssessment } from '../store/slices/assessmentsSlice';

const CreateAssessment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const steps = ['Basic Info', 'Questions', 'Settings', 'Review'];

  const [assessmentData, setAssessmentData] = useState({
    title: '',
    description: '',
    category: '',
    tags: [],
    timeLimit: 60,
    totalMarks: 100,
    passingMarks: 40,
    instructions: '',
    questions: [],
    settings: {
      shuffleQuestions: false,
      shuffleOptions: false,
      showResults: true,
      allowRetake: false,
      proctoring: false,
      lockdown: false,
      preventCopyPaste: true,
      showCorrectAnswers: true,
      randomQuestions: false
    },
    schedule: {
      startDate: '',
      endDate: '',
      timezone: 'UTC'
    }
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'multiple-choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    marks: 1,
    explanation: ''
  });

  const [newTag, setNewTag] = useState('');

  const handleBasicInfoChange = (field, value) => {
    setAssessmentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSettingsChange = (field, value) => {
    setAssessmentData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value
      }
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !assessmentData.tags.includes(newTag.trim())) {
      setAssessmentData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setAssessmentData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleQuestionChange = (field, value) => {
    setCurrentQuestion(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const addQuestion = () => {
    if (currentQuestion.question.trim()) {
      setAssessmentData(prev => ({
        ...prev,
        questions: [...prev.questions, { ...currentQuestion, id: Date.now() }]
      }));
      setCurrentQuestion({
        type: 'multiple-choice',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        marks: 1,
        explanation: ''
      });
    }
  };

  const removeQuestion = (questionId) => {
    setAssessmentData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const generateWithAI = async (prompt) => {
    // Mock AI generation - in real app, this would call OpenAI API
    const mockQuestions = [
      {
        id: Date.now(),
        type: 'multiple-choice',
        question: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 2,
        marks: 1,
        explanation: 'Paris is the capital and largest city of France.'
      },
      {
        id: Date.now() + 1,
        type: 'multiple-choice',
        question: 'Which programming language is known for its use in data science?',
        options: ['JavaScript', 'Python', 'C++', 'Java'],
        correctAnswer: 1,
        marks: 1,
        explanation: 'Python is widely used in data science due to its extensive libraries.'
      }
    ];

    setAssessmentData(prev => ({
      ...prev,
      questions: [...prev.questions, ...mockQuestions]
    }));
    setAiDialogOpen(false);
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSave = async (publish = false) => {
    if (saving) return; // Prevent double-clicking
    
    try {
      setSaving(true);
      
      // Basic validation
      if (!assessmentData.title.trim()) {
        alert('Please enter an assessment title');
        return;
      }
      
      if (assessmentData.questions.length === 0) {
        alert('Please add at least one question');
        return;
      }

      const payload = {
        ...assessmentData,
        status: publish ? 'published' : 'draft'
      };
      
      console.log('Saving assessment:', { publish, payload });
      
      const result = await dispatch(createAssessment(payload)).unwrap();
      console.log('Assessment saved successfully:', result);
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save assessment:', error);
      alert(`Failed to ${publish ? 'publish' : 'save'} assessment: ${error.message || error}`);
    } finally {
      setSaving(false);
    }
  };

  const renderBasicInfo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Assessment Title"
          value={assessmentData.title}
          onChange={(e) => handleBasicInfoChange('title', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Description"
          value={assessmentData.description}
          onChange={(e) => handleBasicInfoChange('description', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={assessmentData.category}
            label="Category"
            onChange={(e) => handleBasicInfoChange('category', e.target.value)}
          >
            <MenuItem value="quiz">Quiz</MenuItem>
            <MenuItem value="exam">Exam</MenuItem>
            <MenuItem value="assignment">Assignment</MenuItem>
            <MenuItem value="survey">Survey</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="number"
          label="Time Limit (minutes)"
          value={assessmentData.timeLimit}
          onChange={(e) => handleBasicInfoChange('timeLimit', parseInt(e.target.value))}
        />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {assessmentData.tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={() => handleRemoveTag(tag)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            label="Add Tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
          />
          <Button onClick={handleAddTag} variant="outlined">
            Add
          </Button>
        </Box>
      </Grid>
    </Grid>
  );

  const renderQuestions = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Questions ({assessmentData.questions.length})</Typography>
        <Button
          startIcon={<AutoAwesome />}
          onClick={() => setAiDialogOpen(true)}
          variant="outlined"
          color="secondary"
        >
          Generate with AI
        </Button>
      </Box>

      {/* Existing Questions */}
      {assessmentData.questions.map((question, index) => (
        <Card key={question.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Q{index + 1}: {question.question}
                </Typography>
                <Box sx={{ ml: 2 }}>
                  {question.options.map((option, optIndex) => (
                    <Typography
                      key={optIndex}
                      color={optIndex === question.correctAnswer ? 'success.main' : 'text.secondary'}
                      sx={{ fontWeight: optIndex === question.correctAnswer ? 'bold' : 'normal' }}
                    >
                      {String.fromCharCode(65 + optIndex)}. {option}
                    </Typography>
                  ))}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Marks: {question.marks} | Type: {question.type}
                </Typography>
              </Box>
              <IconButton onClick={() => removeQuestion(question.id)} color="error">
                <Delete />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}

      {/* Add New Question */}
      <Card sx={{ border: '2px dashed #ccc' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Add New Question</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Question"
                value={currentQuestion.question}
                onChange={(e) => handleQuestionChange('question', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Question Type</InputLabel>
                <Select
                  value={currentQuestion.type}
                  label="Question Type"
                  onChange={(e) => handleQuestionChange('type', e.target.value)}
                >
                  <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                  <MenuItem value="true-false">True/False</MenuItem>
                  <MenuItem value="short-answer">Short Answer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Marks"
                value={currentQuestion.marks}
                onChange={(e) => handleQuestionChange('marks', parseInt(e.target.value))}
              />
            </Grid>
            
            {currentQuestion.type === 'multiple-choice' && (
              <>
                {currentQuestion.options.map((option, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <TextField
                      fullWidth
                      label={`Option ${String.fromCharCode(65 + index)}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      color={index === currentQuestion.correctAnswer ? 'success' : 'primary'}
                    />
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Correct Answer</InputLabel>
                    <Select
                      value={currentQuestion.correctAnswer}
                      label="Correct Answer"
                      onChange={(e) => handleQuestionChange('correctAnswer', e.target.value)}
                    >
                      {currentQuestion.options.map((_, index) => (
                        <MenuItem key={index} value={index}>
                          Option {String.fromCharCode(65 + index)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Explanation (Optional)"
                value={currentQuestion.explanation}
                onChange={(e) => handleQuestionChange('explanation', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={addQuestion}
                disabled={!currentQuestion.question.trim()}
                startIcon={<Add />}
              >
                Add Question
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );

  const renderSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Assessment Settings</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControlLabel
          control={
            <Switch
              checked={assessmentData.settings.shuffleQuestions}
              onChange={(e) => handleSettingsChange('shuffleQuestions', e.target.checked)}
            />
          }
          label="Shuffle Questions"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControlLabel
          control={
            <Switch
              checked={assessmentData.settings.shuffleOptions}
              onChange={(e) => handleSettingsChange('shuffleOptions', e.target.checked)}
            />
          }
          label="Shuffle Options"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControlLabel
          control={
            <Switch
              checked={assessmentData.settings.showResults}
              onChange={(e) => handleSettingsChange('showResults', e.target.checked)}
            />
          }
          label="Show Results After Submission"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControlLabel
          control={
            <Switch
              checked={assessmentData.settings.allowRetake}
              onChange={(e) => handleSettingsChange('allowRetake', e.target.checked)}
            />
          }
          label="Allow Retake"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControlLabel
          control={
            <Switch
              checked={assessmentData.settings.preventCopyPaste}
              onChange={(e) => handleSettingsChange('preventCopyPaste', e.target.checked)}
            />
          }
          label="Prevent Copy/Paste"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControlLabel
          control={
            <Switch
              checked={assessmentData.settings.proctoring}
              onChange={(e) => handleSettingsChange('proctoring', e.target.checked)}
            />
          }
          label="Enable Proctoring"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Instructions for Students"
          value={assessmentData.instructions}
          onChange={(e) => handleBasicInfoChange('instructions', e.target.value)}
        />
      </Grid>
    </Grid>
  );

  const renderReview = () => (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        Review your assessment before publishing. You can save as draft and edit later.
      </Alert>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Basic Information</Typography>
              <Typography><strong>Title:</strong> {assessmentData.title}</Typography>
              <Typography><strong>Category:</strong> {assessmentData.category}</Typography>
              <Typography><strong>Time Limit:</strong> {assessmentData.timeLimit} minutes</Typography>
              <Typography><strong>Questions:</strong> {assessmentData.questions.length}</Typography>
              <Typography><strong>Total Marks:</strong> {assessmentData.questions.reduce((sum, q) => sum + q.marks, 0)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Settings Summary</Typography>
              <Typography>Shuffle Questions: {assessmentData.settings.shuffleQuestions ? 'Yes' : 'No'}</Typography>
              <Typography>Show Results: {assessmentData.settings.showResults ? 'Yes' : 'No'}</Typography>
              <Typography>Allow Retake: {assessmentData.settings.allowRetake ? 'Yes' : 'No'}</Typography>
              <Typography>Proctoring: {assessmentData.settings.proctoring ? 'Enabled' : 'Disabled'}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0: return renderBasicInfo();
      case 1: return renderQuestions();
      case 2: return renderSettings();
      case 3: return renderReview();
      default: return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" gutterBottom>
          Create New Assessment
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 400, mb: 4 }}>
          {getStepContent(activeStep)}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => handleSave(false)}
              startIcon={<Save />}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save as Draft'}
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={() => handleSave(true)}
                startIcon={<Publish />}
                disabled={saving}
              >
                {saving ? 'Publishing...' : 'Publish Assessment'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={saving}
              >
                Next
              </Button>
            )}
            
            <Button
              variant="outlined"
              onClick={() => setPreviewOpen(true)}
              startIcon={<Preview />}
            >
              Preview
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* AI Generation Dialog */}
      <Dialog open={aiDialogOpen} onClose={() => setAiDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate Questions with AI</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Describe the topic or type of questions you want"
            placeholder="e.g., 'Create 5 multiple choice questions about JavaScript fundamentals'"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAiDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => generateWithAI('')} variant="contained">
            Generate Questions
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Assessment Preview</DialogTitle>
        <DialogContent>
          <Typography variant="h5" gutterBottom>{assessmentData.title}</Typography>
          <Typography color="text.secondary" paragraph>{assessmentData.description}</Typography>
          <Typography variant="h6" gutterBottom>Questions:</Typography>
          {assessmentData.questions.map((question, index) => (
            <Box key={question.id} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                {index + 1}. {question.question}
              </Typography>
              {question.options.map((option, optIndex) => (
                <Typography key={optIndex} sx={{ ml: 2, color: 'text.secondary' }}>
                  {String.fromCharCode(65 + optIndex)}. {option}
                </Typography>
              ))}
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateAssessment;
