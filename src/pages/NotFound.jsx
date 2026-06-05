// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Zap } from 'lucide-react';
import SEO from '../components/SEO';

// Animated car drifting off path SVG
function CarDrift() {
  return (
    <div style={{ maxWidth: '360px', margin: '2rem auto' }}>
      <svg viewBox="0 0 360 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Dashed planned path */}
        <path d="M20 100 L340 100" stroke="#00C8FF" strokeWidth="2" strokeDasharray="8 6" strokeOpacity="0.4" />
        <text x="20" y="95" fill="#00C8FF" fontSize="9" fontFamily="'JetBrains Mono'" opacity="0.5">planned path</text>

        {/* Actual drifting path */}
        <motion.path
          d="M20 100 Q100 100 150 80 Q200 60 250 40 Q280 25 340 20"
          stroke="#FF4D6D"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
        />

        {/* Car icon at end of drift path */}
        <motion.g
          initial={{ x: 0, y: 0 }}
          animate={{ x: 320, y: -80 }}
          transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
        >
          <rect x="5" y="2" width="24" height="14" rx="3" fill="#FF4D6D" opacity="0.9" />
          <rect x="9" y="0" width="16" height="10" rx="2" fill="#FF4D6D" />
          <circle cx="9" cy="17" r="3.5" fill="#1A2035" stroke="#E2E8F0" strokeWidth="1.5" />
          <circle cx="21" cy="17" r="3.5" fill="#1A2035" stroke="#E2E8F0" strokeWidth="1.5" />
        </motion.g>

        <text x="240" y="50" fill="#FF4D6D" fontSize="9" fontFamily="'JetBrains Mono'" opacity="0.6">actual position</text>
      </svg>
    </div>
  );
}

export default function NotFound() {
  return (
    <>
      <SEO title="404 — Page Not Found | KalmanVis" path="/404" />

      <section style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '4rem 1.5rem',
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,200,255,0.05) 0%, transparent 70%)',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* 404 number */}
          <div className="error-code text-cyan" style={{ marginBottom: '0.5rem' }}>404</div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            color: 'var(--clr-text-bright)',
            marginBottom: '1rem',
          }}>
            You've left the track.
          </h1>

          <p style={{ color: 'var(--clr-text-muted)', maxWidth: '420px', margin: '0 auto', lineHeight: 1.7 }}>
            The filter predicted you'd end up here, but the measurement says otherwise.
          </p>

          <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginTop: '0.5rem', opacity: 0.6 }}>
            Error code: 404 — Page not found
          </p>

          <CarDrift />

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-primary">
              <Home size={16} /> Back to Home
            </Link>
            <Link to="/simulator" className="btn btn-secondary">
              <Zap size={16} /> Try the Simulator
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}
