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
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Folder,
  Category,
  ColorLens,
  Save,
  Cancel,
  Visibility,
  School,
  Computer,
  Science,
  Business,
  LocalHospital,
  Restaurant,
  Engineering,
  Language,
  Sports,
  Flight,
  Gavel,
  AttachMoney,
  Psychology,
  People
} from '@mui/icons-material';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#2196F3',
    icon: 'Category',
    parentId: null
  });

  const availableIcons = [
    { name: 'Category', icon: <Category />, label: 'General' },
    { name: 'School', icon: <School />, label: 'Education' },
    { name: 'Computer', icon: <Computer />, label: 'Technology' },
    { name: 'Science', icon: <Science />, label: 'Science' },
    { name: 'Business', icon: <Business />, label: 'Business' },
    { name: 'LocalHospital', icon: <LocalHospital />, label: 'Healthcare' },
    { name: 'Restaurant', icon: <Restaurant />, label: 'Hospitality' },
    { name: 'Engineering', icon: <Engineering />, label: 'Engineering' },
    { name: 'Language', icon: <Language />, label: 'Languages' },
    { name: 'Sports', icon: <Sports />, label: 'Sports' },
    { name: 'Flight', icon: <Flight />, label: 'Aviation' },
    { name: 'Gavel', icon: <Gavel />, label: 'Legal' },
    { name: 'AttachMoney', icon: <AttachMoney />, label: 'Finance' },
    { name: 'Psychology', icon: <Psychology />, label: 'Psychology' },
    { name: 'People', icon: <People />, label: 'HR' }
  ];

  const colors = [
    '#2196F3', '#4CAF50', '#FF9800', '#F44336', '#9C27B0',
    '#607D8B', '#795548', '#E91E63', '#00BCD4', '#CDDC39',
    '#FF5722', '#3F51B5', '#009688', '#FFC107', '#673AB7'
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    // Mock data - replace with actual API call
    const mockCategories = [
      {
        id: 1,
        name: 'Programming',
        description: 'Software development and coding assessments',
        color: '#2196F3',
        icon: 'Computer',
        parentId: null,
        questionCount: 150,
        assessmentCount: 25,
        isActive: true,
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        name: 'JavaScript',
        description: 'JavaScript programming language questions',
        color: '#FFC107',
        icon: 'Computer',
        parentId: 1,
        questionCount: 85,
        assessmentCount: 12,
        isActive: true,
        createdAt: '2024-01-16'
      },
      {
        id: 3,
        name: 'React',
        description: 'React framework and ecosystem',
        color: '#00BCD4',
        icon: 'Computer',
        parentId: 2,
        questionCount: 45,
        assessmentCount: 8,
        isActive: true,
        createdAt: '2024-01-17'
      },
      {
        id: 4,
        name: 'Business Knowledge',
        description: 'General business and management concepts',
        color: '#4CAF50',
        icon: 'Business',
        parentId: null,
        questionCount: 200,
        assessmentCount: 18,
        isActive: true,
        createdAt: '2024-01-18'
      },
      {
        id: 5,
        name: 'Customer Service',
        description: 'Customer service skills and best practices',
        color: '#FF9800',
        icon: 'People',
        parentId: 4,
        questionCount: 60,
        assessmentCount: 10,
        isActive: true,
        createdAt: '2024-01-19'
      },
      {
        id: 6,
        name: 'Healthcare',
        description: 'Medical knowledge and healthcare procedures',
        color: '#F44336',
        icon: 'LocalHospital',
        parentId: null,
        questionCount: 120,
        assessmentCount: 15,
        isActive: true,
        createdAt: '2024-01-20'
      }
    ];
    setCategories(mockCategories);
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        color: category.color,
        icon: category.icon,
        parentId: category.parentId
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        color: '#2196F3',
        icon: 'Category',
        parentId: null
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      color: '#2196F3',
      icon: 'Category',
      parentId: null
    });
  };

  const handleSaveCategory = () => {
    if (!formData.name.trim()) {
      alert('Please enter a category name');
      return;
    }

    const newCategory = {
      id: editingCategory ? editingCategory.id : Date.now(),
      ...formData,
      questionCount: editingCategory ? editingCategory.questionCount : 0,
      assessmentCount: editingCategory ? editingCategory.assessmentCount : 0,
      isActive: true,
      createdAt: editingCategory ? editingCategory.createdAt : new Date().toISOString().split('T')[0]
    };

    if (editingCategory) {
      setCategories(prev => prev.map(cat => cat.id === editingCategory.id ? newCategory : cat));
    } else {
      setCategories(prev => [...prev, newCategory]);
    }

    handleCloseDialog();
  };

  const handleDeleteCategory = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    const hasChildren = categories.some(cat => cat.parentId === categoryId);
    
    if (hasChildren) {
      alert('Cannot delete category with subcategories. Please delete subcategories first.');
      return;
    }

    if (category.questionCount > 0) {
      if (!window.confirm(`This category contains ${category.questionCount} questions. Are you sure you want to delete it?`)) {
        return;
      }
    }

    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  const getIconComponent = (iconName) => {
    const iconData = availableIcons.find(icon => icon.name === iconName);
    return iconData ? iconData.icon : <Category />;
  };

  const getParentCategories = () => {
    return categories.filter(cat => cat.parentId === null);
  };

  const getCategoryHierarchy = () => {
    const hierarchy = [];
    const parentCategories = categories.filter(cat => cat.parentId === null);
    
    parentCategories.forEach(parent => {
      hierarchy.push(parent);
      const children = categories.filter(cat => cat.parentId === parent.id);
      children.forEach(child => {
        hierarchy.push({ ...child, isChild: true });
        const grandChildren = categories.filter(cat => cat.parentId === child.id);
        grandChildren.forEach(grandChild => {
          hierarchy.push({ ...grandChild, isGrandChild: true });
        });
      });
    });
    
    return hierarchy;
  };

  const categoryHierarchy = getCategoryHierarchy();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Manage Categories
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Organize your questions and assessments with custom categories
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Category
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Category sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4">{categories.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Categories
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Folder sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4">{getParentCategories().length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Main Categories
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {categories.reduce((sum, cat) => sum + cat.questionCount, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Questions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {categories.reduce((sum, cat) => sum + cat.assessmentCount, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Assessments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Categories Table */}
      <Paper>
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Categories Overview</Typography>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="center">Questions</TableCell>
                <TableCell align="center">Assessments</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categoryHierarchy.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ 
                        ml: category.isGrandChild ? 4 : category.isChild ? 2 : 0,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <Avatar
                          sx={{
                            bgcolor: category.color,
                            width: 32,
                            height: 32,
                            mr: 2
                          }}
                        >
                          {getIconComponent(category.icon)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="medium">
                            {category.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Created: {category.createdAt}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {category.description}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={category.questionCount} 
                      color={category.questionCount > 0 ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={category.assessmentCount} 
                      color={category.assessmentCount > 0 ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={category.isActive ? 'Active' : 'Inactive'}
                      color={category.isActive ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit Category">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(category)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Category">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Category Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Parent Category</InputLabel>
                <Select
                  value={formData.parentId || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value || null }))}
                  label="Parent Category"
                >
                  <MenuItem value="">
                    <em>None (Main Category)</em>
                  </MenuItem>
                  {getParentCategories().map((cat) => (
                    <MenuItem key={cat.id} value={cat.id} disabled={editingCategory && cat.id === editingCategory.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Icon</InputLabel>
                <Select
                  value={formData.icon}
                  onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  label="Icon"
                >
                  {availableIcons.map((iconData) => (
                    <MenuItem key={iconData.name} value={iconData.name}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {iconData.icon}
                        <Typography sx={{ ml: 1 }}>{iconData.label}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Color
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {colors.map((color) => (
                  <Box
                    key={color}
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: color,
                      borderRadius: 1,
                      cursor: 'pointer',
                      border: formData.color === color ? '3px solid #000' : '1px solid #ccc',
                      '&:hover': {
                        transform: 'scale(1.1)'
                      }
                    }}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Alert severity="info">
                Categories help organize your questions and make them easier to find. 
                You can create subcategories for more specific organization.
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button onClick={handleSaveCategory} variant="contained" startIcon={<Save />}>
            {editingCategory ? 'Update' : 'Create'} Category
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageCategories;
