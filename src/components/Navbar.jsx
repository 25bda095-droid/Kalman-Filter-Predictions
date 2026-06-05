// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Zap } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const NAV_LINKS = [
  { to: '/',          label: 'Home' },
  { to: '/simulator', label: 'Simulator' },
  { to: '/learn',     label: 'Learn' },
  { to: '/faq',       label: 'FAQ' },
  { to: '/about',     label: 'About' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, toggleTheme]    = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change / escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <nav
        className={scrolled ? 'scrolled' : ''}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 'var(--nav-h)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1.5rem',
          transition: 'background 0.3s ease, backdrop-filter 0.3s ease, border-bottom 0.3s ease',
          background: scrolled ? 'rgba(15,21,37,0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--clr-border)' : '1px solid transparent',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          {/* SVG Logo Icon */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="15" stroke="#00C8FF" strokeWidth="1.5" strokeOpacity="0.4"/>
            <path
              d="M4 20 Q8 10 12 18 Q16 26 20 14 Q24 2 28 12"
              stroke="#00C8FF" strokeWidth="2" strokeLinecap="round" fill="none"
              strokeDasharray="3 2"
              opacity="0.5"
            />
            <path
              d="M4 22 Q9 18 14 19 Q20 20 24 17 Q27 15 28 14"
              stroke="#00C8FF" strokeWidth="2.5" strokeLinecap="round" fill="none"
            />
            <circle cx="28" cy="14" r="3" fill="#00C8FF"/>
          </svg>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.35rem',
            fontWeight: 800,
            color: 'var(--clr-text-bright)',
            letterSpacing: '-0.02em',
          }}>
            KalmanVis
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto', marginRight: '1.5rem' }}
          className="desktop-nav">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                padding: '0.4rem 0.875rem',
                borderRadius: 'var(--radius-sm)',
                color: isActive ? 'var(--clr-cyan)' : 'var(--clr-text-muted)',
                fontWeight: 500,
                fontSize: '0.9rem',
                transition: 'color 0.2s ease, background 0.2s ease',
                background: isActive ? 'var(--clr-cyan-dim)' : 'transparent',
                borderBottom: isActive ? '2px solid var(--clr-cyan)' : '2px solid transparent',
                textDecoration: 'none',
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--clr-text-muted)',
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s ease',
            }}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* CTA */}
          <Link to="/simulator" className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Zap size={14} />
            Launch Simulator
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--clr-text)',
              padding: '0.5rem',
            }}
            className="hamburger-btn"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999,
              background: 'rgba(7,11,20,0.97)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
              padding: '2rem',
            }}
          >
            <button
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'absolute', top: '1.5rem', right: '1.5rem',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--clr-text)', padding: '0.5rem',
              }}
            >
              <X size={24} />
            </button>

            {NAV_LINKS.map(({ to, label }, i) => (
              <motion.div
                key={to}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={() => setMenuOpen(false)}
                  style={({ isActive }) => ({
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: isActive ? 'var(--clr-cyan)' : 'var(--clr-text)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    display: 'block',
                    textAlign: 'center',
                    padding: '0.5rem 2rem',
                    minHeight: '56px',
                    lineHeight: '56px',
                  })}
                >
                  {label}
                </NavLink>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ marginTop: '1rem', width: '100%', maxWidth: '300px' }}
            >
              <Link
                to="/simulator"
                onClick={() => setMenuOpen(false)}
                className="btn btn-primary btn-full btn-lg"
                style={{ justifyContent: 'center' }}
              >
                <Zap size={18} /> Launch Simulator
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>

      {/* Spacer */}
      <div style={{ height: 'var(--nav-h)' }} />
    </>
  );
}
