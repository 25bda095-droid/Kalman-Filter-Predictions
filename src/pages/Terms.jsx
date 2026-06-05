// src/pages/Terms.jsx
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const MIT_LICENSE = `MIT License

Copyright (c) 2025 KalmanVis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

export default function Terms() {
  return (
    <>
      <SEO
        title="Terms & Conditions — KalmanVis"
        description="KalmanVis Terms and Conditions. Educational use, MIT License, and disclaimer of warranties."
        path="/terms"
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
            <h1 style={{ fontFamily: 'var(--font-display)' }}>Terms & Conditions</h1>
            <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Last Updated: June 2025
            </p>
          </div>

          <div style={{ height: '2px', background: 'linear-gradient(90deg, var(--clr-cyan), transparent)', marginBottom: '2rem' }} />

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using KalmanVis ("the Service"), you agree to be bound by these Terms and Conditions.
            If you do not agree with any part of these terms, you may not use the Service.
          </p>

          <h2>2. Use of Service</h2>
          <p>
            KalmanVis is provided as a free educational tool for learning about Kalman Filter algorithms,
            state estimation, and autonomous vehicle technology. You may use the Service for:
          </p>
          <ul>
            <li>Personal learning and exploration</li>
            <li>Academic research and coursework</li>
            <li>Teaching and educational demonstrations</li>
            <li>Non-commercial technical analysis</li>
          </ul>
          <p>No commercial warranty is implied or provided.</p>

          <h2>3. Intellectual Property</h2>
          <p>
            The KalmanVis source code is released under the MIT License (see Section 6 below).
            Educational content, documentation, and written explanations are licensed under
            CC-BY 4.0 (Creative Commons Attribution 4.0 International).
          </p>
          <p>
            You are free to fork, modify, and redistribute the code, provided you include the
            original copyright notice and this permission notice.
          </p>

          <h2>4. Disclaimer of Warranties</h2>
          <div style={{
            background: 'var(--clr-red-dim)',
            border: '1px solid rgba(255,77,109,0.3)',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            marginBottom: '1rem',
          }}>
            <p style={{ color: 'var(--clr-red)', fontWeight: 600, marginBottom: '0.5rem' }}>⚠️ Important Safety Notice</p>
            <p style={{ color: 'var(--clr-text-muted)' }}>
              Simulation results produced by KalmanVis are for <strong>educational purposes only</strong> and
              must NOT be used in safety-critical systems, real autonomous vehicles, aircraft, medical devices,
              or any application where failure could result in injury or death.
            </p>
          </div>
          <p>
            The Service is provided "AS IS" without warranty of any kind, express or implied, including
            but not limited to the warranties of merchantability, fitness for a particular purpose,
            and non-infringement.
          </p>

          <h2>5. Limitation of Liability</h2>
          <p>
            In no event shall the KalmanVis authors or contributors be liable for any indirect,
            incidental, special, exemplary, or consequential damages arising out of or in connection
            with the use of this software, even if advised of the possibility of such damage.
          </p>

          <h2>6. Open Source License</h2>
          <p>KalmanVis is released under the MIT License:</p>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            <code>{MIT_LICENSE}</code>
          </pre>

          <h2>7. Contact Information</h2>
          <p>
            For questions about these Terms, please visit our <a href="/contact">contact page</a> or
            email hello@kalmanvis.app.
          </p>
        </motion.div>
      </section>
    </>
  );
}
