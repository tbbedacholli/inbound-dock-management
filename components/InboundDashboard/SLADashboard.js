// components/InboundDashboard/SLADashboard.js
'use client';
import React from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress,
  Grid2 as Grid
} from '@mui/material';

export default function SLADashboard() {
  const slaMetrics = [
    { label: 'On-Time Delivery', value: 94.5, target: 95, color: 'warning' },
    { label: 'Processing Speed', value: 87.2, target: 85, color: 'success' },
    { label: 'Accuracy Rate', value: 99.1, target: 99, color: 'success' }
  ];

  return (
    <Box>
      <Grid container spacing={2}>
        {slaMetrics.map((metric, index) => (
          <Grid xs={4} key={index}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
                <CircularProgress
                  variant="determinate"
                  value={metric.value}
                  size={60}
                  thickness={4}
                  color={metric.color}
                />
                <Box sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {metric.value}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                {metric.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}