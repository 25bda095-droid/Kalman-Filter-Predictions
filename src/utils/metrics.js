// src/utils/metrics.js
// RMSE, NIS, and summary metrics computation

/**
 * Compute RMSE between estimated and truth arrays
 * @param {number[]} estimated
 * @param {number[]} truth
 * @returns {number}
 */
export function computeRMSE(estimated, truth) {
  if (!estimated || !truth || estimated.length === 0) return 0;
  const n = Math.min(estimated.length, truth.length);
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const diff = estimated[i] - truth[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum / n);
}

/**
 * Compute NIS statistics
 * @param {number[]} nisArray
 * @returns {{ mean: number, consistent: boolean, percentBelow: number }}
 */
export function computeNIS(nisArray) {
  if (!nisArray || nisArray.length === 0) return { mean: 0, consistent: false, percentBelow: 0 };
  const threshold = 5.991; // 95% chi-squared with 2 DOF
  const validNIS = nisArray.filter(v => isFinite(v) && !isNaN(v));
  if (validNIS.length === 0) return { mean: 0, consistent: false, percentBelow: 0 };
  const mean = validNIS.reduce((a, b) => a + b, 0) / validNIS.length;
  const countBelow = validNIS.filter(v => v < threshold).length;
  const percentBelow = (countBelow / validNIS.length) * 100;
  const consistent = percentBelow >= 80 && percentBelow <= 98; // roughly 85-97% is good
  return { mean, consistent, percentBelow };
}

/**
 * Compute full metrics from simulation results
 * @param {Object} data - runSimulation output
 * @returns {Object} metrics
 */
export function computeMetrics(data) {
  if (!data) return null;

  const {
    trueX, trueY, trueVx, trueVy,
    cvX, cvY, cvVx, cvVy, cvNIS,
    caX, caY, caVx, caVy, caNIS,
  } = data;

  const cvPosRMSE = Math.sqrt(
    (computeRMSE(cvX, trueX) ** 2 + computeRMSE(cvY, trueY) ** 2) / 2
  );
  const caPosRMSE = Math.sqrt(
    (computeRMSE(caX, trueX) ** 2 + computeRMSE(caY, trueY) ** 2) / 2
  );
  const cvVelRMSE = Math.sqrt(
    (computeRMSE(cvVx, trueVx) ** 2 + computeRMSE(cvVy, trueVy) ** 2) / 2
  );
  const caVelRMSE = Math.sqrt(
    (computeRMSE(caVx, trueVx) ** 2 + computeRMSE(caVy, trueVy) ** 2) / 2
  );

  const cvNISStats = computeNIS(cvNIS);
  const caNISStats = computeNIS(caNIS);

  const cvWins = cvPosRMSE < caPosRMSE;

  // Determine verdict
  let cvVerdict, caVerdict;
  const ratio = cvPosRMSE / Math.max(caPosRMSE, 0.001);
  if (ratio < 0.7) {
    cvVerdict = 'RECOMMENDED';
    caVerdict = 'UNDERPERFORMS';
  } else if (ratio > 1.4) {
    cvVerdict = 'UNDERPERFORMS';
    caVerdict = 'RECOMMENDED';
  } else {
    cvVerdict = 'ADEQUATE';
    caVerdict = 'ADEQUATE';
  }

  return {
    cv: {
      posRMSE: cvPosRMSE,
      velRMSE: cvVelRMSE,
      xRMSE:   computeRMSE(cvX, trueX),
      yRMSE:   computeRMSE(cvY, trueY),
      nisStats: cvNISStats,
      verdict:  cvVerdict,
    },
    ca: {
      posRMSE: caPosRMSE,
      velRMSE: caVelRMSE,
      xRMSE:   computeRMSE(caX, trueX),
      yRMSE:   computeRMSE(caY, trueY),
      nisStats: caNISStats,
      verdict:  caVerdict,
    },
    winner: cvWins ? 'cv' : 'ca',
  };
}

/**
 * Generate CSV string from simulation data
 */
export function generateCSV(data, params) {
  if (!data) return '';
  const { time, trueX, trueY, trueVx, trueVy,
          measX, measY, isOutlier,
          cvX, cvY, cvVx, cvVy, cvNIS,
          caX, caY, caVx, caVy, caNIS } = data;

  const header = [
    'time_s','true_x','true_y','true_vx','true_vy',
    'meas_x','meas_y','is_outlier',
    'cv_x','cv_y','cv_vx','cv_vy','cv_nis',
    'ca_x','ca_y','ca_vx','ca_vy','ca_nis'
  ].join(',');

  const rows = time.map((t, i) => [
    t.toFixed(3),
    trueX[i].toFixed(4), trueY[i].toFixed(4),
    trueVx[i].toFixed(4), trueVy[i].toFixed(4),
    measX[i].toFixed(4), measY[i].toFixed(4),
    isOutlier[i] ? 1 : 0,
    cvX[i].toFixed(4), cvY[i].toFixed(4),
    cvVx[i].toFixed(4), cvVy[i].toFixed(4),
    cvNIS[i].toFixed(4),
    caX[i].toFixed(4), caY[i].toFixed(4),
    caVx[i].toFixed(4), caVy[i].toFixed(4),
    caNIS[i].toFixed(4),
  ].join(','));

  return [header, ...rows].join('\n');
}

/**
 * Trigger a CSV file download in the browser
 */
export function downloadCSV(data, params) {
  const csv = generateCSV(data, params);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kalmanvis_${params.scenario}_seed${params.seed}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
