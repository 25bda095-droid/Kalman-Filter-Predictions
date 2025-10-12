import streamlit as st
import numpy as np
import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from kalman_filter import Kalman2DFilter

# Default values for sidebar controls
DEFAULTS = dict(
    init_pos_x=0.0,
    init_pos_y=0.0,
    init_vel_x=5.0,
    init_vel_y=2.0,
    dt=0.1,
    duration=100,
    acceleration_x=0.0,
    acceleration_y=0.0,
    measurement_noise=5.0,
    process_noise_pos=0.1,
    process_noise_vel=0.01,
)

EXAMPLES = dict(
    init_pos_x=0.0,
    init_pos_y=0.0,
    init_vel_x=10.0,
    init_vel_y=3.0,
    dt=0.1,
    duration=150,
    acceleration_x=0.5,
    acceleration_y=0.2,
    measurement_noise=3.0,
    process_noise_pos=0.05,
    process_noise_vel=0.01,
)

# Session state initialization
for key, val in DEFAULTS.items():
    if key not in st.session_state:
        st.session_state[key] = val

if 'kf' not in st.session_state or st.session_state.kf is None:
    st.session_state.kf = Kalman2DFilter(dt=st.session_state['dt'])
if 'simulation_data' not in st.session_state:
    st.session_state.simulation_data = None
if 'run_simulation' not in st.session_state:
    st.session_state.run_simulation = False

# Streamlit page configuration
st.set_page_config(page_title="Kalman Filter Car Game", layout="wide", initial_sidebar_state="expanded")

st.title("🚗 Kalman Filter Car Tracking Game")
st.markdown("""
This interactive application demonstrates how a **Kalman Filter** works by tracking a moving car.
The filter intelligently combines noisy measurements with motion predictions to estimate the car's true position.
""")

# Sidebar controls - bind everything to session_state
st.sidebar.header("⚙️ Configuration")
st.sidebar.subheader("Initial Car State")
init_pos_x = st.sidebar.slider("Initial Position X (m)", -100.0, 100.0, st.session_state['init_pos_x'], step=1.0, key='init_pos_x')
init_pos_y = st.sidebar.slider("Initial Position Y (m)", -100.0, 100.0, st.session_state['init_pos_y'], step=1.0, key='init_pos_y')
init_vel_x = st.sidebar.slider("Initial Velocity X (m/s)", -20.0, 20.0, st.session_state['init_vel_x'], step=0.5, key='init_vel_x')
init_vel_y = st.sidebar.slider("Initial Velocity Y (m/s)", -20.0, 20.0, st.session_state['init_vel_y'], step=0.5, key='init_vel_y')
st.sidebar.subheader("Motion Parameters")
dt = st.sidebar.slider("Time Step (seconds)", 0.01, 1.0, st.session_state['dt'], step=0.01, key='dt')
duration = st.sidebar.slider("Simulation Duration (steps)", 10, 500, st.session_state['duration'], step=10, key='duration')
acceleration_x = st.sidebar.slider("Acceleration X (m/s²)", -5.0, 5.0, st.session_state['acceleration_x'], step=0.1, key='acceleration_x')
acceleration_y = st.sidebar.slider("Acceleration Y (m/s²)", -5.0, 5.0, st.session_state['acceleration_y'], step=0.1, key='acceleration_y')
st.sidebar.subheader("Noise Parameters")
measurement_noise = st.sidebar.slider("Measurement Noise σ (m)", 0.1, 50.0, st.session_state['measurement_noise'], step=0.5, key='measurement_noise')
process_noise_pos = st.sidebar.slider("Process Noise (Position) σ (m²)", 0.001, 1.0, st.session_state['process_noise_pos'], step=0.01, key='process_noise_pos')
process_noise_vel = st.sidebar.slider("Process Noise (Velocity) σ (m²/s²)", 0.001, 1.0, st.session_state['process_noise_vel'], step=0.01, key='process_noise_vel')

# Action buttons
col1, col2, col3 = st.sidebar.columns(3)
if col1.button("▶️ Run Simulation", use_container_width=True):
    st.session_state.kf = Kalman2DFilter(dt=st.session_state['dt'])
    st.session_state.run_simulation = True
    st.rerun()

if col2.button("🔄 Reset", use_container_width=True):
    for k, v in DEFAULTS.items():
        st.session_state[k] = v
    st.session_state.kf = Kalman2DFilter(dt=st.session_state['dt'])
    st.session_state.simulation_data = None
    st.session_state.run_simulation = False
    st.success("✅ Reset complete! All parameters returned to default.")
    st.rerun()

if col3.button("📊 Example Data", use_container_width=True):
    for k, v in EXAMPLES.items():
        st.session_state[k] = v
    st.session_state.kf = Kalman2DFilter(dt=st.session_state['dt'])
    st.session_state.simulation_data = run_kalman_simulation(
        st.session_state.kf,
        init_pos_x=st.session_state['init_pos_x'], init_pos_y=st.session_state['init_pos_y'],
        init_vel_x=st.session_state['init_vel_x'], init_vel_y=st.session_state['init_vel_y'],
        duration=st.session_state['duration'], dt=st.session_state['dt'],
        acceleration_x=st.session_state['acceleration_x'], acceleration_y=st.session_state['acceleration_y'],
        measurement_noise=st.session_state['measurement_noise'],
        process_noise_pos=st.session_state['process_noise_pos'],
        process_noise_vel=st.session_state['process_noise_vel']
    )
    st.success("✅ Example data loaded! All parameters set to example values.")
    st.rerun()

# --- Simulation Logic function unchanged from previous example ---
def run_kalman_simulation(kf, init_pos_x, init_pos_y, init_vel_x, init_vel_y,
                         duration, dt, acceleration_x, acceleration_y, measurement_noise, process_noise_pos, process_noise_vel):
    # [Simulation code - unchanged from your working version]
    ...

# Run simulation if requested -- unchanged
if st.session_state.run_simulation:
    with st.spinner("🔄 Running Kalman filter simulation..."):
        sim_data = run_kalman_simulation(
            st.session_state.kf,
            init_pos_x=st.session_state['init_pos_x'],
            init_pos_y=st.session_state['init_pos_y'],
            init_vel_x=st.session_state['init_vel_x'],
            init_vel_y=st.session_state['init_vel_y'],
            duration=st.session_state['duration'],
            dt=st.session_state['dt'],
            acceleration_x=st.session_state['acceleration_x'],
            acceleration_y=st.session_state['acceleration_y'],
            measurement_noise=st.session_state['measurement_noise'],
            process_noise_pos=st.session_state['process_noise_pos'],
            process_noise_vel=st.session_state['process_noise_vel']
        )
        st.session_state.simulation_data = sim_data
        st.session_state.run_simulation = False
        st.success("✅ Simulation complete!")
        st.rerun()

# Visualization & Tables code remains the same as your previous working version.


