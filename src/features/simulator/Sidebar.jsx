// src/features/simulator/Sidebar.jsx
import { useState } from 'react';
import { Play, RotateCcw, ChevronDown, ChevronRight, Info } from 'lucide-react';
import ScenarioPicker from './ScenarioPicker';
import { TOOLTIPS } from '../../constants/tooltips';

function SliderParam({ label, param, value, min, max, step, unit, tooltip, onChange }) {
  const [showTip, setShowTip] = useState(false);
  const pct = Math.round(((value - min) / (max - min)) * 100);
  const gradient = `linear-gradient(to right, var(--clr-cyan) 0%, var(--clr-cyan) ${pct}%, var(--clr-surface-2) ${pct}%, var(--clr-surface-2) 100%)`;

  return (
    <div className="slider-wrapper">
      <div className="slider-header">
        <label className="slider-label">
          {label}
          {unit && <span className="badge badge-surface" style={{ padding: '0.05rem 0.35rem', fontSize: '0.65rem' }}>{unit}</span>}
          {tooltip && (
            <div className="tooltip-container"
              onMouseEnter={() => setShowTip(true)}
              onMouseLeave={() => setShowTip(false)}
            >
              <span className="tooltip-trigger">?</span>
              {showTip && <div className="tooltip-box">{tooltip}</div>}
            </div>
          )}
        </label>
        <span className="slider-value">{typeof value === 'number' ? value.toFixed(step < 1 ? 2 : 0) : value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(param, parseFloat(e.target.value))}
        style={{ background: gradient }}
      />
    </div>
  );
}

function CheckboxParam({ label, param, value, tooltip, onChange }) {
  const [showTip, setShowTip] = useState(false);
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: '0.625rem',
      cursor: 'pointer', userSelect: 'none', padding: '0.25rem 0',
    }}>
      <input
        type="checkbox"
        checked={value}
        onChange={e => onChange(param, e.target.checked)}
        style={{
          width: '16px', height: '16px',
          accentColor: 'var(--clr-cyan)',
          cursor: 'pointer',
        }}
      />
      <span style={{ fontSize: '0.8125rem', color: 'var(--clr-text-muted)', flex: 1 }}>{label}</span>
      {tooltip && (
        <div className="tooltip-container"
          onMouseEnter={() => setShowTip(true)}
          onMouseLeave={() => setShowTip(false)}
        >
          <span className="tooltip-trigger">?</span>
          {showTip && <div className="tooltip-box">{tooltip}</div>}
        </div>
      )}
    </label>
  );
}

function NumberInput({ label, param, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <label style={{ fontSize: '0.8125rem', color: 'var(--clr-text-muted)' }}>{label}</label>
      <input
        type="number"
        value={value}
        onChange={e => onChange(param, parseInt(e.target.value))}
        className="form-input"
        style={{ fontFamily: 'var(--font-mono)', padding: '0.375rem 0.625rem', fontSize: '0.875rem' }}
      />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ padding: '1rem', borderBottom: '1px solid var(--clr-border)' }}>
      <div style={{
        fontSize: '0.7rem', fontWeight: 700, color: 'var(--clr-text-muted)',
        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem',
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

export default function Sidebar({ sim }) {
  const { params, phase, updateParam, loadScenario, resetParams, startSimulation } = sim;
  const [advOpen, setAdvOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(() => !localStorage.getItem('kv-guide-closed'));

  const closeGuide = () => {
    setGuideOpen(false);
    localStorage.setItem('kv-guide-closed', '1');
  };

  return (
    <aside className="simulator-sidebar">
      {/* Header */}
      <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--clr-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '1.1rem' }}>⚙️</span>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--clr-text-bright)' }}>Simulation Setup</h2>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)' }}>Configure your scenario and filter parameters</p>
      </div>

      {/* Guide panel */}
      {guideOpen && (
        <div style={{
          margin: '0.75rem', padding: '0.875rem',
          background: 'var(--clr-cyan-dim)',
          border: '1px solid rgba(0,200,255,0.25)',
          borderRadius: '10px',
          position: 'relative',
        }}>
          <button onClick={closeGuide} style={{
            position: 'absolute', top: '0.5rem', right: '0.5rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--clr-text-muted)', fontSize: '1rem', lineHeight: 1,
          }}>×</button>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.5rem' }}>
            <Info size={14} color="var(--clr-cyan)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--clr-cyan)' }}>New here?</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--clr-text)' }}>Step 1:</strong> Pick a scenario below<br />
            <strong style={{ color: 'var(--clr-text)' }}>Step 2:</strong> Adjust parameters (hover ? for help)<br />
            <strong style={{ color: 'var(--clr-text)' }}>Step 3:</strong> Click Start Simulation<br />
            <strong style={{ color: 'var(--clr-text)' }}>Step 4:</strong> Walk through guided results
          </div>
        </div>
      )}

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Section title="A — Choose Scenario">
          <ScenarioPicker
            selected={params.scenario}
            onChange={(key, defaults) => loadScenario(key, defaults)}
          />
        </Section>

        <Section title="B — Initial State">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <SliderParam label="Position X" param="initPos" value={params.initPos[0]} min={-50} max={50} step={0.5} unit="m" tooltip={TOOLTIPS.posX}
              onChange={(_, v) => updateParam('initPos', [v, params.initPos[1]])} />
            <SliderParam label="Position Y" param="initPos" value={params.initPos[1]} min={-50} max={50} step={0.5} unit="m" tooltip={TOOLTIPS.posY}
              onChange={(_, v) => updateParam('initPos', [params.initPos[0], v])} />
            <SliderParam label="Velocity X" param="initVel" value={params.initVel[0]} min={-20} max={20} step={0.5} unit="m/s" tooltip={TOOLTIPS.velX}
              onChange={(_, v) => updateParam('initVel', [v, params.initVel[1]])} />
            <SliderParam label="Velocity Y" param="initVel" value={params.initVel[1]} min={-20} max={20} step={0.5} unit="m/s" tooltip={TOOLTIPS.velY}
              onChange={(_, v) => updateParam('initVel', [params.initVel[0], v])} />
          </div>
        </Section>

        <Section title="C — Motion Parameters">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <SliderParam label="Time Step dt" param="dt" value={params.dt} min={0.05} max={0.5} step={0.05} unit="s" tooltip={TOOLTIPS.dt} onChange={updateParam} />
            <SliderParam label="Duration" param="duration" value={params.duration} min={30} max={300} step={10} unit="steps" tooltip={TOOLTIPS.duration} onChange={updateParam} />
            <SliderParam label="Acceleration X" param="accX" value={params.accX} min={-5} max={5} step={0.1} unit="m/s²" tooltip={TOOLTIPS.accX} onChange={updateParam} />
            <SliderParam label="Acceleration Y" param="accY" value={params.accY} min={-5} max={5} step={0.1} unit="m/s²" tooltip={TOOLTIPS.accY} onChange={updateParam} />
          </div>
        </Section>

        <Section title="D — Noise Parameters">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <SliderParam label="Measurement Noise σ" param="measNoise" value={params.measNoise} min={0.5} max={25} step={0.5} unit="m" tooltip={TOOLTIPS.measNoise} onChange={updateParam} />
            <SliderParam label="Process Noise Position" param="qPos" value={params.qPos} min={0.001} max={2} step={0.001} unit="" tooltip={TOOLTIPS.qPos} onChange={updateParam} />
            <SliderParam label="Process Noise Velocity" param="qVel" value={params.qVel} min={0.001} max={0.5} step={0.001} unit="" tooltip={TOOLTIPS.qVel} onChange={updateParam} />
          </div>
        </Section>

        {/* Advanced section */}
        <div style={{ borderBottom: '1px solid var(--clr-border)' }}>
          <button
            onClick={() => setAdvOpen(o => !o)}
            style={{
              width: '100%', padding: '0.875rem 1rem',
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              color: 'var(--clr-text-muted)', fontSize: '0.7rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              transition: 'color 0.2s ease',
            }}
          >
            {advOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            E — Advanced Options
          </button>

          {advOpen && (
            <div style={{ padding: '0 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <CheckboxParam label="Adaptive R (Dynamic Noise)" param="adaptiveR" value={params.adaptiveR} tooltip={TOOLTIPS.adaptiveAlpha} onChange={updateParam} />
              {params.adaptiveR && (
                <SliderParam label="Alpha" param="alpha" value={params.alpha} min={0.5} max={0.999} step={0.001} tooltip={TOOLTIPS.adaptiveAlpha} onChange={updateParam} />
              )}
              <CheckboxParam label="Show Confidence Ellipses" param="showEllipses" value={params.showEllipses} tooltip={TOOLTIPS.showEllipses} onChange={updateParam} />
              {params.showEllipses && (
                <SliderParam label="Ellipse Interval" param="ellipseInterval" value={params.ellipseInterval} min={5} max={50} step={5} unit="steps" tooltip={TOOLTIPS.ellipseInterval} onChange={updateParam} />
              )}
              <SliderParam label="Outlier Probability" param="outlierProb" value={params.outlierProb} min={0} max={0.3} step={0.01} tooltip={TOOLTIPS.outlierProb} onChange={updateParam} />
              <SliderParam label="Outlier Scale" param="outlierScale" value={params.outlierScale} min={1} max={20} step={0.5} tooltip={TOOLTIPS.outlierScale} onChange={updateParam} />
              <NumberInput label="Random Seed" param="seed" value={params.seed} onChange={updateParam} />
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--clr-border)', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        <button
          onClick={startSimulation}
          disabled={phase === 'running'}
          className="btn btn-primary btn-full btn-primary-ping"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          {phase === 'running' ? (
            <>
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: '1rem' }}>⟳</span>
              Running...
            </>
          ) : (
            <><Play size={15} /> Start Simulation</>
          )}
        </button>

        <button
          onClick={resetParams}
          className="btn btn-ghost btn-full"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          <RotateCcw size={14} /> Reset Parameters
        </button>
      </div>
    </aside>
  );
}
