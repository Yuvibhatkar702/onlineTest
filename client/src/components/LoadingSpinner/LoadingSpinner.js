import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingSpinner = ({ size = 40, message = 'Loading...' }) => {
  return (
    <Box
      className="loading-spinner-container"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        minHeight: 200
      }}
    >
      <CircularProgress 
        size={size} 
        thickness={4}
        sx={{ 
          color: 'primary.main',
          mb: 2
        }}
      />
      {message && (
        <Box
          component="span"
          sx={{
            color: 'text.secondary',
            fontSize: '0.875rem',
            textAlign: 'center'
          }}
        >
          {message}
        </Box>
      )}
    </Box>
  );
};

export default LoadingSpinner;
