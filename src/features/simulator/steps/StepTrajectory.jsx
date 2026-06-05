// src/features/simulator/steps/StepTrajectory.jsx
import PlotlyChart from 'react-plotly.js';
const Plot = typeof PlotlyChart === 'object' && PlotlyChart.default ? PlotlyChart.default : PlotlyChart;
import { COLORS, PLOTLY_CONFIG } from '../../../constants/colors';
import { usePlotlyTheme } from '../../../hooks/usePlotlyTheme';
import { getPlotlyLayout } from '../../../utils/plotlyLayout';

export default function StepTrajectory({ results, params }) {
  if (!results) return null;

  const colors = usePlotlyTheme();
  const { trueX, trueY, measX, measY, cvX, cvY, caX, caY, isOutlier, cvPxx, cvPyy } = results;

  // Separate outlier and normal measurements
  const normalMeasX = measX.filter((_, i) => !isOutlier[i]);
  const normalMeasY = measY.filter((_, i) => !isOutlier[i]);
  const outlierMeasX = measX.filter((_, i) => isOutlier[i]);
  const outlierMeasY = measY.filter((_, i) => isOutlier[i]);

  const traces = [
    // True path
    {
      x: trueX, y: trueY,
      mode: 'lines',
      name: 'True Path',
      line: { color: COLORS.truePath, width: 2.5 },
    },
    // Normal measurements
    {
      x: normalMeasX, y: normalMeasY,
      mode: 'markers',
      name: 'GPS Measurements',
      marker: { color: COLORS.measurement, size: 5, opacity: 0.65 },
    },
    // Outlier measurements
    ...(outlierMeasX.length > 0 ? [{
      x: outlierMeasX, y: outlierMeasY,
      mode: 'markers',
      name: 'GPS Outliers',
      marker: { color: '#FF4D6D', size: 9, symbol: 'x', opacity: 0.9, line: { width: 2 } },
    }] : []),
    // CV filter
    {
      x: cvX, y: cvY,
      mode: 'lines',
      name: 'CV Filter',
      line: { color: COLORS.cvFilter, width: 2, dash: 'dash' },
    },
    // CA filter
    {
      x: caX, y: caY,
      mode: 'lines',
      name: 'CA Filter',
      line: { color: COLORS.caFilter, width: 2, dash: 'dot' },
    },
    // Start marker
    {
      x: [trueX[0]], y: [trueY[0]],
      mode: 'markers',
      name: 'Start',
      marker: { color: '#00FF88', size: 10, symbol: 'diamond' },
      showlegend: true,
    },
    // End marker
    {
      x: [trueX[trueX.length - 1]], y: [trueY[trueY.length - 1]],
      mode: 'markers',
      name: 'End',
      marker: { color: COLORS.gold, size: 10, symbol: 'star' },
      showlegend: true,
    },
  ];

  const baseLayout = getPlotlyLayout(colors);
  const layout = {
    ...baseLayout,
    title: { text: '2D Trajectory — True vs Filtered', font: { color: colors.textColor, size: 13 } },
    xaxis: { ...baseLayout.xaxis, type: 'linear', title: { text: 'X Position (m)', font: { color: colors.textColor } } },
    yaxis: { ...baseLayout.yaxis, type: 'linear', title: { text: 'Y Position (m)', font: { color: colors.textColor } }, scaleanchor: 'x' },
    height: 450,
  };

  return (
    <div>
      <div className="chart-container">
        <Plot
          key={colors.textColor}
          data={traces}
          layout={layout}
          config={PLOTLY_CONFIG}
          style={{ width: '100%' }}
          useResizeHandler
        />
      </div>

      <div className="card" style={{ marginTop: '1.25rem', borderLeft: '3px solid var(--clr-cyan)', background: 'var(--clr-cyan-dim)' }}>
        <p style={{ color: colors.textColor, lineHeight: 1.7, fontStyle: 'italic' }}>
          💡 The <strong style={{ color: COLORS.truePath }}>cyan line</strong> is where the car actually went.
          The <strong style={{ color: COLORS.measurement }}>red dots</strong> are what GPS reported — full of noise
          {params.outlierProb > 0 ? ' and outlier spikes' : ''}.
          The <strong style={{ color: COLORS.cvFilter }}>green dashed line</strong> (CV) and{' '}
          <strong style={{ color: COLORS.caFilter }}>purple dotted line</strong> (CA)
          are the filter estimates — the goal is to track cyan as closely as possible.
        </p>
      </div>

      {/* Color legend */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        {[
          { color: COLORS.truePath, label: 'True Path', style: 'solid' },
          { color: COLORS.measurement, label: 'GPS Measurements', style: 'dot' },
          { color: COLORS.cvFilter, label: 'CV Filter', style: 'dashed' },
          { color: COLORS.caFilter, label: 'CA Filter', style: 'dotted' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{
              width: '20px', height: '2.5px',
              background: item.color,
              borderRadius: '2px',
            }} />
            <span style={{ fontSize: '0.75rem', color: colors.textColor }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
