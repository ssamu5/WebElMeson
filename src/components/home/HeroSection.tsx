"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden scanlines">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/foodtruck-frente.webp"
          alt="El Mesón Smashburgers Foodtruck"
          fill
          className="object-cover object-center opacity-40"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/50 via-dark/30 to-dark" />
        {/* Warm amber glow at center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(255,140,0,0.12),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_50%_55%,rgba(232,24,154,0.10),transparent_70%)]" />
      </div>

      {/* Decorative neon lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-amber to-transparent opacity-50" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-pink to-transparent opacity-40" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 flex flex-col items-center gap-5 animate-fade-in">
        {/* Logo */}
        <div className="relative w-28 h-28 md:w-36 md:h-36 animate-float drop-shadow-[0_0_30px_rgba(255,140,0,0.5)]">
          <Image
            src="/images/logo.webp"
            alt="El Mesón Smashburgers"
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 112px, 144px"
          />
        </div>

        {/* Title */}
        <div>
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-wider text-[#F5F5F5] leading-none drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
            El Mesón
          </h1>
          <p className="neon-text font-display text-2xl sm:text-3xl md:text-4xl uppercase tracking-[0.2em] animate-flicker mt-1">
            Smashburgers
          </p>
        </div>

        {/* Tagline */}
        <p className="font-display text-lg sm:text-xl uppercase tracking-widest text-[#7A6050]">
          La Leyenda de los Dioses
        </p>

        {/* Hours badge */}
        <div className="flex items-center gap-2 bg-brand-amber/15 border border-brand-amber/40 px-5 py-2.5 rounded-sm animate-amber-pulse">
          <span className="w-2 h-2 rounded-full bg-brand-amber inline-block animate-pulse" />
          <span className="font-display text-base sm:text-lg uppercase tracking-[0.2em] text-brand-amber">
            Sáb &amp; Dom · 20:00 – 23:00
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-1">
          <Link href="/carta">
            <Button variant="primary" size="lg">Ver la Carta</Button>
          </Link>
          <Link href="/foodtruck">
            <Button variant="neon" size="lg">¿Dónde estamos hoy?</Button>
          </Link>
        </div>

        {/* Call button — big and visible */}
        <a
          href="tel:948840354"
          className="flex items-center gap-3 bg-brand-amber text-dark font-display text-xl uppercase tracking-widest px-10 py-4 rounded-sm hover:bg-brand-amber/90 transition-all duration-200 shadow-[0_0_20px_rgba(255,140,0,0.4)] hover:shadow-[0_0_35px_rgba(255,140,0,0.6)] mt-1"
        >
          <PhoneIcon />
          Llámanos · 948 840 354
        </a>

        {/* Hashtag */}
        <p className="text-[#7A6050] text-xs font-display uppercase tracking-[0.3em]">
          #TheBestF*ckingBurger
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="text-xs font-display uppercase tracking-widest text-[#7A6050]">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-brand-amber to-transparent animate-pulse" />
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
