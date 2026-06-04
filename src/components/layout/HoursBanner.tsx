"use client";

export default function HoursBanner() {
  const text = "SÁBADOS Y DOMINGOS · 20:00 – 23:00 · FUSTIÑANA, NAVARRA";
  const repeated = Array(6).fill(text).join("   ᛟ   ");

  return (
    <div className="bg-white fixed top-0 left-0 right-0 z-[60]" style={{ height: 36, overflow: "hidden" }}>
      <div
        className="flex items-center h-full whitespace-nowrap"
        style={{ animation: "ticker 22s linear infinite", willChange: "transform" }}
      >
        <span className="font-display text-sm uppercase tracking-widest text-brand-pink px-4">
          {repeated}
        </span>
        <span className="font-display text-sm uppercase tracking-widest text-brand-pink px-4" aria-hidden>
          {repeated}
        </span>
      </div>
      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
