// src/utils/kalman.js
// Full Kalman Filter implementation using mathjs for matrix operations
import * as math from 'mathjs';

// Seeded random number generator (mulberry32)
function mulberry32(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Box-Muller transform for Gaussian random numbers
function gaussianRandom(rand) {
  let u = 0, v = 0;
  while (u === 0) u = rand();
  while (v === 0) v = rand();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// Helper: safely extract scalar from mathjs result
function scalar(v) {
  if (typeof v === 'number') return v;
  if (v && typeof v.valueOf === 'function') return v.valueOf();
  return Number(v);
}

// ─── CV Kalman Filter (4-state: [x, vx, y, vy]) ────────────────────────────

export class KalmanCV {
  constructor(dt, qPos, qVel, rNoise) {
    // State transition matrix F
    this.F = math.matrix([
      [1, dt, 0,  0],
      [0,  1, 0,  0],
      [0,  0, 1, dt],
      [0,  0, 0,  1],
    ]);

    // Process noise Q
    const q  = qPos;
    const qv = qVel;
    const dt2 = dt * dt;
    const dt3 = dt2 * dt;
    this.Q = math.matrix([
      [q * dt3 / 3, q * dt2 / 2,           0,            0],
      [q * dt2 / 2, q * dt + qv * dt,       0,            0],
      [0,           0,           q * dt3 / 3, q * dt2 / 2],
      [0,           0,           q * dt2 / 2, q * dt + qv * dt],
    ]);

    // Measurement matrix H (observe x and y only)
    this.H = math.matrix([
      [1, 0, 0, 0],
      [0, 0, 1, 0],
    ]);

    // Measurement noise R
    const r = rNoise * rNoise;
    this.R = math.matrix([[r, 0], [0, r]]);

    // State vector [x, vx, y, vy]
    this.x = math.matrix([[0], [0], [0], [0]]);

    // Covariance
    this.P = math.multiply(math.identity(4), 500);

    // Adaptive R (starts as static R)
    this.R_current = math.clone(this.R);
  }

  setState(px, vx, py, vy) {
    this.x = math.matrix([[px], [vx], [py], [vy]]);
  }

  predict() {
    // x = F * x
    this.x = math.multiply(this.F, this.x);
    // P = F * P * F' + Q
    this.P = math.add(
      math.multiply(math.multiply(this.F, this.P), math.transpose(this.F)),
      this.Q
    );
  }

  update(zx, zy, adaptiveAlpha = null) {
    const z = math.matrix([[zx], [zy]]);

    // Innovation: y = z - H*x
    const innov = math.subtract(z, math.multiply(this.H, this.x));

    // S = H*P*H' + R
    const S = math.add(
      math.multiply(math.multiply(this.H, this.P), math.transpose(this.H)),
      this.R_current
    );

    // S_inv for Kalman gain and NIS
    const S_inv = math.inv(S);

    // NIS = y' * S^-1 * y  (scalar)
    const nisMatrix = math.multiply(math.multiply(math.transpose(innov), S_inv), innov);
    const nis = scalar(nisMatrix.get ? nisMatrix.get([0, 0]) : nisMatrix);

    // Kalman gain: K = P*H' * S^-1
    const K = math.multiply(math.multiply(this.P, math.transpose(this.H)), S_inv);

    // Update state: x = x + K*y
    this.x = math.add(this.x, math.multiply(K, innov));

    // Update covariance: P = (I - K*H)*P
    const I = math.identity(4);
    this.P = math.multiply(math.subtract(I, math.multiply(K, this.H)), this.P);

    // Adaptive R update
    if (adaptiveAlpha !== null) {
      const alpha = adaptiveAlpha;
      const innov_outer = math.multiply(innov, math.transpose(innov));
      this.R_current = math.add(
        math.multiply(innov_outer, 1 - alpha),
        math.multiply(this.R_current, alpha)
      );
    }

    return {
      innovX: scalar(innov.get([0, 0])),
      innovY: scalar(innov.get([1, 0])),
      nis: isFinite(nis) ? nis : 0,
    };
  }

  getState() {
    return {
      x:   scalar(this.x.get([0, 0])),
      vx:  scalar(this.x.get([1, 0])),
      y:   scalar(this.x.get([2, 0])),
      vy:  scalar(this.x.get([3, 0])),
      pxx: scalar(this.P.get([0, 0])),
      pyy: scalar(this.P.get([2, 2])),
    };
  }
}

// ─── CA Kalman Filter (6-state: [x, vx, ax, y, vy, ay]) ───────────────────

export class KalmanCA {
  constructor(dt, qPos, qVel, rNoise) {
    const dt2 = dt * dt / 2;
    const dt3 = dt * dt * dt / 6;

    this.F = math.matrix([
      [1, dt, dt * dt / 2, 0,  0,   0],
      [0,  1,          dt, 0,  0,   0],
      [0,  0,           1, 0,  0,   0],
      [0,  0,           0, 1, dt, dt * dt / 2],
      [0,  0,           0, 0,  1,          dt],
      [0,  0,           0, 0,  0,           1],
    ]);

    const q  = qPos;
    const qv = qVel;
    const qa = qVel * 0.1;

    // Diagonal Q
    const Qarr = [
      [q * dt * dt * dt / 3, 0,      0,      0,                   0,      0],
      [0,                    qv * dt, 0,      0,                   0,      0],
      [0,                    0,      qa * dt, 0,                   0,      0],
      [0,                    0,      0,      q * dt * dt * dt / 3, 0,      0],
      [0,                    0,      0,      0,                    qv * dt, 0],
      [0,                    0,      0,      0,                    0,      qa * dt],
    ];
    this.Q = math.matrix(Qarr);

    this.H = math.matrix([
      [1, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0],
    ]);

    const r = rNoise * rNoise;
    this.R = math.matrix([[r, 0], [0, r]]);

    this.x = math.matrix([[0], [0], [0], [0], [0], [0]]);
    this.P = math.multiply(math.identity(6), 500);
    this.R_current = math.clone(this.R);
  }

  setState(px, vx, ax, py, vy, ay) {
    this.x = math.matrix([[px], [vx], [ax], [py], [vy], [ay]]);
  }

  predict() {
    this.x = math.multiply(this.F, this.x);
    this.P = math.add(
      math.multiply(math.multiply(this.F, this.P), math.transpose(this.F)),
      this.Q
    );
  }

  update(zx, zy, adaptiveAlpha = null) {
    const z = math.matrix([[zx], [zy]]);
    const innov = math.subtract(z, math.multiply(this.H, this.x));

    const S = math.add(
      math.multiply(math.multiply(this.H, this.P), math.transpose(this.H)),
      this.R_current
    );

    const S_inv = math.inv(S);
    const nisMatrix = math.multiply(math.multiply(math.transpose(innov), S_inv), innov);
    const nis = scalar(nisMatrix.get ? nisMatrix.get([0, 0]) : nisMatrix);

    const K = math.multiply(math.multiply(this.P, math.transpose(this.H)), S_inv);
    this.x = math.add(this.x, math.multiply(K, innov));

    const I = math.identity(6);
    this.P = math.multiply(math.subtract(I, math.multiply(K, this.H)), this.P);

    if (adaptiveAlpha !== null) {
      const alpha = adaptiveAlpha;
      const innov_outer = math.multiply(innov, math.transpose(innov));
      this.R_current = math.add(
        math.multiply(innov_outer, 1 - alpha),
        math.multiply(this.R_current, alpha)
      );
    }

    return {
      innovX: scalar(innov.get([0, 0])),
      innovY: scalar(innov.get([1, 0])),
      nis: isFinite(nis) ? nis : 0,
    };
  }

  getState() {
    return {
      x:   scalar(this.x.get([0, 0])),
      vx:  scalar(this.x.get([1, 0])),
      ax:  scalar(this.x.get([2, 0])),
      y:   scalar(this.x.get([3, 0])),
      vy:  scalar(this.x.get([4, 0])),
      ay:  scalar(this.x.get([5, 0])),
      pxx: scalar(this.P.get([0, 0])),
      pyy: scalar(this.P.get([3, 3])),
    };
  }
}

// ─── Ground Truth Generator ────────────────────────────────────────────────

function generateTruth(scenario, params) {
  const { dt, duration, initPos, initVel, accX, accY } = params;
  const trueX = [], trueY = [], trueVx = [], trueVy = [];
  let x = initPos[0], y = initPos[1], vx = initVel[0], vy = initVel[1];

  for (let i = 0; i < duration; i++) {
    trueX.push(x);
    trueY.push(y);
    trueVx.push(vx);
    trueVy.push(vy);

    if (scenario === 'cruising' || scenario === 'glitchy_gps') {
      x += vx * dt;
      y += vy * dt;
    } else if (scenario === 'acceleration') {
      vx += accX * dt;
      vy += accY * dt;
      x  += vx * dt;
      y  += vy * dt;
    } else if (scenario === 'braking') {
      const newVx = vx + accX * dt;
      const newVy = vy + accY * dt;
      vx = accX < 0 ? Math.max(0, newVx) : Math.min(0, newVx);
      vy = accY < 0 ? Math.max(0, newVy) : Math.min(0, newVy);
      x += vx * dt;
      y += vy * dt;
    } else if (scenario === 'circular') {
      const omega = 0.1; // angular velocity rad/s
      const cosW = Math.cos(omega * dt);
      const sinW = Math.sin(omega * dt);
      const newVx = vx * cosW - vy * sinW;
      const newVy = vx * sinW + vy * cosW;
      x += vx * dt;
      y += vy * dt;
      vx = newVx;
      vy = newVy;
    }
  }

  return { trueX, trueY, trueVx, trueVy };
}

// ─── Main Simulation Runner ────────────────────────────────────────────────

export function runSimulation(params) {
  const {
    scenario    = 'cruising',
    dt          = 0.1,
    duration    = 100,
    initPos     = [0, 0],
    initVel     = [5, 2],
    accX        = 0,
    accY        = 0,
    measNoise   = 5,
    qPos        = 0.1,
    qVel        = 0.01,
    adaptiveR   = true,
    alpha       = 0.95,
    outlierProb = 0.05,
    outlierScale= 8,
    seed        = 42,
  } = params;

  const rand = mulberry32(seed);

  // Generate ground truth
  const { trueX, trueY, trueVx, trueVy } = generateTruth(
    scenario,
    { dt, duration, initPos, initVel, accX, accY }
  );

  // Generate measurements
  const measX = [], measY = [], isOutlier = [];
  for (let i = 0; i < duration; i++) {
    const outlier = rand() < outlierProb;
    const scale = outlier ? outlierScale : 1;
    measX.push(trueX[i] + gaussianRandom(rand) * measNoise * scale);
    measY.push(trueY[i] + gaussianRandom(rand) * measNoise * scale);
    isOutlier.push(outlier);
  }

  // Initialize CV filter
  const cv = new KalmanCV(dt, qPos, qVel, measNoise);
  cv.setState(initPos[0], initVel[0], initPos[1], initVel[1]);

  const cvX = [], cvY = [], cvVx = [], cvVy = [];
  const cvNIS = [], cvInnovX = [], cvInnovY = [];
  const cvPxx = [], cvPyy = [];

  // Initialize CA filter
  const ca = new KalmanCA(dt, qPos, qVel, measNoise);
  ca.setState(initPos[0], initVel[0], accX, initPos[1], initVel[1], accY);

  const caX = [], caY = [], caVx = [], caVy = [];
  const caNIS = [], caInnovX = [], caInnovY = [];
  const caPxx = [], caPyy = [];

  const time = [];

  for (let i = 0; i < duration; i++) {
    time.push(i * dt);

    // CV step
    cv.predict();
    const cvUpd   = cv.update(measX[i], measY[i], adaptiveR ? alpha : null);
    const cvState = cv.getState();

    cvX.push(cvState.x);
    cvY.push(cvState.y);
    cvVx.push(cvState.vx);
    cvVy.push(cvState.vy);
    cvNIS.push(Math.min(cvUpd.nis, 50));
    cvInnovX.push(cvUpd.innovX);
    cvInnovY.push(cvUpd.innovY);
    cvPxx.push(Math.sqrt(Math.max(cvState.pxx, 0)));
    cvPyy.push(Math.sqrt(Math.max(cvState.pyy, 0)));

    // CA step
    ca.predict();
    const caUpd   = ca.update(measX[i], measY[i], adaptiveR ? alpha : null);
    const caState = ca.getState();

    caX.push(caState.x);
    caY.push(caState.y);
    caVx.push(caState.vx);
    caVy.push(caState.vy);
    caNIS.push(Math.min(caUpd.nis, 50));
    caInnovX.push(caUpd.innovX);
    caInnovY.push(caUpd.innovY);
    caPxx.push(Math.sqrt(Math.max(caState.pxx, 0)));
    caPyy.push(Math.sqrt(Math.max(caState.pyy, 0)));
  }

  return {
    time,
    trueX, trueY, trueVx, trueVy,
    measX, measY, isOutlier,
    cvX, cvY, cvVx, cvVy, cvNIS, cvInnovX, cvInnovY, cvPxx, cvPyy,
    caX, caY, caVx, caVy, caNIS, caInnovX, caInnovY, caPxx, caPyy,
  };
}
