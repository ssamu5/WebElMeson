"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/carta", label: "Carta" },
  { href: "/foodtruck", label: "Foodtruck" },
  { href: "/info", label: "Info" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => setOpen(false), [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed top-9 left-0 right-0 z-50 transition-all duration-300 bg-brand-pink",
          (scrolled || open) && "shadow-[0_2px_12px_rgba(217,48,96,0.4)]"
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10">
              <Image
                src="/images/logo-sm.webp"
                alt="El Mesón Smashburgers"
                fill
                className="object-contain group-hover:scale-110 transition-transform duration-200"
                sizes="40px"
              />
            </div>
            <span className="hidden sm:block font-display text-xl text-white tracking-wider uppercase">
              El Mesón
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "px-4 py-2 font-display text-sm uppercase tracking-wider transition-colors duration-200 neon-underline",
                    pathname === link.href
                      ? "text-white font-bold"
                      : "text-white/80 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Phone CTA (desktop) */}
          <a
            href="tel:948840354"
            className="hidden md:flex items-center gap-2 text-sm font-display uppercase tracking-wider text-white hover:text-white/80 transition-colors duration-200"
          >
            <PhoneIcon />
            948 840 354
          </a>

          {/* Hamburger (mobile) */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[6px] group"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            <span
              className={cn(
                "block w-6 h-0.5 bg-white transition-all duration-300 origin-center",
                open && "rotate-45 translate-y-2"
              )}
            />
            <span
              className={cn(
                "block w-6 h-0.5 bg-white transition-all duration-300",
                open && "opacity-0 scale-x-0"
              )}
            />
            <span
              className={cn(
                "block w-6 h-0.5 bg-white transition-all duration-300 origin-center",
                open && "-rotate-45 -translate-y-2"
              )}
            />
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-all duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-dark/95 backdrop-blur-lg"
          onClick={() => setOpen(false)}
        />

        {/* Menu content */}
        <nav className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-display text-4xl uppercase tracking-widest transition-all duration-200 py-2",
                "animate-slide-up",
                pathname === link.href
                  ? "text-brand-pink neon-text"
                  : "text-[#F5F5F5] hover:text-brand-pink"
              )}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {link.label}
            </Link>
          ))}

          {/* Call CTA */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <a
              href="tel:948840354"
              className="flex items-center gap-2 font-display text-lg uppercase tracking-wider text-brand-pink border-2 border-brand-pink px-6 py-3 hover:bg-brand-pink hover:text-white transition-all duration-200"
            >
              <PhoneIcon />
              948 840 354
            </a>
            <span className="text-muted text-xs">Sáb - Dom · 20:00 – 23:00</span>
          </div>
        </nav>
      </div>
    </>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.34 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.77-.77a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}
