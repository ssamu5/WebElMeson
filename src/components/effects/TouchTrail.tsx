"use client";

import { useEffect, useRef } from "react";

const TRAIL_MS = 350;   // each point lives 350ms
const HEAD_R   = 14;    // glow radius at head

export default function TouchTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    // Match physical pixels for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    function resize() {
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width  = window.innerWidth  + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.scale(dpr, dpr);
    }
    resize();

    // Each point: { x, y, t } — t is timestamp when added
    type Pt = { x: number; y: number; t: number };
    const trail: Pt[] = [];
    let active = false;
    let rafId = 0;

    function draw() {
      const now = Date.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Remove old points
      while (trail.length > 0 && now - trail[trail.length - 1].t > TRAIL_MS) {
        trail.pop();
      }

      if (trail.length < 2) {
        rafId = requestAnimationFrame(draw);
        return;
      }

      // Draw tapered trail segment by segment
      for (let i = 0; i < trail.length - 1; i++) {
        const a = trail[i];
        const b = trail[i + 1];
        const ageA = (now - a.t) / TRAIL_MS; // 0 = fresh, 1 = about to die
        const ageB = (now - b.t) / TRAIL_MS;
        const alpha = Math.max(0, 1 - ageA) * 0.85;
        const width = Math.max(0.5, (1 - ageA) * 16);

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(217,48,96,${alpha})`;
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();

        void ageB; // used for future gradient if needed
      }

      // Glowing head at the newest point
      if (trail.length > 0) {
        const { x, y } = trail[0];
        const g = ctx.createRadialGradient(x, y, 0, x, y, HEAD_R * 2);
        g.addColorStop(0,   "rgba(255,255,255,0.95)");
        g.addColorStop(0.25,"rgba(240,71,122,0.85)");
        g.addColorStop(0.6, "rgba(217,48,96,0.4)");
        g.addColorStop(1,   "rgba(217,48,96,0)");
        ctx.beginPath();
        ctx.arc(x, y, HEAD_R * 2, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        // Crisp inner dot
        ctx.beginPath();
        ctx.arc(x, y, HEAD_R * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    }

    function push(x: number, y: number) {
      trail.unshift({ x, y, t: Date.now() });
      if (trail.length > 80) trail.length = 80; // cap
    }

    function onTouchMove(e: TouchEvent) {
      push(e.touches[0].clientX, e.touches[0].clientY);
      active = true;
    }
    function onTouchStart(e: TouchEvent) {
      trail.length = 0;
      push(e.touches[0].clientX, e.touches[0].clientY);
      active = true;
    }
    function onTouchEnd() { active = false; }

    rafId = requestAnimationFrame(draw);
    document.addEventListener("touchmove",   onTouchMove,  { passive: true });
    document.addEventListener("touchstart",  onTouchStart, { passive: true });
    document.addEventListener("touchend",    onTouchEnd);
    document.addEventListener("touchcancel", onTouchEnd);
    window.addEventListener("resize", resize);

    void active;

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("touchmove",   onTouchMove);
      document.removeEventListener("touchstart",  onTouchStart);
      document.removeEventListener("touchend",    onTouchEnd);
      document.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0, left: 0,
        pointerEvents: "none",
        zIndex: 9998,
      }}
    />
  );
}
