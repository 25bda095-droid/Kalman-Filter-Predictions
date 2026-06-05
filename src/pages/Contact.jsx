// src/pages/Contact.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ExternalLink, MessageSquare, CheckCircle, Loader } from 'lucide-react';
import SEO from '../components/SEO';

const INFO_CARDS = [
  { icon: <Mail size={22} />, label: 'Email', value: 'hello@kalmanvis.app', href: 'mailto:rishavrmishra@gmail.com', color: '#00C8FF' },
  { icon: <ExternalLink size={22} />, label: 'GitHub', value: 'github.com/kalmanvis', href: 'https://github.com/25bda095-droid', color: '#9B5DE5' },
  { icon: <MessageSquare size={22} />, label: 'LinkedIn', value: '@kalmanvis', href: 'www.linkedin.com/in/rishav-r-mishra', color: '#52B788' },
];

const SUBJECTS = [
  'Bug Report',
  'Feature Request',
  'Math Question',
  'General Question',
  'Other',
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Name is required';
    if (!form.email.trim())   e.email   = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setStatus('loading');
    setTimeout(() => setStatus('success'), 1500);
  };

  const handleChange = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  };

  return (
    <>
      <SEO
        title="Contact — KalmanVis"
        description="Get in touch with the KalmanVis team. Report bugs, request features, or ask math questions."
        path="/contact"
      />

      {/* Hero */}
      <section style={{ padding: '5rem 1.5rem 2rem', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <span className="badge badge-gold" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>✉️ Get in Touch</span>
          <h1 className="section-title" style={{ fontFamily: 'var(--font-display)', marginBottom: '0.75rem' }}>Contact Us</h1>
          <p style={{ color: 'var(--clr-text-muted)', maxWidth: '480px', margin: '0 auto' }}>
            Have a question? Found a bug? Want to contribute? We'd love to hear from you.
          </p>
        </motion.div>
      </section>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
        <div className="grid-2" style={{ gap: '3rem', alignItems: 'start' }}>

          {/* Left — Info cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--clr-text-bright)' }}>
              Ways to reach us
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {INFO_CARDS.map((card) => (
                <a
                  key={card.label}
                  href={card.href}
                  target={card.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    textDecoration: 'none',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    borderLeft: `3px solid ${card.color}`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 0 20px ${card.color}30`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                >
                  <div style={{ color: card.color }}>{card.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>{card.label}</div>
                    <div style={{ color: 'var(--clr-text)', fontWeight: 500 }}>{card.value}</div>
                  </div>
                </a>
              ))}
            </div>
            <div className="card" style={{ background: 'var(--clr-cyan-dim)', borderColor: 'rgba(0,200,255,0.2)' }}>
              <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                <strong style={{ color: 'var(--clr-cyan)' }}>Response time:</strong> We typically respond within 24–48 hours.
                For urgent issues, please open a GitHub issue for fastest response.
              </p>
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card"
                  style={{ textAlign: 'center', padding: '3rem', borderColor: 'rgba(82,183,136,0.3)' }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  >
                    <CheckCircle size={64} color="#52B788" style={{ margin: '0 auto 1.5rem' }} />
                  </motion.div>
                  <h3 style={{ color: '#52B788', marginBottom: '0.75rem' }}>Message Sent!</h3>
                  <p style={{ color: 'var(--clr-text-muted)', lineHeight: 1.7 }}>
                    Thanks! We'll get back to you within 24–48 hours.
                  </p>
                  <button
                    onClick={() => { setStatus('idle'); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="btn btn-ghost"
                    style={{ marginTop: '1.5rem' }}
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="card"
                  style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                >
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--clr-text-bright)', marginBottom: '0.5rem' }}>
                    Send a Message
                  </h2>

                  <div className="form-group">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      placeholder="Your name"
                      value={form.name}
                      onChange={e => handleChange('name', e.target.value)}
                    />
                    {errors.name && <span style={{ color: 'var(--clr-red)', fontSize: '0.8rem' }}>{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={e => handleChange('email', e.target.value)}
                    />
                    {errors.email && <span style={{ color: 'var(--clr-red)', fontSize: '0.8rem' }}>{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <select
                      className="form-select"
                      value={form.subject}
                      onChange={e => handleChange('subject', e.target.value)}
                    >
                      <option value="">Select a subject...</option>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea
                      className={`form-textarea ${errors.message ? 'error' : ''}`}
                      placeholder="Tell us what's on your mind..."
                      rows={5}
                      value={form.message}
                      onChange={e => handleChange('message', e.target.value)}
                    />
                    {errors.message && <span style={{ color: 'var(--clr-red)', fontSize: '0.8rem' }}>{errors.message}</span>}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-full"
                    disabled={status === 'loading'}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    {status === 'loading' ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                          <Loader size={16} />
                        </motion.div>
                        Sending...
                      </>
                    ) : (
                      <>Send Message →</>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  );
}
