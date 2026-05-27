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
