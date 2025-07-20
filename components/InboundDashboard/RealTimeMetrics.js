// components/InboundDashboard/RealTimeMetrics.js
'use client';
import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress,
  Grid,
  Divider,
} from '@mui/material';
import {
  Speed,
  Schedule,
  TrendingUp,
  LocalShipping,
  CheckCircle,
  Warning,
  Timer,
  Inventory,
} from '@mui/icons-material';
import { formatTime } from '../../utils/dateHelpers';

export default function RealTimeMetrics({ data }) {
  if (!data) {
    return (
      <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          📈 Loading metrics...
        </Typography>
      </Box>
    );
  }

  const getStatusColor = (value, good, excellent) => {
    if (value >= excellent) return 'success';
    if (value >= good) return 'warning';
    return 'error';
  };

  const metrics = [
    {
      icon: <LocalShipping color="primary" />,
      label: 'Active Loads',
      value: data.activeLoads || 0,
      unit: '',
      trend: '+2',
      color: 'primary',
    },
    {
      icon: <Schedule color="info" />,
      label: 'Avg Processing Time',
      value: data.avgProcessingTime || 0,
      unit: 'min',
      trend: '-3',
      color: 'info',
    },
    {
      icon: <Speed color="warning" />,
      label: 'Dock Utilization',
      value: data.dockUtilization || 0,
      unit: '%',
      trend: '+5',
      color: getStatusColor(data.dockUtilization || 0, 70, 85),
    },
    {
      icon: <TrendingUp color="success" />,
      label: 'Efficiency',
      value: data.efficiency || 0,
      unit: '%',
      trend: '+2',
      color: 'success',
    },
    {
      icon: <Timer color="secondary" />,
      label: 'Throughput Rate',
      value: data.throughputRate || 0,
      unit: '/hr',
      trend: '+1',
      color: 'secondary',
    },
    {
      icon: <CheckCircle color="success" />,
      label: 'Completed Today',
      value: data.completedToday || 0,
      unit: '',
      trend: '+8',
      color: 'success',
    },
  ];

  return (
    <Box>
      <List dense sx={{ maxHeight: 400, overflow: 'auto' }}>
        {metrics.map((metric, index) => (
          <React.Fragment key={index}>
            <ListItem sx={{ px: 0, py: 1.5 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>{metric.icon}</ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {metric.label}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: `${metric.color}.main` }}
                      >
                        {metric.value}
                        {metric.unit}
                      </Typography>
                      <Chip
                        label={metric.trend}
                        size="small"
                        color={metric.trend.startsWith('+') ? 'success' : 'error'}
                        sx={{ fontSize: '0.7rem', height: 20, fontWeight: 600 }}
                      />
                    </Box>
                  </Box>
                }
                secondary={
                  metric.unit === '%' && (
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, metric.value)}
                      color={metric.color}
                      sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                    />
                  )
                }
              />
            </ListItem>
            {index < metrics.length - 1 && <Divider sx={{ my: 0.5 }} />}
          </React.Fragment>
        ))}
      </List>

      {/* Summary Status */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          🎯 Overall Status
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="textSecondary">
                Performance
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color:
                    data.efficiency >= 90
                      ? 'success.main'
                      : data.efficiency >= 80
                      ? 'warning.main'
                      : 'error.main',
                }}
              >
                {data.efficiency >= 90
                  ? '🟢'
                  : data.efficiency >= 80
                  ? '🟡'
                  : '🔴'}{' '}
                {data.efficiency || 0}%
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="textSecondary">
                Alerts
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color:
                    data.temperatureAlerts === 0
                      ? 'success.main'
                      : 'error.main',
                }}
              >
                {data.temperatureAlerts === 0 ? '✅' : '⚠️'} {data.temperatureAlerts || 0}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ display: 'block', mt: 1, textAlign: 'center' }}
        >
          {data.temperatureAlerts === 0 && data.efficiency >= 90
            ? '🎉 Operations running smoothly!'
            : '📊 Monitor closely for optimal performance'}
        </Typography>
      </Box>
    </Box>
  );
}