// components/InboundDashboard/InboundDashboard.js
'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Badge,
  Tooltip,
  LinearProgress,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  CalendarToday,
  TrendingUp,
  Warning,
  LocalShipping,
  Thermostat,
  NotificationsActive,
  Refresh,
  Assessment,
  Speed,
  Timeline,
  Analytics,
  TrendingDown,
} from '@mui/icons-material';
import { keyframes } from '@mui/system';
import { 
  useLoadsData, 
  useAlertsData, 
  useMetricsData, 
  useSLAData, 
  useTemperatureData 
} from '../../hooks/useS3Data';

// Subtle, professional animations - only for critical alerts
const subtlePulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
`;

const gentleSlide = keyframes`
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const criticalAlert = keyframes`
  0%, 100% { border-color: #f44336; }
  50% { border-color: rgba(244, 67, 54, 0.5); }
`;

// Live updating mock data
const useLiveData = () => {
  const [data, setData] = useState({
    activeLoads: 12,
    pendingLoads: 8,
    completedToday: 24,
    delayedLoads: 3,
    avgProcessingTime: 45,
    temperatureAlerts: 2,
    slaCompliance: 94.5,
    dockUtilization: 78,
    efficiency: 87,
    throughputRate: 22,
    lastUpdated: new Date()
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        activeLoads: Math.max(8, Math.min(18, prev.activeLoads + (Math.random() - 0.5) * 2)),
        slaCompliance: Math.max(85, Math.min(98, prev.slaCompliance + (Math.random() - 0.5) * 2)),
        dockUtilization: Math.max(60, Math.min(95, prev.dockUtilization + (Math.random() - 0.5) * 5)),
        efficiency: Math.max(75, Math.min(95, prev.efficiency + (Math.random() - 0.5) * 3)),
        throughputRate: Math.max(15, Math.min(30, prev.throughputRate + (Math.random() - 0.5) * 2)),
        lastUpdated: new Date()
      }));
    }, 5000); // Update every 5 seconds (less frequent)

    return () => clearInterval(interval);
  }, []);

  return data;
};

// Professional card component
const ProfessionalCard = ({ children, sx = {}, alert = false, critical = false, ...props }) => (
  <Card 
    sx={{ 
      borderRadius: 2, 
      boxShadow: 2,
      transition: 'all 0.3s ease',
      border: critical ? '2px solid' : '1px solid',
      borderColor: critical ? '#f44336' : 'grey.200',
      animation: critical ? `${criticalAlert} 2s infinite` : 'none',
      bgcolor: alert && !critical ? 'warning.light' : 'background.paper',
      '&:hover': {
        boxShadow: 4,
        transform: 'translateY(-2px)',
      },
      ...sx
    }}
    {...props}
  >
    {children}
  </Card>
);

// Update the MetricCard component with muted colors
const MetricCard = ({ icon, title, value, unit, color, progress, trend, status = 'normal' }) => (
  <ProfessionalCard 
    critical={status === 'critical'} 
    alert={status === 'warning'}
  >
    <CardContent sx={{ textAlign: 'center', py: 3 }}>
      <Box sx={{ position: 'relative' }}>
        {/* Status indicator with muted colors */}
        {status !== 'normal' && (
          <Box sx={{ 
            position: 'absolute', 
            top: -8, 
            right: -8,
            width: 12,
            height: 12,
            borderRadius: '50%',
            bgcolor: status === 'critical' ? '#c62828' : '#f57c00', // Darker red/orange
            animation: status === 'critical' ? `${subtlePulse} 1.5s infinite` : 'none'
          }} />
        )}

        <Avatar sx={{ 
          width: 60, height: 60, mx: 'auto', mb: 2,
          bgcolor: color,
          boxShadow: 1 // Reduced shadow
        }}>
          {icon}
        </Avatar>
        
        <Typography variant="h4" sx={{ 
          fontWeight: 700, 
          color: status === 'critical' ? '#c62828' : color, // Darker colors
          mb: 1
        }}>
          {typeof value === 'number' ? value.toFixed(0) : value}{unit}
        </Typography>
        
        <Typography variant="body2" color="textSecondary" sx={{ 
          fontWeight: 600,
          mb: 2
        }}>
          {title}
        </Typography>

        {/* Trend indicator with muted colors */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
          {trend === 'up' ? (
            <TrendingUp sx={{ color: '#388e3c', fontSize: 16 }} /> // Darker green
          ) : trend === 'down' ? (
            <TrendingDown sx={{ color: '#d32f2f', fontSize: 16 }} /> // Darker red
          ) : (
            <Timeline sx={{ color: '#1976d2', fontSize: 16 }} /> // Darker blue
          )}
          <Typography variant="caption" color="textSecondary">
            {trend === 'up' ? 'Trending Up' : trend === 'down' ? 'Trending Down' : 'Stable'}
          </Typography>
        </Box>

        {/* Progress bar with muted colors */}
        {progress && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: '#e0e0e0', // Softer gray
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  bgcolor: status === 'critical' ? '#c62828' : color
                }
              }}
            />
            <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
              {progress.toFixed(0)}% Capacity
            </Typography>
          </Box>
        )}
      </Box>
    </CardContent>
  </ProfessionalCard>
);

// Professional Alerts Panel
const AlertsPanel = ({ alerts = [], onDismiss }) => {
  if (alerts.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Box sx={{ 
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: '#e8f5e8', // Very light green
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2
        }}>
          <Typography variant="h6" sx={{ color: '#2e7d32' }}>✓</Typography>
        </Box>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#2e7d32' }}>
          All Systems Operational
        </Typography>
        <Typography variant="body2" color="textSecondary">
          No active alerts • All zones monitoring normally
        </Typography>
      </Box>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#c62828'; // Darker red
      case 'medium': return '#f57c00'; // Darker orange
      case 'low': return '#1976d2'; // Darker blue
      default: return '#616161'; // Dark gray
    }
  };

  const getSeverityBgColor = (severity) => {
    switch (severity) {
      case 'high': return '#ffebee'; // Light red background
      case 'medium': return '#fff3e0'; // Light orange background
      case 'low': return '#e3f2fd'; // Light blue background
      default: return '#f5f5f5'; // Light gray background
    }
  };

  return (
    <Box sx={{ maxHeight: 350, overflow: 'auto' }}>
      {alerts.map((alert, index) => (
        <Box
          key={alert.id || index}
          sx={{ 
            mb: 2, 
            p: 2,
            bgcolor: getSeverityBgColor(alert.severity), 
            borderRadius: 2,
            border: '1px solid',
            borderColor: getSeverityColor(alert.severity),
            borderLeftWidth: 4,
            animation: `${gentleSlide} 0.3s ease-out ${index * 0.1}s both`,
            '&:hover': {
              boxShadow: 1, // Reduced shadow
              transform: 'translateX(4px)'
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                {alert.message}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="textSecondary">
                  {alert.time}
                </Typography>
                <Chip 
                  label={alert.severity.toUpperCase()} 
                  size="small"
                  sx={{
                    bgcolor: getSeverityColor(alert.severity),
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              </Box>
              {alert.zone && (
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 500, color: '#1976d2' }}>
                  Location: {alert.zone}
                </Typography>
              )}
            </Box>
            {onDismiss && (
              <IconButton 
                size="small" 
                onClick={() => onDismiss(alert.id)}
                sx={{ ml: 1, color: '#757575' }} // Muted gray
              >
                ✕
              </IconButton>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

// Professional Temperature Monitor
const TemperatureMonitor = () => {
  const { data: zones, loading, error } = useTemperatureData();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        Unable to fetch real-time data. Using cached information.
      </Alert>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return '#c62828'; // Darker red
      case 'warning': return '#f57c00'; // Darker orange
      default: return '#2e7d32'; // Darker green
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'critical': return '#ffebee'; // Light red
      case 'warning': return '#fff3e0'; // Light orange
      default: return '#e8f5e8'; // Light green
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {zones.map((zone, index) => (
        <Box 
          key={index}
          sx={{ 
            mb: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: getStatusBgColor(zone.status),
            border: '1px solid',
            borderColor: getStatusColor(zone.status),
            animation: zone.status === 'critical' ? `${subtlePulse} 2s infinite` : 'none'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {zone.name}
            </Typography>
            <Typography variant="h6" sx={{ 
              fontWeight: 700,
              color: getStatusColor(zone.status)
            }}>
              {zone.temp}°C
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="textSecondary">
              Target: {zone.target}°C
            </Typography>
            <Chip 
              label={zone.status.toUpperCase()} 
              size="small" 
              sx={{
                bgcolor: getStatusColor(zone.status),
                color: 'white',
                fontWeight: 600
              }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

// Professional Real-time Metrics
const RealTimeMetrics = ({ data }) => {
  const metrics = [
    {
      label: 'Throughput Rate',
      value: data?.throughputRate || 22,
      unit: '/hr',
      color: 'primary.main',
      trend: 'up',
      decimals: 1
    },
    {
      label: 'Efficiency Score',
      value: data?.efficiency || 87,
      unit: '%',
      color: 'success.main',
      trend: 'up',
      decimals: 1
    },
    {
      label: 'Avg Processing Time',
      value: data?.avgProcessingTime || 45,
      unit: ' min',
      color: 'warning.main',
      trend: 'down',
      decimals: 0
    }
  ];

  return (
    <Box sx={{ p: 2 }}>
      {metrics.map((metric, index) => (
        <Box 
          key={index}
          sx={{ 
            mb: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'grey.200',
            '&:hover': {
              boxShadow: 1,
              borderColor: metric.color
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {metric.label}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" color={metric.color} sx={{ fontWeight: 700 }}>
                {metric.value.toFixed(metric.decimals)}{metric.unit}
              </Typography>
              {metric.trend === 'up' ? (
                <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />
              ) : (
                <TrendingDown sx={{ color: 'error.main', fontSize: 16 }} />
              )}
            </Box>
          </Box>
        </Box>
      ))}
      
      <Box sx={{ 
        mt: 3, 
        pt: 2, 
        borderTop: '1px solid', 
        borderColor: 'grey.200',
        textAlign: 'center' 
      }}>
        <Typography variant="caption" color="textSecondary">
          Last updated: {new Date().toLocaleTimeString()}
        </Typography>
      </Box>
    </Box>
  );
};

// Professional LoadCalendar
const LoadCalendar = () => {
  const { data: upcomingLoads, loading, error } = useLoadsData();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading load schedule...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        Unable to fetch real-time data. Using cached information.
      </Alert>
    );
  }

  // Sober color scheme
  const getStatusColor = (status) => {
    switch (status) {
      case 'On Time': return 'success';
      case 'Early': return 'info';
      case 'Delayed': return 'error';
      case 'Scheduled': return 'primary';
      default: return 'default';
    }
  };

  // Remove emojis and use subtle text indicators
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '●';
      case 'medium': return '◐';
      case 'low': return '○';
      default: return '○';
    }
  };

  // Calculate summary data
  const onTimeLoads = upcomingLoads.filter(load => load.status === 'On Time').length;
  const delayedLoads = upcomingLoads.filter(load => load.status === 'Delayed').length;
  const earlyLoads = upcomingLoads.filter(load => load.status === 'Early').length;
  const scheduledLoads = upcomingLoads.filter(load => load.status === 'Scheduled').length;
  const highPriorityLoads = upcomingLoads.filter(load => load.priority === 'high').length;
  const totalItems = upcomingLoads.reduce((sum, load) => sum + load.items, 0);

  // Group loads by status for action-oriented display
  const delayedLoadsList = upcomingLoads.filter(load => load.status === 'Delayed');
  const nextThreeLoads = upcomingLoads.slice(0, 3);

  return (
    <Box>
      {/* Sober Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3,
        p: 3,
        bgcolor: '#37474f', // Dark blue-grey
        borderRadius: 2,
        color: 'white'
      }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Today&apos;s Load Operations
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, fontWeight: 500 }}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            {upcomingLoads.length}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, fontWeight: 500 }}>
            Active Loads
          </Typography>
        </Box>
      </Box>

      {/* Sober Status Dashboard */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
        gap: 3, 
        mb: 4 
      }}>
        {/* Critical Actions Required */}
        <Box sx={{ 
          p: 3, 
          bgcolor: delayedLoads > 0 ? '#fafafa' : '#f8f9fa',
          borderRadius: 2,
          border: '1px solid',
          borderColor: delayedLoads > 0 ? '#9e9e9e' : '#e0e0e0',
          borderLeft: '4px solid',
          borderLeftColor: delayedLoads > 0 ? '#616161' : '#66bb6a'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: delayedLoads > 0 ? '#616161' : '#66bb6a',
              mr: 2,
              animation: delayedLoads > 0 ? `${subtlePulse} 1.5s infinite` : 'none'
            }} />
            <Typography variant="h6" sx={{ 
              fontWeight: 600,
              color: delayedLoads > 0 ? '#424242' : '#388e3c'
            }}>
              {delayedLoads > 0 ? 'Action Required' : 'All Loads on Track'}
            </Typography>
          </Box>
          
          {delayedLoads > 0 ? (
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 2, color: '#424242' }}>
                {delayedLoads} Delayed Load{delayedLoads > 1 ? 's' : ''} Need Attention
              </Typography>
              {delayedLoadsList.map((load, index) => (
                <Box key={index} sx={{ 
                  p: 2, 
                  mb: 1, 
                  bgcolor: 'white', 
                  borderRadius: 1,
                  border: '1px solid #e0e0e0',
                  borderLeft: '3px solid #757575'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {load.id} - {load.carrier}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      bgcolor: '#757575', 
                      color: 'white', 
                      px: 1, 
                      py: 0.5, 
                      borderRadius: 1,
                      fontWeight: 500
                    }}>
                      Dock {load.dock}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="textSecondary">
                    Scheduled: {load.scheduledTime} → Est: {load.estimatedArrival}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body1" sx={{ color: '#388e3c', fontWeight: 500 }}>
              All loads are on schedule or early
            </Typography>
          )
        }
        </Box>

        {/* Operations Summary with sober colors */}
        <Box sx={{ 
          p: 3, 
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: '1px solid #e0e0e0'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#424242' }}>
            Today&apos;s Operations Summary
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f1f8e9', borderRadius: 1, border: '1px solid #dcedc8' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#388e3c' }}>
                {onTimeLoads}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 500, color: '#2e7d32' }}>
                ON TIME
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fafafa', borderRadius: 1, border: '1px solid #e0e0e0' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#616161' }}>
                {delayedLoads}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 500, color: '#424242' }}>
                DELAYED
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e8f4fd', borderRadius: 1, border: '1px solid #bbdefb' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1565c0' }}>
                {earlyLoads}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 500, color: '#0d47a1' }}>
                EARLY
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f3e5f5', borderRadius: 1, border: '1px solid #e1bee7' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#6a1b9a' }}>
                {scheduledLoads}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 500, color: '#4a148c' }}>
                SCHEDULED
              </Typography>
            </Box>
          </Box>

          <Box sx={{ pt: 2, borderTop: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="textSecondary">High Priority Loads:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#424242' }}>
                {highPriorityLoads}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="textSecondary">Total Items Expected:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {totalItems.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Next 3 Loads - Sober styling */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#424242' }}>
          Next 3 Loads - Immediate Focus
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr 1fr' }, gap: 2 }}>
          {nextThreeLoads.map((load, index) => (
            <Box
              key={load.id}
              sx={{ 
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                borderLeft: '4px solid',
                borderLeftColor: load.status === 'Delayed' ? '#757575' : 
                                load.status === 'Early' ? '#42a5f5' :
                                load.status === 'On Time' ? '#66bb6a' : '#9e9e9e',
                animation: load.status === 'Delayed' ? `${subtlePulse} 2s infinite` : 'none',
                '&:hover': {
                  boxShadow: 1,
                  transform: 'translateY(-1px)'
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" sx={{ 
                    color: load.priority === 'high' ? '#424242' : 
                           load.priority === 'medium' ? '#616161' : '#9e9e9e',
                    fontWeight: 600
                  }}>
                    {getPriorityIcon(load.priority)}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#37474f' }}>
                    {load.id}
                  </Typography>
                </Box>
                <Chip
                  label={load.status}
                  size="small"
                  sx={{ 
                    fontWeight: 500,
                    bgcolor: load.status === 'Delayed' ? '#757575' : 
                            load.status === 'Early' ? '#42a5f5' :
                            load.status === 'On Time' ? '#66bb6a' : '#9e9e9e',
                    color: 'white'
                  }}
                />
              </Box>
              
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: '#424242' }}>
                {load.carrier} • Dock {load.dock}
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                p: 1.5,
                bgcolor: '#f8f9fa',
                borderRadius: 1,
                mb: 1
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 500 }}>
                    SCHEDULED
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {load.scheduledTime}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 500 }}>
                    ESTIMATED
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 600,
                    color: load.status === 'Delayed' ? '#757575' : 
                           load.status === 'Early' ? '#1565c0' :
                           load.status === 'On Time' ? '#388e3c' : '#424242'
                  }}>
                    {load.estimatedArrival}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="textSecondary">
                  {load.items} items • {load.temperature}
                </Typography>
                <Typography variant="caption" sx={{ 
                  bgcolor: load.priority === 'high' ? '#424242' : '#757575',
                  color: 'white',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontWeight: 500
                }}>
                  {load.priority.toUpperCase()}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Full Schedule View - Sober styling */}
      <Box sx={{ 
        p: 2, 
        bgcolor: '#f8f9fa', 
        borderRadius: 2,
        border: '1px solid #e0e0e0'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#424242' }}>
          Complete Load Schedule ({upcomingLoads.length} loads)
        </Typography>
        
        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
          {upcomingLoads.map((load, index) => (
            <Box
              key={load.id}
              sx={{ 
                mb: 1,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid #e0e0e0',
                borderLeft: '3px solid',
                borderLeftColor: load.status === 'Delayed' ? '#757575' : 
                                load.status === 'Early' ? '#42a5f5' :
                                load.status === 'On Time' ? '#66bb6a' : '#9e9e9e',
                '&:hover': {
                  boxShadow: 1,
                  transform: 'translateX(2px)'
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body1" sx={{ 
                    color: load.priority === 'high' ? '#424242' : 
                           load.priority === 'medium' ? '#616161' : '#9e9e9e'
                  }}>
                    {getPriorityIcon(load.priority)}
                  </Typography>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {load.id} - {load.carrier}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {load.scheduledTime} → {load.estimatedArrival} • Dock {load.dock} • {load.items} items
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={load.status}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: load.status === 'Delayed' ? '#757575' : 
                                load.status === 'Early' ? '#42a5f5' :
                                load.status === 'On Time' ? '#66bb6a' : '#9e9e9e',
                    color: load.status === 'Delayed' ? '#757575' : 
                           load.status === 'Early' ? '#1565c0' :
                           load.status === 'On Time' ? '#388e3c' : '#424242'
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

// Professional SLADashboard
const SLADashboard = () => {
  const { data: slaData, loading, error } = useSLAData();

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return '#388e3c';
      case 'warning': return '#f57c00';
      case 'critical': return '#c62828';
      default: return '#616161';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'good': return '#e8f5e8';
      case 'warning': return '#fff3e0';
      case 'critical': return '#ffebee';
      default: return '#f5f5f5';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        Unable to fetch SLA data. Using cached information.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {slaData.map((item, index) => (
        <Box 
          key={index}
          sx={{ 
            mb: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: getStatusBgColor(item.status),
            border: '1px solid',
            borderColor: getStatusColor(item.status)
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {item.metric}
            </Typography>
            <Typography variant="h6" sx={{ 
              fontWeight: 700,
              color: getStatusColor(item.status)
            }}>
              {item.actual}%
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="caption" color="textSecondary">
              Target: {item.target}%
            </Typography>
            <Chip 
              label={item.status.toUpperCase()} 
              size="small" 
              sx={{
                bgcolor: getStatusColor(item.status),
                color: 'white',
                fontWeight: 500
              }}
            />
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(item.actual / item.target) * 100} 
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                bgcolor: getStatusColor(item.status)
              }
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

// Main Dashboard Component
export default function InboundDashboard() {
  const { data: metricsData, loading: metricsLoading } = useMetricsData();
  const { data: alertsData, loading: alertsLoading } = useAlertsData();

  const handleDismissAlert = (alertId) => {
    // You might want to implement this to update S3 data
    console.log('Dismiss alert:', alertId);
  };

  const getMetricStatus = (metric, value) => {
    if (metric === 'temperatureAlerts' && value > 0) return 'critical';
    if (metric === 'slaCompliance' && value < 90) return 'warning';
    if (metric === 'dockUtilization' && value > 90) return 'warning';
    return 'normal';
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f5f5f5',
      py: 4 
    }}>
      <Container maxWidth="xl">
        {/* Loading state for critical metrics */}
        {metricsLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading dashboard metrics...</Typography>
          </Box>
        )}

        {/* Key Metrics Row */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
            <MetricCard
              icon={<LocalShipping fontSize="large" />}
              title="Active Loads"
              value={Math.round(metricsData?.activeLoads || 0)}
              unit=""
              color="#455a64"
              progress={(metricsData?.activeLoads || 0) * 5}
              trend="up"
              status={getMetricStatus('activeLoads', metricsData?.activeLoads)}
            />
          </Box>

          <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
            <MetricCard
              icon={<Assessment fontSize="large" />}
              title="SLA Compliance"
              value={metricsData?.slaCompliance || 0}
              unit="%"
              color="#388e3c"
              progress={metricsData?.slaCompliance || 0}
              trend="up"
              status={getMetricStatus('slaCompliance', metricsData?.slaCompliance)}
            />
          </Box>

          <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
            <MetricCard
              icon={<Thermostat fontSize="large" />}
              title="Temperature Alerts"
              value={metricsData?.temperatureAlerts || 0}
              unit=""
              color="#616161"
              progress={(metricsData?.temperatureAlerts || 0) * 25}
              trend="down"
              status={getMetricStatus('temperatureAlerts', metricsData?.temperatureAlerts)}
            />
          </Box>

          <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
            <MetricCard
              icon={<Speed fontSize="large" />}
              title="Dock Utilization"
              value={Math.round(metricsData?.dockUtilization || 0)}
              unit="%"
              color="#795548"
              progress={metricsData?.dockUtilization || 0}
              trend="up"
              status={getMetricStatus('dockUtilization', metricsData?.dockUtilization)}
            />
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flex: '2 1 600px', minWidth: '600px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <ProfessionalCard>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: '#455a64', mr: 2 }}>
                      <CalendarToday />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Incoming Loads Schedule
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Real-time load scheduling and tracking
                      </Typography>
                    </Box>
                  </Box>
                  <LoadCalendar />
                </CardContent>
              </ProfessionalCard>
            </Box>
          </Box>

          <Box sx={{ flex: '1 1 350px', minWidth: '350px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <ProfessionalCard critical={alertsData?.some(a => a.severity === 'high')}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: '#455a64', mr: 2 }}>
                      <Analytics />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        System Alerts
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Active notifications and warnings
                      </Typography>
                    </Box>
                  </Box>
                  <AlertsPanel alerts={alertsData || []} onDismiss={handleDismissAlert} />
                </CardContent>
              </ProfessionalCard>

              <ProfessionalCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: '#455a64', mr: 2 }}>
                      <Analytics />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Performance Metrics
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Real-time operational data
                      </Typography>
                    </Box>
                  </Box>
                  <RealTimeMetrics data={metricsData} />
                </CardContent>
              </ProfessionalCard>

              <ProfessionalCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: '#388e3c', mr: 2 }}>
                      <Assessment />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Inbound Provider Performance
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Service level agreement tracking
                      </Typography>
                    </Box>
                  </Box>
                  <SLADashboard />
                </CardContent>
              </ProfessionalCard>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}