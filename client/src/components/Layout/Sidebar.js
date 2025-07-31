import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Collapse,
  Badge,
  Chip
} from '@mui/material';
import {
  Dashboard,
  Assessment,
  QuestionAnswer,
  People,
  Analytics,
  Settings,
  Help,
  Folder,
  ExpandLess,
  ExpandMore,
  Add,
  List as ListIcon,
  BarChart,
  PieChart,
  TrendingUp,
  AccountCircle,
  Security,
  Notifications,
  CloudUpload,
  Schedule,
  MonitorHeart,
  Videocam,
  AutoAwesome
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const drawerWidth = 260;

const Sidebar = ({ open, onClose, variant = 'temporary' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [openMenus, setOpenMenus] = React.useState({
    assessments: false,
    questions: false,
    analytics: false,
    settings: false
  });

  const handleMenuToggle = (menu) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (variant === 'temporary') {
      onClose();
    }
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard',
      badge: null
    },
    {
      title: 'Assessments',
      icon: <Assessment />,
      path: '/assessments',
      expandable: true,
      children: [
        { title: 'All Assessments', icon: <ListIcon />, path: '/assessments' },
        { title: 'Create Assessment', icon: <Add />, path: '/assessments/create' },
        { title: 'Templates', icon: <Folder />, path: '/assessments/templates' },
        { title: 'Scheduled', icon: <Schedule />, path: '/assessments/scheduled', badge: 3 },
      ]
    },
    {
      title: 'Question Bank',
      icon: <QuestionAnswer />,
      path: '/questions',
      expandable: true,
      children: [
        { title: 'All Questions', icon: <ListIcon />, path: '/questions' },
        { title: 'Create Question', icon: <Add />, path: '/questions/create' },
        { title: 'Generate with AI', icon: <AutoAwesome />, path: '/questions/generate' },
        { title: 'Categories', icon: <Folder />, path: '/questions/categories' },
        { title: 'Import/Export', icon: <CloudUpload />, path: '/questions/import' },
      ]
    },
    {
      title: 'Users',
      icon: <People />,
      path: '/users',
      badge: user?.role === 'admin' ? null : undefined,
      hidden: user?.role !== 'admin' && user?.role !== 'teacher'
    },
    {
      title: 'Analytics',
      icon: <Analytics />,
      path: '/analytics',
      expandable: true,
      children: [
        { title: 'Overview', icon: <BarChart />, path: '/analytics' },
        { title: 'Performance', icon: <TrendingUp />, path: '/analytics/performance' },
        { title: 'Reports', icon: <PieChart />, path: '/analytics/reports' },
      ]
    },
    {
      title: 'Exam Monitoring',
      icon: <MonitorHeart />,
      path: '/admin/monitoring',
      badge: 2, // Show active exams count
      hidden: user?.role !== 'admin' && user?.role !== 'teacher'
    }
  ];

  const bottomMenuItems = [
    {
      title: 'Settings',
      icon: <Settings />,
      path: '/settings',
      expandable: true,
      children: [
        { title: 'Profile', icon: <AccountCircle />, path: '/settings/profile' },
        { title: 'Security', icon: <Security />, path: '/settings/security' },
        { title: 'Notifications', icon: <Notifications />, path: '/settings/notifications' },
      ]
    },
    {
      title: 'Help & Support',
      icon: <Help />,
      path: '/help'
    }
  ];

  const renderMenuItem = (item, isChild = false) => {
    if (item.hidden) return null;

    const active = isActive(item.path);
    
    return (
      <React.Fragment key={item.title}>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => {
              if (item.expandable) {
                handleMenuToggle(item.path.replace('/', ''));
              } else {
                handleNavigation(item.path);
              }
            }}
            sx={{
              minHeight: 48,
              justifyContent: 'initial',
              px: isChild ? 4 : 2.5,
              bgcolor: active ? 'action.selected' : 'transparent',
              '&:hover': {
                bgcolor: active ? 'action.selected' : 'action.hover',
              },
              borderRadius: 1,
              mx: 1,
              mb: 0.5
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 1.5,
                justifyContent: 'center',
                color: active ? 'primary.main' : 'text.secondary'
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.title}
              sx={{
                opacity: 1,
                '& .MuiListItemText-primary': {
                  fontSize: '0.875rem',
                  fontWeight: active ? 600 : 400,
                  color: active ? 'primary.main' : 'text.primary'
                }
              }}
            />
            {item.badge && (
              <Badge 
                badgeContent={item.badge} 
                color="error" 
                sx={{ mr: item.expandable ? 1 : 0 }}
              >
                <Box />
              </Badge>
            )}
            {item.expandable && (
              openMenus[item.path.replace('/', '')] ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>
        
        {item.expandable && (
          <Collapse in={openMenus[item.path.replace('/', '')]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map(child => renderMenuItem(child, true))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const drawerContent = (
    <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* User Info */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ mr: 2 }}>
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.firstName}
                style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </Box>
            )}
          </Box>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Box sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }}>
              {user?.firstName} {user?.lastName}
            </Box>
            <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              {user?.organization}
            </Box>
          </Box>
        </Box>
        <Chip
          label={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ fontSize: '0.75rem' }}
        />
      </Box>

      {/* Main Navigation */}
      <Box sx={{ flexGrow: 1, py: 1 }}>
        <List>
          {menuItems.map(item => renderMenuItem(item))}
        </List>
      </Box>

      {/* Bottom Navigation */}
      <Box>
        <Divider />
        <List>
          {bottomMenuItems.map(item => renderMenuItem(item))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
