// src/components/ParticlesBg.jsx
import { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

const particlesOptions = {
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: { enable: true, mode: 'grab' },
      onClick: { enable: false },
    },
    modes: {
      grab: { distance: 140, links: { opacity: 0.3 } },
    },
  },
  particles: {
    color: { value: '#00C8FF' },
    links: {
      color:   '#00C8FF',
      distance: 150,
      enable:  true,
      opacity: 0.1,
      width:   1,
    },
    move: {
      direction: 'none',
      enable:    true,
      outModes:  { default: 'bounce' },
      random:    false,
      speed:     0.6,
      straight:  false,
    },
    number: {
      density: { enable: true, area: 900 },
      value:   55,
    },
    opacity: {
      value: 0.22,
      animation: {
        enable:   true,
        speed:    0.6,
        minimumValue: 0.1,
        sync:    false,
      },
    },
    shape: { type: 'circle' },
    size: {
      value: { min: 1, max: 2.5 },
    },
  },
  detectRetina: true,
};

export default function ParticlesBg({ style = {} }) {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={particlesOptions}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        ...style,
      }}
    />
  );
}
