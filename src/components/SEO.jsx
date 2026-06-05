// src/components/SEO.jsx
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, path = '' }) {
  const baseUrl  = 'https://kalmanvis.app';
  const fullTitle = title
    || 'KalmanVis — Interactive Kalman Filter Simulator | See Through the Noise';
  const fullDesc = description
    || 'Visualise the Kalman Filter algorithm used in autonomous vehicles. Run CV and CA filter simulations with real-time charts, guided results, and math explanations. Free, interactive, browser-based.';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDesc} />
      <meta name="keywords" content="Kalman filter, autonomous vehicles, state estimation, sensor fusion, interactive simulation, CV filter, CA filter, RMSE, NIS, educational tool" />
      <link rel="canonical" href={`${baseUrl}${path}`} />

      {/* Open Graph */}
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={fullDesc} />
      <meta property="og:url"         content={`${baseUrl}${path}`} />
      <meta property="og:type"        content="website" />
      <meta property="og:image"       content={`${baseUrl}/og-image.png`} />

      {/* Twitter */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={fullDesc} />
      <meta name="twitter:image"       content={`${baseUrl}/og-image.png`} />
    </Helmet>
  );
}
