"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden scanlines">
      {/* Background: burger photo */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-burger.webp"
          alt="El Mesón Smashburgers"
          fill
          className="object-cover object-center opacity-50"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/40 to-dark" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,rgba(232,24,154,0.12),transparent_70%)]" />
      </div>

      {/* Neon lines */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-brand-pink to-transparent opacity-70" />
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-brand-pink/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 flex flex-col items-center gap-4 sm:gap-5 animate-fade-in w-full max-w-lg mx-auto">
        {/* Logo */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 animate-float drop-shadow-[0_0_25px_rgba(232,24,154,0.7)]">
          <Image
            src="/images/logo.webp"
            alt="El Mesón Smashburgers"
            fill className="object-contain"
            priority sizes="(max-width: 640px) 96px, 128px"
          />
        </div>

        {/* Title */}
        <div>
          <h1 className="font-display text-6xl sm:text-7xl md:text-9xl uppercase tracking-wider text-[#F5F5F5] leading-none drop-shadow-[0_2px_30px_rgba(0,0,0,0.9)]">
            El Mesón
          </h1>
          <p className="neon-text font-display text-2xl sm:text-3xl md:text-4xl uppercase tracking-[0.2em] animate-flicker mt-1">
            Smashburgers
          </p>
        </div>

        {/* Hours — critical info */}
        <div className="flex items-center gap-2.5 bg-brand-pink/10 border border-brand-pink/50 px-4 sm:px-6 py-2.5 rounded-sm animate-glow-pulse">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping-pink absolute inline-flex h-full w-full rounded-full bg-brand-pink opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-pink" />
          </span>
          <span className="font-display text-sm sm:text-base uppercase tracking-[0.18em] text-brand-pink">
            Sáb &amp; Dom · 20:00 – 23:00
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link href="/carta" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full">Ver la Carta</Button>
          </Link>
          <Link href="/foodtruck" className="w-full sm:w-auto">
            <Button variant="neon" size="lg" className="w-full">¿Dónde estamos hoy?</Button>
          </Link>
        </div>

        {/* Call button — big, unmissable */}
        <a
          href="tel:948840354"
          className="flex items-center justify-center gap-2.5 w-full sm:w-auto bg-brand-pink text-white font-display text-lg sm:text-xl uppercase tracking-widest px-8 sm:px-10 py-4 rounded-sm hover:bg-brand-pink-dark transition-all duration-200 shadow-[0_0_25px_rgba(232,24,154,0.5)] hover:shadow-[0_0_40px_rgba(232,24,154,0.7)]"
        >
          <PhoneIcon />
          Llámanos · 948 840 354
        </a>

        <p className="text-muted text-[11px] font-display uppercase tracking-[0.3em]">
          #TheBestF*ckingBurger
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="text-[10px] font-display uppercase tracking-widest text-muted">Scroll</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-brand-pink to-transparent animate-pulse" />
      </div>
    </section>
  );
}

function PhoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
      <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
    </svg>
  );
}
