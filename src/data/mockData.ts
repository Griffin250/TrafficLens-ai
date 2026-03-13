export const trafficStats = {
  totalVehicles: 143,
  leftTurns: 41,
  rightTurns: 37,
  straight: 65,
  density: 'High',
  avgSpeed: 34.2,
  peakHour: '08:00 - 09:00',
  processingTime: '12.4s',
};

export const timeSeriesData = [
  { time: '06:00', vehicles: 18, left: 4, right: 3, straight: 11 },
  { time: '07:00', vehicles: 42, left: 10, right: 8, straight: 24 },
  { time: '08:00', vehicles: 78, left: 22, right: 18, straight: 38 },
  { time: '09:00', vehicles: 95, left: 28, right: 24, straight: 43 },
  { time: '10:00', vehicles: 62, left: 16, right: 14, straight: 32 },
  { time: '11:00', vehicles: 55, left: 14, right: 12, straight: 29 },
  { time: '12:00', vehicles: 71, left: 19, right: 17, straight: 35 },
  { time: '13:00', vehicles: 68, left: 18, right: 15, straight: 35 },
  { time: '14:00', vehicles: 84, left: 24, right: 20, straight: 40 },
  { time: '15:00', vehicles: 91, left: 26, right: 22, straight: 43 },
  { time: '16:00', vehicles: 105, left: 30, right: 25, straight: 50 },
  { time: '17:00', vehicles: 118, left: 34, right: 29, straight: 55 },
  { time: '18:00', vehicles: 98, left: 27, right: 23, straight: 48 },
  { time: '19:00', vehicles: 64, left: 17, right: 14, straight: 33 },
  { time: '20:00', vehicles: 38, left: 9, right: 8, straight: 21 },
];

export const movementDistribution = [
  { name: 'Straight', value: 65, fill: 'hsl(230, 89%, 67%)' },
  { name: 'Left Turn', value: 41, fill: 'hsl(160, 84%, 39%)' },
  { name: 'Right Turn', value: 37, fill: 'hsl(24, 94%, 50%)' },
];

export const vehicleTypes = [
  { type: 'Car', count: 89, percentage: 62 },
  { type: 'Truck', count: 24, percentage: 17 },
  { type: 'Bus', count: 12, percentage: 8 },
  { type: 'Motorcycle', count: 11, percentage: 8 },
  { type: 'Bicycle', count: 7, percentage: 5 },
];

export const densityData = [
  { time: '06:00', density: 12 },
  { time: '08:00', density: 78 },
  { time: '10:00', density: 45 },
  { time: '12:00', density: 56 },
  { time: '14:00', density: 67 },
  { time: '16:00', density: 89 },
  { time: '18:00', density: 72 },
  { time: '20:00', density: 28 },
];
