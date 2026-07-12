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
      </div>

      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-brand-pink to-transparent opacity-70" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 flex flex-col items-center gap-4 sm:gap-5 animate-fade-in w-full max-w-lg mx-auto">
        <div>
          <h1 className="metal animate-glitch text-white drop-shadow-[0_2px_30px_rgba(0,0,0,0.9)]" style={{ fontSize: "clamp(4.5rem,24vw,10rem)", lineHeight: 1 }}>
            El Mesón
          </h1>
          <p className="metal neon-text mt-1" style={{ fontSize: "clamp(1.8rem,9vw,4rem)" }}>
            Smashburgers
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2">
          <Link href="/carta" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full ripple-container font-playfair">Carta Restaurante</Button>
          </Link>
          <Link href="/foodtruck" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full ripple-container font-playfair">Carta Foodtruck</Button>
          </Link>
        </div>

        <p className="text-muted text-xs font-rawhide uppercase tracking-[0.3em] mt-1">
          <span className="text-brand-pink-glow text-xl align-middle">#</span>TheBestF*ckingBurger
        </p>
      </div>
    </section>
  );
}
