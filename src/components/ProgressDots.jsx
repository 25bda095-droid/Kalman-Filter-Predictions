// src/components/ProgressDots.jsx
import { motion } from 'framer-motion';

export default function ProgressDots({ total, current, labels = [] }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      padding: '8px 0',
    }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: i === current ? 1.2 : 1 }}
            transition={{ duration: 0.25 }}
            style={{
              width:  i === current ? 12 : 9,
              height: i === current ? 12 : 9,
              borderRadius: '50%',
              background:   i < current
                ? 'var(--clr-cyan)'
                : i === current
                ? 'var(--clr-cyan)'
                : 'transparent',
              border: i === current
                ? '2px solid var(--clr-cyan)'
                : i < current
                ? '2px solid var(--clr-cyan)'
                : '2px solid var(--clr-text-muted)',
              boxShadow: i === current ? 'var(--glow-cyan)' : 'none',
              transition: 'all 0.25s ease',
              cursor: 'pointer',
            }}
            title={labels[i] || `Step ${i}`}
          />
          {labels[i] && (
            <span style={{
              fontSize: '0.6rem',
              color: i === current ? 'var(--clr-cyan)' : 'var(--clr-text-muted)',
              whiteSpace: 'nowrap',
            }}>
              {labels[i]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
