// components/InboundDashboard/LoadCalendar.js
'use client';
import React from 'react';
import { Box, Typography } from '@mui/material';

export default function LoadCalendar() {
  return (
    <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h6" color="textSecondary">
        📅 Load Calendar Component
      </Typography>
    </Box>
  );
}