# KalmanVis — Interactive Kalman Filter Simulator

> **See Through the Noise** — A professional, browser-based Kalman Filter visualisation tool built with React + Vite.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](../LICENSE)

---

## ✨ What is KalmanVis?

KalmanVis is a fully interactive web application that helps you **understand, visualise, and compare Kalman Filters** — the algorithm powering GPS smoothing, autonomous vehicle navigation, and aerospace tracking.

### Key Features

| Feature | Description |
|---|---|
| 🎮 **Interactive Simulator** | Configure noise, outliers, motion model, and watch the filter work in real time |
| 📊 **Full Dashboard** | 7 live Plotly charts — trajectory, position, velocity, NIS diagnostics |
| 📖 **Guided Walkthrough** | 5-step animated results walkthrough with explanations |
| 📄 **PDF Export** | One-click professional simulation report (jsPDF + html2canvas) |
| 📐 **Math Explainer** | Full KaTeX-rendered equations for every filter step |
| 🌗 **Dark / Light Theme** | Persistent theme with reactive Plotly chart recoloring |
| ⌨️ **Keyboard Navigation** | Arrow keys for walkthrough, keyboard hint toast |
| 📱 **Responsive** | Works on desktop, tablet, and mobile |

---

## 🗂️ Project Structure

```
kalmanvis/
├── public/
│   ├── favicon.svg          # App icon
│   ├── icons.svg            # SVG sprite
│   └── robots.txt
├── src/
│   ├── App.jsx              # Router, layout, ScrollToTop
│   ├── main.jsx             # React entry point
│   ├── index.css            # Global design system (tokens, components)
│   ├── App.css
│   │
│   ├── components/          # Shared UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ScrollToTop.jsx  # Resets scroll on route change
│   │   ├── ProgressDots.jsx
│   │   ├── SEO.jsx
│   │   ├── ScrollProgress.jsx
│   │   ├── ParticlesBg.jsx
│   │   └── Button.jsx
│   │
│   ├── pages/               # Route-level pages
│   │   ├── Home.jsx
│   │   ├── Simulator.jsx
│   │   ├── Learn.jsx        # KaTeX math explainer
│   │   ├── About.jsx
│   │   ├── FAQ.jsx
│   │   ├── Contact.jsx
│   │   ├── PrivacyPolicy.jsx
│   │   ├── Terms.jsx
│   │   ├── NotFound.jsx
│   │   └── ServerError.jsx
│   │
│   ├── features/
│   │   └── simulator/
│   │       ├── SimulationCanvas.jsx   # Phase switcher (idle/running/walkthrough/dashboard)
│   │       ├── Sidebar.jsx            # Parameter controls
│   │       ├── ScenarioPicker.jsx
│   │       ├── ResultsWalkthrough.jsx # Fixed nav bar + keyboard hint toast
│   │       └── steps/
│   │           ├── StepSummary.jsx
│   │           ├── StepFilter.jsx
│   │           ├── StepTrajectory.jsx
│   │           ├── StepStateEst.jsx
│   │           ├── StepInnovation.jsx
│   │           ├── StepReport.jsx
│   │           └── FullDashboard.jsx  # 7 charts + PDF export button
│   │
│   ├── hooks/
│   │   ├── useSimulation.js    # Core simulation state machine
│   │   ├── usePlotlyTheme.js   # Reactive Plotly color tokens (MutationObserver)
│   │   ├── useTheme.js         # Dark/light toggle (data-theme on <html>)
│   │   ├── useCountUp.js
│   │   └── useScrollReveal.js
│   │
│   ├── utils/
│   │   ├── kalman.js              # CV + CA Kalman filter implementations
│   │   ├── metrics.js             # RMSE, NIS, CSV export
│   │   ├── scenarios.js           # Pre-built simulation presets
│   │   ├── plotlyLayout.js        # Reactive Plotly layout builder
│   │   └── downloadDashboardPDF.js # jsPDF + html2canvas PDF generator
│   │
│   └── constants/
│       ├── colors.js           # Design tokens + static Plotly helpers
│       └── tooltips.js
│
├── index.html
├── vite.config.js
├── eslint.config.js
├── package.json
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x — [download](https://nodejs.org)
- **npm** ≥ 9.x (ships with Node)

### Installation & Dev Server

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/kalmanvis.git
cd kalmanvis

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
npm run build        # outputs to dist/
npm run preview      # preview the production build locally
```

---

## 🧪 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Routing | React Router v7 |
| Animations | Framer Motion |
| Charts | Plotly.js via react-plotly.js |
| Math rendering | KaTeX via react-katex |
| PDF export | jsPDF + html2canvas |
| Icons | Lucide React |
| Particles | @tsparticles/react |
| SEO | react-helmet-async |
| Styling | Vanilla CSS (design tokens) |

---

## 🎛️ Simulation Modes

### Scenarios
| Scenario | Description |
|---|---|
| Cruising | Constant-velocity straight-line motion |
| Turning | Smooth curved trajectory |
| Accelerating | Non-constant velocity — favours CA filter |
| Urban Stop-Go | Irregular acceleration / deceleration |
| Evasive Manoeuvre | Rapid direction changes |

### Filters
- **CV (Constant Velocity)** — assumes constant velocity between steps
- **CA (Constant Acceleration)** — assumes constant acceleration between steps

### Metrics
- **Position RMSE** — how far off the filter was on average
- **NIS** (Normalized Innovation Squared) — statistical filter health check

---

## 📄 PDF Report

Click **📄 PDF Report** on the Full Dashboard to generate a professional A4 report containing:
- Simulation parameters table
- CV and CA filter performance cards
- All 7 charts (trajectory, X/Y position, X/Y velocity, NIS, RMSE)
- Auto-paginated with header, footer, and page numbers

---

## 🌗 Theme Support

Click the theme toggle in the navbar to switch between **dark** and **light** mode. All Plotly chart labels, ticks, and legends update instantly via `MutationObserver`.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `→` Arrow Right | Next step in walkthrough |
| `←` Arrow Left | Previous step in walkthrough |

---

## 📜 License

MIT — see [LICENSE](../LICENSE)

---

## 🙏 Acknowledgements

Built as an educational tool to demystify the Kalman Filter — an algorithm that powers autonomous vehicles, GPS receivers, spacecraft navigation, and financial forecasting.

> *"The Kalman filter is arguably the most important algorithm of the 20th century."*
