"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { id: "raciones", label: "Raciones" },
  { id: "smash_10", label: "Smash €10" },
  { id: "smash_13", label: "Smash €13" },
  { id: "burger-mes", label: "Burger del Mes" },
  { id: "postres", label: "Postres" },
];

// banner(36) + navbar(40) = 76px
const TOP_OFFSET = 76;

export default function MenuCategoryTabs() {
  const [active, setActive] = useState("raciones");

  function scrollToSection(id: string) {
    setActive(id);
    const el = document.getElementById(id);
    if (el) {
      const tabsHeight = 44;
      const top = el.getBoundingClientRect().top + window.scrollY - TOP_OFFSET - tabsHeight - 8;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: `-${TOP_OFFSET + 50}px 0px -60% 0px`, threshold: 0 }
    );

    TABS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky z-30 bg-dark/95 backdrop-blur-lg border-b border-dark-border" style={{ top: TOP_OFFSET }}>
      <div className="max-w-7xl mx-auto px-2 overflow-x-auto no-scrollbar snap-x snap-mandatory">
        <div className="flex gap-1 py-1.5 w-max">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={cn(
                "px-3 py-1.5 font-rawhide text-xs sm:text-sm uppercase tracking-wider rounded-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 snap-start",
                active === tab.id
                  ? "bg-brand-pink text-white"
                  : "text-muted hover:text-[#f0ece4] hover:bg-dark-elevated"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
