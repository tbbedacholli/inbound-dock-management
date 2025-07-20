// components/InboundDashboard/LoadDetails.js
'use client';
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  LocalShipping,
  Schedule,
  LocationOn,
  Inventory,
  ThermostatAuto,
  Person,
  Close,
  Edit,
  CheckCircle,
  Warning,
  Error,
  Info,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { formatDateTime, formatTime } from '../../utils/dateHelpers';
import { LOAD_STATUS, TEMPERATURE_ZONES } from '../../utils/constants';

const DetailCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  border: '1px solid rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4],
  }
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  const statusColors = {
    scheduled: theme.palette.info.main,
    arriving: theme.palette.warning.main,
    'in-progress': theme.palette.primary.main,
    completed: theme.palette.success.main,
    delayed: theme.palette.warning.main,
    critical: theme.palette.error.main,
  };

  return {
    backgroundColor: statusColors[status] + '20',
    color: statusColors[status],
    fontWeight: 600,
    border: `1px solid ${statusColors[status]}40`,
  };
});

export default function LoadDetails({ load, open, onClose, onUpdate }) {
  const [editMode, setEditMode] = useState(false);

  if (!load) return null;

  const zoneInfo = Object.values(TEMPERATURE_ZONES).find(zone => zone.id === load.tempZone) || TEMPERATURE_ZONES.DRY;
  const statusInfo = LOAD_STATUS[load.status.toUpperCase().replace('-', '_')] || LOAD_STATUS.SCHEDULED;

  const getProgressValue = () => {
    switch (load.status) {
      case 'scheduled': return 0;
      case 'arriving': return 25;
      case 'in-progress': return 60;
      case 'completed': return 100;
      case 'delayed': return 40;
      case 'critical': return 20;
      default: return 0;
    }
  };

  const getStatusIcon = () => {
    switch (load.status) {
      case 'completed': return <CheckCircle color="success" />;
      case 'critical': return <Error color="error" />;
      case 'delayed': return <Warning color="warning" />;
      default: return <Info color="primary" />;
    }
  };

  const handleStatusUpdate = (newStatus) => {
    if (onUpdate) {
      onUpdate({ ...load, status: newStatus });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, maxHeight: '90vh' }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: zoneInfo.color + '20', color: zoneInfo.color }}>
            <LocalShipping />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Load Details: {load.id}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {zoneInfo.name} Zone • {load.carrier}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit Load">
            <IconButton onClick={() => setEditMode(!editMode)}>
              <Edit />
            </IconButton>
          </Tooltip>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* Status and Progress */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            {getStatusIcon()}
            <StatusChip
              label={statusInfo.label}
              status={load.status}
              icon={statusInfo.icon}
            />
            <Typography variant="body2" color="textSecondary">
              Updated {formatTime(new Date())}
            </Typography>
          </Box>
          
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Progress</Typography>
              <Typography variant="body2">{getProgressValue()}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={getProgressValue()}
              color={
                load.status === 'completed' ? 'success' :
                load.status === 'critical' ? 'error' :
                load.status === 'delayed' ? 'warning' :
                'primary'
              }
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        </Box>

        {/* Load Information */}
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <DetailCard>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  📋 Load Information
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><Schedule /></ListItemIcon>
                    <ListItemText
                      primary="Scheduled Time"
                      secondary={formatDateTime(load.scheduledTime)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><LocationOn /></ListItemIcon>
                    <ListItemText
                      primary="Dock Assignment"
                      secondary={load.dock || 'Not assigned'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Person /></ListItemIcon>
                    <ListItemText
                      primary="Carrier"
                      secondary={load.carrier}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><LocalShipping /></ListItemIcon>
                    <ListItemText
                      primary="Trailer"
                      secondary={load.trailer}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </DetailCard>
          </Grid>

          {/* Cargo Details */}
          <Grid item xs={12} md={6}>
            <DetailCard>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  📦 Cargo Details
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><ThermostatAuto /></ListItemIcon>
                    <ListItemText
                      primary="Temperature Zone"
                      secondary={`${zoneInfo.name} (${zoneInfo.targetTemp}°C)`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Inventory /></ListItemIcon>
                    <ListItemText
                      primary="Pallet Count"
                      secondary={`${load.palletCount} pallets`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Weight"
                      secondary={`${load.weight?.toLocaleString()} lbs`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Purchase Order"
                      secondary={load.po}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </DetailCard>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12}>
            <DetailCard>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  🛒 Product Categories
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {load.products?.map((product, index) => (
                    <Chip
                      key={index}
                      label={product}
                      variant="outlined"
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  )) || <Typography color="textSecondary">No product details available</Typography>}
                </Box>
              </CardContent>
            </DetailCard>
          </Grid>

          {/* Timeline/History */}
          <Grid item xs={12}>
            <DetailCard>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  🕒 Timeline
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color={load.status !== 'scheduled' ? 'success' : 'disabled'} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Load Scheduled"
                      secondary={formatDateTime(load.scheduledTime)}
                    />
                  </ListItem>
                  
                  {load.status !== 'scheduled' && (
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color={['arriving', 'in-progress', 'completed'].includes(load.status) ? 'success' : 'disabled'} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Truck Arrived"
                        secondary="Estimated arrival time"
                      />
                    </ListItem>
                  )}

                  {['in-progress', 'completed'].includes(load.status) && (
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color={load.status === 'completed' ? 'success' : 'primary'} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Unloading Started"
                        secondary="Processing in progress"
                      />
                    </ListItem>
                  )}

                  {load.status === 'completed' && (
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Load Completed"
                        secondary="All items processed"
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </DetailCard>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        {editMode && (
          <Box sx={{ display: 'flex', gap: 1, mr: 'auto' }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleStatusUpdate('in-progress')}
              disabled={load.status === 'completed'}
            >
              Start Processing
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="success"
              onClick={() => handleStatusUpdate('completed')}
              disabled={load.status === 'completed'}
            >
              Mark Complete
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="warning"
              onClick={() => handleStatusUpdate('delayed')}
            >
              Mark Delayed
            </Button>
          </Box>
        )}
        
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}