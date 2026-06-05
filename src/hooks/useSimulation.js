// src/hooks/useSimulation.js
import { useState, useCallback } from 'react';
import { runSimulation } from '../utils/kalman';
import { computeMetrics } from '../utils/metrics';

const DEFAULT_PARAMS = {
  scenario:     'cruising',
  dt:           0.1,
  duration:     100,
  initPos:      [0, 0],
  initVel:      [5, 2],
  accX:         0,
  accY:         0,
  measNoise:    5,
  qPos:         0.1,
  qVel:         0.01,
  adaptiveR:    true,
  alpha:        0.95,
  showEllipses: true,
  ellipseInterval: 10,
  outlierProb:  0.05,
  outlierScale: 8,
  seed:         42,
};

export function useSimulation() {
  const [params, setParams]   = useState(DEFAULT_PARAMS);
  const [results, setResults] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [phase, setPhase]     = useState('idle');  // idle | running | walkthrough | dashboard
  const [step, setStep]       = useState(0);
  const [error, setError]     = useState(null);

  const updateParam = useCallback((key, value) => {
    setParams(p => ({ ...p, [key]: value }));
  }, []);

  const loadScenario = useCallback((scenarioKey, defaults) => {
    setParams(p => ({ ...p, scenario: scenarioKey, ...defaults }));
  }, []);

  const resetParams = useCallback(() => {
    setParams(DEFAULT_PARAMS);
    setResults(null);
    setMetrics(null);
    setPhase('idle');
    setStep(0);
    setError(null);
  }, []);

  const startSimulation = useCallback(() => {
    setPhase('running');
    setError(null);

    // Small delay so UI can render loading state before heavy computation
    setTimeout(() => {
      try {
        const data = runSimulation(params);
        const m    = computeMetrics(data);
        setResults(data);
        setMetrics(m);
        setStep(0);
        setPhase('walkthrough');
      } catch (e) {
        console.error('Simulation error:', e);
        setError(e.message || 'Unknown simulation error');
        setPhase('idle');
      }
    }, 600);
  }, [params]);

  const goToStep      = useCallback((s) => setStep(s), []);
  const goToDashboard = useCallback(() => setPhase('dashboard'), []);
  const goToIdle      = useCallback(() => { setPhase('idle'); setStep(0); }, []);
  const goToWalkthrough = useCallback(() => { setPhase('walkthrough'); setStep(0); }, []);

  return {
    params, results, metrics, phase, step, error,
    updateParam, loadScenario, resetParams, startSimulation,
    goToStep, goToDashboard, goToIdle, goToWalkthrough,
    DEFAULT_PARAMS,
  };
}
