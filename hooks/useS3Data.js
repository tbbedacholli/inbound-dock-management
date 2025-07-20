// hooks/useS3Data.js - Update all refresh intervals to 15 minutes
import { useState, useEffect } from 'react';

const fetchDataFromAPI = async (key) => {
  const response = await fetch(`/api/s3-data?key=${encodeURIComponent(key)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${key}: ${response.statusText}`);
  }
  return response.json();
};

// 15 minutes = 900,000 milliseconds
const FIFTEEN_MINUTES = 15 * 60 * 1000;

// Hook for loads data
export const useLoadsData = (refreshInterval = FIFTEEN_MINUTES) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackData = {
    loads: [
      {
        id: 'LD-2024-001',
        carrier: 'FedEx',
        type: 'Frozen',
        scheduledTime: '08:30 AM',
        estimatedArrival: '08:45 AM',
        status: 'On Time',
        dock: '3A',
        priority: 'high',
        items: 245,
        temperature: '-18°C'
      }
      // ... other fallback loads
    ]
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await fetchDataFromAPI('loads/loads-data.json');
      setData(result.loads || fallbackData.loads);
      setError(null);
    } catch (err) {
      console.warn('Using fallback data:', err.message);
      setData(fallbackData.loads);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  return { data: data || [], loading, error, refresh: fetchData };
};

// Hook for alerts data
export const useAlertsData = (refreshInterval = FIFTEEN_MINUTES) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackData = [
    {
      id: 1,
      type: 'temperature',
      severity: 'high',
      message: 'Freezer zone temperature spike detected in Dock 3',
      time: '2 min ago',
      zone: 'Frozen Storage A'
    }
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await fetchDataFromAPI('alerts/alerts-data.json');
      setData(result.alerts || fallbackData);
      setError(null);
    } catch (err) {
      console.warn('Using fallback data:', err.message);
      setData(fallbackData);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  return { data, loading, error, refresh: fetchData };
};

// Hook for metrics data
export const useMetricsData = (refreshInterval = FIFTEEN_MINUTES) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackData = {
    activeLoads: 12,
    slaCompliance: 94.5,
    dockUtilization: 78,
    temperatureAlerts: 2,
    efficiency: 87,
    throughputRate: 22,
    avgProcessingTime: 45,
    completedToday: 24
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await fetchDataFromAPI('metrics/metrics-data.json');
      setData(result.metrics || fallbackData);
      setError(null);
    } catch (err) {
      console.warn('Using fallback data:', err.message);
      setData(fallbackData);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  return { data, loading, error, refresh: fetchData };
};

// Hook for SLA data
export const useSLAData = (refreshInterval = FIFTEEN_MINUTES) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackData = {
    providerPerformance: [
      { metric: 'On-Time Delivery', target: 95, actual: 94.5, status: 'warning' },
      { metric: 'Accuracy Rate', target: 99, actual: 98.8, status: 'warning' }
    ]
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await fetchDataFromAPI('sla/sla-data.json');
      setData(result.providerPerformance || fallbackData.providerPerformance);
      setError(null);
    } catch (err) {
      console.warn('Using fallback data:', err.message);
      setData(fallbackData.providerPerformance);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  return { data, loading, error, refresh: fetchData };
};

// Hook for temperature data
export const useTemperatureData = (refreshInterval = FIFTEEN_MINUTES) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackData = {
    zones: [
      { name: 'Frozen Storage A', temp: -18, status: 'normal', target: -18 },
      { name: 'Refrigerated Zone 1', temp: 4, status: 'normal', target: 4 }
    ]
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await fetchDataFromAPI('temperature/temperature-zones.json');
      setData(result.zones || fallbackData.zones);
      setError(null);
    } catch (err) {
      console.warn('Using fallback data:', err.message);
      setData(fallbackData.zones);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  return { data, loading, error, refresh: fetchData };
};