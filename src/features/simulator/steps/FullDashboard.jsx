// src/features/simulator/steps/FullDashboard.jsx
import { useState } from 'react';
import PlotlyChart from 'react-plotly.js';
const Plot = typeof PlotlyChart === 'object' && PlotlyChart.default ? PlotlyChart.default : PlotlyChart;
import { Download, ArrowLeft, RefreshCw, FileText } from 'lucide-react';
import { COLORS, PLOTLY_CONFIG } from '../../../constants/colors';
import { usePlotlyTheme } from '../../../hooks/usePlotlyTheme';
import { getPlotlyLayout } from '../../../utils/plotlyLayout';
import { downloadCSV } from '../../../utils/metrics';
import { downloadDashboardPDF } from '../../../utils/downloadDashboardPDF';

const NIS_THRESHOLD = 5.991;

function DashboardChart({ id, title, data, height = 280, yLabel, colors }) {
  const baseLayout = getPlotlyLayout(colors);
  return (
    <div id={id} className="chart-container">
      <Plot
        key={colors.textColor + title}
        data={data}
        layout={{
          ...baseLayout,
          title: { text: title, font: { color: colors.textColor, size: 12 } },
          xaxis: { ...baseLayout.xaxis },
          yaxis: { ...baseLayout.yaxis, title: { text: yLabel, font: { color: colors.textColor, size: 10 } } },
          height,
          margin: { t: 40, r: 15, b: 40, l: 50 },
          legend: { ...baseLayout.legend, orientation: 'h', y: -0.25, x: 0 },
        }}
        config={{ ...PLOTLY_CONFIG, displayModeBar: false }}
        style={{ width: '100%' }}
        useResizeHandler
      />
    </div>
  );
}

export default function FullDashboard({ results, metrics, params, onNewSimulation, onBackToWalkthrough }) {
  if (!results || !metrics) return null;

  const colors = usePlotlyTheme();
  const [isGenerating, setIsGenerating] = useState(false);

  const { time, trueX, trueY, measX, measY, cvX, cvY, caX, caY,
    trueVx, trueVy, cvVx, cvVy, caVx, caVy, cvNIS, caNIS, isOutlier } = results;

  const th = Array(time.length).fill(NIS_THRESHOLD);
  const normalMeasX  = measX.filter((_, i) => !isOutlier?.[i]);
  const normalMeasY  = measY.filter((_, i) => !isOutlier?.[i]);
  const outlierMeasX = measX.filter((_, i) =>  isOutlier?.[i]);
  const outlierMeasY = measY.filter((_, i) =>  isOutlier?.[i]);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await downloadDashboardPDF(params, metrics);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', color: colors.textColor, marginBottom: '0.25rem' }}>Full Dashboard</h2>
          <p style={{ color: colors.textColor, fontSize: '0.875rem' }}>
            Winner: <strong style={{ color: metrics.winner === 'cv' ? COLORS.cvFilter : COLORS.caFilter }}>
              {metrics.winner.toUpperCase()} Filter
            </strong> — Position RMSE: <span style={{ fontFamily: 'var(--font-mono)' }}>
              {Math.min(metrics.cv.posRMSE, metrics.ca.posRMSE).toFixed(3)}m
            </span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={onBackToWalkthrough} className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowLeft size={14} /> Walkthrough
          </button>
          <button onClick={() => downloadCSV(results, params)} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Download size={14} /> CSV
          </button>

          {/* ── PDF Download button ── */}
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.375rem 1rem',
              borderRadius: '8px',
              border: '1px solid rgba(0,200,255,0.3)',
              background: isGenerating
                ? 'rgba(0,200,255,0.05)'
                : 'rgba(0,200,255,0.1)',
              color: 'var(--clr-cyan)',
              cursor: isGenerating ? 'wait' : 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              transition: 'all 0.2s',
              minHeight: '36px',
            }}
          >
            <FileText size={14} />
            {isGenerating ? '⏳ Generating…' : '📄 PDF Report'}
          </button>

          <button onClick={onNewSimulation} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <RefreshCw size={14} /> New Simulation
          </button>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.875rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'CV Pos RMSE', value: metrics.cv.posRMSE.toFixed(3), unit: 'm',   color: COLORS.cvFilter },
          { label: 'CA Pos RMSE', value: metrics.ca.posRMSE.toFixed(3), unit: 'm',   color: COLORS.caFilter },
          { label: 'CV Vel RMSE', value: metrics.cv.velRMSE.toFixed(3), unit: 'm/s', color: COLORS.cvFilter },
          { label: 'CA Vel RMSE', value: metrics.ca.velRMSE.toFixed(3), unit: 'm/s', color: COLORS.caFilter },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ borderLeftColor: s.color }}>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label} ({s.unit})</div>
          </div>
        ))}
      </div>

      {/* ── Charts grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

        {/* 2D Trajectory — full width */}
        <div style={{ gridColumn: '1 / -1' }}>
          <DashboardChart
            id="pdf-chart-trajectory"
            title="2D Trajectory"
            yLabel="Y (m)"
            height={340}
            colors={colors}
            data={[
              { x: trueX,       y: trueY,       mode: 'lines',   name: 'True',     line: { color: COLORS.truePath,    width: 2.5 } },
              { x: normalMeasX, y: normalMeasY, mode: 'markers', name: 'GPS',      marker: { color: COLORS.measurement, size: 4, opacity: 0.6 } },
              ...(outlierMeasX.length > 0 ? [{ x: outlierMeasX, y: outlierMeasY, mode: 'markers', name: 'Outliers', marker: { color: COLORS.measurement, size: 9, symbol: 'x', opacity: 0.9 } }] : []),
              { x: cvX,         y: cvY,         mode: 'lines',   name: 'CV',       line: { color: COLORS.cvFilter,    width: 2, dash: 'dash' } },
              { x: caX,         y: caY,         mode: 'lines',   name: 'CA',       line: { color: COLORS.caFilter,    width: 2, dash: 'dot'  } },
            ]}
          />
        </div>

        {/* X / Y Position */}
        <DashboardChart id="pdf-chart-xpos" title="X Position" yLabel="X (m)" colors={colors} data={[
          { x: time, y: trueX, mode: 'lines', name: 'True', line: { color: COLORS.truePath } },
          { x: time, y: measX, mode: 'lines', name: 'GPS',  line: { color: COLORS.measurement, width: 1, dash: 'dot' } },
          { x: time, y: cvX,   mode: 'lines', name: 'CV',   line: { color: COLORS.cvFilter, dash: 'dash' } },
          { x: time, y: caX,   mode: 'lines', name: 'CA',   line: { color: COLORS.caFilter, dash: 'dot'  } },
        ]} />
        <DashboardChart id="pdf-chart-ypos" title="Y Position" yLabel="Y (m)" colors={colors} data={[
          { x: time, y: trueY, mode: 'lines', name: 'True', line: { color: COLORS.truePath } },
          { x: time, y: measY, mode: 'lines', name: 'GPS',  line: { color: COLORS.measurement, width: 1, dash: 'dot' } },
          { x: time, y: cvY,   mode: 'lines', name: 'CV',   line: { color: COLORS.cvFilter, dash: 'dash' } },
          { x: time, y: caY,   mode: 'lines', name: 'CA',   line: { color: COLORS.caFilter, dash: 'dot'  } },
        ]} />

        {/* X / Y Velocity */}
        <DashboardChart id="pdf-chart-xvel" title="X Velocity" yLabel="Vx (m/s)" colors={colors} data={[
          { x: time, y: trueVx, mode: 'lines', name: 'True', line: { color: COLORS.truePath } },
          { x: time, y: cvVx,   mode: 'lines', name: 'CV',   line: { color: COLORS.cvFilter, dash: 'dash' } },
          { x: time, y: caVx,   mode: 'lines', name: 'CA',   line: { color: COLORS.caFilter, dash: 'dot'  } },
        ]} />
        <DashboardChart id="pdf-chart-yvel" title="Y Velocity" yLabel="Vy (m/s)" colors={colors} data={[
          { x: time, y: trueVy, mode: 'lines', name: 'True', line: { color: COLORS.truePath } },
          { x: time, y: cvVy,   mode: 'lines', name: 'CV',   line: { color: COLORS.cvFilter, dash: 'dash' } },
          { x: time, y: caVy,   mode: 'lines', name: 'CA',   line: { color: COLORS.caFilter, dash: 'dot'  } },
        ]} />

        {/* NIS — full width */}
        <div style={{ gridColumn: '1 / -1' }}>
          <DashboardChart
            id="pdf-chart-nis"
            title="NIS Over Time — 95% Threshold"
            yLabel="NIS"
            height={240}
            colors={colors}
            data={[
              { x: time, y: cvNIS, mode: 'lines', name: 'CV NIS',        line: { color: COLORS.cvFilter, width: 1.5 } },
              { x: time, y: caNIS, mode: 'lines', name: 'CA NIS',        line: { color: COLORS.caFilter, width: 1.5 } },
              { x: time, y: th,    mode: 'lines', name: '95% Threshold', line: { color: COLORS.gold,     width: 2, dash: 'dash' } },
            ]}
          />
        </div>

        {/* RMSE bar chart — full width */}
        <div id="pdf-chart-rmse" style={{ gridColumn: '1 / -1' }} className="chart-container">
          <Plot
            key={colors.textColor + 'rmse'}
            data={[
              {
                name: 'CV Filter',
                x: ['Position RMSE', 'Velocity RMSE'],
                y: [metrics.cv.posRMSE, metrics.cv.velRMSE],
                type: 'bar',
                marker: { color: COLORS.cvFilter, opacity: 0.85 },
              },
              {
                name: 'CA Filter',
                x: ['Position RMSE', 'Velocity RMSE'],
                y: [metrics.ca.posRMSE, metrics.ca.velRMSE],
                type: 'bar',
                marker: { color: COLORS.caFilter, opacity: 0.85 },
              },
            ]}
            layout={{
              ...getPlotlyLayout(colors),
              title: { text: 'RMSE Comparison — CV vs CA', font: { color: colors.textColor, size: 12 } },
              yaxis: { ...getPlotlyLayout(colors).yaxis, title: { text: 'RMSE (m or m/s)', font: { color: colors.textColor, size: 10 } } },
              height: 260,
              margin: { t: 40, r: 15, b: 40, l: 50 },
              legend: { ...getPlotlyLayout(colors).legend, orientation: 'h', y: -0.25, x: 0 },
            }}
            config={{ ...PLOTLY_CONFIG, displayModeBar: false }}
            style={{ width: '100%' }}
            useResizeHandler
          />
        </div>

      </div>
    </div>
  );
}
