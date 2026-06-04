"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden scanlines" style={{ marginTop: -76, paddingTop: 76 }}>
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-burger.webp"
          alt="El Mesón Smashburgers"
          fill
          className="object-cover object-[center_30%]"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/35 to-dark" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,rgba(232,24,154,0.10),transparent_70%)]" />
      </div>

      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-brand-pink to-transparent opacity-70" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 flex flex-col items-center gap-4 sm:gap-5 animate-fade-in w-full max-w-lg mx-auto">
        <div>
          <h1 className="font-display text-7xl sm:text-8xl md:text-9xl uppercase tracking-wider text-white leading-none drop-shadow-[0_2px_30px_rgba(0,0,0,0.9)]">
            El Mesón
          </h1>
          <p className="neon-text font-display text-3xl sm:text-4xl uppercase tracking-[0.2em] animate-flicker mt-1">
            Smashburgers
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2">
          <Link href="/carta" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full">Ver la Carta</Button>
          </Link>
          <Link href="/foodtruck" className="w-full sm:w-auto">
            <Button variant="neon" size="lg" className="w-full">¿Dónde estamos hoy?</Button>
          </Link>
        </div>

        <p className="text-muted text-[11px] font-display uppercase tracking-[0.3em] mt-1">
          #TheBestF*ckingBurger
        </p>
      </div>
    </section>
  );
}
