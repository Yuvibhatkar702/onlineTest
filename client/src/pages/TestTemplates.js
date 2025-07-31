import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  TextField,
  InputAdornment,
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
  Divider,
  Alert,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  Visibility,
  GetApp,
  Star,
  StarBorder,
  Timer,
  QuestionAnswer,
  Category,
  People,
  Business,
  School,
  Science,
  Computer,
  Restaurant,
  LocalHospital,
  Engineering,
  Gavel,
  AttachMoney,
  Psychology,
  Language,
  Sports,
  Flight
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TestTemplates = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewDialog, setPreviewDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const categories = [
    { value: 'all', label: 'All Categories', icon: <Category /> },
    { value: 'business', label: 'Business & Finance', icon: <Business /> },
    { value: 'education', label: 'Education & Training', icon: <School /> },
    { value: 'technology', label: 'Technology & IT', icon: <Computer /> },
    { value: 'healthcare', label: 'Healthcare & Medical', icon: <LocalHospital /> },
    { value: 'hospitality', label: 'Hospitality & Service', icon: <Restaurant /> },
    { value: 'engineering', label: 'Engineering', icon: <Engineering /> },
    { value: 'legal', label: 'Legal & Compliance', icon: <Gavel /> },
    { value: 'sales', label: 'Sales & Marketing', icon: <AttachMoney /> },
    { value: 'hr', label: 'Human Resources', icon: <People /> },
    { value: 'science', label: 'Science & Research', icon: <Science /> }
  ];

  const templates = [
    {
      id: 1,
      title: "Example Quiz for Restaurant Staff",
      description: "Comprehensive quiz covering food safety, customer service, and restaurant operations for new staff onboarding.",
      category: 'hospitality',
      questions: 25,
      duration: 30,
      difficulty: 'intermediate',
      tags: ['food-safety', 'customer-service', 'onboarding'],
      rating: 4.8,
      downloads: 1250,
      isPopular: true,
      preview: [
        "What is the safe minimum internal temperature for cooking poultry?",
        "How should you handle a customer complaint about food quality?",
        "What are the proper steps for washing hands in a commercial kitchen?"
      ]
    },
    {
      id: 2,
      title: "Example: Customer Care Periodic Test",
      description: "Regular assessment for customer service representatives covering communication skills, problem-solving, and company policies.",
      category: 'business',
      questions: 20,
      duration: 25,
      difficulty: 'intermediate',
      tags: ['customer-service', 'communication', 'periodic-assessment'],
      rating: 4.6,
      downloads: 890,
      isPopular: true,
      preview: [
        "What is the appropriate response time for email inquiries?",
        "How do you de-escalate an angry customer situation?",
        "Which company policy applies to refund requests?"
      ]
    },
    {
      id: 3,
      title: "Example Product Knowledge Test for Sales",
      description: "Comprehensive product knowledge assessment for sales team members to ensure they can effectively communicate product benefits.",
      category: 'sales',
      questions: 30,
      duration: 45,
      difficulty: 'advanced',
      tags: ['product-knowledge', 'sales-training', 'b2b'],
      rating: 4.9,
      downloads: 2100,
      isPopular: true,
      preview: [
        "What are the key differentiators of our premium product line?",
        "How do you calculate ROI for enterprise clients?",
        "Which integration options are available for technical buyers?"
      ]
    },
    {
      id: 4,
      title: "Example Reasoning Test",
      description: "Logical reasoning and problem-solving assessment suitable for various professional roles and cognitive ability evaluation.",
      category: 'hr',
      questions: 15,
      duration: 20,
      difficulty: 'intermediate',
      tags: ['reasoning', 'problem-solving', 'cognitive-assessment'],
      rating: 4.7,
      downloads: 1680,
      isPopular: false,
      preview: [
        "If A > B and B > C, what can we conclude about A and C?",
        "Complete the pattern: 2, 6, 18, 54, ?",
        "Which statement logically follows from the given premises?"
      ]
    },
    {
      id: 5,
      title: "IT Security Awareness Test",
      description: "Essential cybersecurity knowledge assessment for all employees covering phishing, password security, and data protection.",
      category: 'technology',
      questions: 18,
      duration: 25,
      difficulty: 'beginner',
      tags: ['cybersecurity', 'awareness', 'compliance'],
      rating: 4.5,
      downloads: 3200,
      isPopular: true,
      preview: [
        "How can you identify a phishing email?",
        "What makes a strong password?",
        "When should you report a security incident?"
      ]
    },
    {
      id: 6,
      title: "Medical Terminology Quiz",
      description: "Fundamental medical terminology test for healthcare professionals and students covering anatomy, procedures, and abbreviations.",
      category: 'healthcare',
      questions: 40,
      duration: 35,
      difficulty: 'intermediate',
      tags: ['medical-terminology', 'healthcare', 'certification'],
      rating: 4.8,
      downloads: 950,
      isPopular: false,
      preview: [
        "What does the prefix 'cardio-' refer to?",
        "Define 'tachycardia' in medical terms",
        "What is the abbreviation for 'twice daily' in prescriptions?"
      ]
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const popularTemplates = templates.filter(t => t.isPopular);
  const recentTemplates = [...templates].sort((a, b) => b.id - a.id).slice(0, 6);

  const handlePreview = (template) => {
    setSelectedTemplate(template);
    setPreviewDialog(true);
  };

  const handleUseTemplate = (template) => {
    navigate('/assessments/create', { state: { template } });
  };

  const toggleFavorite = (templateId) => {
    setFavorites(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category) => {
    const categoryData = categories.find(cat => cat.value === category);
    return categoryData ? categoryData.icon : <Category />;
  };

  const TemplateCard = ({ template }) => (
    <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h3" sx={{ flexGrow: 1, pr: 1 }}>
            {template.title}
          </Typography>
          <IconButton
            size="small"
            onClick={() => toggleFavorite(template.id)}
            color={favorites.includes(template.id) ? 'warning' : 'default'}
          >
            {favorites.includes(template.id) ? <Star /> : <StarBorder />}
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {template.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={getCategoryIcon(template.category)}
            label={categories.find(cat => cat.value === template.category)?.label}
            size="small"
            variant="outlined"
          />
          <Chip
            label={template.difficulty}
            color={getDifficultyColor(template.difficulty)}
            size="small"
          />
          {template.isPopular && (
            <Chip label="Popular" color="primary" size="small" />
          )}
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <QuestionAnswer color="action" />
              <Typography variant="caption" display="block">
                {template.questions} Questions
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Timer color="action" />
              <Typography variant="caption" display="block">
                {template.duration} min
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <GetApp color="action" />
              <Typography variant="caption" display="block">
                {template.downloads}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {template.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Box>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          startIcon={<Visibility />}
          onClick={() => handlePreview(template)}
        >
          Preview
        </Button>
        <Button
          size="small"
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleUseTemplate(template)}
        >
          Use Template
        </Button>
      </CardActions>
    </Card>
  );

  const TabPanel = ({ children, value, index }) => (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Test Templates
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Choose from professionally designed test templates to quickly create assessments
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {category.icon}
                      <Typography sx={{ ml: 1 }}>{category.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
            >
              More Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Template Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label={`All Templates (${filteredTemplates.length})`} />
            <Tab label={`Popular (${popularTemplates.length})`} />
            <Tab label="Recent" />
            <Tab label="My Favorites" />
          </Tabs>
        </Box>

        {/* All Templates */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            {filteredTemplates.map((template) => (
              <Grid item xs={12} md={6} lg={4} key={template.id}>
                <TemplateCard template={template} />
              </Grid>
            ))}
          </Grid>
          
          {filteredTemplates.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No templates found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search criteria or browse different categories
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* Popular Templates */}
        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            {popularTemplates.map((template) => (
              <Grid item xs={12} md={6} lg={4} key={template.id}>
                <TemplateCard template={template} />
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Recent Templates */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            {recentTemplates.map((template) => (
              <Grid item xs={12} md={6} lg={4} key={template.id}>
                <TemplateCard template={template} />
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Favorites */}
        <TabPanel value={activeTab} index={3}>
          {favorites.length > 0 ? (
            <Grid container spacing={3}>
              {templates.filter(t => favorites.includes(t.id)).map((template) => (
                <Grid item xs={12} md={6} lg={4} key={template.id}>
                  <TemplateCard template={template} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Star sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No favorite templates yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click the star icon on any template to add it to your favorites
              </Typography>
            </Box>
          )}
        </TabPanel>
      </Paper>

      {/* Preview Dialog */}
      <Dialog 
        open={previewDialog} 
        onClose={() => setPreviewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Template Preview: {selectedTemplate?.title}
        </DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Box>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {selectedTemplate.description}
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <QuestionAnswer color="primary" sx={{ fontSize: 40 }} />
                    <Typography variant="h6">{selectedTemplate.questions}</Typography>
                    <Typography variant="caption">Questions</Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Timer color="primary" sx={{ fontSize: 40 }} />
                    <Typography variant="h6">{selectedTemplate.duration}</Typography>
                    <Typography variant="caption">Minutes</Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Star color="primary" sx={{ fontSize: 40 }} />
                    <Typography variant="h6">{selectedTemplate.rating}</Typography>
                    <Typography variant="caption">Rating</Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <GetApp color="primary" sx={{ fontSize: 40 }} />
                    <Typography variant="h6">{selectedTemplate.downloads}</Typography>
                    <Typography variant="caption">Downloads</Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Sample Questions:
              </Typography>
              <List>
                {selectedTemplate.preview.map((question, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 24, height: 24, fontSize: '0.875rem' }}>
                        {index + 1}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary={question} />
                  </ListItem>
                ))}
              </List>

              <Alert severity="info" sx={{ mt: 2 }}>
                This is a preview of the template. The full version contains {selectedTemplate.questions} questions 
                covering all aspects mentioned in the description.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog(false)}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handleUseTemplate(selectedTemplate);
              setPreviewDialog(false);
            }}
          >
            Use This Template
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TestTemplates;
