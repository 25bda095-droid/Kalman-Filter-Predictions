// src/constants/colors.js
// Design token hex values for use in Plotly charts and JS logic

export const COLORS = {
  bg:          '#070B14',
  surface:     '#0F1525',
  surface2:    '#161E30',
  border:      'rgba(255,255,255,0.07)',

  // Accents
  cyan:        '#00C8FF',
  violet:      '#9B5DE5',
  green:       '#52B788',
  gold:        '#FFB703',
  red:         '#FF4D6D',

  // Text
  text:        '#E2E8F0',
  textMuted:   '#7A8BA8',
  textBright:  '#FFFFFF',

  // Transparent variants
  cyanDim:     'rgba(0,200,255,0.15)',
  violetDim:   'rgba(155,93,229,0.15)',
  greenDim:    'rgba(82,183,136,0.15)',
  goldDim:     'rgba(255,183,3,0.15)',
  redDim:      'rgba(255,77,109,0.15)',

  // Chart-specific
  truePath:    '#00C8FF',   // cyan - ground truth
  measurement: '#FF4D6D',   // red  - noisy GPS
  cvFilter:    '#52B788',   // green - CV filter
  caFilter:    '#9B5DE5',   // violet - CA filter
  threshold:   '#FFB703',   // gold - NIS threshold
};

// Plotly layout defaults
export function getPlotlyLayout() {
  const isLight = typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'light';
  const textColor = isLight ? '#000000' : '#FFFFFF';
  const mutedColor = isLight ? '#5A6882' : '#7A8BA8';
  const gridColor = isLight ? 'rgba(0,0,0,0.14)' : 'rgba(255,255,255,0.12)';
  const legendBg = isLight ? 'rgba(232, 238, 248, 0.8)' : 'rgba(15,21,37,0.8)';
  return {
  paper_bgcolor: 'transparent',
  plot_bgcolor:  'transparent',
  font: {
    color: textColor,
    family: "'JetBrains Mono', monospace",
    size:   11,
  },
  margin: { t: 40, r: 20, b: 50, l: 55 },
  xaxis: {
    
    gridcolor: gridColor,
    linecolor: gridColor,
    tickcolor: gridColor,
    zerolinecolor: mutedColor,
  },
  yaxis: {
    
    gridcolor: gridColor,
    linecolor: gridColor,
    tickcolor: gridColor,
    zerolinecolor: mutedColor,
  },
  legend: {
    bgcolor: legendBg,
    bordercolor: gridColor,
    borderwidth: 1,
    font: { size: 10 },
  },
};
}

export function getTextColor() { return typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'light' ? '#000000' : '#FFFFFF'; }
export function getMutedColor() { return typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'light' ? '#5A6882' : '#7A8BA8'; }

export const PLOTLY_CONFIG = {
  displayModeBar: true,
  modeBarButtonsToRemove: ['toImage', 'sendDataToCloud', 'select2d', 'lasso2d'],
  displaylogo: false,
  responsive: true,
};
