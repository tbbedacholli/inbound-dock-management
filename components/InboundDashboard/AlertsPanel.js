// components/InboundDashboard/AlertsPanel.js
'use client';
import React from 'react';
import { 
  Box, 
  Typography, 
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
  Alert
} from '@mui/material';
import { 
  Close, 
  Warning, 
  Error,
  Info
} from '@mui/icons-material';

export default function AlertsPanel({ alerts = [], onDismiss }) {
  const mockAlerts = [
    {
      id: 1,
      type: 'temperature',
      severity: 'high',
      message: 'Freezer zone temperature spike detected in Dock 3',
      time: '2 min ago',
      zone: 'Frozen A'
    },
    {
      id: 2,
      type: 'delay',
      severity: 'medium',
      message: 'Load LD-2024-003 delayed by 30 minutes',
      time: '15 min ago',
      load: 'LD-2024-003'
    }
  ];

  const displayAlerts = alerts.length > 0 ? alerts : mockAlerts;

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'high': return <Error color="error" />;
      case 'medium': return <Warning color="warning" />;
      default: return <Info color="info" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      default: return 'info';
    }
  };

  if (displayAlerts.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="success.main" sx={{ mb: 1 }}>
          ✅ All Clear!
        </Typography>
        <Typography variant="body2" color="textSecondary">
          No active alerts at this time
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
        {displayAlerts.map((alert) => (
          <ListItem
            key={alert.id}
            sx={{ 
              mb: 1, 
              bgcolor: 'background.paper', 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <ListItemIcon>
              {getAlertIcon(alert.severity)}
            </ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
                    {alert.message}
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => onDismiss?.(alert.id)}
                    sx={{ ml: 1 }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              }
              secondary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <Typography variant="caption" color="textSecondary">
                    {alert.time}
                  </Typography>
                  <Chip
                    label={alert.severity}
                    size="small"
                    color={getSeverityColor(alert.severity)}
                    sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                  />
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}