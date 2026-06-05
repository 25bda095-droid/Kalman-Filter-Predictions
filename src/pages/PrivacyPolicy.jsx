// src/pages/PrivacyPolicy.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';   // ✅ fixes 404 on /contact click
import SEO from '../components/SEO';

export default function PrivacyPolicy() {
  return (
    <>
      <SEO
        title="Privacy Policy — KalmanVis"
        description="KalmanVis Privacy Policy. We do not collect personal data. All simulations run in your browser."
        path="/privacy-policy"
      />
      <section style={{ padding: '4rem 1.5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="prose"
        >
          <div style={{ marginBottom: '2rem' }}>
            <span className="badge badge-surface" style={{ marginBottom: '1rem', display: 'inline-flex' }}>Legal</span>
            <h1 style={{ fontFamily: 'var(--font-display)' }}>Privacy Policy</h1>
            <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Last Updated: June 2026
            </p>
          </div>

          <div style={{ height: '2px', background: 'linear-gradient(90deg, var(--clr-cyan), transparent)', marginBottom: '2rem' }} />

          <h2>1. What We Collect</h2>
          <p>
            KalmanVis does not collect personal information. All simulation computations run entirely
            in your browser session using JavaScript. No data from your simulations is transmitted
            to any server.
          </p>

          <h2>2. Cookies</h2>
          <p>
            We use no tracking cookies. We store only a single preference value (<code>kv-theme</code>)
            in your browser's localStorage to remember your dark/light theme preference. This value
            never leaves your device.
          </p>
          <p>
            Optional anonymous analytics (visit counts only, no personal data) may be used to
            understand overall usage patterns. If enabled, this uses a privacy-first analytics
            service that does not fingerprint users or share data with third parties.
          </p>

          <h2>3. Third-Party Services</h2>
          <p>We use the following third-party services for functionality only:</p>
          <ul>
            <li><strong>Google Fonts</strong> — loads fonts from Google's CDN, resulting in a request to Google's servers on page load.</li>
            <li><strong>jsDelivr CDN</strong> — loads the KaTeX stylesheet for mathematical notation rendering.</li>
            <li><strong>Formspree</strong> — processes contact form submissions on the Contact page. Only the data you explicitly type into the form (name, email, message) is sent. See <a href="https://formspree.io/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--clr-cyan)' }}>Formspree's Privacy Policy</a> for details.</li>
          </ul>
          <p>We use no advertising networks, no social media trackers, and no third-party analytics platforms that collect personal data.</p>

          <h2>4. Data Security</h2>
          <p>
            Because KalmanVis does not collect or store user data, there is nothing to breach.
            All simulation data exists only in your browser's memory for the duration of your session
            and is discarded when you close the page.
          </p>

          <h2>5. Children's Privacy</h2>
          <p>
            KalmanVis is an educational tool suitable for all ages, including students under 13.
            In compliance with COPPA, we do not knowingly collect any personal information from
            children or any other users.
          </p>

          <h2>6. Open Source</h2>
          <p>
            KalmanVis is open source (MIT License). You can verify exactly what code runs in your
            browser by reviewing the source code on{' '}
            <a href="https://github.com/25bda095-droid" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--clr-cyan)' }}>
              GitHub
            </a>. There are no hidden data collection mechanisms.
          </p>

          <h2>7. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. When we do, we will update the
            "Last Updated" date at the top of this page. Continued use of KalmanVis after any
            changes constitutes your acceptance of the updated policy.
          </p>

          <h2>8. Contact</h2>
          <p>
            If you have any questions about this privacy policy, please visit our{' '}
            {/* ✅ Link instead of <a> — prevents full reload & 404 on Vercel */}
            <Link to="/contact" style={{ color: 'var(--clr-cyan)' }}>contact page</Link>
            {' '}or email us at{' '}
            <a href="mailto:rishavrmishra@gmail.com" style={{ color: 'var(--clr-cyan)' }}>
              rishavrmishra@gmail.com
            </a>.
          </p>
        </motion.div>
      </section>
    </>
  );
}