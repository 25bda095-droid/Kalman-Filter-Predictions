// src/hooks/usePlotlyTheme.js
import { useEffect, useState } from 'react';

const getColors = () => {
  const isDark =
    typeof document !== 'undefined' &&
    document.documentElement.getAttribute('data-theme') !== 'light';

  return {
    textColor:  isDark ? '#E2E8F0' : '#000000',
    mutedColor: isDark ? '#7A8BA8' : '#5A6882',
    gridColor:  isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.14)',
    legendBg:   isDark ? 'rgba(15,21,37,0.8)' : 'rgba(232,238,248,0.8)',
    paperColor: 'rgba(0,0,0,0)',
    plotColor:  'rgba(0,0,0,0)',
  };
};

export function usePlotlyTheme() {
  const [colors, setColors] = useState(getColors);

  useEffect(() => {
    // Watch for data-theme attribute changes on <html>
    const observer = new MutationObserver(() => setColors(getColors()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });
    return () => observer.disconnect();
  }, []);

  return colors;
}
