// ============================================================
// ISHAMI SIMULATION — Cockpit Dashboard Overlay
// Animated speedometer, tachometer, and gauges
// ============================================================

import { useEffect, useRef } from 'react';
import type { SimulationState } from '../core/SimulationState';

interface CockpitDashboardProps {
  speed: number;
  rpm: number;
  state: SimulationState;
  visible: boolean;
}

export default function CockpitDashboard({ speed, rpm, state, visible }: CockpitDashboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!visible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = 'rgba(13, 17, 23, 0.85)';
      ctx.fillRect(0, 0, w, h);

      // ─── Speedometer (left) ─────────────────
      drawGauge(ctx, w * 0.25, h * 0.45, 65, speed, 0, 80, 'km/h', '#22c55e', '#f59e0b', '#ef4444');

      // ─── Tachometer (right) ─────────────────
      drawGauge(ctx, w * 0.75, h * 0.45, 65, rpm, 0, 6500, 'RPM', '#3b82f6', '#f59e0b', '#ef4444');

      // ─── Center: Gear + Status ──────────────
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px "SF Mono", "Fira Code", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(state.gear, w * 0.5, h * 0.4);

      // Gear label
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('GEAR', w * 0.5, h * 0.4 + 20);

      // ─── Status indicators ──────────────────
      const indicators = [
        { label: 'ENG', active: state.engineRunning, color: '#22c55e' },
        { label: 'SBT', active: state.seatbeltFastened, color: '#22c55e' },
        { label: 'HBK', active: !state.handbrakeOn, color: state.handbrakeOn ? '#f59e0b' : '#22c55e' },
        { label: 'CLT', active: state.clutchPressed, color: state.clutchPressed ? '#3b82f6' : '#64748b' },
      ];

      indicators.forEach((ind, i) => {
        const x = w * 0.3 + (i % 2) * w * 0.2;
        const y = h * 0.6 + Math.floor(i / 2) * 22;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = ind.active ? ind.color : '#374151';
        ctx.fill();

        ctx.font = '9px sans-serif';
        ctx.fillStyle = ind.active ? '#e2e8f0' : '#64748b';
        ctx.textAlign = 'left';
        ctx.fillText(ind.label, x + 8, y + 3);
      });

      // ─── Speed bar (bottom) ─────────────────
      const barY = h * 0.82;
      const barW = w * 0.8;
      const barH = 6;
      const barX = w * 0.1;

      // Background
      ctx.fillStyle = '#1f2937';
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW, barH, 3);
      ctx.fill();

      // Speed fill
      const fillW = (speed / 80) * barW;
      const gradient = ctx.createLinearGradient(barX, 0, barX + barW, 0);
      gradient.addColorStop(0, '#22c55e');
      gradient.addColorStop(0.5, '#f59e0b');
      gradient.addColorStop(1, '#ef4444');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(barX, barY, Math.min(fillW, barW), barH, 3);
      ctx.fill();

      // Speed limit marker
      const limitX = barX + (30 / 80) * barW;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(limitX, barY - 4);
      ctx.lineTo(limitX, barY + barH + 4);
      ctx.stroke();
      ctx.setLineDash([]);

      // Labels
      ctx.font = '8px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'left';
      ctx.fillText('0', barX, barY + barH + 12);
      ctx.textAlign = 'right';
      ctx.fillText('80', barX + barW, barY + barH + 12);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ef4444';
      ctx.fillText('LIMIT', limitX, barY - 6);

      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animFrame);
  }, [visible, speed, rpm, state]);

  if (!visible) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-25 pointer-events-none">
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        className="w-full max-w-2xl mx-auto"
        style={{ imageRendering: 'auto' }}
      />
    </div>
  );
}

function drawGauge(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  value: number,
  min: number,
  max: number,
  unit: string,
  lowColor: string,
  midColor: string,
  highColor: string
) {
  const startAngle = Math.PI * 0.75;
  const endAngle = Math.PI * 2.25;
  const valueAngle = startAngle + ((value - min) / (max - min)) * (endAngle - startAngle);

  // Background arc
  ctx.beginPath();
  ctx.arc(cx, cy, radius, startAngle, endAngle);
  ctx.strokeStyle = '#1f2937';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Value arc
  const gradient = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
  gradient.addColorStop(0, lowColor);
  gradient.addColorStop(0.6, midColor);
  gradient.addColorStop(1, highColor);

  ctx.beginPath();
  ctx.arc(cx, cy, radius, startAngle, Math.min(valueAngle, endAngle));
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Needle
  const needleLength = radius * 0.7;
  const needleX = cx + Math.cos(valueAngle) * needleLength;
  const needleY = cy + Math.sin(valueAngle) * needleLength;

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(needleX, needleY);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Center dot
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#ef4444';
  ctx.fill();

  // Value text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px "SF Mono", "Fira Code", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(Math.round(value).toString(), cx, cy + radius * 0.35);

  // Unit text
  ctx.font = '9px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText(unit, cx, cy + radius * 0.55);

  // Tick marks
  for (let i = 0; i <= 8; i++) {
    const tickAngle = startAngle + (i / 8) * (endAngle - startAngle);
    const innerR = radius - 14;
    const outerR = radius - 10;

    ctx.beginPath();
    ctx.moveTo(
      cx + Math.cos(tickAngle) * innerR,
      cy + Math.sin(tickAngle) * innerR
    );
    ctx.lineTo(
      cx + Math.cos(tickAngle) * outerR,
      cy + Math.sin(tickAngle) * outerR
    );
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}
