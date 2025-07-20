// hooks/useTemperatureData.js
import { useState, useEffect } from 'react';
import { TEMPERATURE_UPDATE_INTERVAL } from '../utils/constants';

export const useTemperatureData = (zone = null) => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTemperatureData = async () => {
    try {
      const params = new URLSearchParams();
      if (zone) params.append('zone', zone);
      params.append('hours', '24');

      const response = await fetch(`/api/temperature?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setTemperatureData(result.data);
        setError(null);
      } else {
        throw new Error(result.error || 'Failed to fetch temperature data');
      }
    } catch (err) {
      setError(err.message);
      console.error('Temperature data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemperatureData();

    // Set up interval for real-time updates
    const interval = setInterval(fetchTemperatureData, TEMPERATURE_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [zone]);

  const recordTemperature = async (zoneId, temperature) => {
    try {
      const response = await fetch('/api/temperature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zone: zoneId,
          temperature,
          timestamp: new Date().toISOString()
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh data after recording
        fetchTemperatureData();
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to record temperature');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    temperatureData,
    loading,
    error,
    refetch: fetchTemperatureData,
    recordTemperature
  };
};