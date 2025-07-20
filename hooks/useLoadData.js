// hooks/useLoadData.js
import { useState, useEffect } from 'react';
import { formatDateKey } from '../utils/dateHelpers';

export const useLoadData = (date = null, filters = {}) => {
  const [loadsData, setLoadsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLoadsData = async () => {
    try {
      const params = new URLSearchParams();
      if (date) params.append('date', formatDateKey(date));
      if (filters.status) params.append('status', filters.status);
      if (filters.zone) params.append('zone', filters.zone);

      const response = await fetch(`/api/loads?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setLoadsData(result.data);
        setError(null);
      } else {
        throw new Error(result.error || 'Failed to fetch loads data');
      }
    } catch (err) {
      setError(err.message);
      console.error('Loads data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoadsData();
  }, [date, filters.status, filters.zone]);

  const createLoad = async (loadData) => {
    try {
      const response = await fetch('/api/loads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loadData),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh data after creating
        fetchLoadsData();
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to create load');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateLoad = async (loadId, updateData) => {
    try {
      const response = await fetch('/api/loads', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: loadId, ...updateData }),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh data after updating
        fetchLoadsData();
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to update load');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Helper functions
  const getLoadsByDate = (targetDate) => {
    const dateKey = formatDateKey(targetDate);
    return loadsData[dateKey] || [];
  };

  const getLoadById = (loadId) => {
    for (const dateLoads of Object.values(loadsData)) {
      const load = dateLoads.find(l => l.id === loadId);
      if (load) return load;
    }
    return null;
  };

  const getActiveLoads = () => {
    const activeStatuses = ['arriving', 'in-progress'];
    const allLoads = Object.values(loadsData).flat();
    return allLoads.filter(load => activeStatuses.includes(load.status));
  };

  const getLoadsByZone = (zone) => {
    const allLoads = Object.values(loadsData).flat();
    return allLoads.filter(load => load.tempZone === zone);
  };

  return {
    loadsData,
    loading,
    error,
    refetch: fetchLoadsData,
    createLoad,
    updateLoad,
    getLoadsByDate,
    getLoadById,
    getActiveLoads,
    getLoadsByZone
  };
};