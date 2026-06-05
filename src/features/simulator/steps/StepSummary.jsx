// src/features/simulator/steps/StepSummary.jsx
import { SCENARIOS } from '../../../utils/scenarios';

export default function StepSummary({ params, onBack, onNext }) {
  const scenario = SCENARIOS[params.scenario];

  const rows = [
    ['Scenario', `${scenario?.emoji} ${scenario?.name} (${params.scenario})`],
    ['Duration', `${params.duration} steps`],
    ['Time step', `${params.dt}s`],
    ['Init Position', `(${params.initPos[0].toFixed(1)}, ${params.initPos[1].toFixed(1)}) m`],
    ['Init Velocity', `(${params.initVel[0].toFixed(1)}, ${params.initVel[1].toFixed(1)}) m/s`],
    ['Acceleration', `(${params.accX.toFixed(1)}, ${params.accY.toFixed(1)}) m/s²`],
    ['Meas. Noise σ', `${params.measNoise} m`],
    ['Process Noise q', `pos: ${params.qPos}, vel: ${params.qVel}`],
    ['Adaptive R', params.adaptiveR ? `ON (α=${params.alpha})` : 'OFF'],
    ['Outlier Prob.', `${(params.outlierProb * 100).toFixed(0)}%`],
    ['Random Seed', String(params.seed)],
    ['Filters', 'CV + CA (parallel)'],
  ];

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div className="card" style={{ borderColor: 'rgba(0,200,255,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>📋</span>
          <h3 style={{ color: 'var(--clr-text-bright)', fontSize: '1.125rem' }}>Your Simulation Setup</h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.625rem',
          marginBottom: '1.5rem',
        }}>
          {rows.map(([label, value]) => (
            <div key={label} style={{
              background: 'var(--clr-surface-2)',
              borderRadius: '8px',
              padding: '0.625rem 0.875rem',
              border: '1px solid var(--clr-border)',
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--clr-text-bright)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>
                {label}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--clr-cyan)', fontWeight: 600 }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {scenario && (
          <div style={{
            background: 'var(--clr-cyan-dim)',
            border: '1px solid rgba(0,200,255,0.2)',
            borderRadius: '10px',
            padding: '0.875rem',
            marginBottom: '1.5rem',
          }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-bright)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--clr-cyan)' }}>Scenario note:</strong> {scenario.longDesc}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button onClick={onBack} className="btn btn-secondary">
            ← Reconfigure
          </button>
          <button onClick={onNext} className="btn btn-primary">
            ▶ See Results
          </button>
        </div>
      </div>
    </div>
  );
}
