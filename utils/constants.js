// utils/constants.js
export const TEMPERATURE_ZONES = {
  FROZEN: {
    id: 'frozen',
    name: 'Frozen',
    targetTemp: -18,
    tolerance: 2,
    color: '#1976d2',
    icon: '❄️',
    docks: ['Dock 1', 'Dock 2', 'Dock 3'],
    slaTarget: 95,
  },
  FRESH: {
    id: 'fresh',
    name: 'Fresh/Produce',
    targetTemp: 2,
    tolerance: 1.5,
    color: '#2e7d32',
    icon: '🥬',
    docks: ['Dock 4', 'Dock 5', 'Dock 6'],
    slaTarget: 92,
  },
  DAIRY: {
    id: 'dairy',
    name: 'Dairy/Deli',
    targetTemp: 4,
    tolerance: 2,
    color: '#f57c00',
    icon: '🧀',
    docks: ['Dock 7', 'Dock 8'],
    slaTarget: 94,
  },
  DRY: {
    id: 'dry',
    name: 'Dry Goods',
    targetTemp: 21,
    tolerance: 3,
    color: '#757575',
    icon: '📦',
    docks: ['Dock 9', 'Dock 10', 'Dock 11', 'Dock 12'],
    slaTarget: 90,
  }
};