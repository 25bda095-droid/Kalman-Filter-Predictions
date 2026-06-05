// src/features/simulator/ScenarioPicker.jsx
import { SCENARIO_LIST } from '../../utils/scenarios';

export default function ScenarioPicker({ selected, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {SCENARIO_LIST.map((scenario) => {
        const isActive = selected === scenario.key;
        return (
          <button
            key={scenario.key}
            onClick={() => onChange(scenario.key, scenario.defaults)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: isActive ? 'var(--clr-cyan-dim)' : 'var(--clr-surface-2)',
              border: isActive ? '1.5px solid var(--clr-cyan)' : '1.5px solid var(--clr-border)',
              borderRadius: '10px',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? 'var(--glow-cyan)' : 'none',
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = 'rgba(0,200,255,0.3)'; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = 'var(--clr-border)'; }}
          >
            <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{scenario.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontWeight: 600,
                fontSize: '0.875rem',
                color: isActive ? 'var(--clr-cyan)' : 'var(--clr-text)',
                marginBottom: '0.125rem',
              }}>
                {scenario.name}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--clr-text-muted)',
                lineHeight: 1.4,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {scenario.desc}
              </div>
            </div>
            {isActive && (
              <div style={{
                width: '8px', height: '8px',
                borderRadius: '50%',
                background: 'var(--clr-cyan)',
                flexShrink: 0,
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
}
