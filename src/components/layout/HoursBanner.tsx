"use client";

export default function HoursBanner() {
  const text = "SÁBADOS Y DOMINGOS · 20:00 – 23:00 · FUSTIÑANA, NAVARRA";
  const repeated = Array(6).fill(text).join("   ᛟ   ");

  return (
    <div className="bg-brand-pink overflow-hidden sticky top-0 z-[60]" style={{ height: 36 }}>
      <div
        className="flex items-center h-full whitespace-nowrap"
        style={{ animation: "ticker 22s linear infinite" }}
      >
        <span className="font-display text-sm uppercase tracking-widest text-white px-4">
          {repeated}
        </span>
        <span className="font-display text-sm uppercase tracking-widest text-white px-4" aria-hidden>
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
