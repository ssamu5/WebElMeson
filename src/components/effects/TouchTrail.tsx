"use client";

import { useEffect, useRef } from "react";

export default function TouchTrail() {
  const dotRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    function moveTo(x: number, y: number) {
      if (!dot) return;
      dot.style.left = `${x}px`;
      dot.style.top  = `${y}px`;
    }

    function show() {
      if (!dot) return;
      dot.style.opacity = "1";
      dot.style.transform = "translate(-50%, -50%) scale(1)";
      visibleRef.current = true;
    }

    function hide() {
      if (!dot) return;
      dot.style.opacity = "0";
      dot.style.transform = "translate(-50%, -50%) scale(0.3)";
      visibleRef.current = false;
    }

    function onTouchMove(e: TouchEvent) {
      const t = e.touches[0];
      moveTo(t.clientX, t.clientY);
      if (!visibleRef.current) show();
    }

    function onTouchStart(e: TouchEvent) {
      const t = e.touches[0];
      moveTo(t.clientX, t.clientY);
      show();
    }

    function onTouchEnd() { hide(); }

    document.addEventListener("touchmove",  onTouchMove,  { passive: true });
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend",   onTouchEnd);

    return () => {
      document.removeEventListener("touchmove",  onTouchMove);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend",   onTouchEnd);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        pointerEvents: "none",
        zIndex: 9998,
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, #D93060 55%, rgba(217,48,96,0.2) 100%)",
        boxShadow: "0 0 16px rgba(217,48,96,0.8), 0 0 30px rgba(217,48,96,0.4)",
        opacity: 0,
        transform: "translate(-50%, -50%) scale(0.3)",
        transition: "opacity 0.12s ease, transform 0.12s ease",
        left: "-100px",
        top: "-100px",
        mixBlendMode: "screen",
      }}
    />
  );
}
