// src/pages/FAQ.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import SEO from '../components/SEO';
import ScrollProgress from '../components/ScrollProgress';

const FAQS = {
  'The Tool': [
    {
      q: 'What is the Kalman Filter?',
      a: "It's a recursive mathematical algorithm that estimates the true state of a system (position, velocity) from noisy measurements. Think of it as the math that lets your GPS give you a smooth route instead of a jittery, jumping arrow.",
    },
    {
      q: 'What scenarios are available?',
      a: 'Five scenarios: Cruising (constant velocity), Acceleration, Sudden Braking, Circular Turning, and Glitchy GPS with outlier injection. Each tests a different aspect of how Kalman filters handle real-world motion.',
    },
    {
      q: "What's the difference between CV and CA filters?",
      a: 'CV (Constant Velocity) assumes the vehicle moves at steady speed. CA (Constant Acceleration) also models acceleration. CV wins on simple motion; CA wins when vehicles brake or turn sharply.',
    },
    {
      q: 'What is NIS?',
      a: "Normalized Innovation Squared — a statistical test that checks if the filter's uncertainty estimates are accurate. If NIS consistently exceeds the 95% threshold (≈5.99), the filter is miscalibrated.",
    },
    {
      q: 'Can I export the simulation data?',
      a: 'Yes — after running any simulation, a Download CSV button appears in the Performance Report step. The CSV contains ground truth, measurements, and filter estimates for every time step.',
    },
  ],
  'The Math': [
    {
      q: 'Do I need to know math to use this?',
      a: 'No. Every parameter has a plain-English tooltip. The results walkthrough explains each result in normal language before showing any equations.',
    },
    {
      q: 'Where can I learn more about Kalman Filters?',
      a: "Check our /learn page for the full math walkthrough. Classic references: Welch & Bishop \"An Introduction to the Kalman Filter\" and Thrun \"Probabilistic Robotics.\"",
    },
    {
      q: 'What is Adaptive R?',
      a: "Adaptive R is a technique where the filter automatically adjusts its measurement noise estimate (R) based on observed innovations. This helps the filter handle non-stationary noise without manual retuning.",
    },
  ],
  'Technical': [
    {
      q: 'Is this open source?',
      a: 'Yes, MIT License. Source code available on GitHub.',
    },
    {
      q: 'Does this store any of my data?',
      a: 'No. All simulation runs entirely in your browser session. No data is sent to any server or stored anywhere.',
    },
    {
      q: 'What browsers are supported?',
      a: 'Chrome 90+, Firefox 88+, Safari 14+, Edge 90+. Mobile browsers supported with responsive layout.',
    },
  ],
};

function FAQItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        background: 'var(--clr-surface)',
        border: '1px solid var(--clr-border)',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'border-color 0.2s ease',
        borderColor: open ? 'rgba(0,200,255,0.3)' : 'var(--clr-border)',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          padding: '1.25rem 1.5rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          textAlign: 'left',
          minHeight: '44px',
        }}
      >
        <span style={{ fontWeight: 600, color: 'var(--clr-text-bright)', fontSize: '0.9375rem', lineHeight: 1.5 }}>
          {item.q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ flexShrink: 0, color: 'var(--clr-cyan)' }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{
              padding: '0 1.5rem 1.25rem',
              color: 'var(--clr-text-muted)',
              lineHeight: 1.7,
              borderTop: '1px solid var(--clr-border)',
              paddingTop: '1rem',
            }}>
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <>
      <SEO
        title="FAQ — KalmanVis Kalman Filter Simulator"
        description="Answers to common questions about the Kalman Filter, KalmanVis simulator, CV vs CA filters, NIS, and data export."
        path="/faq"
      />
      <ScrollProgress />

      {/* Hero */}
      <section style={{ padding: '5rem 1.5rem 2rem', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="badge badge-green" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
            ❓ Help Center
          </span>
          <h1 className="section-title" style={{ marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ color: 'var(--clr-text-muted)', maxWidth: '500px', margin: '0 auto' }}>
            Everything you need to know about KalmanVis and the Kalman Filter.
          </p>
        </motion.div>
      </section>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
        {Object.entries(FAQS).map(([category, items], ci) => (
          <motion.section
            key={category}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: ci * 0.1 }}
            style={{ marginBottom: '3rem' }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.25rem',
            }}>
              <div style={{ width: '3px', height: '20px', background: 'var(--clr-cyan)', borderRadius: '2px' }} />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--clr-cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {category}
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {items.map((item, i) => (
                <FAQItem key={i} item={item} />
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </>
  );
}
