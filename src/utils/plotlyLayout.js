// src/utils/plotlyLayout.js
// Builds a Plotly layout object from the reactive color tokens returned by usePlotlyTheme().
// Pass chart-specific overrides as the second argument — they are deep-merged on top.

export function getPlotlyLayout(colors, overrides = {}) {
  return {
    paper_bgcolor: colors.paperColor,
    plot_bgcolor:  colors.plotColor,
    font: {
      color:  colors.textColor,
      family: "'Space Grotesk', 'JetBrains Mono', monospace",
      size:   11,
    },
    xaxis: {
      color:         colors.textColor,
      gridcolor:     colors.gridColor,
      linecolor:     colors.gridColor,
      tickcolor:     colors.gridColor,
      tickfont:      { color: colors.textColor },
      title:         { font: { color: colors.textColor } },
      zerolinecolor: colors.mutedColor,
    },
    yaxis: {
      color:         colors.textColor,
      gridcolor:     colors.gridColor,
      linecolor:     colors.gridColor,
      tickcolor:     colors.gridColor,
      tickfont:      { color: colors.textColor },
      title:         { font: { color: colors.textColor } },
      zerolinecolor: colors.mutedColor,
    },
    legend: {
      font:        { color: colors.textColor, size: 10 },
      bgcolor:     colors.legendBg,
      bordercolor: colors.gridColor,
      borderwidth: 1,
    },
    margin: { t: 40, r: 20, b: 50, l: 55 },
    ...overrides,
  };
}
