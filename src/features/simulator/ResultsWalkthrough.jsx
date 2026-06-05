// src/features/simulator/ResultsWalkthrough.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressDots from '../../components/ProgressDots';
import StepSummary    from './steps/StepSummary';
import StepFilter     from './steps/StepFilter';
import StepTrajectory from './steps/StepTrajectory';
import StepStateEst   from './steps/StepStateEst';
import StepInnovation from './steps/StepInnovation';
import StepReport     from './steps/StepReport';

const STEP_LABELS = ['Setup', 'Filter', 'Path', 'State', 'NIS', 'Report'];
const TOTAL_STEPS = 6;

const stepVariants = {
  enter:  (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit:   (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.25 } }),
};

export default function ResultsWalkthrough({ results, metrics, params, step, goToStep, goToDashboard, goToIdle }) {
  const [direction, setDirection]       = useState(1);
  const [furthestStep, setFurthestStep] = useState(step);
  const [showKeyHint, setShowKeyHint]   = useState(true);

  // Keep furthestStep in sync when step prop jumps forward (e.g. restored state)
  useEffect(() => {
    setFurthestStep(prev => Math.max(prev, step));
  }, [step]);

  // Auto-dismiss keyboard hint after 5 s (only fires once on mount)
  useEffect(() => {
    const timer = setTimeout(() => setShowKeyHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const navigate = (nextStep) => {
    setDirection(nextStep > step ? 1 : -1);
    goToStep(nextStep);
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setFurthestStep(prev => Math.max(prev, step + 1));
      navigate(step + 1);
    } else {
      goToDashboard();
    }
  };

  const handleBack = () => {
    if (step > 0) navigate(step - 1);
  };

  // Keyboard arrow navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft' && step > 0) handleBack();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [step, furthestStep]);

  const steps = [
    <StepSummary    key={0} params={params} onBack={goToIdle} onNext={handleNext} />,
    <StepFilter     key={1} metrics={metrics} params={params} />,
    <StepTrajectory key={2} results={results} params={params} />,
    <StepStateEst   key={3} results={results} />,
    <StepInnovation key={4} results={results} params={params} />,
    <StepReport     key={5} results={results} metrics={metrics} params={params} onDashboard={goToDashboard} />,
  ];

  const headers = [
    'Your Simulation Setup',
    'Step 1 of 5 — Which Filter Wins?',
    'Step 2 of 5 — The Path Through Space',
    'Step 3 of 5 — Position & Velocity Over Time',
    'Step 4 of 5 — Is the Filter Telling the Truth?',
    'Step 5 of 5 — Numbers Don\'t Lie',
  ];

  const isLastStep = step === TOTAL_STEPS - 1;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* ── Header ── */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid var(--clr-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        <div>
          <div style={{
            fontSize: '0.7rem',
            color: 'var(--clr-text-muted)',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.2rem',
          }}>
            Results Walkthrough
          </div>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--clr-text-bright)' }}>
            {headers[step]}
          </h2>
        </div>
        <ProgressDots total={TOTAL_STEPS} current={step} labels={STEP_LABELS} />
      </div>

      {/* ── Step content — padded so fixed bar never covers last line ── */}
      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ padding: '1.5rem', paddingBottom: '90px' }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Fixed sticky bottom nav bar ── */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.875rem 2rem',
        background: 'var(--clr-surface)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--clr-border)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.18)',
      }}>

        {/* LEFT — Back */}
        <button
          onClick={handleBack}
          disabled={step === 0}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.55rem 1.3rem',
            borderRadius: '8px',
            border: '1px solid var(--clr-border)',
            background: 'transparent',
            color: step === 0 ? 'var(--clr-text-muted)' : 'var(--clr-text)',
            cursor: step === 0 ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            opacity: step === 0 ? 0.4 : 1,
            transition: 'all 0.2s',
          }}
        >
          ← Back
        </button>

        {/* CENTER — Pill dots with labels */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
        }}>
          {STEP_LABELS.map((label, i) => {
            const isActive   = i === step;
            const isVisited  = i < step;
            const isLocked   = i > furthestStep;
            return (
              <button
                key={i}
                onClick={() => !isLocked && navigate(i)}
                title={label}
                disabled={isLocked}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.3rem',
                  background: 'none',
                  border: 'none',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  padding: '0.25rem 0.3rem',
                  opacity: isLocked ? 0.3 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {/* Pill indicator */}
                <div style={{
                  width: isActive ? '28px' : '10px',
                  height: '10px',
                  borderRadius: '5px',
                  background: isActive
                    ? 'var(--clr-cyan)'
                    : isVisited
                    ? 'var(--clr-green)'
                    : 'rgba(128,128,160,0.3)',
                  transition: 'width 0.3s ease, background 0.3s ease',
                  boxShadow: isActive ? '0 0 8px rgba(0,200,255,0.55)' : 'none',
                }} />
                {/* Label — hidden on mobile via CSS class */}
                <span className="step-nav-label" style={{
                  fontSize: '0.6rem',
                  color: isActive ? 'var(--clr-cyan)' : 'var(--clr-text-muted)',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.05em',
                  transition: 'color 0.2s',
                  whiteSpace: 'nowrap',
                }}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* RIGHT — Next / Dashboard */}
        <button
          onClick={handleNext}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.55rem 1.3rem',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #00C8FF, #0090CC)',
            color: '#fff',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            fontWeight: 600,
            transition: 'all 0.2s',
            boxShadow: '0 0 16px rgba(0,200,255,0.28)',
          }}
        >
          {isLastStep ? '📊 Full Dashboard →' : 'Next →'}
        </button>

      </div>

      {/* ── Keyboard hint toast (shown once, auto-dismisses after 5 s) ── */}
      <AnimatePresence>
        {showKeyHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              bottom: '80px',
              left: '2rem',
              zIndex: 200,
              background: 'var(--clr-surface)',
              border: '1px solid rgba(0,200,255,0.25)',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 0 20px rgba(0,200,255,0.1)',
              maxWidth: '280px',
              overflow: 'hidden',
            }}
          >
            {/* Key icon */}
            <div style={{
              background: 'rgba(0,200,255,0.1)',
              border: '1px solid rgba(0,200,255,0.3)',
              borderRadius: '8px',
              padding: '0.4rem 0.6rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--clr-cyan)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
              ← →
            </div>

            <div>
              <div style={{
                color: 'var(--clr-text)',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '0.2rem',
              }}>
                Keyboard shortcut
              </div>
              <div style={{
                color: 'var(--clr-text-muted)',
                fontSize: '0.72rem',
                lineHeight: 1.4,
              }}>
                Use arrow keys to navigate between steps
              </div>
            </div>

            {/* Dismiss button */}
            <button
              onClick={() => setShowKeyHint(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--clr-text-muted)',
                cursor: 'pointer',
                fontSize: '1.1rem',
                lineHeight: 1,
                padding: 0,
                flexShrink: 0,
                alignSelf: 'flex-start',
              }}
              aria-label="Dismiss"
            >
              ×
            </button>

            {/* Auto-dismiss progress bar */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5, ease: 'linear' }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'var(--clr-cyan)',
                borderRadius: '0 0 12px 12px',
                transformOrigin: 'left',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
