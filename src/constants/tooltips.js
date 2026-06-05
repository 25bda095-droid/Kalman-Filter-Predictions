// src/constants/tooltips.js
// Plain-English tooltip text for all simulator parameters

export const TOOLTIPS = {
  posX: 'Initial X position of the vehicle in metres. This is where the vehicle starts on the horizontal axis.',
  posY: 'Initial Y position of the vehicle in metres. This is where the vehicle starts on the vertical axis.',
  velX: 'Initial velocity in the X direction (metres per second). Positive = moving right.',
  velY: 'Initial velocity in the Y direction (metres per second). Positive = moving up.',
  dt: 'Time step in seconds — the interval between each simulation update. Smaller dt = more granular simulation, but more steps to compute.',
  duration: 'Total number of simulation steps to run. With dt=0.1s and 100 steps, the simulation covers 10 seconds of motion.',
  accX: 'Constant acceleration in the X direction (m/s²). Used for Acceleration and Braking scenarios. Set to 0 for constant-velocity motion.',
  accY: 'Constant acceleration in the Y direction (m/s²). Used for Acceleration and Braking scenarios. Set to 0 for constant-velocity motion.',
  measNoise: 'Standard deviation of GPS measurement noise in metres. Higher values = noisier, less reliable GPS readings. Real urban GPS is typically 3–10 m.',
  qPos: 'Process noise for position — how much we trust our motion model vs. measurements for position. Lower = trust the model more.',
  qVel: 'Process noise for velocity — how much uncertainty we assign to velocity in the model. Higher = the filter adapts velocity estimates faster.',
  adaptiveAlpha: 'Smoothing factor for Adaptive R (0–1). Values close to 1 = slow adaptation, values close to 0 = fast adaptation to recent innovations.',
  ellipseInterval: 'How often to draw a 95% confidence ellipse on the trajectory chart (in steps). Lower = more ellipses drawn.',
  outlierProb: 'Probability that any given GPS reading is a wild outlier (e.g., 0.05 = 5% chance per step). Higher = more GPS glitches injected.',
  outlierScale: 'How large outlier GPS spikes are, relative to normal noise. A scale of 8 means outlier readings are 8× noisier than normal.',
  seed: 'Random seed for reproducibility. Change this to get a different random noise pattern while keeping all other parameters the same.',
  adaptiveR: 'Enable Adaptive R to let the filter automatically adjust its measurement noise estimate over time based on observed innovations.',
  showEllipses: 'Toggle 95% confidence ellipses on the trajectory chart. Each ellipse shows where the filter is 95% confident the true position lies.',
};
