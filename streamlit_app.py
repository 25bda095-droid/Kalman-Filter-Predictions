import streamlit as st
import numpy as np
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
from kalman_filter import Kalman2DFilter

# Page configuration
st.set_page_config(
    page_title="Kalman Filter Car Game",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.title("🚗 Kalman Filter Car Tracking Game")
st.markdown("""
This interactive application demonstrates how a **Kalman Filter** works by tracking a moving car.
The filter intelligently combines noisy measurements with motion predictions to estimate the car's true position.
""")

# ============================================================================
# SIDEBAR: Configuration
# ============================================================================
st.sidebar.header("⚙️ Configuration")

st.sidebar.subheader("Initial Car State")
init_pos_x = st.sidebar.slider("Initial Position X (m)", -100.0, 100.0, 0.0, step=1.0)
init_pos_y = st.sidebar.slider("Initial Position Y (m)", -100.0, 100.0, 0.0, step=1.0)
init_vel_x = st.sidebar.slider("Initial Velocity X (m/s)", -20.0, 20.0, 5.0, step=0.5)
init_vel_y = st.sidebar.slider("Initial Velocity Y (m/s)", -20.0, 20.0, 2.0, step=0.5)

st.sidebar.subheader("Motion Parameters")
dt = st.sidebar.slider("Time Step (seconds)", 0.01, 1.0, 0.1, step=0.01)
duration = st.sidebar.slider("Simulation Duration (steps)", 10, 500, 100, step=10)
acceleration_x = st.sidebar.slider("Acceleration X (m/s²)", -5.0, 5.0, 0.0, step=0.1)
acceleration_y = st.sidebar.slider("Acceleration Y (m/s²)", -5.0, 5.0, 0.0, step=0.1)

st.sidebar.subheader("Noise Parameters")
measurement_noise = st.sidebar.slider(
    "Measurement Noise σ (m)", 0.1, 50.0, 5.0, step=0.5,
    help="Standard deviation of position measurements"
)
process_noise_pos = st.sidebar.slider(
    "Process Noise (Position) σ (m²)", 0.001, 1.0, 0.1, step=0.01,
    help="Uncertainty in motion model for position"
)
process_noise_vel = st.sidebar.slider(
    "Process Noise (Velocity) σ (m²/s²)", 0.001, 1.0, 0.01, step=0.01,
    help="Uncertainty in motion model for velocity"
)

# Initialize session state
if 'kf' not in st.session_state:
    st.session_state.kf = Kalman2DFilter(dt=dt)
    st.session_state.simulation_data = None
    st.session_state.run_simulation = False

# Run or reset simulation
col1, col2, col3 = st.sidebar.columns(3)
if col1.button("▶️ Run Simulation", use_container_width=True):
    st.session_state.run_simulation = True
if col2.button("🔄 Reset", use_container_width=True):
    st.session_state.kf.reset()
    st.session_state.simulation_data = None
    st.session_state.run_simulation = False
if col3.button("📊 Example Data", use_container_width=True):
    # Load example with preset values
    st.session_state.run_simulation = True

# ============================================================================
# SIMULATION LOGIC
# ============================================================================
def run_kalman_simulation(kf, init_pos_x, init_pos_y, init_vel_x, init_vel_y,
                         duration, dt, accel_x, accel_y, meas_noise, proc_noise_pos, proc_noise_vel):
    """
    Run complete Kalman filter simulation.
    
    The simulation:
    1. Generates true car trajectory with constant acceleration
    2. Adds measurement noise to simulate sensor noise
    3. Applies Kalman filter to estimate true state from noisy measurements
    """
    
    # Configure filter
    kf.reset()
    kf.set_initial_state(init_pos_x, init_pos_y, init_vel_x, init_vel_y)
    kf.set_process_noise(proc_noise_pos, proc_noise_vel)
    kf.set_measurement_noise(meas_noise ** 2)
    
    # Storage
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
    
    # True state (not given to filter)
    true_state = np.array([init_pos_x, init_vel_x, init_pos_y, init_vel_y])
    
    for step in range(duration):
        try:
            t = step * dt
            
            # Update true state with acceleration (kinematic equation)
            true_state[0] += true_state[1] * dt + 0.5 * accel_x * dt**2
            true_state[1] += accel_x * dt
            true_state[2] += true_state[3] * dt + 0.5 * accel_y * dt**2
            true_state[3] += accel_y * dt
            
            # Add measurement noise
            measurement_noise_x = np.random.normal(0, meas_noise)
            measurement_noise_y = np.random.normal(0, meas_noise)
            measurement = np.array([
                true_state[0] + measurement_noise_x,
                true_state[2] + measurement_noise_y
            ], dtype=np.float64)
            
            # Apply Kalman filter
            step_result = kf.step(measurement)
        except Exception as e:
            st.error(f"Error in step {step}: {str(e)}")
            break
        
        # Extract results
        estimated_state = step_result['x_updated']
        innovation = step_result['innovation']
        
        # Store history
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

# Run simulation if requested
if st.session_state.run_simulation:
    with st.spinner("🔄 Running Kalman filter simulation..."):
        sim_data = run_kalman_simulation(
            st.session_state.kf,
            init_pos_x, init_pos_y, init_vel_x, init_vel_y,
            duration, dt, acceleration_x, acceleration_y,
            measurement_noise, process_noise_pos, process_noise_vel
        )
        st.session_state.simulation_data = sim_data
        st.session_state.run_simulation = False
        st.success("✅ Simulation complete!")

# ============================================================================
# DISPLAY RESULTS
# ============================================================================
if st.session_state.simulation_data is not None:
    data = st.session_state.simulation_data
    
    # Create tabs for different visualizations
    tab1, tab2, tab3, tab4, tab5 = st.tabs([
        "📍 2D Trajectory", 
        "📈 Position Tracking", 
        "📉 Velocity & Uncertainty",
        "🎯 Errors & Innovation",
        "📋 Data Tables"
    ])
    
    # ========================================================================
    # TAB 1: 2D TRAJECTORY
    # ========================================================================
    with tab1:
        st.subheader("Car Trajectory in 2D Space")
        st.markdown("Blue=True, Red=Measured, Green=Estimated")
        
        fig_traj = go.Figure()
        
        # True trajectory
        fig_traj.add_trace(go.Scatter(
            x=data['true_pos_x'], y=data['true_pos_y'],
            mode='lines+markers', name='True State',
            line=dict(color='blue', width=2),
            marker=dict(size=4)
        ))
        
        # Measurements
        fig_traj.add_trace(go.Scatter(
            x=data['measurement_x'], y=data['measurement_y'],
            mode='markers', name='Measurements (Noisy)',
            marker=dict(color='red', size=3, opacity=0.6)
        ))
        
        # Kalman estimate
        fig_traj.add_trace(go.Scatter(
            x=data['estimated_pos_x'], y=data['estimated_pos_y'],
            mode='lines+markers', name='Kalman Estimate',
            line=dict(color='green', width=2, dash='dash'),
            marker=dict(size=4)
        ))
        
        # Start and end points
        fig_traj.add_trace(go.Scatter(
            x=[data['true_pos_x'][0]], y=[data['true_pos_y'][0]],
            mode='markers', name='Start',
            marker=dict(color='green', size=15, symbol='circle')
        ))
        
        fig_traj.add_trace(go.Scatter(
            x=[data['true_pos_x'][-1]], y=[data['true_pos_y'][-1]],
            mode='markers', name='End (True)',
            marker=dict(color='blue', size=15, symbol='square')
        ))
        
        fig_traj.update_layout(
            title="2D Car Trajectory: Noisy Measurements vs Kalman Filter Estimate",
            xaxis_title="Position X (m)",
            yaxis_title="Position Y (m)",
            height=600,
            hovermode='closest',
            template='plotly_dark'
        )
        st.plotly_chart(fig_traj, use_container_width=True)
    
    # ========================================================================
    # TAB 2: POSITION TRACKING
    # ========================================================================
    with tab2:
        st.subheader("Position Over Time")
        
        fig_pos = make_subplots(
            rows=2, cols=1,
            subplot_titles=("Position X", "Position Y"),
            vertical_spacing=0.12,
            specs=[[{"secondary_y": False}], [{"secondary_y": False}]]
        )
        
        # X position
        fig_pos.add_trace(
            go.Scatter(x=data['time'], y=data['true_pos_x'], mode='lines',
                      name='True X', line=dict(color='blue', width=2)),
            row=1, col=1
        )
        fig_pos.add_trace(
            go.Scatter(x=data['time'], y=data['measurement_x'], mode='markers',
                      name='Measured X', marker=dict(color='red', size=2, opacity=0.5)),
            row=1, col=1
        )
        fig_pos.add_trace(
            go.Scatter(x=data['time'], y=data['estimated_pos_x'], mode='lines',
                      name='Estimated X', line=dict(color='green', width=2, dash='dash')),
            row=1, col=1
        )
        
        # Y position
        fig_pos.add_trace(
            go.Scatter(x=data['time'], y=data['true_pos_y'], mode='lines',
                      name='True Y', line=dict(color='blue', width=2), showlegend=False),
            row=2, col=1
        )
        fig_pos.add_trace(
            go.Scatter(x=data['time'], y=data['measurement_y'], mode='markers',
                      name='Measured Y', marker=dict(color='red', size=2, opacity=0.5), showlegend=False),
            row=2, col=1
        )
        fig_pos.add_trace(
            go.Scatter(x=data['time'], y=data['estimated_pos_y'], mode='lines',
                      name='Estimated Y', line=dict(color='green', width=2, dash='dash'), showlegend=False),
            row=2, col=1
        )
        
        fig_pos.update_xaxes(title_text="Time (s)", row=2, col=1)
        fig_pos.update_yaxes(title_text="X Position (m)", row=1, col=1)
        fig_pos.update_yaxes(title_text="Y Position (m)", row=2, col=1)
        fig_pos.update_layout(height=600, hovermode='x unified', template='plotly_dark')
        
        st.plotly_chart(fig_pos, use_container_width=True)
    
    # ========================================================================
    # TAB 3: VELOCITY & UNCERTAINTY
    # ========================================================================
    with tab3:
        st.subheader("Velocity Estimation & Filter Uncertainty")
        
        fig_vel = make_subplots(
            rows=3, cols=1,
            subplot_titles=("Velocity X", "Velocity Y", "Position Uncertainty (σ)"),
            vertical_spacing=0.1
        )
        
        # Velocity X
        fig_vel.add_trace(
            go.Scatter(x=data['time'], y=data['true_vel_x'], mode='lines',
                      name='True Vel X', line=dict(color='blue', width=2)),
            row=1, col=1
        )
        fig_vel.add_trace(
            go.Scatter(x=data['time'], y=data['estimated_vel_x'], mode='lines',
                      name='Estimated Vel X', line=dict(color='green', width=2, dash='dash')),
            row=1, col=1
        )
        
        # Velocity Y
        fig_vel.add_trace(
            go.Scatter(x=data['time'], y=data['true_vel_y'], mode='lines',
                      name='True Vel Y', line=dict(color='blue', width=2), showlegend=False),
            row=2, col=1
        )
        fig_vel.add_trace(
            go.Scatter(x=data['time'], y=data['estimated_vel_y'], mode='lines',
                      name='Estimated Vel Y', line=dict(color='green', width=2, dash='dash'), showlegend=False),
            row=2, col=1
        )
        
        # Uncertainty
        fig_vel.add_trace(
            go.Scatter(x=data['time'], y=data['uncertainty'], mode='lines',
                      name='Uncertainty', line=dict(color='orange', width=2), fill='tozeroy'),
            row=3, col=1
        )
        
        fig_vel.update_xaxes(title_text="Time (s)", row=3, col=1)
        fig_vel.update_yaxes(title_text="Vel X (m/s)", row=1, col=1)
        fig_vel.update_yaxes(title_text="Vel Y (m/s)", row=2, col=1)
        fig_vel.update_yaxes(title_text="Uncertainty (m)", row=3, col=1)
        fig_vel.update_layout(height=800, hovermode='x unified', template='plotly_dark')
        
        st.plotly_chart(fig_vel, use_container_width=True)
    
    # ========================================================================
    # TAB 4: ERRORS & INNOVATION
    # ========================================================================
    with tab4:
        st.subheader("Prediction Errors & Measurement Innovation")
        
        fig_err = make_subplots(
            rows=2, cols=1,
            subplot_titles=("Position Prediction Error", "Measurement Innovation (Residual)"),
            vertical_spacing=0.12
        )
        
        # Prediction error
        fig_err.add_trace(
            go.Scatter(x=data['time'], y=data['prediction_error_x'], mode='lines',
                      name='Error X', line=dict(color='red', width=1)),
            row=1, col=1
        )
        fig_err.add_trace(
            go.Scatter(x=data['time'], y=data['prediction_error_y'], mode='lines',
                      name='Error Y', line=dict(color='orange', width=1)),
            row=1, col=1
        )
        
        # Innovation (residual)
        fig_err.add_trace(
            go.Scatter(x=data['time'], y=data['innovation_x'], mode='lines',
                      name='Innovation X', line=dict(color='purple', width=1)),
            row=2, col=1
        )
        fig_err.add_trace(
            go.Scatter(x=data['time'], y=data['innovation_y'], mode='lines',
                      name='Innovation Y', line=dict(color='cyan', width=1)),
            row=2, col=1
        )
        
        fig_err.update_xaxes(title_text="Time (s)", row=2, col=1)
        fig_err.update_yaxes(title_text="Error (m)", row=1, col=1)
        fig_err.update_yaxes(title_text="Innovation (m)", row=2, col=1)
        fig_err.update_layout(height=600, hovermode='x unified', template='plotly_dark')
        
        st.plotly_chart(fig_err, use_container_width=True)
    
    # ========================================================================
    # TAB 5: DATA TABLES
    # ========================================================================
    with tab5:
        col_a, col_b = st.columns(2)
        
        with col_a:
            st.subheader("📊 Input Parameters")
            params_df = pd.DataFrame({
                'Parameter': [
                    'Time Step (dt)',
                    'Duration (steps)',
                    'Initial Position X',
                    'Initial Position Y',
                    'Initial Velocity X',
                    'Initial Velocity Y',
                    'Acceleration X',
                    'Acceleration Y',
                    'Measurement Noise σ',
                    'Process Noise (Pos) σ',
                    'Process Noise (Vel) σ'
                ],
                'Value': [
                    f"{dt} s",
                    f"{duration}",
                    f"{init_pos_x:.2f} m",
                    f"{init_pos_y:.2f} m",
                    f"{init_vel_x:.2f} m/s",
                    f"{init_vel_y:.2f} m/s",
                    f"{acceleration_x:.2f} m/s²",
                    f"{acceleration_y:.2f} m/s²",
                    f"{measurement_noise:.2f} m",
                    f"{process_noise_pos:.4f} m²",
                    f"{process_noise_vel:.4f} m²/s²"
                ]
            })
            st.dataframe(params_df, use_container_width=True, hide_index=True)
        
        with col_b:
            st.subheader("📈 Statistics")
            stats_df = pd.DataFrame({
                'Metric': [
                    'Mean Position Error X',
                    'Mean Position Error Y',
                    'Max Position Error',
                    'Mean Innovation X',
                    'Mean Innovation Y',
                    'Final Uncertainty',
                    'Total Distance Traveled'
                ],
                'Value': [
                    f"{np.mean(np.abs(data['prediction_error_x'])):.4f} m",
                    f"{np.mean(np.abs(data['prediction_error_y'])):.4f} m",
                    f"{np.max(np.sqrt(np.array(data['prediction_error_x'])**2 + np.array(data['prediction_error_y'])**2)):.4f} m",
                    f"{np.mean(np.abs(data['innovation_x'])):.4f} m",
                    f"{np.mean(np.abs(data['innovation_y'])):.4f} m",
                    f"{data['uncertainty'][-1]:.4f} m",
                    f"{sum(np.sqrt(np.diff(np.array(data['true_pos_x']))**2 + np.diff(np.array(data['true_pos_y']))**2)):.2f} m"
                ]
            })
            st.dataframe(stats_df, use_container_width=True, hide_index=True)
        
        st.subheader("🔢 Time Series Data (First 20 Rows)")
        display_df = pd.DataFrame({
            'Time (s)': data['time'][:20],
            'True X (m)': np.round(data['true_pos_x'][:20], 3),
            'Measured X (m)': np.round(data['measurement_x'][:20], 3),
            'Est X (m)': np.round(data['estimated_pos_x'][:20], 3),
            'Error X (m)': np.round(data['prediction_error_x'][:20], 3),
            'True Y (m)': np.round(data['true_pos_y'][:20], 3),
            'Measured Y (m)': np.round(data['measurement_y'][:20], 3),
            'Est Y (m)': np.round(data['estimated_pos_y'][:20], 3),
            'Error Y (m)': np.round(data['prediction_error_y'][:20], 3),
            'Uncertainty (m)': np.round(data['uncertainty'][:20], 4)
        })
        st.dataframe(display_df, use_container_width=True, hide_index=True)
        
        # Download CSV
        csv = display_df.to_csv(index=False)
        st.download_button(
            label="📥 Download Data as CSV",
            data=csv,
            file_name="kalman_filter_results.csv",
            mime="text/csv"
        )

else:
    st.info("👈 Configure parameters and click **Run Simulation** to start!")
