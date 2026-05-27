"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { TodaySpecial } from "@/types";
import Button from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants/siteConfig";

interface Props {
  initial: TodaySpecial | null;
}

export default function FoodtruckTeaser({ initial }: Props) {
  const [today, setToday] = useState<TodaySpecial | null>(initial);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("today_special_teaser")
      .on("postgres_changes", { event: "*", schema: "public", table: "today_special" }, (payload) => {
        setToday(payload.new as TodaySpecial);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

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
          {/* Label */}
          <span className="font-display text-xs uppercase tracking-[0.3em] text-brand-pink mb-4 block">
            🚚 Foodtruck 2026
          </span>

          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl uppercase tracking-wider text-[#F5F5F5] mb-4 leading-none">
            El Mesón,<br />
            <span className="neon-text">Donde Tú Estés</span>
          </h2>

          {/* Today's location */}
          {today?.special_message ? (
            <div className="mb-6 glass-card rounded-lg p-4 border-l-2 border-brand-pink">
              <p className="text-xs font-display uppercase tracking-widest text-brand-pink mb-1">Hoy estamos en</p>
              <p className="text-[#F5F5F5] font-medium">{today.special_message}</p>
              {today.featured_burgers && today.featured_burgers.length > 0 && (
                <p className="text-muted text-xs mt-1">
                  Hoy: {today.featured_burgers.join(" · ")}
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted text-sm mb-6 italic">
              Consulta el calendario para ver nuestras próximas paradas.
            </p>
          )}

          {/* Hours reminder */}
          <p className="text-muted text-sm mb-6">{SITE_CONFIG.hours}</p>

          <Link href="/foodtruck">
            <Button variant="neon" size="lg">
              Ver Calendario y Ubicación
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
