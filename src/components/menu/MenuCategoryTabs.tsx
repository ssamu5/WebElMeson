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

export default function MenuCategoryTabs() {
  const [active, setActive] = useState("raciones");

  function scrollToSection(id: string) {
    setActive(id);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // navbar height
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  // Update active tab based on scroll position
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    TABS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky top-16 z-30 bg-dark/95 backdrop-blur-lg border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-2 overflow-x-auto no-scrollbar">
        <div className="flex gap-1 py-2 min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={cn(
                "px-4 py-2 font-display text-sm uppercase tracking-wider rounded-sm transition-all duration-200 whitespace-nowrap",
                active === tab.id
                  ? "bg-brand-pink text-white shadow-[0_0_10px_rgba(232,24,154,0.4)]"
                  : "text-muted hover:text-[#F5F5F5] hover:bg-dark-elevated"
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
