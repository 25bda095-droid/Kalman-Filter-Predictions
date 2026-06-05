<div align="center">

# 🎯 KalmanVis

### *See Through the Noise*

**A professional, browser-based Kalman Filter visualisation tool — built with React + Vite**

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-kalman--filter--predictions.vercel.app-00C8FF?style=for-the-badge)](https://kalman-filter-predictions.vercel.app)

<br/>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?style=flat-square&logo=reactrouter&logoColor=white)](https://reactrouter.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-latest-FF0080?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion)
[![License: MIT](https://img.shields.io/badge/License-MIT-52B788?style=flat-square)](./LICENSE)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)

<br/>

> *"The Kalman filter is arguably the most important algorithm of the 20th century."*

<br/>

![KalmanVis Screenshot](https://kalman-filter-predictions.vercel.app/og-image.png)

</div>

---

## 📖 What is KalmanVis?

**KalmanVis** is a fully interactive web application that helps you **understand, visualise, and compare Kalman Filters** — the algorithm powering GPS smoothing, autonomous vehicle navigation, and aerospace tracking.

Whether you're a student discovering state estimation for the first time, or an engineer wanting an intuitive visual reference, KalmanVis gives you a real-time sandbox to experiment with filter parameters and see exactly what the math does.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎮 **Interactive Simulator** | Configure noise, outliers, motion model, and watch the filter work in real time |
| 📊 **Full Dashboard** | 7 live Plotly charts — trajectory, position, velocity, NIS diagnostics |
| 📖 **Guided Walkthrough** | 5-step animated results walkthrough with explanations |
| 📄 **PDF Export** | One-click professional simulation report (jsPDF + html2canvas) |
| 📐 **Math Explainer** | Full KaTeX-rendered equations for every filter step |
| 🌗 **Dark / Light Theme** | Persistent theme with reactive Plotly chart recoloring |
| ⌨️ **Keyboard Navigation** | Arrow keys for walkthrough, keyboard hint toast |
| 📱 **Fully Responsive** | Works on desktop, tablet, and mobile |

---

## 🚀 Live Demo

**👉 [kalman-filter-predictions.vercel.app](https://kalman-filter-predictions.vercel.app)**

| Page | URL |
|---|---|
| Home | [/](https://kalman-filter-predictions.vercel.app/) |
| Simulator | [/simulator](https://kalman-filter-predictions.vercel.app/simulator) |
| Learn | [/learn](https://kalman-filter-predictions.vercel.app/learn) |
| FAQ | [/faq](https://kalman-filter-predictions.vercel.app/faq) |
| About | [/about](https://kalman-filter-predictions.vercel.app/about) |
| Contact | [/contact](https://kalman-filter-predictions.vercel.app/contact) |

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js** ≥ 18.x — [download](https://nodejs.org)
- **npm** ≥ 9.x (ships with Node)

### Installation & Dev Server

```bash
# 1. Clone the repository
git clone https://github.com/25bda095-droid/kalmanvis.git
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

### Vercel Deployment

This project is deployed on Vercel. To handle client-side routing correctly, ensure a `vercel.json` exists at the project root:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 🗂️ Project Structure

```
kalmanvis/
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── robots.txt
│
├── src/
│   ├── App.jsx                        # Router, layout, ScrollToTop
│   ├── main.jsx                       # React entry point
│   ├── index.css                      # Global design system (tokens, components)
│   │
│   ├── components/                    # Shared UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ScrollToTop.jsx
│   │   ├── ProgressDots.jsx
│   │   ├── SEO.jsx
│   │   ├── ScrollProgress.jsx
│   │   ├── ParticlesBg.jsx
│   │   └── Button.jsx
│   │
│   ├── pages/                         # Route-level pages
│   │   ├── Home.jsx
│   │   ├── Simulator.jsx
│   │   ├── Learn.jsx                  # KaTeX math explainer
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
│   │           └── FullDashboard.jsx  # 7 charts + PDF export
│   │
│   ├── hooks/
│   │   ├── useSimulation.js           # Core simulation state machine
│   │   ├── usePlotlyTheme.js          # Reactive Plotly color tokens (MutationObserver)
│   │   ├── useTheme.js                # Dark/light toggle
│   │   ├── useCountUp.js
│   │   └── useScrollReveal.js
│   │
│   ├── utils/
│   │   ├── kalman.js                  # CV + CA Kalman filter implementations
│   │   ├── metrics.js                 # RMSE, NIS, CSV export
│   │   ├── scenarios.js               # Pre-built simulation presets
│   │   ├── plotlyLayout.js            # Reactive Plotly layout builder
│   │   └── downloadDashboardPDF.js    # jsPDF + html2canvas PDF generator
│   │
│   └── constants/
│       ├── colors.js                  # Design tokens + Plotly helpers
│       └── tooltips.js
│
├── vercel.json                        # SPA routing fix for Vercel
├── index.html
├── vite.config.js
├── eslint.config.js
├── package.json
└── .gitignore
```

---

## 🧪 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Routing | React Router v7 |
| Animations | Framer Motion |
| Charts | Plotly.js via react-plotly.js |
| Math Rendering | KaTeX via react-katex |
| PDF Export | jsPDF + html2canvas |
| Icons | Lucide React |
| Particles | @tsparticles/react |
| Contact Form | Formspree |
| SEO | react-helmet-async |
| Styling | Vanilla CSS (design tokens) |
| Deployment | Vercel |

---

## 🎛️ Simulation Reference

### Scenarios

| Scenario | Description |
|---|---|
| Cruising | Constant-velocity straight-line motion |
| Turning | Smooth curved trajectory |
| Accelerating | Non-constant velocity — favours CA filter |
| Urban Stop-Go | Irregular acceleration / deceleration |
| Evasive Manoeuvre | Rapid direction changes |

### Filters

| Filter | Model Assumption |
|---|---|
| **CV** — Constant Velocity | Constant velocity between time steps |
| **CA** — Constant Acceleration | Constant acceleration between time steps |

### Metrics

| Metric | Meaning |
|---|---|
| **Position RMSE** | Average positional error of the filter estimate |
| **NIS** | Normalized Innovation Squared — statistical filter health check |

---

## 📄 PDF Report

Click **📄 PDF Report** on the Full Dashboard to generate a professional A4 report containing:

- Simulation parameters table
- CV and CA filter performance cards
- All 7 charts (trajectory, X/Y position, X/Y velocity, NIS, RMSE)
- Auto-paginated with header, footer, and page numbers

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `→` Arrow Right | Next step in results walkthrough |
| `←` Arrow Left | Previous step in results walkthrough |

---

## 📬 Contact

Have a question, found a bug, or want to contribute?

- 🌐 **Contact form:** [kalman-filter-predictions.vercel.app/contact](https://kalman-filter-predictions.vercel.app/contact)
- 📧 **Email:** [rishavrmishra@gmail.com](mailto:rishavrmishra@gmail.com)
- 🐙 **GitHub:** [github.com/25bda095-droid](https://github.com/25bda095-droid)
- 💼 **LinkedIn:** [linkedin.com/in/rishav-r-mishra](https://www.linkedin.com/in/rishav-r-mishra)

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

You are free to fork, modify, and build on this project. Attribution appreciated but not required.

---

## 🙏 Acknowledgements

Built as an open-source educational tool to demystify the Kalman Filter — an algorithm that powers autonomous vehicles, GPS receivers, spacecraft navigation, and financial forecasting.

---

<div align="center">

Made with ☕ by [Rishav Mishra](https://www.linkedin.com/in/rishav-r-mishra) &nbsp;|&nbsp; [MIT License](./LICENSE) &nbsp;|&nbsp; [Live Demo](https://kalman-filter-predictions.vercel.app)

</div>