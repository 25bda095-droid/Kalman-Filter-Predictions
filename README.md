# 🚗 Kalman Filter Car Tracking Game

An interactive educational application that demonstrates the **Kalman Filter algorithm** through real-time car tracking visualization. Watch as noisy sensor measurements are intelligently combined with motion predictions to accurately estimate a vehicle's position and velocity.

## 📖 What is a Kalman Filter?

The Kalman Filter is an optimal recursive algorithm that estimates the true state of a system from noisy measurements. It balances two sources of uncertainty:

1. **Measurement Noise**: Sensors are imperfect (GPS errors, sensor drift)
2. **Model Uncertainty**: Our motion model isn't perfect (unexpected accelerations, wind effects)

The filter has two main steps executed repeatedly:
- **Prediction**: "Where should the car be based on physics?"
- **Correction**: "Where did the sensor say it is? Let me adjust."

## 🎮 Features

✨ **Interactive Kalman Filter Visualization**
- Real-time 2D trajectory plotting (true vs measured vs estimated)
- Position tracking over time with confidence bands
- Velocity estimation (not directly measured!)
- Prediction error analysis
- Measurement innovation (residual) display

📊 **Comprehensive Analysis**
- Filter uncertainty over time
- Position prediction errors
- Measurement residuals
- Input parameter configuratio
- Statistical summary tables
- Downloadable CSV data

🛠️ **Educational Value**
- Clear math annotations in code
- Step-by-step Kalman filter implementation
- Configurable noise levels to understand filter behavior
- Visual demonstration of how the filter trades measurement trust vs prediction trust

## 📁 Project Structure

```
kalman-filter-car-game/
├── kalman_filter.py          # Core Kalman filter implementation
├── streamlit_app.py          # Interactive Streamlit UI
├── requirements.txt          # Python dependencies
├── README.md                 # This file
├── .gitignore               # Git ignore rules
├── .streamlit/
│   └── config.toml          # Streamlit configuration
└── example_data/
    └── sample_results.csv   # Example output
```

## 🚀 Quick Start (Local)

### Prerequisites
- Python 3.8+
- pip or conda

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kalman-filter-car-game.git
   cd kalman-filter-car-game
   ```

2. **Create virtual environment** (recommended)
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   streamlit run streamlit_app.py
   ```

5. **Open in browser**
   - Streamlit will automatically open `http://localhost:8501`
   - Or manually navigate to that URL

## 🎛️ Using the Application

### Step 1: Configure Initial State (Left Sidebar)

**Initial Car State:**
- **Position X/Y**: Starting location (meters)
- **Velocity X/Y**: Initial speed (meters/second)

**Motion Parameters:**
- **Time Step**: How often we update (0.01-1.0s). Smaller = more accurate but more steps
- **Duration**: How many steps to simulate (10-500)
- **Acceleration**: Constant acceleration in each direction (m/s²)

**Noise Parameters:**
- **Measurement Noise σ**: How noisy is the sensor? Typical GPS: 5-20m error
- **Process Noise (Position) σ**: Model uncertainty for position
- **Process Noise (Velocity) σ**: Model uncertainty for velocity

### Step 2: Run Simulation

Click **"▶️ Run Simulation"** to execute the Kalman filter with your parameters.

The simulation:
1. Generates true car trajectory based on initial state + acceleration
2. Simulates noisy sensor measurements (true position + random noise)
3. Runs Kalman filter to estimate true position from measurements
4. Stores all intermediate calculations for visualization

### Step 3: Interpret Results

**📍 Tab 1: 2D Trajectory**
- Blue line: True car path (not given to filter)
- Red dots: Noisy measurements (sensor readings)
- Green dashed line: Kalman filter estimate
- See how green smoothly follows blue despite noisy red dots!

**📈 Tab 2: Position Tracking**
- X and Y position over time
- Noisy measurements bounce around
- Kalman estimate smoothly tracks true position
- Filter "knows" the car must move smoothly due to physics

**📉 Tab 3: Velocity & Uncertainty**
- Filter estimates velocity (not directly measured)
- Orange uncertainty band shows filter confidence
- Watch how uncertainty increases without measurements
- Uncertainty decreases when filter gets good measurement

**🎯 Tab 4: Errors & Innovation**
- **Error**: Difference between true and estimated position
- **Innovation**: Difference between measurement and prediction
- Good filter: Errors near zero, innovation has no pattern

**📋 Tab 5: Data Tables**
- Input parameters recap
- Statistical summary
- Raw time series data (downloadable)

## 📚 Understanding the Math

### State Vector
```
x = [pos_x, vel_x, pos_y, vel_y]ᵀ
```
Position and velocity in 2D. Velocity NOT measured - learned by filter!

### Prediction Step (Physics)
```
x_pred = F * x_old  where F = [[1, dt, 0,  0 ],
                               [0,  1, 0,  0 ],
                               [0,  0, 1, dt],
                               [0,  0, 0,  1 ]]
```

New position = old position + velocity × dt
(Assumes constant velocity; no acceleration modeled in F)

### Update Step (Measurement)
```
1. Innovation (residual): y = z - H*x_pred
   How much measurement differs from prediction

2. Innovation Covariance: S = H*P*HᵀR
   Combined uncertainty from model and measurement noise

3. Kalman Gain: K = P*HᵀS⁻¹
   How much to trust measurement vs prediction
   
4. Updated State: x = x_pred + K*y
   Blend prediction with measurement using Kalman gain
```

**Key Insight**: If measurement noise is high, K is small (trust prediction).
If measurement noise is low, K is large (trust measurement).

### Covariance Propagation
```
P_pred = F*P*FᵀQ
```
Uncertainty grows during prediction (process noise Q)
Uncertainty shrinks during update (if measurement is trusted)

## 🔧 Configuration Details

### `kalman_filter.py` - Core Algorithm

**Class: `Kalman2DFilter`**

Key methods:
- `set_initial_state()`: Set starting position and velocity
- `set_process_noise()`: Configure how much model uncertainty
- `set_measurement_noise()`: Configure sensor noise level
- `predict()`: Physics-based state prediction
- `update()`: Measurement-based state correction
- `step()`: Full predict-update cycle

**Important Variables:**
- `F` (4×4): State transition matrix - defines motion model
- `H` (2×4): Measurement matrix - links state to measurements
- `Q` (4×4): Process noise covariance - model uncertainty
- `R` (2×2): Measurement noise covariance - sensor uncertainty
- `P` (4×4): State covariance - filter uncertainty

### `streamlit_app.py` - Interactive UI

**Sidebar Controls:**
- Sliders for all parameters
- Buttons: Run/Reset/Example Data
- Realtime parameter adjustment

**Main Tabs:**
1. 2D Trajectory: Top-down view of car path
2. Position Tracking: X and Y vs time
3. Velocity & Uncertainty: Estimated velocity and confidence
4. Errors & Innovation: Filter performance metrics
5. Data Tables: Summary statistics and CSV export

## 📈 Tips for Learning

### Experiment 1: High Measurement Noise
- Set measurement noise to 20m (very noisy sensor)
- Filter should smooth out the noise significantly
- Red dots scattered, green line smooth
- Innovation will be large

### Experiment 2: Low Process Noise
- Set process noise to 0.001
- Filter trusts motion model very much
- If you add acceleration but model has none, filter will lag
- Add acceleration to see filter recover over time

### Experiment 3: Perfect Sensor
- Set measurement noise to 0.1m
- Filter should closely match measurements
- Green line nearly overlaps red dots
- Innovation becomes very small

### Experiment 4: Curved Motion
- Set Vel X=5, Accel X=1, Vel Y=2, Accel Y=0.5
- Watch car move in curved path
- Filter tracks beautifully despite no velocity measurement
- Physics-based filtering is powerful!

## 🌐 Deployment on Streamlit Cloud

### Step 1: Push to GitHub

```bash
# Initialize git if not done
git init
git add .
git commit -m "Initial Kalman filter car game commit"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/kalman-filter-car-game.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Streamlit Cloud

1. Go to https://share.streamlit.io/
2. Click "New app"
3. Connect your GitHub account (authorize if needed)
4. Select repository: `kalman-filter-car-game`
5. Select branch: `main`
6. Set main file path: `streamlit_app.py`
7. Click "Deploy"

Streamlit will install dependencies from `requirements.txt` automatically.

### Step 3: Share Your App

Your app is now live at: `https://share.streamlit.io/yourusername/kalman-filter-car-game`

Share this URL with anyone!

## 🛠️ Troubleshooting

**Q: "ModuleNotFoundError: No module named 'kalman_filter'"**
- Make sure `kalman_filter.py` is in same directory as `streamlit_app.py`

**Q: App runs slowly with 500 steps**
- Reduce duration slider
- Streamlit reruns entire script on every interaction - normal behavior

**Q: Graphs not showing**
- Check browser console for errors (F12)
- Try clearing browser cache
- Ensure plotly installed: `pip install plotly`

**Q: Deployment on Streamlit Cloud fails**
- Check `requirements.txt` has all packages
- Ensure no local imports not in requirements
- Check app runs locally first

## 📖 References & Further Reading

**Kalman Filter Basics:**
- [Kalman Filter Wikipedia](https://en.wikipedia.org/wiki/Kalman_filter)
- "Understanding the Basis of the Kalman Filter" - Zarchan & Musoff

**Extended Kalman Filter (nonlinear systems):**
- Useful for more realistic motion models
- See kalman_filter.py comments for architecture

**Practical Applications:**
- GPS/IMU fusion
- Drone stabilization
- Autonomous vehicle localization
- Stock price prediction
- Robot tracking

## 📝 License

This project is open source under the MIT License. Feel free to use, modify, and redistribute.

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Extended Kalman Filter (EKF) for nonlinear motion
- Unscented Kalman Filter (UKF)
- Multi-hypothesis tracking
- Particle filter comparison
- Real GPS/IMU data integration

## 💡 Questions or Feedback?

If you have questions, found bugs, or suggestions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include steps to reproduce and expected behavior

---

**Happy filtering! 🎉** The Kalman Filter is one of the most elegant algorithms in control theory. Understanding it deeply opens doors to robotics, autonomous systems, and signal processing.
