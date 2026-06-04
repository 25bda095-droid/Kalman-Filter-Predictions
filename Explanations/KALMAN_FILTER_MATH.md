# 🔬 Kalman Filter Mathematics - Complete Explanation

## Table of Contents
1. [Problem Statement](#problem-statement)
2. [State Vector](#state-vector)
3. [Motion Model](#motion-model)
4. [Measurement Model](#measurement-model)
5. [Kalman Filter Algorithm](#kalman-filter-algorithm)
6. [Intuition & Insights](#intuition--insights)
7. [Implementation Details](#implementation-details)

---

## Problem Statement

**The Goal**: Estimate the true state of a system using noisy measurements.

**The Challenge**: 
- Sensors are noisy (GPS has ~5-20m error)
- Motion model is uncertain (wind, friction, unexpected maneuvers)
- Both sources of error are random and unpredictable

**The Solution**: The Kalman Filter optimally combines predictions (from physics) with measurements (from sensors) to get the best estimate.

---

## State Vector

Our system has 4 state variables:

```
x = [x_pos, x_vel, y_pos, y_vel]ᵀ

or written out:
x = [position_x    ]
    [velocity_x    ]
    [position_y    ]
    [velocity_y    ]
```

**Why this state?**
- Position: Where the car is
- Velocity: How fast it's moving (not directly measured!)
- The filter will learn velocity from position changes over time

---

## Motion Model

### The Physics (Constant Velocity Assumption)

Assuming no acceleration (in the motion model):

```
Position Update:    p(t+dt) = p(t) + v(t) * dt
Velocity Update:    v(t+dt) = v(t)
```

### State Transition Matrix F

This matrix encodes the physics:

```
x_new = F * x_old

F = [1  dt  0   0 ]
    [0   1  0   0 ]
    [0   0  1  dt ]
    [0   0  0   1 ]
```

**Interpretation:**
- F[0,0] = 1: new_pos_x = 1 * old_pos_x (keep position)
- F[0,1] = dt: + dt * old_vel_x (add displacement from velocity)
- F[1,1] = 1: new_vel_x = old_vel_x (constant velocity)
- Rows 2-3: Same for Y coordinate

**Example with dt = 0.1s:**
```
Car at: pos_x=0, vel_x=10 m/s
After 0.1s: pos_x_new = 1*0 + 0.1*10 = 1.0 m ✓

Car at: pos_x=5, vel_x=10 m/s
After 0.1s: pos_x_new = 1*5 + 0.1*10 = 6.0 m ✓
```

### Process Noise Q

The motion model is imperfect. We add process noise to account for:
- Unmodeled acceleration (driver brakes, wind)
- Model uncertainty
- Unmodeled dynamics

```
Q = [σ²_pos   0        0        0      ]
    [0     σ²_vel     0        0      ]
    [0        0     σ²_pos    0      ]
    [0        0        0   σ²_vel    ]
```

**Interpretation:**
- σ²_pos: Position uncertainty (m²) - grows if model has error
- σ²_vel: Velocity uncertainty (m²/s²) - grows if acceleration unmodeled

**Typical values:**
- Low noise (Q small): Trust motion model, slow adaptation to measured errors
- High noise (Q large): Don't trust model, adapt quickly to measurements

---

## Measurement Model

### What We Measure

We only measure position, not velocity:

```
Measurement vector z = [pos_x  ]
                       [pos_y  ]

The measurement matrix H (2×4) selects position from state:

H = [1  0  0  0]
    [0  0  1  0]

So: z_measured = H * x_true + noise
```

**Interpretation:**
- H[0,0] = 1: Measure position X (first state element)
- H[1,2] = 1: Measure position Y (third state element)
- All velocity elements ignored (we can't measure velocity directly)

### Measurement Noise R

Real sensors have noise:

```
GPS error typically: 5-20 meters
Radar: 0.5-2 meters
LiDAR: 0.01-0.1 meters

R = [σ²_x    0   ]  (covariance matrix)
    [0    σ²_y   ]

If sensor noise σ = 5 meters:
R = [25   0 ]
    [0   25 ]
```

**Interpretation:**
- Larger R: Sensor is noisy, don't trust measurements much
- Smaller R: Sensor is accurate, trust measurements

---

## Kalman Filter Algorithm

The complete algorithm runs in a loop:

### **PREDICT STEP** (Time Update)

Propagate state and uncertainty forward using motion model.

**Predicted state:**
```
x̂⁻ = F * x̂⁺
```

**What happens**: Apply motion model to last estimate.

**Predicted covariance (uncertainty):**
```
P⁻ = F * P⁺ * Fᵀ + Q
```

**What happens**: 
1. `F * P⁺ * Fᵀ`: Uncertainty grows as it propagates through motion model
2. `+ Q`: Add process noise (model doesn't capture everything)

**Intuition:**
- Uncertainty increases during prediction (we don't know what happens between measurements)
- If Q is large, uncertainty grows faster
- If motion model F accurately captures physics, uncertainty grows slowly

---

### **UPDATE STEP** (Measurement Update)

Use measurement to correct prediction.

**Innovation (Measurement Residual):**
```
y = z - H * x̂⁻
```

**What it means:**
- `H * x̂⁻`: What measurement should we see if prediction is correct?
- `z - ...`: How different is actual measurement?
- Large y: Prediction was wrong, measurement says something different
- Small y: Prediction was good

**Innovation Covariance (total uncertainty in measurement space):**
```
S = H * P⁻ * Hᵀ + R
```

**What it means:**
- `H * P⁻ * Hᵀ`: Uncertainty of predicted measurement (prediction error projected to measurement space)
- `+ R`: Add measurement noise
- S is total uncertainty when comparing prediction to measurement

**Kalman Gain (How much to trust measurement vs prediction):**
```
K = P⁻ * Hᵀ * S⁻¹
```

**What it means:**
- If S is small (high confidence in comparison): K is large (trust measurement more)
- If S is large (low confidence): K is small (trust prediction more)
- K determines the optimal blend

**Visual interpretation:**
```
If R is small (accurate sensor):
  - S is small
  - K is large (close to 1)
  - x̂⁺ = x̂⁻ + K*(z - H*x̂⁻) ≈ z (follow measurement)

If R is large (noisy sensor):
  - S is large
  - K is small (close to 0)
  - x̂⁺ ≈ x̂⁻ (ignore measurement, trust prediction)
```

**Updated State:**
```
x̂⁺ = x̂⁻ + K * y = x̂⁻ + K * (z - H*x̂⁻)
```

**What it means:**
- Start with prediction `x̂⁻`
- Add correction `K * (innovation)` scaled by Kalman gain

**Updated Covariance:**
```
P⁺ = (I - K*H) * P⁻
```

Numerically stable form:
```
P⁺ = P⁻ - K * S * Kᵀ
```

**What it means:**
- Uncertainty decreases after measurement (measurement reduces uncertainty)
- `(I - K*H)`: If K is large (trust measurement), removes more uncertainty
- `(I - K*H)`: If K is small (ignore measurement), removes less uncertainty

---

## Intuition & Insights

### Why Does It Work?

The Kalman Filter is **optimal** for linear systems with Gaussian noise. This means:
- No other algorithm can produce lower estimation error (for this problem class)
- It's both a filter (smooths noise) and a predictor (learns velocity)

### The Beauty of Learning Velocity

The measurement model only observes position, not velocity:

```
z = [pos_x]
    [pos_y]
```

But the filter learns velocity! How?

**Over time:**
- Position changes: Δpos = pos(t) - pos(t-1)
- This should equal: vel * dt (from motion model)
- Measurement residuals (innovations) tell filter if velocity is correct
- Filter updates velocity to explain position changes
- Eventually: estimated velocity ≈ true velocity

**This is the power of the Kalman Filter**: It learns hidden state from observable quantities.

### Covariance Growth & Shrinkage

**Prediction phase** (uncertainty grows):
```
P⁻ = F * P⁺ * Fᵀ + Q
```
- Uncertainty in position grows because velocity is estimated (not certain)
- Uncertainty in velocity doesn't grow (assumed constant velocity in model)

**Update phase** (uncertainty shrinks):
```
P⁺ = (I - K*H) * P⁻
```
- Measurement provides new information: uncertainty shrinks
- How much shrinkage depends on measurement noise R

**In steady state:**
- Predict phase grows uncertainty
- Update phase shrinks it back
- They balance out at a stable uncertainty level

### Divergence vs Convergence

**Filter diverges if:**
- Q is too small: Model is too accurate, reality disproves it → Filter doesn't adapt
- R is too large: Don't trust measurements → Prediction errors accumulate

**Filter converges if:**
- Q and R are reasonable: Balances model trust with measurement trust
- Motion model captures reality well enough
- Measurements arrive regularly

---

## Implementation Details

### Matrix Dimensions

All operations are dimension-compatible:

```
x:        4×1  (state vector)
F:        4×4  (state transition)
P:        4×4  (covariance)
Q:        4×4  (process noise)
H:        2×4  (measurement matrix)
R:        2×2  (measurement noise)
z:        2×1  (measurement)
K:        4×2  (Kalman gain)
S:        2×2  (innovation covariance)
y:        2×1  (innovation)
```

**Predict step dimensions:**
```
x⁻ = F * x⁺           → 4×4 * 4×1 = 4×1 ✓
P⁻ = F * P⁺ * Fᵀ + Q  → 4×4 * 4×4 * 4×4 + 4×4 = 4×4 ✓
```

**Update step dimensions:**
```
y = z - H*x⁻          → 2×1 - 2×4*4×1 = 2×1 ✓
S = H*P⁻*Hᵀ + R       → 2×4 * 4×4 * 4×2 + 2×2 = 2×2 ✓
K = P⁻*Hᵀ*S⁻¹         → 4×4 * 4×2 * 2×2⁻¹ = 4×2 ✓
x⁺ = x⁻ + K*y         → 4×1 + 4×2 * 2×1 = 4×1 ✓
P⁺ = (I - K*H)*P⁻     → (4×4 - 4×2*2×4)*4×4 = 4×4 ✓
```

### Numerical Stability

**Joseph Form for Covariance Update:**
Instead of:
```
P⁺ = (I - K*H) * P⁻
```

Use:
```
P⁺ = P⁻ - K * S * Kᵀ
```

Why? The first form can produce non-symmetric matrices (numerical errors). The second maintains symmetry and positive-definiteness.

### Computational Complexity

**Per iteration:**
- Predict: O(n³) for matrix multiplies (n=4)
- Update: O(n³) for matrix inverse
- Total: ~100 operations per step (very fast!)

For 100 steps: <1ms on modern hardware

---

## Example Walk-Through

### Initial Setup
```
Car at origin, moving 5 m/s in X:
x̂⁰ = [0, 5, 0, 0]ᵀ

Uncertainty (diagonal covariance):
P⁰ = diag([1000, 100, 1000, 100])  (very uncertain initially)

Motion model:
F = [[1,    0.1, 0,     0  ],      dt = 0.1s
     [0,    1,   0,     0  ],
     [0,    0,   1,    0.1],
     [0,    0,   0,     1  ]]

Q = diag([0.01, 0.01, 0.01, 0.01])  (low process noise)
R = 25 * I₂                           (sensor noise σ=5m)
```

### Step 1: Predict
```
x̂⁻ = F * x̂⁰
   = [[1,    0.1, 0,     0  ],     [[0  ],
      [0,    1,   0,     0  ],      [5  ],
      [0,    0,   1,    0.1],   *   [0  ],
      [0,    0,   0,     1  ]]      [0  ]]
   
   = [[0 + 0.1*5  ],     [[0.5],
      [5 + 0      ],  =   [5  ],
      [0 + 0.1*0  ],      [0  ],
      [0 + 0      ]]      [0  ]]

Predicted position: (0.5, 0) ✓ Moved 0.1s at 5 m/s
```

### Step 2: Measurement Arrives
```
True car: at (0.45, 0) with noise
z = [0.42]  (measurement with ~0.05m error)
    [0.03]
```

### Step 3: Innovation
```
y = z - H*x̂⁻
  = [0.42] - [[1, 0, 0, 0], [0.5 ],    = [0.42] - [0.5]  = [-0.08]
    [0.03]   [0, 0, 1, 0]]  [5   ],       [0.03]   [0  ]    [0.03]
                             [0   ],
                             [0   ]]
```

Measurement says position is (0.42, 0.03) but prediction said (0.5, 0).
Innovation: There's a 0.08m discrepancy in X.

### Step 4: Kalman Gain
```
Small innovation covariance means:
S = H*P⁻*Hᵀ + R  (relatively small)

Kalman gain K will be moderate (trust measurement somewhat)

Typical K ≈ [[0.05],
             [0.5 ],   (learns velocity from position changes)
             [0.05],
             [0.5 ]]
```

### Step 5: Update
```
x̂⁺ = x̂⁻ + K * y
    = [0.5] + [[0.05],     [-0.08],    [0.5] + [-0.004] = [0.496]
      [5  ]   [0.5 ],  *   [0.03 ],  = [5  ]   [-0.015] = [4.985]
      [0  ]   [0.05],                  [0  ]   [-0.004]   [-0.004]
      [0  ]   [0.5 ]]                  [0  ]   [0.015]    [0.015]
```

Updated state: position (0.496, -0.004), velocity (4.985, 0.015)

**What happened:**
- Position slightly corrected toward measurement
- Velocity adjusted slightly (0.015 m/s in Y) because measurement had Y component
- Filter is learning velocity from subtle position changes!

---

## Practical Tuning Guidelines

### Tuning Process Noise Q

**Symptoms of Q too small:**
- Estimated state drifts from true state
- Innovation has systematic bias (not zero-mean)
- Prediction errors grow over time

**Fix:** Increase Q

**Symptoms of Q too large:**
- Estimated state jumps around (noisy)
- Covariance barely decreases with measurements
- Filter doesn't smooth measurements

**Fix:** Decrease Q

**Starting point:** Set Q_pos ≈ (max_accel * dt)² / 4 and Q_vel ≈ Q_pos / dt

### Tuning Measurement Noise R

**Symptoms of R too small:**
- Estimated state jerks around following noisy measurements
- Innovation too large
- Covariance artificially low

**Fix:** Increase R

**Symptoms of R too large:**
- Predicted state drifts from true state
- Filter ignores measurements
- Covariance stays high

**Fix:** Decrease R

**Starting point:** Measure actual sensor noise offline, set R = (sensor_std_dev)²

---

## References

**Foundational Papers:**
- Kalman, R. E. (1960). "A New Approach to Linear Filtering and Prediction Problems"
  
**Excellent Textbooks:**
- "Optimal State Estimation" - Dan Simon
- "The Kalman Filter and Related Algorithms" - Bierman
- "Understanding the Basis of the Kalman Filter" - Zarchan & Musoff

**Extensions:**
- Extended Kalman Filter (EKF): For nonlinear systems
- Unscented Kalman Filter (UKF): Better for highly nonlinear systems
- Particle Filter: For non-Gaussian systems

---

## Summary Table

| Concept | Equation | Interpretation |
|---------|----------|-----------------|
| **Predict** | `x⁻ = F*x⁺` | Apply motion model |
| **Predict Cov** | `P⁻ = F*P⁺*Fᵀ+Q` | Uncertainty grows |
| **Innovation** | `y = z - H*x⁻` | Measurement residual |
| **Innovation Cov** | `S = H*P⁻*Hᵀ+R` | Total measurement uncertainty |
| **Kalman Gain** | `K = P⁻*Hᵀ*S⁻¹` | Blending ratio (0-1) |
| **Update** | `x⁺ = x⁻ + K*y` | Correct with measurement |
| **Update Cov** | `P⁺ = (I-K*H)*P⁻` | Uncertainty shrinks |

---

This is a linear, time-invariant, discrete-time Kalman filter for a constant-velocity motion model. Understanding these foundations prepares you for more advanced filters (Extended, Unscented, Particle) used in real systems!
