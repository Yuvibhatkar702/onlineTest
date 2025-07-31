import React from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  School,
  Assessment,
  Analytics,
  Security,
  Speed,
  Support
} from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Assessment sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Create Assessments',
      description: 'Build comprehensive tests with multiple question types, advanced settings, and AI-powered question generation.'
    },
    {
      icon: <Analytics sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Advanced Analytics',
      description: 'Get detailed insights with comprehensive reports, performance tracking, and statistical analysis.'
    },
    {
      icon: <Security sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Anti-Cheating Technology',
      description: 'Secure testing environment with proctoring, browser lockdown, and real-time monitoring.'
    },
    {
      icon: <Speed sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Real-time Results',
      description: 'Instant grading, live progress tracking, and immediate feedback for better learning outcomes.'
    },
    {
      icon: <School sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Educational Focus',
      description: 'Designed specifically for educational institutions with academic integrity at its core.'
    },
    {
      icon: <Support sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: '24/7 Support',
      description: 'Comprehensive support system with documentation, tutorials, and responsive customer service.'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                fontWeight="bold"
                gutterBottom
                sx={{ 
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  animation: 'fadeIn 1s ease-out'
                }}
              >
                TestPortal
              </Typography>
              <Typography
                variant="h5"
                component="h2"
                sx={{ 
                  mb: 4, 
                  opacity: 0.9,
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  animation: 'fadeIn 1s ease-out 0.2s both'
                }}
              >
                The Complete Assessment Platform for Modern Education
              </Typography>
              <Typography
                variant="body1"
                sx={{ 
                  mb: 4, 
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  animation: 'fadeIn 1s ease-out 0.4s both'
                }}
              >
                Create, manage, and analyze assessments with advanced security features, 
                real-time monitoring, and AI-powered question generation. Perfect for 
                educational institutions, training organizations, and certification bodies.
              </Typography>
              <Box sx={{ animation: 'fadeIn 1s ease-out 0.6s both' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    mr: 2,
                    mb: { xs: 2, sm: 0 },
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'grey.100',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  animation: 'slideIn 1s ease-out 0.8s both'
                }}
              >
                <Card
                  elevation={8}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    transform: 'rotate(2deg)',
                    '&:hover': {
                      transform: 'rotate(0deg) scale(1.02)',
                      transition: 'transform 0.3s ease'
                    }
                  }}
                >
                  <Typography variant="h6" color="primary" gutterBottom>
                    ✨ Platform Highlights
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • AI-Powered Question Generation<br/>
                    • Advanced Anti-Cheating Technology<br/>
                    • Real-time Analytics & Reporting<br/>
                    • Multiple Question Types<br/>
                    • Secure Testing Environment<br/>
                    • Collaborative Assessment Creation
                  </Typography>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ mb: 6, fontWeight: 'bold', color: 'text.primary' }}
        >
          Why Choose TestPortal?
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  p: 3,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.12)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} textAlign="center">
            <Grid item xs={12} sm={3}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                10K+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Active Users
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                1M+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Assessments Created
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                50M+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Questions Answered
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                99.9%
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Uptime
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
            Ready to Transform Your Assessment Process?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem' }} color="text.secondary">
            Join thousands of educators and organizations who trust TestPortal 
            for their assessment needs. Get started today with our free plan.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Start Free Trial
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
