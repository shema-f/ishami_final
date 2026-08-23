// ============================================================
// ISHAMI SIMULATION — Mini Map
// Top-down mini map showing car position, route, and waypoints
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import type { Waypoint } from '../core/SimulationState';

const MAP_SIZE = typeof window !== 'undefined' && window.innerWidth < 640 ? 120 : 180;
const WORLD_RANGE = 60;

interface MiniMapProps {
  waypoints: Waypoint[];
  visible: boolean;
}

export default function MiniMap({ waypoints, visible }: MiniMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [carPos, setCarPos] = useState({ x: 0, z: 5 });
  const [carRot, setCarRot] = useState(0);

  // Poll car position from global
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      const pos = (window as any).__ishami_carPosition;
      const rot = (window as any).__ishami_carRotation ?? 0;
      if (pos) {
        setCarPos({ x: pos.x, z: pos.z });
        setCarRot(rot);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [visible]);

  // Draw minimap
  useEffect(() => {
    if (!visible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Background circle
      ctx.beginPath();
      ctx.arc(cx, cy, MAP_SIZE / 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(13, 17, 23, 0.9)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Clip to circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, MAP_SIZE / 2 - 2, 0, Math.PI * 2);
      ctx.clip();

      // Grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 0.5;
      for (let i = -WORLD_RANGE; i <= WORLD_RANGE; i += 10) {
        const sx = cx + ((i - carPos.x) / WORLD_RANGE) * (MAP_SIZE / 2);
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, MAP_SIZE);
        ctx.stroke();
        const sy = cy + ((i - carPos.z) / WORLD_RANGE) * (MAP_SIZE / 2);
        ctx.beginPath();
        ctx.moveTo(0, sy);
        ctx.lineTo(MAP_SIZE, sy);
        ctx.stroke();
      }

      // Route line
      if (waypoints.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        waypoints.forEach((wp, i) => {
          const mx = cx + ((wp.position[0] - carPos.x) / WORLD_RANGE) * (MAP_SIZE / 2);
          const my = cy + ((wp.position[2] - carPos.z) / WORLD_RANGE) * (MAP_SIZE / 2);
          if (i === 0) ctx.moveTo(mx, my);
          else ctx.lineTo(mx, my);
        });
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Waypoint dots
      waypoints.forEach((wp, i) => {
        const mx = cx + ((wp.position[0] - carPos.x) / WORLD_RANGE) * (MAP_SIZE / 2);
        const my = cy + ((wp.position[2] - carPos.z) / WORLD_RANGE) * (MAP_SIZE / 2);
        if (mx < -10 || mx > MAP_SIZE + 10 || my < -10 || my > MAP_SIZE + 10) return;

        const color = wp.completed ? '#22c55e' : i === ((window as any).__ishami_currentWp || 0) ? '#f59e0b' : '#3b82f6';
        const size = i === ((window as any).__ishami_currentWp || 0) ? 5 : 3;

        ctx.beginPath();
        ctx.arc(mx, my, size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });

      // Car indicator (triangle)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(carRot);

      ctx.beginPath();
      ctx.moveTo(0, -7);
      ctx.lineTo(-5, 5);
      ctx.lineTo(0, 2);
      ctx.lineTo(5, 5);
      ctx.closePath();
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Direction cone
      ctx.beginPath();
      ctx.moveTo(0, -7);
      ctx.lineTo(-12, -25);
      ctx.lineTo(12, -25);
      ctx.closePath();
      ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
      ctx.fill();

      ctx.restore();

      // Compass
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillText('N', cx, 12);
      ctx.fillText('S', cx, MAP_SIZE - 4);
      ctx.fillText('E', MAP_SIZE - 6, cy + 3);
      ctx.fillText('W', 8, cy + 3);

      ctx.restore();

      animFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animFrame);
  }, [visible, carPos, carRot, waypoints]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute top-4 right-4 z-30 pointer-events-none"
    >
      <div className="relative">
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10">
          <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold bg-[#0d1117]/80 px-2 py-0.5 rounded-full">
            MAP
          </span>
        </div>
        <canvas
          ref={canvasRef}
          width={MAP_SIZE}
          height={MAP_SIZE}
          className="rounded-full"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
        />
      </div>
    </motion.div>
  );
}
