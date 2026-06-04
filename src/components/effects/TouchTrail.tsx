"use client";

import { useEffect, useRef } from "react";

const SIZE = 28;

export default function TouchTrail() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    // Use transform: translate for GPU-accelerated movement (zero latency)
    function move(x: number, y: number) {
      dot!.style.transform = `translate(${x - SIZE / 2}px, ${y - SIZE / 2}px)`;
    }

    function show() { dot!.style.opacity = "1"; }
    function hide() { dot!.style.opacity = "0"; }

    function onTouchMove(e: TouchEvent) {
      const t = e.touches[0];
      move(t.clientX, t.clientY);
      show();
    }

    function onTouchStart(e: TouchEvent) {
      const t = e.touches[0];
      move(t.clientX, t.clientY);
      show();
    }

    function onTouchEnd() { hide(); }

    document.addEventListener("touchmove",   onTouchMove,  { passive: true });
    document.addEventListener("touchstart",  onTouchStart, { passive: true });
    document.addEventListener("touchend",    onTouchEnd);
    document.addEventListener("touchcancel", onTouchEnd);

    return () => {
      document.removeEventListener("touchmove",   onTouchMove);
      document.removeEventListener("touchstart",  onTouchStart);
      document.removeEventListener("touchend",    onTouchEnd);
      document.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9998,
        width: SIZE,
        height: SIZE,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, #D93060 50%, rgba(217,48,96,0.15) 100%)",
        boxShadow: "0 0 14px rgba(217,48,96,0.9), 0 0 28px rgba(217,48,96,0.4)",
        willChange: "transform, opacity",
        opacity: 0,
        transform: "translate(-200px, -200px)",
        /* Only opacity transitions — position must be instant */
        transition: "opacity 0.08s linear",
        mixBlendMode: "screen",
      }}
    />
  );
}
