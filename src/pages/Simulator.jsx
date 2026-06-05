// src/pages/Simulator.jsx
import SEO from '../components/SEO';
import Sidebar from '../features/simulator/Sidebar';
import SimulationCanvas from '../features/simulator/SimulationCanvas';
import { useSimulation } from '../hooks/useSimulation';

export default function Simulator() {
  const sim = useSimulation();

  return (
    <>
      <SEO
        title="Kalman Filter Simulator — KalmanVis"
        description="Run CV and CA Kalman filter simulations with 5 scenarios, real-time charts, and guided results."
        path="/simulator"
      />
      <div className="simulator-layout">
        <Sidebar sim={sim} />
        <SimulationCanvas sim={sim} />
      </div>
    </>
  );
}
