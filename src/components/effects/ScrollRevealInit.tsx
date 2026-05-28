"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollRevealInit() {
  const pathname = usePathname();

  useEffect(() => {
    const observe = () => {
      const els = document.querySelectorAll<HTMLElement>(".scroll-reveal, .scroll-reveal-left");
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("visible");
              observer.unobserve(e.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
      );
      els.forEach((el) => observer.observe(el));
      return observer;
    };

    const timer = setTimeout(() => {
      const observer = observe();
      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
