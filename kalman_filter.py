import numpy as np
from dataclasses import dataclass
from typing import Tuple

@dataclass
class KalmanFilterState:
    """Container for Kalman filter state and covariance matrices"""
    x: np.ndarray  # State vector [pos_x, vel_x, pos_y, vel_y]
    P: np.ndarray  # State covariance matrix (4x4)
    Q: np.ndarray  # Process noise covariance (4x4)
    R: np.ndarray  # Measurement noise covariance (2x2)
    
class Kalman2DFilter:
    """
    2D Kalman Filter for tracking car position and velocity.
    
    State Vector: x = [pos_x, vel_x, pos_y, vel_y]
    Measurement Vector: z = [pos_x, pos_y]
    
    The Kalman filter has two main steps:
    1. Prediction: Estimate next state and uncertainty based on motion model
    2. Update: Correct estimate using actual measurement
    """
    
    def __init__(self, dt: float = 0.1):
        """
        Initialize Kalman filter for 2D constant-velocity motion.
        
        Args:
            dt: Time step (seconds)
        """
        self.dt = dt
        
        # State transition matrix F (4x4)
        # Describes how state evolves without control: x_new = F * x_old
        # Models constant velocity: new_pos = old_pos + old_vel * dt
        self.F = np.array([
            [1, dt, 0,  0],   # pos_x = pos_x + vel_x * dt
            [0,  1, 0,  0],   # vel_x = vel_x (constant velocity)
            [0,  0, 1, dt],   # pos_y = pos_y + vel_y * dt
            [0,  0, 0,  1]    # vel_y = vel_y (constant velocity)
        ])
        
        # Measurement matrix H (2x4)
        # Maps state to measurements: we only measure position, not velocity
        self.H = np.array([
            [1, 0, 0, 0],  # measure pos_x
            [0, 0, 1, 0]   # measure pos_y
        ])
        
        # Initial state [pos_x, vel_x, pos_y, vel_y]
        self.x = np.array([0.0, 0.0, 0.0, 0.0])
        
        # Initial state covariance (uncertainty about initial state)
        self.P = np.eye(4) * 1000.0
        
        # Process noise covariance (will be set by user)
        self.Q = np.eye(4) * 0.01
        
        # Measurement noise covariance (will be set by user)
        self.R = np.eye(2) * 1.0
        
        # Storage for history
        self.history = {
            'true_state': [],
            'measurement': [],
            'predicted_state': [],
            'updated_state': [],
            'covariance_trace': [],
            'innovation': [],
            'kalman_gain': []
        }
    
    def set_initial_state(self, pos_x: float, pos_y: float, 
                         vel_x: float, vel_y: float):
        """Set initial car position and velocity"""
        self.x = np.array([pos_x, vel_x, pos_y, vel_y])
        self.history['updated_state'].append(self.x.copy())
    
    def set_process_noise(self, q_pos: float, q_vel: float):
        """
        Set process noise covariance Q.
        
        Args:
            q_pos: Process noise for position (m²)
            q_vel: Process noise for velocity (m²/s²)
        """
        self.Q = np.diag([q_pos, q_vel, q_pos, q_vel])
    
    def set_measurement_noise(self, r_pos: float):
        """
        Set measurement noise covariance R.
        
        Args:
            r_pos: Measurement noise for position (m²)
        """
        self.R = np.eye(2) * r_pos
    
    def predict(self) -> Tuple[np.ndarray, np.ndarray]:
        """
        Prediction step: Estimate next state and uncertainty.
        
        Based on motion model:
        - x_pred = F * x (apply state transition)
        - P_pred = F * P * F^T + Q (propagate uncertainty + add process noise)
        
        Returns:
            x_pred: Predicted state
            P_pred: Predicted covariance
        """
        x_pred = self.F @ self.x
        P_pred = self.F @ self.P @ self.F.T + self.Q
        
        return x_pred, P_pred
    
    def update(self, z: np.ndarray, x_pred: np.ndarray, 
               P_pred: np.ndarray) -> Tuple[np.ndarray, np.ndarray, 
                                            np.ndarray, np.ndarray]:
        """
        Update step: Correct prediction using measurement.
        
        Innovation (measurement residual): y = z - H * x_pred
        Innovation covariance: S = H * P_pred * H^T + R
        Kalman gain (how much to trust measurement): K = P_pred * H^T * S^-1
        Updated state: x = x_pred + K * y
        Updated covariance: P = (I - K * H) * P_pred
        
        Args:
            z: Measurement [pos_x, pos_y]
            x_pred: Predicted state
            P_pred: Predicted covariance
        
        Returns:
            x_updated: Updated state estimate
            P_updated: Updated covariance
            innovation: Measurement residual
            K: Kalman gain matrix
        """
        # Calculate innovation (residual between measurement and prediction)
        y = z - self.H @ x_pred
        
        # Calculate innovation covariance
        S = self.H @ P_pred @ self.H.T + self.R
        
        # Calculate Kalman gain
        K = P_pred @ self.H.T @ np.linalg.inv(S)
        
        # Update state estimate
        x_updated = x_pred + K @ y
        
        # Update covariance (Joseph form for numerical stability)
        I = np.eye(4)
        P_updated = (I - K @ self.H) @ P_pred
        
        return x_updated, P_updated, y, K
    
    def step(self, measurement: np.ndarray) -> dict:
        """
        Execute one complete Kalman filter cycle.
        
        Args:
            measurement: Measured position [pos_x, pos_y]
        
        Returns:
            Dictionary with step results
        """
        # Step 1: Prediction
        x_pred, P_pred = self.predict()
        
        # Step 2: Update
        x_updated, P_updated, innovation, K = self.update(
            measurement, x_pred, P_pred
        )
        
        # Update internal state
        self.x = x_updated
        self.P = P_updated
        
        # Store history
        self.history['predicted_state'].append(x_pred)
        self.history['updated_state'].append(x_updated)
        self.history['measurement'].append(measurement)
        self.history['covariance_trace'].append(np.trace(P_updated))
        self.history['innovation'].append(innovation)
        self.history['kalman_gain'].append(K.copy())
        
        return {
            'x_predicted': x_pred,
            'P_predicted': P_pred,
            'x_updated': x_updated,
            'P_updated': P_updated,
            'innovation': innovation,
            'kalman_gain': K,
            'innovation_cov': np.linalg.det(P_pred @ self.H.T)
        }
    
    def get_uncertainty(self) -> float:
        """Return current position uncertainty (trace of covariance)"""
        return np.sqrt(np.trace(self.P[:2, :2]))
    
    def get_history_arrays(self) -> dict:
        """Convert history lists to numpy arrays for plotting"""
        return {
            'true_state': np.array(self.history['true_state']) if self.history['true_state'] else np.array([]),
            'measurement': np.array(self.history['measurement']) if self.history['measurement'] else np.array([]),
            'predicted_state': np.array(self.history['predicted_state']) if self.history['predicted_state'] else np.array([]),
            'updated_state': np.array(self.history['updated_state']) if self.history['updated_state'] else np.array([]),
            'covariance_trace': np.array(self.history['covariance_trace']),
            'innovation': np.array(self.history['innovation']) if self.history['innovation'] else np.array([]),
        }
    
    def reset(self):
        """Reset filter to initial state"""
        self.x = np.array([0.0, 0.0, 0.0, 0.0])
        self.P = np.eye(4) * 1000.0
        self.history = {
            'true_state': [],
            'measurement': [],
            'predicted_state': [],
            'updated_state': [],
            'covariance_trace': [],
            'innovation': [],
            'kalman_gain': []
        }
