// // src/pages/Learn.jsx
// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { InlineMath, BlockMath } from 'react-katex';
// import 'katex/dist/katex.min.css';
// import SEO from '../components/SEO';
// import ScrollProgress from '../components/ScrollProgress';
// import { Zap } from 'lucide-react';

// const SectionHeader = ({ num, title, subtitle }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 30 }}
//     whileInView={{ opacity: 1, y: 0 }}
//     viewport={{ once: true, margin: '-60px' }}
//     transition={{ duration: 0.5 }}
//     style={{ marginBottom: '2rem' }}
//   >
//     <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--clr-cyan)', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
//       SECTION {num}
//     </div>
//     <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>{title}</h2>
//     {subtitle && <p style={{ color: 'var(--clr-text-muted)', maxWidth: '600px' }}>{subtitle}</p>}
//   </motion.div>
// );

// const EqBox = ({ label, children }) => (
//   <div className="katex-block">
//     {label && <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', marginBottom: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>}
//     {children}
//   </div>
// );

// const InfoCard = ({ title, color, children }) => (
//   <div className="card" style={{ borderLeft: `3px solid ${color}`, marginBottom: '1.5rem' }}>
//     <h4 style={{ color, marginBottom: '0.75rem' }}>{title}</h4>
//     {children}
//   </div>
// );

// export default function Learn() {
//   return (
//     <>
//       <SEO
//         title="The Math Behind the Kalman Filter — KalmanVis"
//         description="Deep dive into the Kalman Filter equations. State vectors, F matrix, Kalman gain, NIS diagnostics — all with LaTeX equations and plain-English explanations."
//         path="/learn"
//       />
//       <ScrollProgress />

//       {/* Hero */}
//       <section style={{
//         padding: '5rem 1.5rem 3rem',
//         textAlign: 'center',
//         background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,200,255,0.1) 0%, transparent 70%)',
//       }}>
//         <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
//           <span className="badge badge-cyan" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
//             📐 Mathematical Deep Dive
//           </span>
//           <h1 className="section-title" style={{ marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>
//             The Math That Steers a Self-Driving Car
//           </h1>
//           <p style={{ color: 'var(--clr-text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7, fontSize: '1.1rem' }}>
//             From noisy sensor readings to precise state estimation — this is the algorithm
//             that guided Apollo to the Moon and now navigates autonomous vehicles.
//           </p>
//         </motion.div>
//       </section>

//       <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>

//         {/* ── §1: What is State Estimation ──────────────────── */}
//         <section style={{ padding: '3rem 0' }}>
//           <SectionHeader num="01" title="What is State Estimation?" subtitle="The core problem: knowing where you are when your sensors lie." />
//           <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
//             <p style={{ color: 'var(--clr-text)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
//               Imagine you're driving blindfolded. Every second, someone calls out your approximate position — but they're guessing, and they're wrong by a few metres each time.
//               <strong style={{ color: 'var(--clr-cyan)' }}> State estimation</strong> is the mathematical art of combining those imperfect readings with a physics model of how you move, to produce the best possible guess of your true position.
//             </p>

//             {/* Animated predict → update cycle diagram */}
//             <div style={{
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               gap: '0', marginBottom: '2rem', flexWrap: 'wrap',
//             }}>
//               {[
//                 { label: 'PREDICT', sub: 'Physics model\nx̂⁻ = F·x̂', color: '#9B5DE5', bg: 'rgba(155,93,229,0.15)' },
//                 { label: '→', color: 'var(--clr-text-muted)', bg: 'transparent', noBox: true },
//                 { label: 'UPDATE', sub: 'Sensor reading\nx̂ = x̂⁻ + K·ν', color: '#00C8FF', bg: 'rgba(0,200,255,0.1)' },
//                 { label: '→', color: 'var(--clr-text-muted)', bg: 'transparent', noBox: true },
//                 { label: 'REPEAT', sub: 'Every time\nstep dt', color: '#52B788', bg: 'rgba(82,183,136,0.1)' },
//               ].map((box, i) => (
//                 box.noBox ? (
//                   <span key={i} style={{ fontSize: '1.5rem', color: box.color, padding: '0 0.5rem' }}>{box.label}</span>
//                 ) : (
//                   <div key={i} style={{
//                     background: box.bg,
//                     border: `1.5px solid ${box.color}`,
//                     borderRadius: '12px',
//                     padding: '1rem 1.5rem',
//                     textAlign: 'center',
//                     minWidth: '140px',
//                   }}>
//                     <div style={{ color: box.color, fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>{box.label}</div>
//                     <div style={{ color: 'var(--clr-text-muted)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{box.sub}</div>
//                   </div>
//                 )
//               ))}
//             </div>

//             <p style={{ color: 'var(--clr-text-muted)', lineHeight: 1.8 }}>
//               The Kalman Filter alternates between two steps at every time tick: <strong style={{ color: 'var(--clr-violet)' }}>Predict</strong> (use physics to guess the next state) and <strong style={{ color: 'var(--clr-cyan)' }}>Update</strong> (correct that guess using the latest sensor measurement). It's recursive — the output of each cycle is the input to the next.
//             </p>
//           </motion.div>
//         </section>

//         {/* ── §2: The State Vector ──────────────────────────── */}
//         <section style={{ padding: '3rem 0', borderTop: '1px solid var(--clr-border)' }}>
//           <SectionHeader num="02" title="The State Vector" subtitle="What the filter is tracking at every time step." />
//           <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
//             <p style={{ color: 'var(--clr-text-muted)', marginBottom: '1.5rem', lineHeight: 1.8 }}>
//               The <strong style={{ color: 'var(--clr-text)' }}>state vector</strong> <InlineMath math={"\\mathbf{x}"} /> contains everything the filter tracks. For a 2D vehicle:
//             </p>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
//               <InfoCard title="CV Filter (4-state)" color="#52B788">
//                 <EqBox label="State vector x">
//                   <BlockMath math={"\\mathbf{x} = \\begin{bmatrix} x \\\\ \\dot{x} \\\\ y \\\\ \\dot{y} \\end{bmatrix} = \\begin{bmatrix} \\text{pos}_x \\\\ \\text{vel}_x \\\\ \\text{pos}_y \\\\ \\text{vel}_y \\end{bmatrix}"} />
//                 </EqBox>
//                 <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.875rem' }}>
//                   Assumes constant velocity. Simpler model, fewer parameters to estimate.
//                 </p>
//               </InfoCard>
//               <InfoCard title="CA Filter (6-state)" color="#9B5DE5">
//                 <EqBox label="State vector x">
//                   <BlockMath math={"\\mathbf{x} = \\begin{bmatrix} x \\\\ \\dot{x} \\\\ \\ddot{x} \\\\ y \\\\ \\dot{y} \\\\ \\ddot{y} \\end{bmatrix} = \\begin{bmatrix} \\text{pos}_x \\\\ \\text{vel}_x \\\\ \\text{acc}_x \\\\ \\text{pos}_y \\\\ \\text{vel}_y \\\\ \\text{acc}_y \\end{bmatrix}"} />
//                 </EqBox>
//                 <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.875rem' }}>
//                   Models acceleration too. Better for braking, turning, and unsteady motion.
//                 </p>
//               </InfoCard>
//             </div>
//           </motion.div>
//         </section>

//         {/* ── §3: Prediction Step ──────────────────────────── */}
//         <section style={{ padding: '3rem 0', borderTop: '1px solid var(--clr-border)' }}>
//           <SectionHeader num="03" title="The Prediction Step" subtitle="Physics tells us where we should be next." />
//           <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
//             <EqBox label="State prediction">
//               <BlockMath math={"\\hat{\\mathbf{x}}^{-}_k = \\mathbf{F} \\cdot \\hat{\\mathbf{x}}_{k-1}"} />
//             </EqBox>
//             <EqBox label="Covariance prediction">
//               <BlockMath math={"\\mathbf{P}^{-}_k = \\mathbf{F} \\cdot \\mathbf{P}_{k-1} \\cdot \\mathbf{F}^T + \\mathbf{Q}"} />
//             </EqBox>
//             <p style={{ color: 'var(--clr-text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
//               <strong style={{ color: 'var(--clr-text)' }}><InlineMath math={"\\mathbf{F}"} /></strong> is the state transition matrix. For the CV filter with time step <InlineMath math={"dt"} />:
//             </p>
//             <EqBox label="CV transition matrix F">
//               <BlockMath math={"\\mathbf{F}_{CV} = \\begin{bmatrix} 1 & dt & 0 & 0 \\\\ 0 & 1 & 0 & 0 \\\\ 0 & 0 & 1 & dt \\\\ 0 & 0 & 0 & 1 \\end{bmatrix}"} />
//             </EqBox>
//             <p style={{ color: 'var(--clr-text-muted)', lineHeight: 1.8 }}>
//               <InlineMath math={"\\mathbf{Q}"} /> is the process noise covariance — how much uncertainty our physics model adds per step. <InlineMath math={"\\mathbf{P}"} /> tracks overall uncertainty about the state estimate.
//             </p>
//           </motion.div>
//         </section>

//         {/* ── §4: Update Step ──────────────────────────────── */}
//         {/* <section style={{ padding: '3rem 0', borderTop: '1px solid var(--clr-border)' }}>
//           <SectionHeader num="04" title="The Update Step" subtitle="Sensor readings correct our prediction with the Kalman gain." />
//           <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
//             <EqBox label="Innovation (measurement residual)">
//               <BlockMath math={"\\boldsymbol{\\nu}_k = \\mathbf{z}_k - \\mathbf{H} \\cdot \\hat{\\mathbf{x}}^{-}_k"} />
//             </EqBox>
//             <EqBox label="Innovation covariance S">
//               <BlockMath math={"\\mathbf{S}_k = \\mathbf{H} \\cdot \\mathbf{P}^{-}_k \\cdot \\mathbf{H}^T + \\mathbf{R}"} />
//             </EqBox>
//             <EqBox label="Kalman gain K (the trust dial)">
//               <BlockMath math={"\\mathbf{K}_k = \\mathbf{P}^{-}_k \\cdot \\mathbf{H}^T \\cdot \\mathbf{S}^{-1}_k"} />
//             </EqBox>
//             <EqBox label="State update">
//               <BlockMath math={"\\hat{\\mathbf{x}}_k = \\hat{\\mathbf{x}}^{-}_k + \\mathbf{K}_k \\cdot \\boldsymbol{\\nu}_k"} />
//             </EqBox>
//             <EqBox label="Covariance update">
//               <BlockMath math={"\\mathbf{P}_k = (\\mathbf{I} - \\mathbf{K}_k \\cdot \\mathbf{H}) \\cdot \\mathbf{P}^{-}_k"} />
//             </EqBox>
//             <div className="card" style={{ borderLeft: '3px solid var(--clr-gold)', marginTop: '1.5rem' }}>
//               <h4 style={{ color: 'var(--clr-gold)', marginBottom: '0.5rem' }}>💡 The Kalman Gain Intuition</h4>
//               <p style={{ color: 'var(--clr-text-muted)', lineHeight: 1.7 }}>
//                 <strong style={{ color: 'var(--clr-text)' }}>K</strong> is a "trust dial" between 0 and 1. When <strong>K → 0</strong>, the filter trusts its model over the sensor.
//                 When <strong>K → I</strong>, it trusts the sensor completely. The filter automatically finds the optimal balance based on the relative uncertainties <strong>P</strong> and <strong>R</strong>.
//               </p>
//             </div>
//           </motion.div>
//         </section> */}

// {/* ── §4: Update Step ──────────────────────────────── */}
// <section style={{ padding: '3rem 0', borderTop: '1px solid var(--clr-border)' }}>
//   <SectionHeader
//     num="04"
//     title="The Update Step"
//     subtitle="Sensor readings correct our prediction with the Kalman gain."
//   />

//   <motion.div
//     initial={{ opacity: 0 }}
//     whileInView={{ opacity: 1 }}
//     viewport={{ once: true }}
//   >
//     <EqBox label="Innovation (measurement residual)">
//       <BlockMath
//         math={"\\boldsymbol{\\nu}_k = \\mathbf{z}_k - \\mathbf{H} \\cdot \\hat{\\mathbf{x}}^{-}_k"}
//       />
//     </EqBox>

//     <EqBox label="Innovation covariance S">
//       <BlockMath
//         math={"\\mathbf{S}_k = \\mathbf{H} \\cdot \\mathbf{P}^{-}_k \\cdot \\mathbf{H}^{T} + \\mathbf{R}"}
//       />
//     </EqBox>

//     <EqBox label="Kalman gain K (the trust dial)">
//       <BlockMath
//         math={"\\mathbf{K}_k = \\mathbf{P}^{-}_k \\cdot \\mathbf{H}^{T} \\cdot \\mathbf{S}_k^{-1}"}
//       />
//     </EqBox>

//     <EqBox label="State update">
//       <BlockMath
//         math={"\\hat{\\mathbf{x}}_k = \\hat{\\mathbf{x}}^{-}_k + \\mathbf{K}_k \\cdot \\boldsymbol{\\nu}_k"}
//       />
//     </EqBox>

//     <EqBox label="Covariance update">
//       <BlockMath
//         math={"\\mathbf{P}_k = \\left(\\mathbf{I} - \\mathbf{K}_k \\cdot \\mathbf{H}\\right) \\cdot \\mathbf{P}^{-}_k"}
//       />
//     </EqBox>

//     <div
//       className="card"
//       style={{
//         borderLeft: '3px solid var(--clr-gold)',
//         marginTop: '1.5rem',
//       }}
//     >
//       <h4 style={{ color: 'var(--clr-gold)', marginBottom: '0.5rem' }}>
//         💡 The Kalman Gain Intuition
//       </h4>

//       <p style={{ color: 'var(--clr-text-muted)', lineHeight: 1.7 }}>
//         <strong style={{ color: 'var(--clr-text)' }}>K</strong> is a
//         "trust dial" between the prediction and the sensor measurement.
//         When the model is very confident, the filter trusts the prediction
//         more. When sensor uncertainty is low, the filter leans more heavily
//         on the measurement.
//       </p>
//     </div>
//   </motion.div>
// </section>

//         {/* ── §5: CV vs CA ──────────────────────────────────── */}
//         <section style={{ padding: '3rem 0', borderTop: '1px solid var(--clr-border)' }}>
//           <SectionHeader num="05" title="CV vs CA: Choosing Your Model" subtitle="Model mismatch is the enemy of a good filter." />
//           <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
//               <div className="card" style={{ borderTop: '3px solid #52B788' }}>
//                 <h4 style={{ color: '#52B788', marginBottom: '1rem' }}>🟢 CV Filter Wins When...</h4>
//                 <ul style={{ color: 'var(--clr-text-muted)', lineHeight: 2, paddingLeft: '1.25rem', listStyle: 'disc' }}>
//                   <li>Constant velocity motion</li>
//                   <li>Cruising on a straight road</li>
//                   <li>Low acceleration</li>
//                   <li>Simple trajectories</li>
//                 </ul>
//               </div>
//               <div className="card" style={{ borderTop: '3px solid #9B5DE5' }}>
//                 <h4 style={{ color: '#9B5DE5', marginBottom: '1rem' }}>🟣 CA Filter Wins When...</h4>
//                 <ul style={{ color: 'var(--clr-text-muted)', lineHeight: 2, paddingLeft: '1.25rem', listStyle: 'disc' }}>
//                   <li>Braking or acceleration</li>
//                   <li>Turning or curved paths</li>
//                   <li>Changing velocity profiles</li>
//                   <li>Complex manoeuvres</li>
//                 </ul>
//               </div>
//             </div>
//           </motion.div>
//         </section>

//         {/* ── §6: NIS Explained ────────────────────────────── */}
//         <section style={{ padding: '3rem 0', borderTop: '1px solid var(--clr-border)' }}>
//           <SectionHeader num="06" title="NIS: Is the Filter Telling the Truth?" subtitle="Normalized Innovation Squared — the engineer's health check." />
//           <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
//             <EqBox label="Normalized Innovation Squared">
//               <BlockMath math={"\\text{NIS}_k = \\boldsymbol{\\nu}_k^T \\cdot \\mathbf{S}_k^{-1} \\cdot \\boldsymbol{\\nu}_k"} />
//             </EqBox>
//             <p style={{ color: 'var(--clr-text-muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
//               NIS follows a <strong style={{ color: 'var(--clr-text)' }}>chi-squared distribution</strong> with degrees of freedom equal to the measurement dimension (2 for 2D GPS).
//               The 95% threshold for 2 DOF is <strong style={{ color: 'var(--clr-gold)' }}>χ²₂(0.95) ≈ 5.991</strong>.
//             </p>
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
//               <div className="card" style={{ borderLeft: '3px solid #52B788', textAlign: 'center' }}>
//                 <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✅</div>
//                 <div style={{ color: '#52B788', fontWeight: 600, marginBottom: '0.25rem' }}>Consistent</div>
//                 <div style={{ color: 'var(--clr-text-muted)', fontSize: '0.8rem' }}>~95% of NIS values below threshold</div>
//               </div>
//               <div className="card" style={{ borderLeft: '3px solid #FF4D6D', textAlign: 'center' }}>
//                 <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚠️</div>
//                 <div style={{ color: '#FF4D6D', fontWeight: 600, marginBottom: '0.25rem' }}>Over-confident</div>
//                 <div style={{ color: 'var(--clr-text-muted)', fontSize: '0.8rem' }}>Most NIS above threshold (Q or R too small)</div>
//               </div>
//               <div className="card" style={{ borderLeft: '3px solid #FFB703', textAlign: 'center' }}>
//                 <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📉</div>
//                 <div style={{ color: '#FFB703', fontWeight: 600, marginBottom: '0.25rem' }}>Under-confident</div>
//                 <div style={{ color: 'var(--clr-text-muted)', fontSize: '0.8rem' }}>Almost all NIS below threshold (Q or R too large)</div>
//               </div>
//             </div>
//           </motion.div>
//         </section>

//         {/* ── §7: Real-World Uses ───────────────────────────── */}
//         <section style={{ padding: '3rem 0', borderTop: '1px solid var(--clr-border)' }}>
//           <SectionHeader num="07" title="Where Kalman Filters Live" />
//           <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
//             <div className="grid-2">
//               {[
//                 { icon: '🚀', title: 'Apollo 11', desc: 'The original — Rudolf Kálmán\'s filter guided the Apollo lunar module navigation computer in 1969.' },
//                 { icon: '🚗', title: 'Tesla Autopilot', desc: 'Fuses LiDAR, camera, radar, and wheel odometry data 30 times per second for lane-precise navigation.' },
//                 { icon: '📱', title: 'Smartphone GPS', desc: 'Your maps app uses a Kalman filter to smooth jittery GPS into the smooth blue dot you see on screen.' },
//                 { icon: '📈', title: 'Financial Models', desc: 'Used in quantitative trading to estimate hidden market states and smooth noisy price signals.' },
//               ].map((item, i) => (
//                 <motion.div
//                   key={i}
//                   className="card"
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: i * 0.1 }}
//                 >
//                   <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{item.icon}</div>
//                   <h4 style={{ marginBottom: '0.5rem', color: 'var(--clr-text-bright)' }}>{item.title}</h4>
//                   <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>{item.desc}</p>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </section>

//         {/* ── CTA ──────────────────────────────────────────── */}
//         <section style={{
//           padding: '3rem',
//           background: 'linear-gradient(135deg, rgba(0,200,255,0.08), rgba(155,93,229,0.08))',
//           border: '1px solid var(--clr-border)',
//           borderRadius: '20px',
//           textAlign: 'center',
//         }}>
//           <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Now try it yourself</h2>
//           <p style={{ color: 'var(--clr-text-muted)', marginBottom: '2rem' }}>
//             The equations make sense. Now watch them run in real time.
//           </p>
//           <Link to="/simulator" className="btn btn-primary btn-lg">
//             <Zap size={18} /> Launch Simulator →
//           </Link>
//         </section>
//       </div>
//     </>
//   );
// }







// src/pages/Learn.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import SEO from '../components/SEO';
import ScrollProgress from '../components/ScrollProgress';
import { Zap } from 'lucide-react';

// ── Render KaTeX directly — bypasses react-katex strict mode entirely ──
const renderMath = (tex, displayMode = false) => ({
  __html: katex.renderToString(tex, {
    displayMode,
    strict: false,
    throwOnError: false,
  }),
});

// Inline math wrapper
const M = ({ t }) => (
  <span dangerouslySetInnerHTML={renderMath(t, false)} />
);

// Block / display math wrapper
const BM = ({ t }) => (
  <div dangerouslySetInnerHTML={renderMath(t, true)} />
);

// ─────────────────────────────────────────────────────────────

const SectionHeader = ({ num, title, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.5 }}
    style={{ marginBottom: '2rem' }}
  >
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
      color: 'var(--clr-cyan)', letterSpacing: '0.1em', marginBottom: '0.5rem',
    }}>
      SECTION {num}
    </div>
    <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>{title}</h2>
    {subtitle && <p style={{ color: 'var(--clr-text-muted)', maxWidth: '600px' }}>{subtitle}</p>}
  </motion.div>
);

const EqBox = ({ label, children }) => (
  <div className="katex-block">
    {label && (
      <div style={{
        fontSize: '0.75rem', color: 'var(--clr-text-muted)', marginBottom: '0.75rem',
        fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em',
      }}>
        {label}
      </div>
    )}
    {children}
  </div>
);

const InfoCard = ({ title, color, children }) => (
  <div className="card" style={{ borderLeft: `3px solid ${color}`, marginBottom: '1.5rem' }}>
    <h4 style={{ color, marginBottom: '0.75rem' }}>{title}</h4>
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────

export default function Learn() {
  return (
    <>
      <SEO
        title="The Math Behind the Kalman Filter — KalmanVis"
        description="Deep dive into the Kalman Filter equations. State vectors, F matrix, Kalman gain, NIS diagnostics — all with LaTeX equations and plain-English explanations."
        path="/learn"
      />
      <ScrollProgress />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={{
        padding: '5rem 1.5rem 3rem',
        textAlign: 'center',
        background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,200,255,0.1) 0%, transparent 70%)',
      }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="badge badge-cyan" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
            📐 Mathematical Deep Dive
          </span>
          <h1 className="section-title" style={{ marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>
            The Math That Steers a Self-Driving Car
          </h1>
          <p style={{ color: 'var(--clr-text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7, fontSize: '1.1rem' }}>
            From noisy sensor readings to precise state estimation — this is the algorithm
            that guided Apollo to the Moon and now navigates autonomous vehicles.
          </p>
        </motion.div>
      </section>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>

        {/* ── §1: What is State Estimation ────────────────── */}
        <section style={{ padding: '3rem 0' }}>
          <SectionHeader
            num="01"
            title="What is State Estimation?"
            subtitle="The core problem: knowing where you are when your sensors lie."
          />
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p style={{ color: 'var(--clr-text)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              Imagine you're driving blindfolded. Every second, someone calls out your approximate
              position — but they're guessing, and they're wrong by a few metres each time.
              <strong style={{ color: 'var(--clr-cyan)' }}> State estimation</strong> is the
              mathematical art of combining those imperfect readings with a physics model of how
              you move, to produce the best possible guess of your true position.
            </p>

            {/* Predict → Update cycle */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 0, marginBottom: '2rem', flexWrap: 'wrap',
            }}>
              {[
                {
                  label: 'PREDICT', color: '#9B5DE5', bg: 'rgba(155,93,229,0.15)',
                  sub: 'Physics model',
                  math: String.raw`\hat{\mathbf{x}}^{-} = \mathbf{F}\hat{\mathbf{x}}`,
                },
                { arrow: true },
                {
                  label: 'UPDATE', color: '#00C8FF', bg: 'rgba(0,200,255,0.1)',
                  sub: 'Sensor reading',
                  math: String.raw`\hat{\mathbf{x}} = \hat{\mathbf{x}}^{-} + \mathbf{K}\boldsymbol{\nu}`,
                },
                { arrow: true },
                {
                  label: 'REPEAT', color: '#52B788', bg: 'rgba(82,183,136,0.1)',
                  sub: 'Every time step dt', math: null,
                },
              ].map((box, i) =>
                box.arrow ? (
                  <span key={i} style={{ fontSize: '1.5rem', color: 'var(--clr-text-muted)', padding: '0 0.5rem' }}>→</span>
                ) : (
                  <div key={i} style={{
                    background: box.bg, border: `1.5px solid ${box.color}`,
                    borderRadius: '12px', padding: '1rem 1.5rem', textAlign: 'center', minWidth: '140px',
                  }}>
                    <div style={{ color: box.color, fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                      {box.label}
                    </div>
                    <div style={{ color: 'var(--clr-text-muted)', fontSize: '0.72rem', marginBottom: '0.4rem' }}>{box.sub}</div>
                    {box.math && <div style={{ fontSize: '0.7rem' }}><M t={box.math} /></div>}
                  </div>
                )
              )}
            </div>

            <p style={{ color: 'var(--clr-text-muted)', lineHeight: 1.8 }}>
              The Kalman Filter alternates between two steps at every time tick:{' '}
              <strong style={{ color: 'var(--clr-violet)' }}>Predict</strong> (use physics to guess
              the next state) and{' '}
              <strong style={{ color: 'var(--clr-cyan)' }}>Update</strong> (correct that guess using
              the latest sensor measurement). It's recursive — the output of each cycle is the input
              to the next.
            </p>
          </motion.div>
        </section>

        {/* ── §2: The State Vector ─────────────────────────── */}
        <section style={{ padding: '3rem 0', borderTop: '1px solid var(--clr-border)' }}>
          <SectionHeader num="02" title="The State Vector" subtitle="What the filter is tracking at every time step." />
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p style={{ color: 'var(--clr-text-muted)', marginBottom: '1.5rem', lineHeight: 1.8 }}>
              The <strong style={{ color: 'var(--clr-text)' }}>state vector</strong>{' '}
              <M t={String.raw`\mathbf{x}`} />{' '}
              contains everything the filter tracks. For a 2D vehicle:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <InfoCard title="CV Filter (4-state)" color="#52B788">
                <EqBox label="State vector x">
                  <BM t={String.raw`\mathbf{x} = \begin{bmatrix} x \\ \dot{x} \\ y \\ \dot{y} \end{bmatrix} = \begin{bmatrix} \text{pos}_x \\ \text{vel}_x \\ \text{pos}_y \\ \text{vel}_y \end{bmatrix}`} />
                </EqBox>
                <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.875rem' }}>
                  Assumes constant velocity. Simpler model, fewer parameters to estimate.
                </p>
              </InfoCard>
              <InfoCard title="CA Filter (6-state)" color="#9B5DE5">
                <EqBox label="State vector x">
                  <BM t={String.raw`\mathbf{x} = \begin{bmatrix} x \\ \dot{x} \\ \ddot{x} \\ y \\ \dot{y} \\ \ddot{y} \end{bmatrix} = \begin{bmatrix} \text{pos}_x \\ \text{vel}_x \\ \text{acc}_x \\ \text{pos}_y \\ \text{vel}_y \\ \text{acc}_y \end{bmatrix}`} />
                </EqBox>
                <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.875rem' }}>
                  Models acceleration too. Better for braking, turning, and unsteady motion.
                </p>
              </InfoCard>
            </div>
          </motion.div>
        </section>

        {/* ── §3: Prediction Step ──────────────────────────── */}
        <section style={{ padding: '3rem 0', borderTop: '1px solid var(--clr-border)' }}>
          <SectionHeader num="03" title="The Prediction Step" subtitle="Physics tells us where we should be next." />
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <EqBox label="State prediction">
              <BM t={String.raw`\hat{\mathbf{x}}^{-}_k = \mathbf{F} \cdot \hat{\mathbf{x}}_{k-1}`} />
            </EqBox>
            <EqBox label="Covariance prediction">
              <BM t={String.raw`\mathbf{P}^{-}_k = \mathbf{F} \cdot \mathbf{P}_{k-1} \cdot \mathbf{F}^T + \mathbf{Q}`} />
            </EqBox>
            <p style={{ color: 'var(--clr-text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
              <strong style={{ color: 'var(--clr-text)' }}><M t={String.raw`\mathbf{F}`} /></strong>{' '}
              is the state transition matrix. For the CV filter with time step <M t={String.raw`dt`} />:
            </p>
            <EqBox label="CV transition matrix F">
              <BM t={String.raw`\mathbf{F}_{CV} = \begin{bmatrix} 1 & dt & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & dt \\ 0 & 0 & 0 & 1 \end{bmatrix}`} />
            </EqBox>
            <p style={{ color: 'var(--clr-text-muted)', lineHeight: 1.8 }}>
              <M t={String.raw`\mathbf{Q}`} /> is the process noise covariance — how much uncertainty
              our physics model adds per step. <M t={String.raw`\mathbf{P}`} /> tracks overall
              uncertainty about the state estimate.
            </p>
          </motion.div>
        </section>

        {/* ── §4: Update Step ──────────────────────────────── */}
        <section style={{ padding: '3rem 0', borderTop: '1px solid var(--clr-border)' }}>
          <SectionHeader
            num="04"
            title="The Update Step"
            subtitle="Sensor readings correct our prediction with the Kalman gain."
          />
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <EqBox label="Innovation (measurement residual)">
              <BM t={String.raw`\boldsymbol{\nu}_k = \mathbf{z}_k - \mathbf{H} \cdot \hat{\mathbf{x}}^{-}_k`} />
            </EqBox>
            <EqBox label="Innovation covariance S">
              <BM t={String.raw`\mathbf{S}_k = \mathbf{H} \cdot \mathbf{P}^{-}_k \cdot \mathbf{H}^{T} + \mathbf{R}`} />
            </EqBox>
            <EqBox label="Kalman gain K (the trust dial)">
              <BM t={String.raw`\mathbf{K}_k = \mathbf{P}^{-}_k \cdot \mathbf{H}^{T} \cdot \mathbf{S}_k^{-1}`} />
            </EqBox>
            <EqBox label="State update">
              <BM t={String.raw`\hat{\mathbf{x}}_k = \hat{\mathbf{x}}^{-}_k + \mathbf{K}_k \cdot \boldsymbol{\nu}_k`} />
            </EqBox>
            <EqBox label="Covariance update">
              <BM t={String.raw`\mathbf{P}_k = \left(\mathbf{I} - \mathbf{K}_k \cdot \mathbf{H}\right) \cdot \mathbf{P}^{-}_k`} />
            </EqBox>

            <div className="card" style={{ borderLeft: '3px solid var(--clr-gold)', marginTop: '1.5rem' }}>
              <h4 style={{ color: 'var(--clr-gold)', marginBottom: '0.5rem' }}>💡 The Kalman Gain Intuition</h4>
              <p style={{ color: 'var(--clr-text-muted)', lineHeight: 1.7 }}>
                <strong style={{ color: 'var(--clr-text)' }}>K</strong> is a "trust dial" between the
                prediction and the sensor measurement. When <M t={String.raw`K \to 0`} />, the filter
                trusts its physics model over the sensor. When <M t={String.raw`K \to I`} />, it trusts
                the sensor completely. The filter automatically finds the optimal balance based on the
                relative uncertainties <M t={String.raw`\mathbf{P}`} /> and <M t={String.raw`\mathbf{R}`} />.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── §5: CV vs CA ─────────────────────────────────── */}
        <section style={{ padding: '3rem 0', borderTop: '1px solid var(--clr-border)' }}>
          <SectionHeader num="05" title="CV vs CA: Choosing Your Model" subtitle="Model mismatch is the enemy of a good filter." />
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div className="card" style={{ borderTop: '3px solid #52B788' }}>
                <h4 style={{ color: '#52B788', marginBottom: '1rem' }}>🟢 CV Filter Wins When...</h4>
                <ul style={{ color: 'var(--clr-text-muted)', lineHeight: 2, paddingLeft: '1.25rem', listStyle: 'disc' }}>
                  <li>Constant velocity motion</li>
                  <li>Cruising on a straight road</li>
                  <li>Low or zero acceleration</li>
                  <li>Simple, predictable trajectories</li>
                </ul>
              </div>
              <div className="card" style={{ borderTop: '3px solid #9B5DE5' }}>
                <h4 style={{ color: '#9B5DE5', marginBottom: '1rem' }}>🟣 CA Filter Wins When...</h4>
                <ul style={{ color: 'var(--clr-text-muted)', lineHeight: 2, paddingLeft: '1.25rem', listStyle: 'disc' }}>
                  <li>Braking or acceleration events</li>
                  <li>Turning or curved paths</li>
                  <li>Changing velocity profiles</li>
                  <li>Complex manoeuvres</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── §6: NIS Explained ────────────────────────────── */}
        <section style={{ padding: '3rem 0', borderTop: '1px solid var(--clr-border)' }}>
          <SectionHeader num="06" title="NIS: Is the Filter Telling the Truth?" subtitle="Normalized Innovation Squared — the engineer's health check." />
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <EqBox label="Normalized Innovation Squared">
              <BM t={String.raw`\text{NIS}_k = \boldsymbol{\nu}_k^T \cdot \mathbf{S}_k^{-1} \cdot \boldsymbol{\nu}_k`} />
            </EqBox>
            <p style={{ color: 'var(--clr-text-muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              NIS follows a <strong style={{ color: 'var(--clr-text)' }}>chi-squared distribution</strong>{' '}
              with degrees of freedom equal to the measurement dimension (2 for 2D GPS). The 95% threshold
              for 2 DOF is{' '}
              <strong style={{ color: 'var(--clr-gold)' }}>
                <M t={String.raw`\chi^2_2(0.95) \approx 5.991`} />
              </strong>.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="card" style={{ borderLeft: '3px solid #52B788', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✅</div>
                <div style={{ color: '#52B788', fontWeight: 600, marginBottom: '0.25rem' }}>Consistent</div>
                <div style={{ color: 'var(--clr-text-muted)', fontSize: '0.8rem' }}>~95% of NIS values below threshold</div>
              </div>
              <div className="card" style={{ borderLeft: '3px solid #FF4D6D', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚠️</div>
                <div style={{ color: '#FF4D6D', fontWeight: 600, marginBottom: '0.25rem' }}>Over-confident</div>
                <div style={{ color: 'var(--clr-text-muted)', fontSize: '0.8rem' }}>Most NIS above threshold (Q or R too small)</div>
              </div>
              <div className="card" style={{ borderLeft: '3px solid #FFB703', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📉</div>
                <div style={{ color: '#FFB703', fontWeight: 600, marginBottom: '0.25rem' }}>Under-confident</div>
                <div style={{ color: 'var(--clr-text-muted)', fontSize: '0.8rem' }}>Almost all NIS below threshold (Q or R too large)</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── §7: Real-World Uses ───────────────────────────── */}
        <section style={{ padding: '3rem 0', borderTop: '1px solid var(--clr-border)' }}>
          <SectionHeader num="07" title="Where Kalman Filters Live" />
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div className="grid-2">
              {[
                { icon: '🚀', title: 'Apollo 11', desc: "The original — Rudolf Kálmán's filter guided the Apollo lunar module navigation computer in 1969." },
                { icon: '🚗', title: 'Tesla Autopilot', desc: 'Fuses LiDAR, camera, radar, and wheel odometry data 30 times per second for lane-precise navigation.' },
                { icon: '📱', title: 'Smartphone GPS', desc: 'Your maps app uses a Kalman filter to smooth jittery GPS into the smooth blue dot you see on screen.' },
                { icon: '📈', title: 'Financial Models', desc: 'Used in quantitative trading to estimate hidden market states and smooth noisy price signals.' },
              ].map((item, i) => (
                <motion.div
                  key={i} className="card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                  <h4 style={{ marginBottom: '0.5rem', color: 'var(--clr-text-bright)' }}>{item.title}</h4>
                  <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section style={{
          padding: '3rem',
          background: 'linear-gradient(135deg, rgba(0,200,255,0.08), rgba(155,93,229,0.08))',
          border: '1px solid var(--clr-border)',
          borderRadius: '20px',
          textAlign: 'center',
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Now try it yourself</h2>
          <p style={{ color: 'var(--clr-text-muted)', marginBottom: '2rem' }}>
            The equations make sense. Now watch them run in real time.
          </p>
          <Link to="/simulator" className="btn btn-primary btn-lg">
            <Zap size={18} /> Launch Simulator →
          </Link>
        </section>

      </div>
    </>
  );
}