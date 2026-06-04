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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,rgba(217,48,96,0.10),transparent_70%)]" />
        {/* Floating orbs */}
        <div className="bg-orb" style={{ width: 300, height: 300, top: "20%", left: "-10%", animationDelay: "0s" }} />
        <div className="bg-orb" style={{ width: 200, height: 200, top: "50%", right: "-5%", animationDelay: "3s" }} />
        <div className="bg-orb" style={{ width: 150, height: 150, bottom: "15%", left: "30%", animationDelay: "5s" }} />
      </div>

      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-brand-pink to-transparent opacity-70" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 flex flex-col items-center gap-4 sm:gap-5 animate-fade-in w-full max-w-lg mx-auto">
        <div>
          <h1 className="metal text-white drop-shadow-[0_2px_30px_rgba(0,0,0,0.9)] animate-glitch" style={{ fontSize: "clamp(4.5rem,24vw,10rem)", lineHeight: 1 }}>
            El Mesón
          </h1>
          <p className="metal neon-text animate-flicker mt-1" style={{ fontSize: "clamp(1.8rem,9vw,4rem)" }}>
            Smashburgers
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2">
          <Link href="/carta" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full btn-shine ripple-container">Ver la Carta</Button>
          </Link>
          <Link href="/foodtruck" className="w-full sm:w-auto">
            <Button variant="neon" size="lg" className="w-full ripple-container">¿Dónde estamos hoy?</Button>
          </Link>
        </div>

        <p className="text-muted text-[11px] font-display uppercase tracking-[0.3em] mt-1">
          #TheBestF*ckingBurger
        </p>
      </div>
    </section>
  );
}
