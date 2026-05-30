"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { BurgerDelMes } from "@/types";
import { formatPriceShort } from "@/lib/utils/formatPrice";
import Button from "@/components/ui/Button";

interface Props {
  initial: BurgerDelMes | null;
}

export default function BurgerDelMesSection({ initial }: Props) {
  const [burger, setBurger] = useState<BurgerDelMes | null>(initial);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("burger_del_mes")
      .on("postgres_changes", { event: "*", schema: "public", table: "burger_del_mes" }, (payload) => {
        const updated = payload.new as BurgerDelMes;
        if (updated.is_active) setBurger(updated);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  if (!burger) return null;

  return (
    <section className="relative overflow-hidden">
      {/* Top divider */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-brand-pink/50 to-transparent" />

      {burger.image_url ? (
        /* === Layout WITH photo === */
        <div className="relative w-full" style={{ minHeight: 420 }}>
          {/* Full bleed burger photo */}
          <Image
            src={burger.image_url}
            alt={burger.name}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          {/* Dark gradient — heavy at bottom so text is readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-dark/20" />
          {/* Pink glow from bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-pink/20 via-transparent to-transparent" />

          {/* Content on top of photo */}
          <div className="relative z-10 flex flex-col items-center text-center px-4 pt-16 pb-12 sm:pt-24 sm:pb-16">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-[0.3em] text-brand-pink border border-brand-pink/60 px-4 py-2 mb-6 bg-dark/60 backdrop-blur-sm animate-glow-pulse rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-pulse" />
              Burger del Mes
              <span className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-pulse" />
            </span>

            <h2 className="font-display text-5xl sm:text-7xl md:text-8xl uppercase tracking-wider text-white leading-none mb-2 drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)]">
              {burger.name}
            </h2>

            {burger.month_year && (
              <p className="text-brand-pink/80 font-display uppercase tracking-widest text-sm mb-5">{burger.month_year}</p>
            )}

            {burger.story && (
              <p className="text-white/75 text-sm sm:text-base max-w-lg mx-auto mb-3 leading-relaxed italic">
                &ldquo;{burger.story}&rdquo;
              </p>
            )}

            {burger.description && (
              <p className="text-white/85 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
                {burger.description}
              </p>
            )}

            <div className="flex items-center gap-5">
              <span className="font-display text-4xl sm:text-5xl neon-text">{formatPriceShort(burger.price)}</span>
              <Link href="/carta#burger-mes">
                <Button variant="primary" size="md">Ver en la Carta</Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* === Layout WITHOUT photo (fallback) === */
        <div className="py-20 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-pink/5 via-transparent to-brand-pink/5" />
          <div className="relative max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-[0.3em] text-brand-pink border border-brand-pink/50 px-4 py-2 mb-6 animate-glow-pulse">
              <span className="w-1 h-1 rounded-full bg-brand-pink animate-pulse" />
              Burger del Mes
              <span className="w-1 h-1 rounded-full bg-brand-pink animate-pulse" />
            </span>
            <h2 className="font-display text-5xl sm:text-7xl uppercase tracking-wider text-[#F5F5F5] mb-2">{burger.name}</h2>
            {burger.month_year && <p className="text-muted font-display uppercase tracking-widest text-sm mb-6">{burger.month_year}</p>}
            {burger.story && <p className="text-[#F5F5F5]/70 text-base max-w-2xl mx-auto mb-4 italic">&ldquo;{burger.story}&rdquo;</p>}
            {burger.description && <p className="text-[#F5F5F5]/90 text-sm max-w-xl mx-auto mb-8">{burger.description}</p>}
            <div className="flex items-center justify-center gap-6">
              <span className="font-display text-4xl neon-text">{formatPriceShort(burger.price)}</span>
              <Link href="/carta#burger-mes"><Button variant="primary" size="md">Ver en la Carta</Button></Link>
            </div>
          </div>
        </div>
      )}

      <div className="h-[1px] bg-gradient-to-r from-transparent via-brand-pink/30 to-transparent" />
    </section>
  );
}
