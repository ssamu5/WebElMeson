"use client";

import { useEffect } from "react";

export default function TouchTrail() {
  useEffect(() => {
    function spawnSpark(x: number, y: number) {
      const count = 3;
      for (let i = 0; i < count; i++) {
        const dot = document.createElement("div");
        const size = 6 + Math.random() * 8;
        const dx = (Math.random() - 0.5) * 20;
        const dy = (Math.random() - 0.5) * 20;
        dot.style.cssText = `
          position:fixed; pointer-events:none; z-index:9998;
          width:${size}px; height:${size}px; border-radius:50%;
          left:${x}px; top:${y}px;
          background: radial-gradient(circle, #fff 0%, #D93060 60%, transparent 100%);
          transform: translate(-50%,-50%);
          animation: spark-out 0.5s ease-out forwards;
          --dx: ${dx}px; --dy: ${dy}px;
        `;
        document.body.appendChild(dot);
        setTimeout(() => dot.remove(), 520);
      }
    }

    function onTouch(e: TouchEvent) {
      for (const t of e.touches) spawnSpark(t.clientX, t.clientY);
    }
    function onMouse(e: MouseEvent) {
      if (e.buttons > 0) spawnSpark(e.clientX, e.clientY);
    }

    document.addEventListener("touchmove",  onTouch, { passive: true });
    document.addEventListener("touchstart", onTouch, { passive: true });
    document.addEventListener("mousemove",  onMouse);

    return () => {
      document.removeEventListener("touchmove",  onTouch);
      document.removeEventListener("touchstart", onTouch);
      document.removeEventListener("mousemove",  onMouse);
    };
  }, []);

  return (
    <style>{`
      @keyframes spark-out {
        0%   { transform: translate(-50%,-50%) scale(1.2); opacity: 1; }
        60%  { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.6); opacity: 0.7; }
        100% { transform: translate(calc(-50% + var(--dx)*2), calc(-50% + var(--dy)*2)) scale(0); opacity: 0; }
      }
    `}</style>
  );
}
