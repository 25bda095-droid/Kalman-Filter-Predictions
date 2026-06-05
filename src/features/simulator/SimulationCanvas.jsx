// src/features/simulator/SimulationCanvas.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { Loader } from 'lucide-react';
import ResultsWalkthrough from './ResultsWalkthrough';
import FullDashboard from './steps/FullDashboard';

const STATUS_MESSAGES = [
  'Running Kalman filters...',
  'Computing RMSE...',
  'Building charts...',
  'Preparing results...',
];

function IdleState() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      padding: '3rem',
      textAlign: 'center',
    }}>
      {/* Illustration */}
      <svg width="280" height="160" viewBox="0 0 280 160" fill="none" style={{ marginBottom: '2rem', opacity: 0.7 }}>
        {/* Grid lines */}
        {[40,80,120].map(y => (
          <line key={y} x1="20" y1={y} x2="260" y2={y} stroke="rgba(0,200,255,0.08)" strokeWidth="1" />
        ))}
        {/* Dashed path */}
        <path d="M20 120 Q70 60 140 80 Q200 100 260 40" stroke="#00C8FF" strokeWidth="2" strokeDasharray="8 5" fill="none" strokeLinecap="round" opacity="0.4" />
        {/* Red scatter dots */}
        {[[40,130],[70,95],[95,105],[120,65],[150,88],[175,72],[200,65],[225,40],[250,55]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="4" fill="#FF4D6D" opacity="0.6" />
        ))}
        {/* Green filter line */}
        <path d="M20 120 Q70 95 140 82 Q200 75 260 42" stroke="#52B788" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Car icon */}
        <motion.g
          animate={{ x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          <rect x="245" y="28" width="22" height="12" rx="2" fill="#52B788" />
          <rect x="249" y="26" width="14" height="8" rx="1.5" fill="#52B788" />
          <circle cx="249" cy="41" r="3" fill="var(--clr-bg)" stroke="#52B788" strokeWidth="1.5" />
          <circle cx="260" cy="41" r="3" fill="var(--clr-bg)" stroke="#52B788" strokeWidth="1.5" />
        </motion.g>
      </svg>

      <h3 style={{ color: 'var(--clr-text-bright)', marginBottom: '0.75rem', fontSize: '1.2rem' }}>
        Configure and Run Your Simulation
      </h3>
      <p style={{ color: 'var(--clr-text-muted)', maxWidth: '380px', lineHeight: 1.7, marginBottom: '2rem' }}>
        Choose a scenario on the left, adjust your parameters, and click Start Simulation
        to see the Kalman Filter in action.
      </p>

      {/* Status pills */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { label: 'CV Filter Ready', color: '#52B788' },
          { label: 'CA Filter Ready', color: '#9B5DE5' },
          { label: 'Awaiting Input', color: '#FFB703' },
        ].map(p => (
          <span key={p.label} className="badge" style={{
            background: `${p.color}15`,
            color: p.color,
            border: `1px solid ${p.color}40`,
            fontSize: '0.8rem',
          }}>
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      padding: '3rem',
      textAlign: 'center',
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        style={{ marginBottom: '2rem', color: 'var(--clr-cyan)' }}
      >
        <Loader size={48} />
      </motion.div>

      <h3 style={{ color: 'var(--clr-text-bright)', marginBottom: '0.5rem' }}>Simulation Running</h3>

      <motion.p
        style={{ color: 'var(--clr-text-muted)', marginBottom: '2rem', minHeight: '1.5rem' }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        Running Kalman filters...
      </motion.p>

      {/* Shimmer progress bar */}
      <div style={{
        width: '100%',
        maxWidth: '400px',
        height: '4px',
        background: 'var(--clr-surface-2)',
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <div className="progress-shimmer" style={{ height: '100%', borderRadius: '2px', width: '100%' }} />
      </div>
    </div>
  );
}

export default function SimulationCanvas({ sim }) {
  const { phase, results, metrics, step, goToStep, goToDashboard, goToIdle, params } = sim;

  return (
    <div
      className="simulator-canvas"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: phase === 'idle' || phase === 'running' ? '0' : 'var(--space-xl)',
      }}
    >
      <AnimatePresence mode="wait">
        {phase === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flex: 1 }}
          >
            <IdleState />
          </motion.div>
        )}

        {phase === 'running' && (
          <motion.div
            key="running"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flex: 1 }}
          >
            <LoadingState />
          </motion.div>
        )}

        {(phase === 'walkthrough') && results && metrics && (
          <motion.div
            key="walkthrough"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ flex: 1 }}
          >
            <ResultsWalkthrough
              results={results}
              metrics={metrics}
              params={params}
              step={step}
              goToStep={goToStep}
              goToDashboard={goToDashboard}
              goToIdle={goToIdle}
            />
          </motion.div>
        )}

        {phase === 'dashboard' && results && metrics && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ flex: 1 }}
          >
            <FullDashboard
              results={results}
              metrics={metrics}
              params={params}
              onNewSimulation={goToIdle}
              onBackToWalkthrough={() => sim.goToWalkthrough()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
