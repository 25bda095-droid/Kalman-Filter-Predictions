// src/pages/ServerError.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, RefreshCw } from 'lucide-react';
import SEO from '../components/SEO';

// Signal interference SVG animation
function SignalInterference() {
  const lines = Array.from({ length: 12 });
  return (
    <div style={{ maxWidth: '300px', margin: '2rem auto' }}>
      <svg viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {lines.map((_, i) => (
          <motion.rect
            key={i}
            x={i * 25}
            y={30}
            width="18"
            height={Math.random() * 60 + 20}
            rx="2"
            fill="#FF4D6D"
            opacity="0.6"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: [1, Math.random() * 2 + 0.2, 1] }}
            transition={{
              duration: 0.4 + Math.random() * 0.3,
              repeat: Infinity,
              repeatType: 'mirror',
              delay: Math.random() * 0.5,
            }}
            style={{ transformOrigin: `${i * 25 + 9}px 90px` }}
          />
        ))}
        <text x="150" y="115" textAnchor="middle" fill="#FF4D6D" fontSize="9" fontFamily="'JetBrains Mono'" opacity="0.7">
          signal interference detected
        </text>
      </svg>
    </div>
  );
}

export default function ServerError() {
  return (
    <>
      <SEO title="500 — Server Error | KalmanVis" path="/500" />

      <section style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '4rem 1.5rem',
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,77,109,0.05) 0%, transparent 70%)',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="error-code" style={{ color: 'var(--clr-red)', marginBottom: '0.5rem' }}>500</div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            color: 'var(--clr-text-bright)',
            marginBottom: '1rem',
          }}>
            The filter diverged.
          </h1>

          <p style={{ color: 'var(--clr-text-muted)', maxWidth: '460px', margin: '0 auto', lineHeight: 1.7 }}>
            Something went wrong on our end. This is like a Kalman gain blowing up —
            we'll recalibrate shortly.
          </p>

          <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginTop: '0.5rem', opacity: 0.6 }}>
            Error code: 500 — Internal Server Error
          </p>

          <SignalInterference />

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-danger"
            >
              <RefreshCw size={16} /> Try Again
            </button>
            <Link to="/" className="btn btn-secondary">
              <Home size={16} /> Go Home
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}
