// src/utils/scenarios.js
// Scenario configuration objects for the simulator

export const SCENARIOS = {
  cruising: {
    key: 'cruising',
    name: 'Cruising',
    emoji: '🛳️',
    desc: 'Constant velocity — the CV filter shines here.',
    longDesc: 'The vehicle moves at steady speed with no acceleration. The CV (Constant Velocity) filter is perfectly matched to this motion model and should significantly outperform CA.',
    defaults: { initVel: [5, 2], accX: 0, accY: 0, measNoise: 5, outlierProb: 0.02 },
  },
  acceleration: {
    key: 'acceleration',
    name: 'Acceleration',
    emoji: '🚀',
    desc: 'Steadily increasing speed — CA handles this better.',
    longDesc: 'The vehicle steadily accelerates over time. The CA (Constant Acceleration) filter is designed for this and should track the true path more accurately.',
    defaults: { initVel: [2, 1], accX: 1.5, accY: 0.5, measNoise: 5, outlierProb: 0.02 },
  },
  braking: {
    key: 'braking',
    name: 'Sudden Braking',
    emoji: '🛑',
    desc: 'Hard deceleration — tests filter response to rapid velocity change.',
    longDesc: 'The vehicle brakes hard from high speed to a stop. This tests how quickly each filter adapts to a sudden change in motion dynamics.',
    defaults: { initVel: [10, 0], accX: -2, accY: 0, measNoise: 5, outlierProb: 0.02 },
  },
  circular: {
    key: 'circular',
    name: 'Circular Turn',
    emoji: '🔄',
    desc: 'Circular arc motion — centripetal acceleration challenges CV.',
    longDesc: 'The vehicle follows a circular arc. The centripetal acceleration is constantly changing direction, which neither CV nor CA handles perfectly — but CA does better.',
    defaults: { initVel: [5, 0], accX: 0, accY: 0, measNoise: 5, outlierProb: 0.02 },
  },
  glitchy_gps: {
    key: 'glitchy_gps',
    name: 'Glitchy GPS',
    emoji: '📡',
    desc: 'GPS outliers injected — tests Mahalanobis rejection.',
    longDesc: 'Random GPS outliers are injected into the measurement stream. This tests the filter\'s robustness and, with Adaptive R enabled, its ability to automatically down-weight bad measurements.',
    defaults: { initVel: [5, 2], accX: 0, accY: 0, measNoise: 8, outlierProb: 0.1, outlierScale: 8 },
  },
};

export const SCENARIO_LIST = Object.values(SCENARIOS);

export const DEFAULT_SCENARIO_KEY = 'cruising';
