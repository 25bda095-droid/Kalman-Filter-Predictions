import streamlit as st
import numpy as np
import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from kalman_filter import Kalman2DFilter

# ----- Default and Example configs -----
DEFAULTS = {
    'init_pos_x': 0.0,
    'init_pos_y': 0.0,
    'init_vel_x': 5.0,
    'init_vel_y': 2.0,
    'dt': 0.1,
    'duration': 100.0,
    'acceleration_x': 0.0,
    'acceleration_y': 0.0,
    'measurement_noise': 5.0,
    'process_noise_pos': 0.1,
    'process_noise_vel': 0.01
}
EXAMPLES = {
    'init_pos_x': 0.0,
    'init_pos_y': 0.0,
    'init_vel_x': 10.0,
    'init_vel_y': 3.0,
    'dt': 0.1,
    'duration': 150.0,
    'acceleration_x': 0.5,
    'acceleration_y': 0.2,
    'measurement_noise': 3.0,
    'process_noise_pos': 0.05,
    'process_noise_vel': 0.01
}
# Triggers for reset/example
if 'reset_trigger' not in st.session_state:
    st.session_state.reset_trigger = False
if 'example_trigger' not in st.session_state:
    st.session_state.example_trigger = False

# BEFORE widgets, check triggers and update session_state for controls
if st.session_state.reset_trigger:
    for key, val in DEFAULTS.items():
        st.session_state[key] = val
    st.session_state.reset_trigger = False

if st.session_state.example_trigger:
    for key, val in EXAMPLES.items():
        st.session_state[key] = val
    st.session_state.example_trigger = False

# Streamlit page setup
st.set_page_config(page_title="Kalman Filter Car Game", layout="wide", initial_sidebar_state="expanded")
st.title("🚗 Kalman Filter Car Tracking Game")
st.markdown("""
This interactive application demonstrates how a **Kalman Filter** works by tracking a moving car.
The filter intelligently combines noisy measurements with motion predictions to estimate the car's true position.
""")

# --- SIDEBAR widgets using floats everywhere ---
st.sidebar.header("⚙️ Configuration")
st.sidebar.subheader("Initial Car State")
init_pos_x = st.sidebar.slider(
    "Initial Position X (m)", -100.0, 100.0, float(st.session_state.get('init_pos_x', 0.0)), step=1.0, key='init_pos_x')
init_pos_y = st.sidebar.slider(
    "Initial Position Y (m)", -100.0, 100.0, float(st.session_state.get('init_pos_y', 0.0)), step=1.0, key='init_pos_y')
init_vel_x = st.sidebar.slider(
    "Initial Velocity X (m/s)", -20.0, 20.0, float(st.session_state.get('init_vel_x', 5.0)), step=0.5, key='init_vel_x')
init_vel_y = st.sidebar.slider(
    "Initial Velocity Y (m/s)", -20.0, 20.0, float(st.session_state.get('init_vel_y', 2.0)), step=0.5, key='init_vel_y')

st.sidebar.subheader("Motion Parameters")
dt = st.sidebar.slider(
    "Time Step (seconds)", 0.01, 1.0, float(st.session_state.get('dt', 0.1)), step=0.01, key='dt')
duration = st.sidebar.slider(
    "Simulation Duration (steps)", 10.0, 500.0, float(st.session_state.get('duration', 100.0)), step=10.0, key='duration')
acceleration_x = st.sidebar.slider(
    "Acceleration X (m/s²)", -5.0, 5.0, float(st.session_state.get('acceleration_x', 0.0)), step=0.1, key='acceleration_x')
acceleration_y = st.sidebar.slider(
    "Acceleration Y (m/s²)", -5.0, 5.0, float(st.session_state.get('acceleration_y', 0.0)), step=0.1, key='acceleration_y')

st.sidebar.subheader("Noise Parameters")
measurement_noise = st.sidebar.slider(
    "Measurement Noise σ (m)", 0.1, 50.0, float(st.session_state.get('measurement_noise', 5.0)), step=0.5, key='measurement_noise')
process_noise_pos = st.sidebar.slider(
    "Process Noise (Position) σ (m²)", 0.001, 1.0, float(st.session_state.get('process_noise_pos', 0.1)), step=0.01, key='process_noise_pos')
process_noise_vel = st.sidebar.slider(
    "Process Noise (Velocity) σ (m²/s²)", 0.001, 1.0, float(st.session_state.get('process_noise_vel', 0.01)), step=0.01, key='process_noise_vel')

# Initialize Kalman2DFilter only once per new dt
if 'kf' not in st.session_state or not isinstance(st.session_state.kf, Kalman2DFilter):
    st.session_state.kf = Kalman2DFilter(dt=float(st.session_state.get('dt', 0.1)))
if 'simulation_data' not in st.session_state:
    st.session_state.simulation_data = None
if 'run_simulation' not in st.session_state:
    st.session_state.run_simulation = False

# --- BUTTONS, use triggers, rerun, update state only via session_state ---
col1, col2, col3 = st.sidebar.columns(3)
if col1.button("▶️ Run Simulation", use_container_width=True):
    st.session_state.kf = Kalman2DFilter(dt=float(st.session_state['dt']))
    st.session_state.run_simulation = True
    st.experimental_rerun()

if col2.button("🔄 Reset", use_container_width=True):
    st.session_state.reset_trigger = True
    st.session_state.kf = Kalman2DFilter(dt=float(DEFAULTS['dt']))
    st.session_state.simulation_data = None
    st.session_state.run_simulation = False
    st.experimental_rerun()

if col3.button("📊 Example Data", use_container_width=True):
    st.session_state.example_trigger = True
    st.session_state.kf = Kalman2DFilter(dt=float(EXAMPLES['dt']))
    st.session_state.simulation_data = run_kalman_simulation(
        st.session_state.kf,
        init_pos_x=EXAMPLES['init_pos_x'], init_pos_y=EXAMPLES['init_pos_y'],
        init_vel_x=EXAMPLES['init_vel_x'], init_vel_y=EXAMPLES['init_vel_y'],
        duration=int(EXAMPLES['duration']), dt=EXAMPLES['dt'],
        acceleration_x=EXAMPLES['acceleration_x'], acceleration_y=EXAMPLES['acceleration_y'],
        measurement_noise=EXAMPLES['measurement_noise'],
        process_noise_pos=EXAMPLES['process_noise_pos'],
        process_noise_vel=EXAMPLES['process_noise_vel']
    )
    st.success("✅ Example data loaded! All parameters set to example values.")
    st.experimental_rerun()

# --- Kalman filter simulation using step() & variable names matched to your class ---
def run_kalman_simulation(kf, init_pos_x, init_pos_y, init_vel_x, init_vel_y,
                         duration, dt, acceleration_x, acceleration_y, measurement_noise, process_noise_pos, process_noise_vel):
    kf.reset()
    kf.dt = dt
    kf.F = np.array([
        [1, dt, 0,  0],
        [0,  1, 0,  0],
        [0,  0, 1, dt],
        [0,  0, 0,  1]
    ])
    kf.set_initial_state(init_pos_x, init_pos_y, init_vel_x, init_vel_y)
    kf.set_process_noise(process_noise_pos, process_noise_vel)
    kf.set_measurement_noise(measurement_noise ** 2)
    results = {
        'time': [],
        'true_pos_x': [],
        'true_pos_y': [],
        'true_vel_x': [],
        'true_vel_y': [],
        'measurement_x': [],
        'measurement_y': [],
        'estimated_pos_x': [],
        'estimated_pos_y': [],
        'estimated_vel_x': [],
        'estimated_vel_y': [],
        'uncertainty': [],
        'prediction_error_x': [],
        'prediction_error_y': [],
        'innovation_x': [],
        'innovation_y': []
    }
    true_state = np.array([init_pos_x, init_vel_x, init_pos_y, init_vel_y])
    for step in range(int(duration)):
        t = step * dt
        true_state[0] += true_state[1] * dt + 0.5 * acceleration_x * dt**2
        true_state[1] += acceleration_x * dt
        true_state[2] += true_state[3] * dt + 0.5 * acceleration_y * dt**2
        true_state[3] += acceleration_y * dt
        measurement_noise_x = np.random.normal(0, measurement_noise)
        measurement_noise_y = np.random.normal(0, measurement_noise)
        measurement = np.array([
            true_state[0] + measurement_noise_x,
            true_state[2] + measurement_noise_y
        ], dtype=np.float64)
        step_result = kf.step(measurement)
        estimated_state = step_result['x_updated']
        innovation = step_result['innovation']
        results['time'].append(t)
        results['true_pos_x'].append(true_state[0])
        results['true_pos_y'].append(true_state[2])
        results['true_vel_x'].append(true_state[1])
        results['true_vel_y'].append(true_state[3])
        results['measurement_x'].append(measurement[0])
        results['measurement_y'].append(measurement[1])
        results['estimated_pos_x'].append(estimated_state[0])
        results['estimated_pos_y'].append(estimated_state[2])
        results['estimated_vel_x'].append(estimated_state[1])
        results['estimated_vel_y'].append(estimated_state[3])
        results['uncertainty'].append(kf.get_uncertainty())
        results['prediction_error_x'].append(true_state[0] - estimated_state[0])
        results['prediction_error_y'].append(true_state[2] - estimated_state[2])
        results['innovation_x'].append(innovation[0])
        results['innovation_y'].append(innovation[1])
    return results

# --- RUN simulation with tabbed visualization (your existing code) ---
if st.session_state.run_simulation:
    with st.spinner("🔄 Running Kalman filter simulation..."):
        sim_data = run_kalman_simulation(
            st.session_state.kf,
            init_pos_x=float(st.session_state.get('init_pos_x', 0.0)),
            init_pos_y=float(st.session_state.get('init_pos_y', 0.0)),
            init_vel_x=float(st.session_state.get('init_vel_x', 5.0)),
            init_vel_y=float(st.session_state.get('init_vel_y', 2.0)),
            duration=float(st.session_state.get('duration', 100.0)),
            dt=float(st.session_state.get('dt', 0.1)),
            acceleration_x=float(st.session_state.get('acceleration_x', 0.0)),
            acceleration_y=float(st.session_state.get('acceleration_y', 0.0)),
            measurement_noise=float(st.session_state.get('measurement_noise', 5.0)),
            process_noise_pos=float(st.session_state.get('process_noise_pos', 0.1)),
            process_noise_vel=float(st.session_state.get('process_noise_vel', 0.01))
        )
        st.session_state.simulation_data = sim_data
        st.session_state.run_simulation = False
        st.success("✅ Simulation complete!")
        st.experimental_rerun()

# --- Visualization tabs (remains as in your working code) ---
if st.session_state.simulation_data is not None:
    # ... visualization code as in your previous version ...
    pass
else:
    st.info("👈 Configure parameters and click **Run Simulation** to start!")
