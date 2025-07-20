// components/InboundDashboard/TemperatureMonitor.js
'use client';
import React from 'react';
import { 
  Box, 
  Typography, 
  Grid2 as Grid,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
  Chip
} from '@mui/material';
import { 
  Thermostat, 
  Warning, 
  CheckCircle,
  Error
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const TempCard = styled(Card)(({ theme, status }) => ({
  borderRadius: 12,
  border: `2px solid ${
    status === 'normal' ? theme.palette.success.main :
    status === 'warning' ? theme.palette.warning.main :
    theme.palette.error.main
  }30`,
  background: `linear-gradient(135deg, ${
    status === 'normal' ? theme.palette.success.main :
    status === 'warning' ? theme.palette.warning.main :
    theme.palette.error.main
  }08 0%, transparent 100%)`,
}));

export default function TemperatureMonitor() {
  const zones = [
    {
      id: 'frozen-a',
      name: 'Frozen A',
      currentTemp: -18.2,
      targetTemp: -18,
      tolerance: 2,
      status: 'normal',
      icon: '❄️',
      docks: ['Dock 1', 'Dock 2']
    },
    {
      id: 'fresh-produce',
      name: 'Fresh Produce',
      currentTemp: 3.1,
      targetTemp: 2,
      tolerance: 1.5,
      status: 'warning',
      icon: '🥬',
      docks: ['Dock 4', 'Dock 5']
    },
    {
      id: 'dairy',
      name: 'Dairy/Deli',
      currentTemp: 4.8,
      targetTemp: 4,
      tolerance: 2,
      status: 'normal',
      icon: '🧀',
      docks: ['Dock 7']
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'normal': return <CheckCircle color="success" />;
      case 'warning': return <Warning color="warning" />;
      case 'critical': return <Error color="error" />;
      default: return <Thermostat />;
    }
  };

  const getVariancePercent = (current, target, tolerance) => {
    const variance = Math.abs(current - target);
    return (variance / tolerance) * 100;
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {zones.map((zone) => (
          <Grid xs={12} key={zone.id}>
            <TempCard status={zone.status}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: 'transparent',
                      fontSize: '16px'
                    }}>
                      {zone.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {zone.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Target: {zone.targetTemp}°C ±{zone.tolerance}°
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getStatusIcon(zone.status)}
                    <Chip
                      label={zone.status}
                      color={
                        zone.status === 'normal' ? 'success' :
                        zone.status === 'warning' ? 'warning' : 'error'
                      }
                      size="small"
                      sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                      {zone.currentTemp}°C
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Variance: {Math.abs(zone.currentTemp - zone.targetTemp).toFixed(1)}°
                    </Typography>
                  </Box>
                  
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, getVariancePercent(zone.currentTemp, zone.targetTemp, zone.tolerance))}
                    color={zone.status === 'normal' ? 'success' : zone.status === 'warning' ? 'warning' : 'error'}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>

                <Typography variant="caption" color="textSecondary">
                  Monitoring: {zone.docks.join(', ')}
                </Typography>
              </CardContent>
            </TempCard>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', textAlign: 'center' }}>
          🌡️ Last updated: {new Date().toLocaleTimeString()}
        </Typography>
      </Box>
    </Box>
  );
}