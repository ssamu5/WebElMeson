"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const CLASSES = [
  ".scroll-reveal",
  ".scroll-reveal-left",
  ".scroll-reveal-right",
  ".scroll-reveal-scale",
  ".scroll-reveal-bounce",
  ".scroll-reveal-flip",
  ".scroll-reveal-curtain",
].join(", ");

export default function ScrollRevealInit() {
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<HTMLElement>(CLASSES);
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("visible");
              observer.unobserve(e.target);
            }
          });
        },
        { threshold: 0.06, rootMargin: "0px 0px -20px 0px" }
      );
      els.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, 80);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Ripple on touch/click for buttons and cards
  useEffect(() => {
    function addRipple(e: MouseEvent | TouchEvent) {
      const target = (e.target as HTMLElement).closest(".ripple-container") as HTMLElement | null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const clientX = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX;
      const clientY = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY;
      const ripple = document.createElement("span");
      ripple.className = "ripple-effect";
      ripple.style.left = `${clientX - rect.left}px`;
      ripple.style.top = `${clientY - rect.top}px`;
      target.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    }
    document.addEventListener("click", addRipple);
    document.addEventListener("touchstart", addRipple, { passive: true });
    return () => {
      document.removeEventListener("click", addRipple);
      document.removeEventListener("touchstart", addRipple);
    };
  }, []);

  return null;
}
