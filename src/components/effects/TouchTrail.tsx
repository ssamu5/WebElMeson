"use client";

import { useEffect, useRef } from "react";

// Main dot + 4 trail dots
const DOTS = [
  { size: 26, opacity: 1,    lerp: 1,    blur: 0  },
  { size: 18, opacity: 0.65, lerp: 0.22, blur: 1  },
  { size: 12, opacity: 0.40, lerp: 0.14, blur: 2  },
  { size: 8,  opacity: 0.22, lerp: 0.08, blur: 2  },
  { size: 5,  opacity: 0.12, lerp: 0.05, blur: 3  },
];

export default function TouchTrail() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const els = Array.from(container.children) as HTMLDivElement[];

    const target = { x: -300, y: -300 };
    const pos = DOTS.map(() => ({ x: -300, y: -300 }));
    let visible = false;
    let rafId = 0;

    function loop() {
      // Main dot snaps instantly
      pos[0].x = target.x;
      pos[0].y = target.y;

      // Each trail lerps toward the one in front
      for (let i = 1; i < DOTS.length; i++) {
        pos[i].x += (pos[i - 1].x - pos[i].x) * DOTS[i].lerp;
        pos[i].y += (pos[i - 1].y - pos[i].y) * DOTS[i].lerp;
      }

      els.forEach((el, i) => {
        const { size } = DOTS[i];
        el.style.transform = `translate(${pos[i].x - size / 2}px, ${pos[i].y - size / 2}px)`;
      });

      rafId = requestAnimationFrame(loop);
    }

    function show() {
      if (visible) return;
      visible = true;
      els.forEach((el, i) => { el.style.opacity = String(DOTS[i].opacity); });
    }

    function hide() {
      visible = false;
      els.forEach(el => { el.style.opacity = "0"; });
    }

    function onTouchMove(e: TouchEvent) {
      target.x = e.touches[0].clientX;
      target.y = e.touches[0].clientY;
      show();
    }
    function onTouchStart(e: TouchEvent) {
      target.x = e.touches[0].clientX;
      target.y = e.touches[0].clientY;
      // Snap all dots to finger position instantly so trail doesn't "fly in"
      pos.forEach(p => { p.x = target.x; p.y = target.y; });
      show();
    }
    function onTouchEnd() { hide(); }

    rafId = requestAnimationFrame(loop);
    document.addEventListener("touchmove",   onTouchMove,  { passive: true });
    document.addEventListener("touchstart",  onTouchStart, { passive: true });
    document.addEventListener("touchend",    onTouchEnd);
    document.addEventListener("touchcancel", onTouchEnd);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("touchmove",   onTouchMove);
      document.removeEventListener("touchstart",  onTouchStart);
      document.removeEventListener("touchend",    onTouchEnd);
      document.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  return (
    <div ref={containerRef} aria-hidden="true">
      {DOTS.map((d, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            top: 0, left: 0,
            pointerEvents: "none",
            zIndex: 9998 - i,
            width: d.size,
            height: d.size,
            borderRadius: "50%",
            background: i === 0
              ? "radial-gradient(circle, rgba(255,255,255,0.95) 0%, #D93060 50%, rgba(217,48,96,0.1) 100%)"
              : "radial-gradient(circle, rgba(255,255,255,0.7) 0%, #D93060 60%, transparent 100%)",
            boxShadow: `0 0 ${d.size * 0.6}px rgba(217,48,96,0.8)`,
            willChange: "transform, opacity",
            opacity: 0,
            filter: d.blur ? `blur(${d.blur}px)` : undefined,
            mixBlendMode: "screen",
            transition: "opacity 0.1s linear",
          }}
        />
      ))}
    </div>
  );
}
