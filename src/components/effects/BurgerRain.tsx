"use client";

const BURGERS = [
  "/images/rain-pulled_beast.webp",
  "/images/rain-vanelope.webp",
  "/images/rain-flash_1.webp",
  "/images/rain-flash_2.webp",
  "/images/rain-oumama.webp",
  "/images/rain-rudolph.webp",
  "/images/rain-space_jam.webp",
];

const DROPS = [
  { left: "3%",  delay: "0s",    dur: "10s", size: 90,  rot: "-15deg", rot2: "170deg"  },
  { left: "11%", delay: "4s",    dur: "13s", size: 70,  rot: "20deg",  rot2: "-200deg" },
  { left: "20%", delay: "1.5s",  dur: "9s",  size: 110, rot: "-30deg", rot2: "185deg"  },
  { left: "31%", delay: "7s",    dur: "14s", size: 65,  rot: "10deg",  rot2: "-160deg" },
  { left: "42%", delay: "2.5s",  dur: "11s", size: 95,  rot: "-25deg", rot2: "210deg"  },
  { left: "54%", delay: "9s",    dur: "10s", size: 75,  rot: "35deg",  rot2: "-190deg" },
  { left: "63%", delay: "0.8s",  dur: "12s", size: 100, rot: "-10deg", rot2: "175deg"  },
  { left: "73%", delay: "5s",    dur: "9.5s",size: 72,  rot: "25deg",  rot2: "-215deg" },
  { left: "83%", delay: "3s",    dur: "11s", size: 85,  rot: "-20deg", rot2: "185deg"  },
  { left: "91%", delay: "6.5s",  dur: "10s", size: 68,  rot: "15deg",  rot2: "-170deg" },
  { left: "7%",  delay: "11s",   dur: "13s", size: 80,  rot: "-18deg", rot2: "195deg"  },
  { left: "47%", delay: "8s",    dur: "15s", size: 60,  rot: "28deg",  rot2: "-180deg" },
  { left: "77%", delay: "2s",    dur: "9s",  size: 92,  rot: "-22deg", rot2: "165deg"  },
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
            animationDelay: drop.delay,
            animationDuration: drop.dur,
            "--rot-start": drop.rot,
            "--rot-end": drop.rot2,
            "--max-opacity": "0.2",
          } as React.CSSProperties}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BURGERS[i % BURGERS.length]}
            alt=""
            width={drop.size}
            style={{ width: drop.size, mixBlendMode: "screen", display: "block" }}
          />
        </div>
      ))}
    </div>
  );
}
