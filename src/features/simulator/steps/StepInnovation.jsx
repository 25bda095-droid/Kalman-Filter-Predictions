// src/features/simulator/steps/StepInnovation.jsx
import PlotlyChart from 'react-plotly.js';
const Plot = typeof PlotlyChart === 'object' && PlotlyChart.default ? PlotlyChart.default : PlotlyChart;
import { COLORS, PLOTLY_CONFIG } from '../../../constants/colors';
import { usePlotlyTheme } from '../../../hooks/usePlotlyTheme';
import { getPlotlyLayout } from '../../../utils/plotlyLayout';

const NIS_THRESHOLD = 5.991; // chi-squared 95%, 2 DOF

export default function StepInnovation({ results, params }) {
  if (!results) return null;

  const colors = usePlotlyTheme();
  const { time, cvNIS, caNIS, cvInnovX, cvInnovY, caInnovX, caInnovY } = results;

  const thresholdLine = Array(time.length).fill(NIS_THRESHOLD);

  const nisData = [
    { x: time, y: cvNIS, mode: 'lines', name: 'CV NIS', line: { color: COLORS.cvFilter, width: 1.5 } },
    { x: time, y: caNIS, mode: 'lines', name: 'CA NIS', line: { color: COLORS.caFilter, width: 1.5 } },
    { x: time, y: thresholdLine, mode: 'lines', name: '95% Threshold (5.99)', line: { color: COLORS.gold, width: 2, dash: 'dash' } },
  ];

  const innovData = [
    { x: time, y: cvInnovX, mode: 'lines', name: 'CV ν_x', line: { color: COLORS.cvFilter, width: 1.5 } },
    { x: time, y: cvInnovY, mode: 'lines', name: 'CV ν_y', line: { color: COLORS.cvFilter, width: 1.5, dash: 'dash' } },
    { x: time, y: caInnovX, mode: 'lines', name: 'CA ν_x', line: { color: COLORS.caFilter, width: 1.5 } },
    { x: time, y: caInnovY, mode: 'lines', name: 'CA ν_y', line: { color: COLORS.caFilter, width: 1.5, dash: 'dash' } },
  ];

  const baseLayout = getPlotlyLayout(colors);
  const sharedLayout = {
    ...baseLayout,
    height: 280,
    margin: { t: 40, r: 20, b: 50, l: 55 },
    legend: { ...baseLayout.legend, orientation: 'h', y: -0.3, x: 0 },
  };

  return (
    <div>
      {/* NIS Chart */}
      <div className="chart-container" style={{ marginBottom: '1.25rem' }}>
        <Plot
          key={colors.textColor + '-nis'}
          data={nisData}
          layout={{
            ...sharedLayout,
            title: { text: 'Normalized Innovation Squared (NIS) vs 95% Threshold', font: { color: colors.textColor, size: 12 } },
            xaxis: { ...sharedLayout.xaxis, type: 'linear', title: { text: 'Time (s)', font: { color: colors.textColor, size: 10 } } },
            yaxis: { ...sharedLayout.yaxis, type: 'linear', title: { text: 'NIS', font: { color: colors.textColor, size: 10 } } },
          }}
          config={PLOTLY_CONFIG}
          style={{ width: '100%' }}
          useResizeHandler
        />
      </div>

      {/* Innovation Residuals Chart */}
      <div className="chart-container" style={{ marginBottom: '1.25rem' }}>
        <Plot
          key={colors.textColor + '-innov'}
          data={innovData}
          layout={{
            ...sharedLayout,
            title: { text: 'Innovation Residuals (ν = z - Hx̂⁻)', font: { color: colors.textColor, size: 12 } },
            xaxis: { ...sharedLayout.xaxis, type: 'linear', title: { text: 'Time (s)', font: { color: colors.textColor, size: 10 } } },
            yaxis: { ...sharedLayout.yaxis, type: 'linear', title: { text: 'Innovation (m)', font: { color: colors.textColor, size: 10 } } },
          }}
          config={PLOTLY_CONFIG}
          style={{ width: '100%' }}
          useResizeHandler
        />
      </div>

      <div className="card" style={{ borderLeft: '3px solid var(--clr-gold)', background: 'var(--clr-gold-dim)' }}>
        <p style={{ color: colors.textColor, lineHeight: 1.7, fontStyle: 'italic' }}>
          💡 <strong>NIS</strong> (Normalized Innovation Squared) is a statistical health check.
          If the filter is well-calibrated, <strong>95% of NIS values should stay BELOW the gold threshold line (≈5.99)</strong>.
          Values consistently above it mean the filter is over-confident; values all below mean it's under-confident.
          This is how engineers validate Kalman filters in production autonomous systems.
        </p>
      </div>
    </div>
  );
}
