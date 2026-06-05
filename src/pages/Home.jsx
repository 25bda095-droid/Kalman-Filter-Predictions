// src/pages/Home.jsx
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Map, BarChart2, Wifi, GraduationCap,
  Download, Moon, ArrowRight, ChevronDown,
  Zap, BookOpen
} from 'lucide-react';
import SEO from '../components/SEO';
import ParticlesBg from '../components/ParticlesBg';

// Mini chart preview using SVG (Noisy → Smooth)
function MiniChartPreview() {
  const noisy = [18,28,12,35,22,40,15,30,25,38,20,45,28,35,22,42,30,25,38,32];
  const smooth = [20,22,23,25,26,28,28,29,30,31,32,33,34,35,35,36,36,37,37,38];
  const W = 300, H = 100;
  const toX = (i) => (i / (noisy.length - 1)) * W;
  const toY = (v) => H - ((v - 10) / 38) * (H - 10) - 5;
  const smoothPath = smooth.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`).join(' ');

  return (
    <div style={{
      background: 'var(--clr-surface)',
      border: '1px solid var(--clr-border)',
      borderRadius: '12px',
      padding: '1rem',
      maxWidth: '340px',
      margin: '2rem auto 0',
    }}>
      <div style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>
        Live Preview — Kalman Filter in action
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
        {/* Noisy red dots */}
        {noisy.map((v, i) => (
          <circle key={i} cx={toX(i)} cy={toY(v)} r="2.5" fill="#FF4D6D" opacity="0.7" />
        ))}
        {/* Smooth green line */}
        <path d={smoothPath} stroke="#52B788" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Legend */}
        <circle cx="8" cy="92" r="3" fill="#FF4D6D" opacity="0.7" />
        <text x="14" y="96" fill="#7A8BA8" fontSize="8">Noisy GPS</text>
        <circle cx="80" cy="92" r="3" fill="#52B788" />
        <text x="86" y="96" fill="#7A8BA8" fontSize="8">Kalman estimate</text>
      </svg>
    </div>
  );
}

const FEATURES = [
  { icon: <Map size={22} />, color: '#00C8FF', title: '5 Real Scenarios', desc: 'Cruising, Acceleration, Braking, Turning, Glitchy GPS — pick your challenge.' },
  { icon: <BarChart2 size={22} />, color: '#9B5DE5', title: 'Dual Filter Comparison', desc: 'CV vs CA Kalman filters running side by side with live RMSE metrics.' },
  { icon: <Wifi size={22} />, color: '#FF4D6D', title: 'GPS Outlier Simulation', desc: 'Inject GPS glitches and watch the filter reject bad data in real time.' },
  { icon: <GraduationCap size={22} />, color: '#52B788', title: 'Math Walkthrough', desc: 'Full equations rendered in LaTeX for every filter step with KaTeX.' },
  { icon: <Download size={22} />, color: '#FFB703', title: 'Export Data', desc: 'Download your simulation as CSV for offline analysis and research.' },
  { icon: <Moon size={22} />, color: '#00C8FF', title: 'Light/Dark Theme', desc: 'Full dark mode for focus, light mode for presentations — switch instantly.' },
];

const JOURNEY_CARDS = [
  {
    emoji: '🔴', title: 'The Problem',
    text: 'GPS sensors report noisy, imperfect positions. In the real world, a car can\'t just follow raw sensor data — it would swerve and crash.',
    color: '#FF4D6D',
  },
  {
    emoji: '⚡', title: 'The Math',
    text: 'The Kalman Filter predicts where you SHOULD be (physics), then corrects using what sensors SAY (measurement). Result: optimal estimate, every step.',
    color: '#FFB703',
  },
  {
    emoji: '✅', title: 'The Magic',
    text: 'Used in: GPS/IMU fusion, drone stabilisation, Apollo moon guidance, Tesla Autopilot, financial models, weather forecasting.',
    color: '#52B788',
  },
];

const HOW_STEPS = [
  { num: '01', icon: '🎯', title: 'Choose a Scenario', desc: 'Pick from 5 pre-built driving scenarios. Each one tests a different aspect of the Kalman Filter.' },
  { num: '02', icon: '🔧', title: 'Set Your Parameters', desc: 'Adjust noise levels, time steps, and initial state. Hover any parameter for a plain-English tooltip.' },
  { num: '03', icon: '▶️', title: 'Run Simulation', desc: 'The filter runs instantly. Both CV and CA models execute in parallel for direct comparison.' },
  { num: '04', icon: '📊', title: 'Explore Results', desc: 'Walk through results one by one with guided explanations, then see the full picture all at once.' },
];

const FAQ_TEASER = [
  { q: 'What is the Kalman Filter?', a: 'A recursive algorithm that estimates the true state of a system from noisy measurements — the math behind self-driving car positioning.' },
  { q: 'What\'s the difference between CV and CA filters?', a: 'CV (Constant Velocity) assumes steady speed. CA (Constant Acceleration) models acceleration too. CV wins on simple motion; CA wins when braking or turning.' },
  { q: 'Do I need to know math to use this?', a: 'No. Every parameter has a plain-English tooltip. The results walkthrough explains everything in normal language before showing any equations.' },
];

export default function Home() {
  return (
    <>
      <SEO path="/" />

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "KalmanVis",
        "url": "https://kalmanvis.app",
        "applicationCategory": "EducationalApplication",
        "description": "Interactive Kalman Filter simulator for autonomous vehicle education",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "operatingSystem": "Web Browser",
        "license": "https://opensource.org/licenses/MIT",
      })}} />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(155,93,229,0.15) 0%, transparent 70%), var(--clr-bg)',
        textAlign: 'center',
        padding: '4rem 1.5rem',
        marginTop: '-70px',
        paddingTop: 'calc(4rem + 70px)',
      }}>
        <ParticlesBg />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
          <div className="hero-line">
            <span className="badge badge-cyan" style={{ fontSize: '0.8rem', marginBottom: '1.5rem', display: 'inline-flex' }}>
              🚗 Autonomous Vehicle Technology
            </span>
          </div>

          <h1 className="hero-title hero-line" style={{ marginBottom: '1.5rem' }}>
            What You See Works.{' '}
            <span className="text-gradient-cyan">There Is Math Behind It.</span>
          </h1>

          <p className="hero-line" style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
            color: 'var(--clr-text-muted)',
            maxWidth: '600px',
            margin: '0 auto 2rem',
            lineHeight: 1.7,
          }}>
            Visualise the Kalman Filter — the algorithm that helps self-driving cars,
            drones, and spacecraft know exactly where they are, even when sensors lie.
          </p>

          <div className="hero-line" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/simulator" className="btn btn-primary btn-lg btn-primary-ping">
              <Zap size={18} /> Start the Journey
            </Link>
            <Link to="/learn" className="btn btn-secondary btn-lg">
              <BookOpen size={18} /> Learn the Math
            </Link>
          </div>

          <p className="hero-line" style={{
            marginTop: '1.5rem',
            color: 'var(--clr-text-muted)',
            fontSize: '0.9rem',
            fontStyle: 'italic',
          }}>
            Are you ready for the journey? Keep your seatbelt tight.
          </p>

          <motion.div
            className="hero-line"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            style={{ marginTop: '2rem' }}
          >
            <ChevronDown size={24} color="var(--clr-text-muted)" style={{ margin: '0 auto' }} />
          </motion.div>

          <MiniChartPreview />
        </div>
      </section>

      {/* ── THE JOURNEY ─────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <h2 className="section-title" style={{ marginBottom: '0.75rem' }}>The Journey</h2>
            <p style={{ color: 'var(--clr-text-muted)', maxWidth: '500px', margin: '0 auto' }}>
              From noisy sensor chaos to precise state estimation — step by step.
            </p>
          </motion.div>

          <div className="grid-3">
            {JOURNEY_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="card card-hover"
                style={{ borderLeft: `3px solid ${card.color}` }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{card.emoji}</div>
                <h3 style={{ color: card.color, marginBottom: '0.75rem', fontSize: '1.25rem' }}>{card.title}</h3>
                <p style={{ color: 'var(--clr-text-muted)', lineHeight: 1.7 }}>{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ───────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--clr-surface)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <h2 className="section-title" style={{ marginBottom: '0.75rem' }}>
              Everything you need to understand state estimation
            </h2>
            <p style={{ color: 'var(--clr-text-muted)' }}>
              Built for students, engineers, and the curious.
            </p>
          </motion.div>

          <div className="grid-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="card"
                style={{
                  borderLeft: `3px solid ${f.color}`,
                  cursor: 'default',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 0 20px ${f.color}40`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ color: f.color, marginBottom: '1rem' }}>{f.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--clr-text-bright)' }}>{f.title}</h3>
                <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section className="section">
        <div className="container-md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <h2 className="section-title">Your Journey in 4 Steps</h2>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {HOW_STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'flex-start',
                  padding: '1.5rem',
                  background: 'var(--clr-surface)',
                  border: '1px solid var(--clr-border)',
                  borderRadius: '16px',
                }}
              >
                <div style={{
                  flexShrink: 0,
                  width: '60px', height: '60px',
                  borderRadius: '50%',
                  background: 'var(--clr-cyan-dim)',
                  border: '2px solid var(--clr-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--clr-cyan)',
                }}>
                  {step.num}
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{step.icon}</div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--clr-text-bright)', marginBottom: '0.5rem' }}>
                    {step.title}
                  </h3>
                  <p style={{ color: 'var(--clr-text-muted)', lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ TEASER ──────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--clr-surface)' }}>
        <div className="container-md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '2.5rem' }}
          >
            <h2 className="section-title">Common Questions</h2>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {FAQ_TEASER.map((item, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{
                  background: 'var(--clr-bg)',
                  border: '1px solid var(--clr-border)',
                  borderRadius: '12px',
                  padding: '1.25rem 1.5rem',
                }}
              >
                <summary style={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: 'var(--clr-text-bright)',
                  listStyle: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  userSelect: 'none',
                }}>
                  {item.q}
                  <span style={{ color: 'var(--clr-cyan)', fontSize: '1.25rem', flexShrink: 0 }}>+</span>
                </summary>
                <p style={{ marginTop: '1rem', color: 'var(--clr-text-muted)', lineHeight: 1.7 }}>{item.a}</p>
              </motion.details>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/faq" className="btn btn-ghost">
              View all FAQ <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────── */}
      <section style={{
        padding: '5rem 1.5rem',
        background: 'linear-gradient(135deg, rgba(0,200,255,0.12) 0%, rgba(155,93,229,0.12) 100%)',
        borderTop: '1px solid var(--clr-border)',
        borderBottom: '1px solid var(--clr-border)',
        textAlign: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>
            Ready to see through the noise?
          </h2>
          <p style={{ color: 'var(--clr-text-muted)', marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 2rem' }}>
            The algorithm is not magic. It is math. And now you can see it.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/simulator" className="btn btn-primary btn-lg">
              🚗 Launch Simulator
            </Link>
            <Link to="/learn" className="btn btn-ghost btn-lg">
              or read about the math first →
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}
