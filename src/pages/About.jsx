// src/pages/About.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import SEO from '../components/SEO';

const TECH_STACK = [
  { name: 'React 19', color: '#61DAFB', emoji: '⚛️' },
  { name: 'Vite 8', color: '#9B5DE5', emoji: '⚡' },
  { name: 'mathjs', color: '#52B788', emoji: '🔢' },
  { name: 'Plotly.js', color: '#3F4F75', emoji: '📊' },
  { name: 'Framer Motion', color: '#FF4D6D', emoji: '🎬' },
  { name: 'KaTeX', color: '#FFB703', emoji: '📐' },
];

// Animated Predict → Update SVG
function PredictUpdateDiagram() {
  return (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ maxWidth: '300px', width: '100%', margin: '0 auto', display: 'block' }}>
      {/* PREDICT box */}
      <rect x="20" y="70" width="100" height="60" rx="12" stroke="#9B5DE5" strokeWidth="2" fill="rgba(155,93,229,0.1)" />
      <text x="70" y="97" textAnchor="middle" fill="#9B5DE5" fontSize="11" fontWeight="700" fontFamily="'JetBrains Mono'">PREDICT</text>
      <text x="70" y="113" textAnchor="middle" fill="#7A8BA8" fontSize="9" fontFamily="'JetBrains Mono'">x̂⁻ = F·x̂</text>

      {/* UPDATE box */}
      <rect x="200" y="70" width="100" height="60" rx="12" stroke="#00C8FF" strokeWidth="2" fill="rgba(0,200,255,0.1)" />
      <text x="250" y="97" textAnchor="middle" fill="#00C8FF" fontSize="11" fontWeight="700" fontFamily="'JetBrains Mono'">UPDATE</text>
      <text x="250" y="113" textAnchor="middle" fill="#7A8BA8" fontSize="9" fontFamily="'JetBrains Mono'">x̂ = x̂⁻ + K·ν</text>

      {/* Arrow PREDICT → UPDATE */}
      <path d="M120 100 L200 100" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="4 2" />
      <polygon points="196,96 204,100 196,104" fill="#E2E8F0" />
      <text x="160" y="94" textAnchor="middle" fill="#7A8BA8" fontSize="8">sensor z_k</text>

      {/* Feedback arc UPDATE → PREDICT */}
      <path d="M250 130 Q250 170 160 170 Q70 170 70 130" stroke="#52B788" strokeWidth="1.5" strokeDasharray="4 2" />
      <polygon points="66,126 70,134 74,126" fill="#52B788" />
      <text x="160" y="185" textAnchor="middle" fill="#52B788" fontSize="8">next step →</text>
    </svg>
  );
}

export default function About() {
  return (
    <>
      <SEO
        title="About KalmanVis — Interactive Kalman Filter Simulator"
        description="KalmanVis makes the mathematics of autonomous systems accessible through interactive simulation. Learn our story, mission, and tech stack."
        path="/about"
      />

      {/* Hero */}
      <section style={{
        padding: '5rem 1.5rem 3rem',
        textAlign: 'center',
        background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(155,93,229,0.1) 0%, transparent 70%)',
      }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="badge badge-violet" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
            🚗 About KalmanVis
          </span>
          <h1 className="section-title" style={{ marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>
            About KalmanVis
          </h1>
          <p style={{ color: 'var(--clr-text-muted)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7, fontSize: '1.1rem' }}>
            We believe the most powerful algorithms in the world should be understandable
            by anyone curious enough to look.
          </p>
        </motion.div>
      </section>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>

        {/* Story section */}
        <section style={{ padding: '3rem 0', borderTop: '1px solid var(--clr-border)' }}>
          <div className="grid-2" style={{ alignItems: 'center', gap: '4rem' }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--clr-text-bright)' }}>
                Why We Built This
              </h2>
              <p style={{ color: 'var(--clr-text-muted)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                The Kalman Filter has been running quietly in the background of modern civilisation for over 60 years. It guided Apollo 11, it stabilises your drone, it smooths the blue dot on your maps app. Yet for most people — including many engineering students — it remains an impenetrable wall of linear algebra.
              </p>
              <p style={{ color: 'var(--clr-text-muted)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                KalmanVis was built to tear that wall down. By making the filter interactive — letting you change noise levels, inject GPS outliers, switch between motion models, and watch the algorithm adapt in real time — we transform abstract equations into something you can <em>feel</em>.
              </p>
              <p style={{ color: 'var(--clr-text-muted)', lineHeight: 1.8 }}>
                What you see works. It is not magic. There is math behind it. We are going to see one of the methods used in autonomous vehicles. Are you ready?
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
            >
              <PredictUpdateDiagram />
              <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.8rem', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                The Kalman Filter predict–update cycle
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission statement */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            padding: '2.5rem',
            borderLeft: '4px solid var(--clr-cyan)',
            background: 'var(--clr-surface)',
            borderRadius: '12px',
            margin: '2rem 0',
          }}
        >
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            fontStyle: 'italic',
            color: 'var(--clr-text)',
            lineHeight: 1.8,
          }}>
            "Our mission: make the mathematics of autonomous systems accessible through
            interactive simulation — so every engineer, student, and curious mind can
            understand the tools that are shaping our world."
          </p>
        </motion.section>

        {/* Tech stack */}
        <section style={{ padding: '3rem 0', borderTop: '1px solid var(--clr-border)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: '2rem' }}
          >
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>
              Built With
            </h2>
            <p style={{ color: 'var(--clr-text-muted)' }}>
              KalmanVis runs entirely in your browser — no server-side computation, no data collection.
            </p>
          </motion.div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {TECH_STACK.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                style={{
                  background: 'var(--clr-surface)',
                  border: `1px solid ${tech.color}40`,
                  borderRadius: '12px',
                  padding: '0.875rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                  color: 'var(--clr-text)',
                  fontWeight: 500,
                }}
              >
                <span>{tech.emoji}</span>
                <span>{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Open source */}
        <section style={{
          padding: '3rem',
          background: 'linear-gradient(135deg, rgba(0,200,255,0.06), rgba(155,93,229,0.06))',
          border: '1px solid var(--clr-border)',
          borderRadius: '20px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🦾</div>
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.75rem' }}>Open Source</h2>
          <p style={{ color: 'var(--clr-text-muted)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
            MIT Licensed. The full source code is available on GitHub. Contributions, issues, and forks are welcome.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://github.com/kalmanvis" target="_blank" rel="noopener noreferrer"
              className="btn btn-secondary">
              <ExternalLink size={16} /> View on GitHub
            </a>
            <Link to="/contact" className="btn btn-ghost">
              Contact Us <ExternalLink size={14} />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
