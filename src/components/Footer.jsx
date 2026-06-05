// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import { ExternalLink, MessageSquare, Zap } from 'lucide-react';

const TOOL_LINKS = [
  { to: '/simulator', label: 'Simulator' },
  { to: '/learn',     label: 'Learn the Math' },
];

const INFO_LINKS = [
  { to: '/about',   label: 'About Us' },
  { to: '/faq',     label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

const LEGAL_LINKS = [
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/terms',          label: 'Terms & Conditions' },
];

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--clr-surface)',
      borderTop: '1px solid var(--clr-border)',
      padding: '3rem 1.5rem 0',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Top section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '2rem',
          paddingBottom: '2.5rem',
        }}>
          {/* Brand column */}
          <div>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" stroke="#00C8FF" strokeWidth="1.5" strokeOpacity="0.4"/>
                <path d="M4 20 Q8 10 12 18 Q16 26 20 14 Q24 2 28 12"
                  stroke="#00C8FF" strokeWidth="2" strokeLinecap="round" fill="none"
                  strokeDasharray="3 2" opacity="0.5"/>
                <path d="M4 22 Q9 18 14 19 Q20 20 24 17 Q27 15 28 14"
                  stroke="#00C8FF" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <circle cx="28" cy="14" r="3" fill="#00C8FF"/>
              </svg>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--clr-text-bright)',
              }}>
                KalmanVis
              </span>
            </Link>
            <p style={{
              color: 'var(--clr-text-muted)',
              fontSize: '0.9rem',
              lineHeight: '1.6',
              maxWidth: '260px',
              marginBottom: '1.25rem',
            }}>
              <em>See Through the Noise.</em> An interactive Kalman Filter simulator
              for autonomous vehicle education.
            </p>
            <Link to="/simulator" className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <Zap size={14} /> Launch Simulator
            </Link>
          </div>

          {/* Tool links */}
          <div>
            <h4 style={{ color: 'var(--clr-text-bright)', fontWeight: 600, marginBottom: '1rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Tool
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {TOOL_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} style={{
                    color: 'var(--clr-text-muted)',
                    fontSize: '0.9rem',
                    transition: 'color 0.2s ease',
                    display: 'inline-block',
                  }}
                  onMouseOver={e => e.target.style.color = 'var(--clr-cyan)'}
                  onMouseOut={e => e.target.style.color = 'var(--clr-text-muted)'}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info links */}
          <div>
            <h4 style={{ color: 'var(--clr-text-bright)', fontWeight: 600, marginBottom: '1rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Info
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {INFO_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} style={{
                    color: 'var(--clr-text-muted)',
                    fontSize: '0.9rem',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseOver={e => e.target.style.color = 'var(--clr-cyan)'}
                  onMouseOut={e => e.target.style.color = 'var(--clr-text-muted)'}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 style={{ color: 'var(--clr-text-bright)', fontWeight: 600, marginBottom: '1rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Legal
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {LEGAL_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} style={{
                    color: 'var(--clr-text-muted)',
                    fontSize: '0.9rem',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseOver={e => e.target.style.color = 'var(--clr-cyan)'}
                  onMouseOut={e => e.target.style.color = 'var(--clr-text-muted)'}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--clr-border)' }} />

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 0',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.8125rem' }}>
            © 2025 KalmanVis. Built with ❤️ for autonomous vehicle education. MIT License. Open Source.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <a href="https://github.com/kalmanvis" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--clr-text-muted)', transition: 'color 0.2s ease' }}
              onMouseOver={e => e.currentTarget.style.color = 'var(--clr-cyan)'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--clr-text-muted)'}
            >
              <ExternalLink size={18} />
            </a>
            <a href="https://twitter.com/kalmanvis" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--clr-text-muted)', transition: 'color 0.2s ease' }}
              onMouseOver={e => e.currentTarget.style.color = 'var(--clr-cyan)'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--clr-text-muted)'}
            >
              <MessageSquare size={18} />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
