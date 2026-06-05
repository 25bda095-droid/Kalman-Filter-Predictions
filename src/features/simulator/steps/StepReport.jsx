// src/features/simulator/steps/StepReport.jsx
import PlotlyChart from 'react-plotly.js';
const Plot = typeof PlotlyChart === 'object' && PlotlyChart.default ? PlotlyChart.default : PlotlyChart;
import { Download, BarChart2 } from 'lucide-react';
import { COLORS, PLOTLY_CONFIG } from '../../../constants/colors';
import { usePlotlyTheme } from '../../../hooks/usePlotlyTheme';
import { getPlotlyLayout } from '../../../utils/plotlyLayout';
import { downloadCSV } from '../../../utils/metrics';
import { useCountUp } from '../../../hooks/useCountUp';

function StatRow({ label, cv, ca, unit, textColor }) {
  const cvV = parseFloat(cv);
  const caV = parseFloat(ca);
  const cvWins = cvV <= caV;
  return (
    <tr>
      <td style={{ padding: '0.5rem 0.75rem', color: textColor, fontSize: '0.8125rem' }}>{label}</td>
      <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'var(--font-mono)', color: cvWins ? COLORS.cvFilter : COLORS.measurement, textAlign: 'right', fontWeight: cvWins ? 700 : 400 }}>
        {cv} {unit}
        {cvWins && <span style={{ marginLeft: '0.25rem', fontSize: '0.7rem' }}>✓</span>}
      </td>
      <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'var(--font-mono)', color: !cvWins ? COLORS.caFilter : COLORS.text, textAlign: 'right', fontWeight: !cvWins ? 700 : 400 }}>
        {ca} {unit}
        {!cvWins && <span style={{ marginLeft: '0.25rem', fontSize: '0.7rem' }}>✓</span>}
      </td>
    </tr>
  );
}

export default function StepReport({ results, metrics, params, onDashboard }) {
  if (!results || !metrics) return null;

  const colors = usePlotlyTheme();
  const cv = metrics.cv;
  const ca = metrics.ca;

  const cvPosRMSE = useCountUp(cv.posRMSE, 1000, 3);
  const caPosRMSE = useCountUp(ca.posRMSE, 1000, 3);

  const barData = [
    {
      name: 'CV Filter',
      x: ['Position RMSE', 'Velocity RMSE'],
      y: [cv.posRMSE, cv.velRMSE],
      type: 'bar',
      marker: { color: COLORS.cvFilter, opacity: 0.85 },
    },
    {
      name: 'CA Filter',
      x: ['Position RMSE', 'Velocity RMSE'],
      y: [ca.posRMSE, ca.velRMSE],
      type: 'bar',
      marker: { color: COLORS.caFilter, opacity: 0.85 },
    },
  ];

  return (
    <div>
      <div className="chart-container" style={{ marginBottom: '1.5rem' }}>
        <Plot
          key={colors.textColor}
          data={barData}
          layout={{
            ...getPlotlyLayout(colors),
            title: { text: 'RMSE Comparison — CV vs CA', font: { color: colors.textColor, size: 13 } },
            yaxis: { ...getPlotlyLayout(colors).yaxis, title: { text: 'RMSE', font: { color: colors.textColor } } },
            height: 280,
          }}
          config={{ ...PLOTLY_CONFIG, displayModeBar: false }}
          style={{ width: '100%' }}
          useResizeHandler
        />
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="stat-card" style={{ borderLeftColor: COLORS.cvFilter }}>
          <div className="stat-value" style={{ color: COLORS.cvFilter }}>{cvPosRMSE.toFixed(3)}</div>
          <div className="stat-label">CV Position RMSE (m)</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: COLORS.caFilter }}>
          <div className="stat-value" style={{ color: COLORS.caFilter }}>{caPosRMSE.toFixed(3)}</div>
          <div className="stat-label">CA Position RMSE (m)</div>
        </div>
      </div>

      {/* Full stats table */}
      <div style={{
        background: 'var(--clr-surface)',
        border: '1px solid var(--clr-border)',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '1.5rem',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--clr-surface-2)', borderBottom: '1px solid var(--clr-border)' }}>
              <th style={{ padding: '0.625rem 0.75rem', textAlign: 'left', fontSize: '0.75rem', color: colors.textColor, fontWeight: 600 }}>Metric</th>
              <th style={{ padding: '0.625rem 0.75rem', textAlign: 'right', fontSize: '0.75rem', color: COLORS.cvFilter, fontWeight: 700 }}>CV Filter</th>
              <th style={{ padding: '0.625rem 0.75rem', textAlign: 'right', fontSize: '0.75rem', color: COLORS.caFilter, fontWeight: 700 }}>CA Filter</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '0.8125rem' }}>
            <StatRow label="Position RMSE" cv={metrics.cv.posRMSE.toFixed(4)} ca={metrics.ca.posRMSE.toFixed(4)} unit="m" textColor={colors.textColor} />
            <StatRow label="Velocity RMSE" cv={metrics.cv.velRMSE.toFixed(4)} ca={metrics.ca.velRMSE.toFixed(4)} unit="m/s" textColor={colors.textColor} />
            <StatRow label="X Position RMSE" cv={metrics.cv.xRMSE.toFixed(4)} ca={metrics.ca.xRMSE.toFixed(4)} unit="m" textColor={colors.textColor} />
            <StatRow label="Y Position RMSE" cv={metrics.cv.yRMSE.toFixed(4)} ca={metrics.ca.yRMSE.toFixed(4)} unit="m" textColor={colors.textColor} />
            <StatRow label="NIS Mean" cv={metrics.cv.nisStats.mean.toFixed(3)} ca={metrics.ca.nisStats.mean.toFixed(3)} unit="" textColor={colors.textColor} />
            <StatRow label="NIS % Below Threshold" cv={metrics.cv.nisStats.percentBelow.toFixed(1)} ca={metrics.ca.nisStats.percentBelow.toFixed(1)} unit="%" textColor={colors.textColor} />
          </tbody>
        </table>
      </div>

      <div className="card" style={{ borderLeft: '3px solid var(--clr-green)', background: 'var(--clr-green-dim)', marginBottom: '1.5rem' }}>
        <p style={{ color: colors.textColor, lineHeight: 1.7, fontStyle: 'italic' }}>
          💡 <strong>RMSE</strong> (Root Mean Square Error) measures how far off the filter was on average.
          Lower is better. The winner for this scenario is the <strong style={{ color: metrics.winner === 'cv' ? COLORS.cvFilter : COLORS.caFilter }}>
            {metrics.winner === 'cv' ? 'CV' : 'CA'} filter
          </strong> with a position RMSE of <strong style={{ fontFamily: 'var(--font-mono)' }}>
            {Math.min(metrics.cv.posRMSE, metrics.ca.posRMSE).toFixed(3)} m
          </strong>.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => downloadCSV(results, params)}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Download size={15} /> Download CSV
        </button>
        <button
          onClick={onDashboard}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <BarChart2 size={15} /> See Full Dashboard →
        </button>
      </div>
    </div>
  );
}
