// src/components/ScrollProgress.jsx
import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      if (total <= 0) { setProgress(0); return; }
      setProgress((scrollTop / total) * 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      zIndex: 9999,
      background: 'var(--clr-surface)',
    }}>
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background: 'var(--clr-cyan)',
          boxShadow: 'var(--glow-cyan)',
          transition: 'width 0.1s linear',
        }}
      />
    </div>
  );
}
