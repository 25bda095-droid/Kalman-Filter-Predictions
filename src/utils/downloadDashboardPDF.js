// src/utils/downloadDashboardPDF.js
// Generates a professional dark-themed A4 PDF report of the simulation results.
// Requires: jspdf, html2canvas

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function downloadDashboardPDF(simulationParams, metrics) {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W       = 210;   // A4 width mm
  const margin  = 15;
  const contentW = W - margin * 2;
  let y = margin;

  // ── Color helpers ────────────────────────────────────────────
  const CYAN    = [0, 200, 255];
  const WHITE   = [226, 232, 240];
  const MUTED   = [122, 139, 168];
  const DARK    = [7, 11, 20];
  const SURFACE = [15, 21, 37];
  const GREEN   = [82, 183, 136];
  const VIOLET  = [155, 93, 229];
  const RED     = [255, 77, 109];

  const setFill   = (rgb) => pdf.setFillColor(...rgb);
  const setStroke = (rgb) => pdf.setDrawColor(...rgb);
  const setTxt    = (rgb) => pdf.setTextColor(...rgb);

  // ── PAGE 1 BACKGROUND ────────────────────────────────────────
  setFill(DARK);
  pdf.rect(0, 0, W, 297, 'F');

  // ── HEADER ───────────────────────────────────────────────────
  // Cyan accent bar
  setFill(CYAN);
  pdf.rect(0, 0, W, 1.5, 'F');

  // Logo
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  setTxt(CYAN);
  pdf.text('KalmanVis', margin, y + 10);

  // Tagline
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  setTxt(MUTED);
  pdf.text('See Through the Noise', margin, y + 16);

  // Report title — right aligned
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  setTxt(WHITE);
  pdf.text('Simulation Report', W - margin, y + 10, { align: 'right' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  setTxt(MUTED);
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
  pdf.text(dateStr, W - margin, y + 16, { align: 'right' });

  y += 24;

  // Header divider
  pdf.setLineWidth(0.3);
  setStroke(CYAN);
  pdf.line(margin, y, W - margin, y);
  y += 8;

  // ── SIMULATION PARAMETERS ────────────────────────────────────
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  setTxt(CYAN);
  pdf.text('SIMULATION PARAMETERS', margin, y);
  y += 5;

  const sp = simulationParams || {};
  const paramRows = [
    ['Scenario',            sp.scenario        ?? '—'],
    ['Duration',            `${sp.duration      ?? '—'} steps`],
    ['Time Step (dt)',      `${sp.dt            ?? '—'} s`],
    ['Init Position',       `(${sp.initPos?.[0] ?? 0}, ${sp.initPos?.[1] ?? 0}) m`],
    ['Init Velocity',       `(${sp.initVel?.[0] ?? 0}, ${sp.initVel?.[1] ?? 0}) m/s`],
    ['Measurement Noise',   `σ = ${sp.measNoise ?? '—'} m`],
    ['Adaptive R',          sp.adaptiveR ? 'Enabled' : 'Disabled'],
    ['Outlier Probability', `${(((sp.outlierProb ?? 0)) * 100).toFixed(0)}%`],
    ['Random Seed',         `${sp.seed          ?? 42}`],
  ];

  const colW = contentW / 2 - 2;
  let col = 0;
  let rowY = y;

  paramRows.forEach(([label, value]) => {
    const xPos = margin + col * (colW + 4);
    setFill(SURFACE);
    pdf.roundedRect(xPos, rowY, colW, 8, 1, 1, 'F');

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    setTxt(MUTED);
    pdf.text(label.toUpperCase(), xPos + 3, rowY + 3.5);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    setTxt(WHITE);
    pdf.text(String(value), xPos + 3, rowY + 7);

    col++;
    if (col === 2) { col = 0; rowY += 11; }
  });

  y = rowY + (col > 0 ? 13 : 3);

  // ── FILTER PERFORMANCE ───────────────────────────────────────
  pdf.setLineWidth(0.2);
  setStroke([30, 40, 60]);
  pdf.line(margin, y, W - margin, y);
  y += 6;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  setTxt(CYAN);
  pdf.text('FILTER PERFORMANCE', margin, y);
  y += 5;

  const cardH = 30;
  const cardW = contentW / 2 - 3;

  // ── CV Card ──────────────────────────────────────────────────
  setFill(SURFACE);
  pdf.roundedRect(margin, y, cardW, cardH, 2, 2, 'F');
  setFill(GREEN);
  pdf.roundedRect(margin, y, cardW, 5, 2, 2, 'F');
  pdf.rect(margin, y + 3, cardW, 2, 'F');  // square off bottom of rounded top
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.5);
  setTxt(DARK);
  pdf.text('CV FILTER — CONSTANT VELOCITY', margin + 3, y + 3.5);

  const cvStats = [
    ['Position RMSE', `${metrics?.cv?.posRMSE?.toFixed(3) ?? '—'} m`],
    ['Velocity RMSE', `${metrics?.cv?.velRMSE?.toFixed(3) ?? '—'} m/s`],
    ['NIS Mean',      `${metrics?.cv?.nisStats?.mean?.toFixed(2) ?? '—'}`],
    ['NIS Consistent', metrics?.cv?.nisStats?.consistent ? '✓ Yes' : '✗ No'],
  ];
  cvStats.forEach(([lbl, val], i) => {
    const iy = y + 9 + i * 5.2;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    setTxt(MUTED);
    pdf.text(lbl.toUpperCase(), margin + 3, iy);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    const valColor = i === 3
      ? (metrics?.cv?.nisStats?.consistent ? GREEN : RED)
      : GREEN;
    setTxt(valColor);
    pdf.text(val, margin + cardW - 3, iy, { align: 'right' });
  });

  // ── CA Card ──────────────────────────────────────────────────
  const caX = margin + cardW + 6;
  setFill(SURFACE);
  pdf.roundedRect(caX, y, cardW, cardH, 2, 2, 'F');
  setFill(VIOLET);
  pdf.roundedRect(caX, y, cardW, 5, 2, 2, 'F');
  pdf.rect(caX, y + 3, cardW, 2, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.5);
  setTxt(WHITE);
  pdf.text('CA FILTER — CONSTANT ACCELERATION', caX + 3, y + 3.5);

  const caStats = [
    ['Position RMSE', `${metrics?.ca?.posRMSE?.toFixed(3) ?? '—'} m`],
    ['Velocity RMSE', `${metrics?.ca?.velRMSE?.toFixed(3) ?? '—'} m/s`],
    ['NIS Mean',      `${metrics?.ca?.nisStats?.mean?.toFixed(2) ?? '—'}`],
    ['NIS Consistent', metrics?.ca?.nisStats?.consistent ? '✓ Yes' : '✗ No'],
  ];
  caStats.forEach(([lbl, val], i) => {
    const iy = y + 9 + i * 5.2;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    setTxt(MUTED);
    pdf.text(lbl.toUpperCase(), caX + 3, iy);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    const valColor = i === 3
      ? (metrics?.ca?.nisStats?.consistent ? GREEN : RED)
      : VIOLET;
    setTxt(valColor);
    pdf.text(val, caX + cardW - 3, iy, { align: 'right' });
  });

  // Winner banner
  const winner = metrics?.winner ?? 'cv';
  const winnerColor = winner === 'cv' ? GREEN : VIOLET;
  const winnerLabel = winner === 'cv' ? 'CV Filter wins' : 'CA Filter wins';
  setFill([...winnerColor, 25]);   // dim background
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  setTxt(winnerColor);
  pdf.text(`🏆  ${winnerLabel} — Best Position RMSE: ${Math.min(metrics?.cv?.posRMSE ?? 0, metrics?.ca?.posRMSE ?? 0).toFixed(3)} m`,
    margin, y + cardH + 6);

  y += cardH + 14;

  // ── CHARTS ───────────────────────────────────────────────────
  pdf.setLineWidth(0.2);
  setStroke([30, 40, 60]);
  pdf.line(margin, y, W - margin, y);
  y += 6;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  setTxt(CYAN);
  pdf.text('SIMULATION CHARTS', margin, y);
  y += 5;

  const chartConfigs = [
    { id: 'pdf-chart-trajectory', label: '2D Trajectory',        fullWidth: true  },
    { id: 'pdf-chart-xpos',       label: 'X Position over Time', fullWidth: false },
    { id: 'pdf-chart-ypos',       label: 'Y Position over Time', fullWidth: false },
    { id: 'pdf-chart-xvel',       label: 'X Velocity over Time', fullWidth: false },
    { id: 'pdf-chart-yvel',       label: 'Y Velocity over Time', fullWidth: false },
    { id: 'pdf-chart-nis',        label: 'NIS Diagnostic',       fullWidth: true  },
    { id: 'pdf-chart-rmse',       label: 'RMSE Comparison',      fullWidth: true  },
  ];

  // Layout state for 2-column half-width charts
  let halfColX   = margin;
  let halfRowMaxH = 0;

  const flushHalfRow = () => {
    if (halfRowMaxH > 0) {
      y += halfRowMaxH + 6;
      halfRowMaxH = 0;
      halfColX = margin;
    }
  };

  for (const chart of chartConfigs) {
    const el = document.getElementById(chart.id);
    if (!el) continue;

    const canvas = await html2canvas(el, {
      backgroundColor: '#070B14',
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgW = chart.fullWidth ? contentW : contentW / 2 - 3;
    const imgH = (canvas.height / canvas.width) * imgW;

    if (chart.fullWidth) {
      flushHalfRow();
      if (y + imgH + 14 > 285) {
        pdf.addPage();
        setFill(DARK);
        pdf.rect(0, 0, W, 297, 'F');
        y = margin;
      }
      // Chart label
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      setTxt(MUTED);
      pdf.text(chart.label.toUpperCase(), margin, y + 3.5);
      y += 5;
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, y, imgW, imgH);
      y += imgH + 6;
    } else {
      // Half-width: lay out 2 per row
      if (halfColX === margin && y + imgH + 14 > 285) {
        pdf.addPage();
        setFill(DARK);
        pdf.rect(0, 0, W, 297, 'F');
        y = margin;
      }
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      setTxt(MUTED);
      pdf.text(chart.label.toUpperCase(), halfColX, y + 3.5);
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', halfColX, y + 5, imgW, imgH);
      halfRowMaxH = Math.max(halfRowMaxH, imgH + 5);

      if (halfColX === margin) {
        halfColX = margin + imgW + 6;   // move to right column
      } else {
        // Both columns filled — advance row
        flushHalfRow();
      }
    }
  }
  flushHalfRow();

  // ── FOOTERS on every page ─────────────────────────────────────
  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    setFill(DARK);
    pdf.rect(0, 285, W, 12, 'F');
    pdf.setLineWidth(0.2);
    setStroke(CYAN);
    pdf.line(margin, 285, W - margin, 285);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    setTxt(MUTED);
    pdf.text('KalmanVis — See Through the Noise', margin, 291);
    pdf.text(`Page ${i} of ${pageCount}`, W - margin, 291, { align: 'right' });
  }

  pdf.save(`KalmanVis_Report_${Date.now()}.pdf`);
}
