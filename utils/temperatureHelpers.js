// utils/temperatureHelpers.js
import { TEMPERATURE_ZONES } from './constants';

export const isTemperatureInRange = (temperature, zone) => {
  const zoneInfo = TEMPERATURE_ZONES[zone.toUpperCase()];
  if (!zoneInfo) return false;

  const { targetTemp, tolerance } = zoneInfo;
  const minTemp = targetTemp - tolerance;
  const maxTemp = targetTemp + tolerance;

  return temperature >= minTemp && temperature <= maxTemp;
};

export const getTemperatureStatus = (temperature, zone) => {
  const zoneInfo = TEMPERATURE_ZONES[zone.toUpperCase()];
  if (!zoneInfo) return 'unknown';

  const { targetTemp, tolerance } = zoneInfo;
  const minTemp = targetTemp - tolerance;
  const maxTemp = targetTemp + tolerance;

  if (temperature < minTemp - tolerance) return 'critical-low';
  if (temperature < minTemp) return 'warning-low';
  if (temperature > maxTemp + tolerance) return 'critical-high';
  if (temperature > maxTemp) return 'warning-high';
  return 'normal';
};

export const getTemperatureVariance = (temperature, zone) => {
  const zoneInfo = TEMPERATURE_ZONES[zone.toUpperCase()];
  if (!zoneInfo) return 0;

  return Math.abs(temperature - zoneInfo.targetTemp);
};

export const formatTemperature = (temperature, unit = 'C') => {
  const temp = Math.round(temperature * 10) / 10;
  return `${temp}°${unit}`;
};

export const calculateTemperatureTrend = (readings) => {
  if (readings.length < 2) return 'stable';

  const recent = readings.slice(-5); // Last 5 readings
  let rising = 0;
  let falling = 0;

  for (let i = 1; i < recent.length; i++) {
    if (recent[i].temperature > recent[i - 1].temperature) rising++;
    else if (recent[i].temperature < recent[i - 1].temperature) falling++;
  }

  if (rising > falling) return 'rising';
  if (falling > rising) return 'falling';
  return 'stable';
};

export const getTemperatureColor = (status) => {
  switch (status) {
    case 'normal': return '#4caf50';
    case 'warning-low':
    case 'warning-high': return '#ff9800';
    case 'critical-low':
    case 'critical-high': return '#f44336';
    default: return '#757575';
  }
};

export const generateTemperatureAlert = (temperature, zone, zoneInfo) => {
  const status = getTemperatureStatus(temperature, zone);
  
  if (status === 'normal') return null;

  const variance = getTemperatureVariance(temperature, zone);
  const isCritical = status.includes('critical');
  const isHigh = status.includes('high');

  return {
    type: 'temperature',
    severity: isCritical ? 'critical' : 'high',
    title: `Temperature ${isHigh ? 'High' : 'Low'} - ${zoneInfo.name}`,
    message: `Temperature ${formatTemperature(temperature)} is ${variance.toFixed(1)}° ${isHigh ? 'above' : 'below'} target range`,
    zone: zone.toLowerCase(),
    zoneName: zoneInfo.name,
    currentTemp: temperature,
    targetTemp: zoneInfo.targetTemp,
    variance: variance,
    timestamp: new Date().toISOString()
  };
};

export const getZoneTemperatureHistory = (temperatureData, zone, hours = 24) => {
  const zoneData = temperatureData.find(data => data.zone === zone);
  if (!zoneData || !zoneData.history) return [];

  const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
  return zoneData.history.filter(reading => new Date(reading.time) >= cutoffTime);
};

export const calculateAverageTemperature = (readings) => {
  if (!readings || readings.length === 0) return 0;
  
  const sum = readings.reduce((acc, reading) => acc + reading.temperature, 0);
  return Math.round((sum / readings.length) * 10) / 10;
};

export const getTemperatureAlerts = (temperatureData) => {
  const alerts = [];

  temperatureData.forEach(zoneData => {
    const zoneInfo = Object.values(TEMPERATURE_ZONES).find(z => z.id === zoneData.zone);
    if (!zoneInfo) return;

    const alert = generateTemperatureAlert(zoneData.currentTemp, zoneData.zone, zoneInfo);
    if (alert) {
      alerts.push({
        ...alert,
        id: `temp-${zoneData.zone}-${Date.now()}`,
        time: new Date().toISOString()
      });
    }
  });

  return alerts;
};