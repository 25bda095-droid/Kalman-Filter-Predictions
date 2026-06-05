// src/features/simulator/steps/StepFilter.jsx
import { useCountUp } from '../../../hooks/useCountUp';

function VerdictBadge({ verdict }) {
  const cfg = {
    RECOMMENDED:  { color: '#52B788', bg: 'rgba(82,183,136,0.15)',  label: '✅ RECOMMENDED' },
    UNDERPERFORMS:{ color: '#FF4D6D', bg: 'rgba(255,77,109,0.15)',  label: '❌ UNDERPERFORMS' },
    ADEQUATE:     { color: '#FFB703', bg: 'rgba(255,183,3,0.15)',    label: '⚡ ADEQUATE' },
  };
  const c = cfg[verdict] || cfg.ADEQUATE;
  return (
    <span style={{
      background: c.bg, color: c.color,
      border: `1px solid ${c.color}50`,
      borderRadius: '999px',
      padding: '0.25rem 0.75rem',
      fontSize: '0.75rem', fontWeight: 700,
      letterSpacing: '0.04em',
    }}>
      {c.label}
    </span>
  );
}

function NISBadge({ consistent }) {
  return consistent
    ? <span style={{ background:'rgba(82,183,136,0.15)', color:'#52B788', border:'1px solid rgba(82,183,136,0.3)', borderRadius:'999px', padding:'0.2rem 0.6rem', fontSize:'0.72rem', fontWeight:700 }}>NIS ✓ Consistent</span>
    : <span style={{ background:'rgba(255,77,109,0.15)', color:'#FF4D6D', border:'1px solid rgba(255,77,109,0.3)', borderRadius:'999px', padding:'0.2rem 0.6rem', fontSize:'0.72rem', fontWeight:700 }}>NIS ✗ Inconsistent</span>;
}

function FilterCard({ name, color, filterKey, metric, verdict }) {
  const posRMSE = useCountUp(metric.posRMSE, 1200, 3);
  const velRMSE = useCountUp(metric.velRMSE, 1200, 3);
  const isWinner = verdict === 'RECOMMENDED';

  return (
    <div style={{
      background: 'var(--clr-surface)',
      border: `1.5px solid ${color}${isWinner ? '80' : '30'}`,
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: isWinner ? `0 0 24px ${color}20` : 'none',
      flex: 1,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <VerdictBadge verdict={verdict} />
        <NISBadge consistent={metric.nisStats.consistent} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: color }} />
        <h3 style={{ fontSize: '1.125rem', color: 'var(--clr-text-bright)', fontWeight: 700 }}>{name}</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        {[
          { label: 'Position RMSE', value: `${posRMSE.toFixed(3)} m` },
          { label: 'Velocity RMSE', value: `${velRMSE.toFixed(3)} m/s` },
          { label: 'NIS Mean', value: metric.nisStats.mean.toFixed(2) },
          { label: 'NIS % Below', value: `${metric.nisStats.percentBelow.toFixed(0)}%` },
        ].map(({ label, value }) => (
          <div key={label} style={{
            background: 'var(--clr-surface-2)',
            borderRadius: '8px',
            padding: '0.625rem',
            border: '1px solid var(--clr-border)',
          }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--clr-text-bright)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color, fontSize: '0.95rem' }}>{value}</div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: '0.825rem', color: 'var(--clr-text-bright)', lineHeight: 1.6 }}>
        {filterKey === 'cv'
          ? `The CV (Constant Velocity) filter ${verdict === 'RECOMMENDED' ? 'excels here — simpler model with no wasted acceleration states' : 'struggles with non-constant motion'}.`
          : `The CA (Constant Acceleration) filter ${verdict === 'RECOMMENDED' ? 'wins by modelling acceleration — fitting this scenario perfectly' : 'adds complexity without benefit for this motion type'}.`
        }
      </p>
    </div>
  );
}

export default function StepFilter({ metrics }) {
  if (!metrics) return null;

  const explanation = metrics.winner === 'cv'
    ? 'The Constant Velocity filter won this round. When motion follows steady-speed dynamics, the simpler CV model avoids the penalty of estimating acceleration states that don\'t exist in the data.'
    : 'The Constant Acceleration filter won this round. The acceleration states it tracks provided a better match to the vehicle\'s dynamics, yielding lower RMSE and better-calibrated uncertainty.';

  return (
    <div>
      <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <FilterCard name="CV Filter" color="#52B788" filterKey="cv" metric={metrics.cv} verdict={metrics.cv.verdict} />
        <FilterCard name="CA Filter" color="#9B5DE5" filterKey="ca" metric={metrics.ca} verdict={metrics.ca.verdict} />
      </div>

      <div className="card" style={{ borderLeft: '3px solid var(--clr-cyan)', background: 'var(--clr-cyan-dim)' }}>
        <p style={{ color: 'var(--clr-text-bright)', lineHeight: 1.7, fontStyle: 'italic', fontSize: '0.9375rem' }}>
          💡 {explanation}
        </p>
      </div>
    </div>
  );
}
