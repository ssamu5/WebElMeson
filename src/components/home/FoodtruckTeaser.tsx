"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function FoodtruckTeaser() {
  return (
    <section className="relative py-0 overflow-hidden min-h-[60vh] flex items-center">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/foodtruck-derecha.webp"
          alt="El Mesón Foodtruck"
          fill
          className="object-cover object-center opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-dark/40" />
      </div>

      {/* Top/bottom neon lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-pink/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-pink/40 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="max-w-xl">
          <h2 className="metal text-5xl sm:text-6xl md:text-7xl text-[#F5F5F5] mb-4 leading-none">
            Nuestra<br />
            <span className="neon-text">Foodtruck</span>
          </h2>
          <p className="text-muted text-sm mb-6 italic">
            Consulta el calendario para ver nuestras próximas paradas.
          </p>
          <Link href="/foodtruck">
            <Button variant="neon" size="lg" className="font-display">
              Ver Calendario y Ubicación
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
