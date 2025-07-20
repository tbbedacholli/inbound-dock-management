// components/InboundDashboard/DockStatus.js
'use client';
import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  LocalShipping,
  CheckCircle,
  Warning,
  Error,
  Schedule,
  Build,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { DOCK_STATUS, TEMPERATURE_ZONES } from '../../utils/constants';

const DockCard = styled(Card)(({ theme, status }) => ({
  borderRadius: 16,
  border: `2px solid ${
    status === 'available' ? theme.palette.success.main :
    status === 'occupied' ? theme.palette.primary.main :
    status === 'maintenance' ? theme.palette.warning.main :
    theme.palette.error.main
  }30`,
  background: `linear-gradient(135deg, ${
    status === 'available' ? theme.palette.success.main :
    status === 'occupied' ? theme.palette.primary.main :
    status === 'maintenance' ? theme.palette.warning.main :
    theme.palette.error.main
  }08 0%, ${
    status === 'available' ? theme.palette.success.main :
    status === 'occupied' ? theme.palette.primary.main :
    status === 'maintenance' ? theme.palette.warning.main :
    theme.palette.error.main
  }02 100%)`,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  }
}));

const StatusIcon = ({ status }) => {
  const icons = {
    available: <CheckCircle color="success" />,
    occupied: <LocalShipping color="primary" />,
    maintenance: <Build color="warning" />,
    out_of_order: <Error color="error" />
  };
  return icons[status] || <Schedule />;
};

export default function DockStatus({ dockData = [] }) {
  // Mock dock data if not provided
  const mockDockData = [
    { id: 'dock-1', name: 'Dock 1', status: 'occupied', zone: 'frozen', currentLoad: 'LD-2024-001', progress: 75, eta: '14:30' },
    { id: 'dock-2', name: 'Dock 2', status: 'available', zone: 'frozen', currentLoad: null, progress: 0, eta: null },
    { id: 'dock-3', name: 'Dock 3', status: 'occupied', zone: 'frozen', currentLoad: 'LD-2024-002', progress: 45, eta: '15:15' },
    { id: 'dock-4', name: 'Dock 4', status: 'occupied', zone: 'fresh', currentLoad: 'LD-2024-003', progress: 90, eta: '14:15' },
    { id: 'dock-5', name: 'Dock 5', status: 'available', zone: 'fresh', currentLoad: null, progress: 0, eta: null },
    { id: 'dock-6', name: 'Dock 6', status: 'maintenance', zone: 'fresh', currentLoad: null, progress: 0, eta: null },
    { id: 'dock-7', name: 'Dock 7', status: 'occupied', zone: 'dairy', currentLoad: 'LD-2024-004', progress: 60, eta: '14:45' },
    { id: 'dock-8', name: 'Dock 8', status: 'available', zone: 'dairy', currentLoad: null, progress: 0, eta: null },
  ];

  const docks = dockData.length > 0 ? dockData : mockDockData;

  const getZoneInfo = (zoneId) => {
    return Object.values(TEMPERATURE_ZONES).find(zone => zone.id === zoneId) || TEMPERATURE_ZONES.DRY;
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
        🚪 Dock Status Overview
      </Typography>

      <Grid container spacing={2}>
        {docks.map((dock) => {
          const zoneInfo = getZoneInfo(dock.zone);
          const statusInfo = DOCK_STATUS[dock.status.toUpperCase()] || DOCK_STATUS.AVAILABLE;

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={dock.id}>
              <DockCard status={dock.status}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ 
                      bgcolor: statusInfo.color + '.main',
                      width: 40,
                      height: 40,
                      mr: 1.5
                    }}>
                      <StatusIcon status={dock.status} />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {dock.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {zoneInfo.name} Zone
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={statusInfo.label}
                      color={statusInfo.color}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>

                  {dock.currentLoad && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        Current Load: <strong>{dock.currentLoad}</strong>
                      </Typography>
                      
                      {dock.progress > 0 && (
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption">Progress</Typography>
                            <Typography variant="caption">{dock.progress}%</Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={dock.progress}
                            color={dock.progress > 80 ? 'success' : dock.progress > 50 ? 'primary' : 'warning'}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      )}

                      {dock.eta && (
                        <Typography variant="caption" color="primary" sx={{ fontWeight: 600, mt: 1, display: 'block' }}>
                          ETA: {dock.eta}
                        </Typography>
                      )}
                    </Box>
                  )}

                  {dock.status === 'available' && (
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                      ✅ Ready for next load
                    </Typography>
                  )}

                  {dock.status === 'maintenance' && (
                    <Typography variant="body2" color="warning.main" sx={{ fontWeight: 600 }}>
                      🔧 Under maintenance
                    </Typography>
                  )}

                  {dock.status === 'out_of_order' && (
                    <Typography variant="body2" color="error.main" sx={{ fontWeight: 600 }}>
                      ❌ Out of service
                    </Typography>
                  )}
                </CardContent>
              </DockCard>
            </Grid>
          );
        })}
      </Grid>

      {/* Dock Summary */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          📊 Dock Summary
        </Typography>
        
        <Grid container spacing={2}>
          {Object.entries(
            docks.reduce((acc, dock) => {
              acc[dock.status] = (acc[dock.status] || 0) + 1;
              return acc;
            }, {})
          ).map(([status, count]) => {
            const statusInfo = DOCK_STATUS[status.toUpperCase()] || { label: status, color: 'default' };
            return (
              <Grid item xs={6} sm={3} key={status}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: statusInfo.color + '.main' }}>
                    {count}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {statusInfo.label}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}