"use client";

import Image from "next/image";

const BURGERS = [
  "/images/burger-rain-1.webp",
  "/images/burger-rain-2.webp",
  "/images/burger-rain-3.webp",
  "/images/burger-rain-4.webp",
  "/images/burger-rain-5.webp",
  "/images/burger-rain-6.webp",
  "/images/burger-rain-7.webp",
  "/images/burger-rain-8.webp",
];

const DROPS = [
  { left: "4%",  delay: "0s",    dur: "9s",  size: 60,  rot: "-15deg",  rot2: "170deg",  op: "0.15" },
  { left: "12%", delay: "3.5s",  dur: "11s", size: 45,  rot: "20deg",   rot2: "-200deg", op: "0.12" },
  { left: "22%", delay: "1s",    dur: "8s",  size: 70,  rot: "-30deg",  rot2: "180deg",  op: "0.17" },
  { left: "33%", delay: "6s",    dur: "13s", size: 40,  rot: "10deg",   rot2: "-160deg", op: "0.10" },
  { left: "44%", delay: "2.5s",  dur: "10s", size: 55,  rot: "-25deg",  rot2: "210deg",  op: "0.14" },
  { left: "55%", delay: "8s",    dur: "9.5s",size: 50,  rot: "35deg",   rot2: "-190deg", op: "0.13" },
  { left: "65%", delay: "0.5s",  dur: "12s", size: 65,  rot: "-10deg",  rot2: "175deg",  op: "0.16" },
  { left: "74%", delay: "4s",    dur: "8.5s",size: 42,  rot: "25deg",   rot2: "-215deg", op: "0.11" },
  { left: "84%", delay: "7s",    dur: "11s", size: 58,  rot: "-20deg",  rot2: "185deg",  op: "0.15" },
  { left: "92%", delay: "2s",    dur: "9s",  size: 48,  rot: "15deg",   rot2: "-170deg", op: "0.12" },
  { left: "8%",  delay: "9s",    dur: "10s", size: 52,  rot: "-18deg",  rot2: "195deg",  op: "0.13" },
  { left: "38%", delay: "5s",    dur: "14s", size: 36,  rot: "28deg",   rot2: "-180deg", op: "0.09" },
  { left: "78%", delay: "11s",   dur: "8s",  size: 62,  rot: "-22deg",  rot2: "165deg",  op: "0.16" },
];

export default function BurgerRain() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {DROPS.map((drop, i) => (
        <div
          key={i}
          className="absolute animate-burger-fall"
          style={{
            left: drop.left,
            top: 0,
            width: drop.size,
            height: drop.size,
            animationDelay: drop.delay,
            animationDuration: drop.dur,
            "--rot-start": drop.rot,
            "--rot-end": drop.rot2,
            "--max-opacity": drop.op,
          } as React.CSSProperties}
        >
          <Image
            src={BURGERS[i % BURGERS.length]}
            alt=""
            width={drop.size}
            height={drop.size}
            className="w-full h-full object-cover rounded-full"
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}
