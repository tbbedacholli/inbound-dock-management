// components/common/LoadingSpinner.js
'use client';
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingSpinner({ 
  size = 40, 
  message = 'Loading...', 
  fullHeight = false 
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        minHeight: fullHeight ? '100vh' : '200px',
        py: 4
      }}
    >
      <CircularProgress size={size} thickness={4} />
      <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
        {message}
      </Typography>
    </Box>
  );
}