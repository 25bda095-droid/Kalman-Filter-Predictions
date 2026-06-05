// src/features/simulator/steps/StepStateEst.jsx
import PlotlyChart from 'react-plotly.js';
const Plot = typeof PlotlyChart === 'object' && PlotlyChart.default ? PlotlyChart.default : PlotlyChart;
import { COLORS, PLOTLY_CONFIG } from '../../../constants/colors';
import { usePlotlyTheme } from '../../../hooks/usePlotlyTheme';
import { getPlotlyLayout } from '../../../utils/plotlyLayout';

function StateChart({ title, yLabel, time, datasets, colors }) {
  const baseLayout = getPlotlyLayout(colors);
  return (
    <div className="chart-container">
      <Plot
        key={colors.textColor}
        data={datasets.map(ds => ({
          x: time,
          y: ds.data,
          mode: 'lines',
          name: ds.name,
          line: { color: ds.color, width: ds.width || 2, dash: ds.dash },
        }))}
        layout={{
          ...baseLayout,
          title: { text: title, font: { color: colors.textColor, size: 11 } },
          xaxis: { ...baseLayout.xaxis, type: 'linear', title: { text: 'Time (s)', font: { color: colors.textColor, size: 9 } } },
          yaxis: { ...baseLayout.yaxis, type: 'linear', title: { text: yLabel, font: { color: colors.textColor, size: 9 } } },
          height: 240,
          margin: { t: 35, r: 15, b: 45, l: 55 },
          legend: { ...baseLayout.legend, orientation: 'h', y: -0.25, x: 0 },
          showlegend: true,
        }}
        config={{ ...PLOTLY_CONFIG, displayModeBar: false }}
        style={{ width: '100%' }}
        useResizeHandler
      />
    </div>
  );
}

export default function StepStateEst({ results }) {
  if (!results) return null;

  const colors = usePlotlyTheme();
  const { time, trueX, trueY, trueVx, trueVy, measX, measY, cvX, cvY, cvVx, cvVy, caX, caY, caVx, caVy } = results;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
        <StateChart
          title="X Position"
          yLabel="X (m)"
          time={time}
          colors={colors}
          datasets={[
            { name: 'True', data: trueX, color: COLORS.truePath, width: 2.5 },
            { name: 'GPS', data: measX, color: COLORS.measurement, width: 1, dash: 'dot' },
            { name: 'CV', data: cvX, color: COLORS.cvFilter, dash: 'dash' },
            { name: 'CA', data: caX, color: COLORS.caFilter, dash: 'dot' },
          ]}
        />
        <StateChart
          title="Y Position"
          yLabel="Y (m)"
          time={time}
          colors={colors}
          datasets={[
            { name: 'True', data: trueY, color: COLORS.truePath, width: 2.5 },
            { name: 'GPS', data: measY, color: COLORS.measurement, width: 1, dash: 'dot' },
            { name: 'CV', data: cvY, color: COLORS.cvFilter, dash: 'dash' },
            { name: 'CA', data: caY, color: COLORS.caFilter, dash: 'dot' },
          ]}
        />
        <StateChart
          title="X Velocity"
          yLabel="Vx (m/s)"
          time={time}
          colors={colors}
          datasets={[
            { name: 'True', data: trueVx, color: COLORS.truePath, width: 2.5 },
            { name: 'CV', data: cvVx, color: COLORS.cvFilter, dash: 'dash' },
            { name: 'CA', data: caVx, color: COLORS.caFilter, dash: 'dot' },
          ]}
        />
        <StateChart
          title="Y Velocity"
          yLabel="Vy (m/s)"
          time={time}
          colors={colors}
          datasets={[
            { name: 'True', data: trueVy, color: COLORS.truePath, width: 2.5 },
            { name: 'CV', data: cvVy, color: COLORS.cvFilter, dash: 'dash' },
            { name: 'CA', data: caVy, color: COLORS.caFilter, dash: 'dot' },
          ]}
        />
      </div>

      <div className="card" style={{ borderLeft: '3px solid var(--clr-violet)', background: 'var(--clr-violet-dim)' }}>
        <p style={{ color: colors.textColor, lineHeight: 1.7, fontStyle: 'italic' }}>
          💡 Notice how <strong>velocity is never directly measured</strong> — we only give the filter position GPS readings.
          Yet the filter correctly infers how fast the vehicle is moving. This is the beauty of state estimation:
          the filter knows more than the sensor can see.
        </p>
      </div>
    </div>
  );
}
