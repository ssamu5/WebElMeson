"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden scanlines">
      {/* Background: foodtruck image with dark overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/foodtruck-frente.webp"
          alt="El Mesón Smashburgers Foodtruck"
          fill
          className="object-cover object-center opacity-30"
          priority
          sizes="100vw"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/40 to-dark" />
        <div className="absolute inset-0 bg-gradient-radial from-brand-pink/5 to-transparent" />
      </div>

      {/* Decorative neon lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-pink to-transparent opacity-60" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-pink to-transparent opacity-30" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 flex flex-col items-center gap-6 animate-fade-in">
        {/* Logo */}
        <div className="relative w-28 h-28 md:w-36 md:h-36 animate-float">
          <Image
            src="/images/logo.webp"
            alt="El Mesón Smashburgers"
            fill
            className="object-contain drop-shadow-[0_0_20px_rgba(232,24,154,0.6)]"
            priority
            sizes="(max-width: 768px) 112px, 144px"
          />
        </div>

        {/* Main title */}
        <div>
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-wider text-[#F5F5F5] leading-none">
            El Mesón
          </h1>
          <p className="neon-text font-display text-2xl sm:text-3xl md:text-4xl uppercase tracking-[0.2em] animate-flicker mt-1">
            Smashburgers
          </p>
        </div>

        {/* Tagline */}
        <p className="font-display text-lg sm:text-xl md:text-2xl uppercase tracking-widest text-muted">
          La Leyenda de los Dioses
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link href="/carta">
            <Button variant="primary" size="lg">
              Ver la Carta
            </Button>
          </Link>
          <Link href="/foodtruck">
            <Button variant="neon" size="lg">
              ¿Dónde estamos hoy?
            </Button>
          </Link>
        </div>

        {/* Call button */}
        <a href="tel:948840354" className="flex items-center gap-3 bg-brand-pink/10 border border-brand-pink/40 hover:bg-brand-pink/20 hover:border-brand-pink transition-all duration-200 px-8 py-4 rounded-sm mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-brand-pink flex-shrink-0">
            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
          </svg>
          <span className="font-display text-lg uppercase tracking-widest text-[#F5F5F5]">948 840 354</span>
        </a>

        {/* Hashtag */}
        <p className="text-muted text-xs font-display uppercase tracking-[0.3em] mt-2">
          #TheBestF*ckingBurger
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="text-xs font-display uppercase tracking-widest text-muted">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-brand-pink to-transparent animate-pulse" />
      </div>
    </section>
  );
}
