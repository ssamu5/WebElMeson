"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollRevealInit() {
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<HTMLElement>(
        ".scroll-reveal, .scroll-reveal-left, .scroll-reveal-scale"
      );
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("visible");
              observer.unobserve(e.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
      );
      els.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, 80);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
