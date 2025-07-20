// hooks/useRealTimeData.js
import { useState, useEffect } from 'react';

export const useRealTimeData = () => {
  const [data, setData] = useState({
    activeLoads: 12,
    pendingLoads: 8,
    completedToday: 24,
    delayedLoads: 3,
    avgProcessingTime: 45,
    temperatureAlerts: 2,
    slaCompliance: 94.5,
    dockUtilization: 78,
    efficiency: 87,          // Added this
    throughputRate: 22,      // Added this
    lastUpdated: new Date()
  });

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'temperature',
      severity: 'high',
      message: 'Freezer zone temperature spike detected in Dock 3',
      time: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      load: 'LD-2024-001',
      zone: 'Frozen A'
    }
  ]);

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  return {
    data,
    alerts,
    dismissAlert
  };
};