"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-pink/5 via-transparent to-brand-pink/5" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-pink/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-pink/30 to-transparent" />

      <div className="relative max-w-4xl mx-auto">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-[0.3em] text-brand-pink border border-brand-pink/50 px-4 py-2 animate-glow-pulse">
            <span className="w-1 h-1 rounded-full bg-brand-pink inline-block animate-pulse" />
            Burger del Mes
            <span className="w-1 h-1 rounded-full bg-brand-pink inline-block animate-pulse" />
          </span>
        </div>

        {/* Content */}
        <div className="text-center">
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl uppercase tracking-wider text-[#F5F5F5] mb-2">
            {burger.name}
          </h2>

          {burger.month_year && (
            <p className="text-muted font-display uppercase tracking-widest text-sm mb-6">{burger.month_year}</p>
          )}

          {burger.story && (
            <p className="text-[#F5F5F5]/70 text-base md:text-lg max-w-2xl mx-auto mb-4 leading-relaxed italic">
              &ldquo;{burger.story}&rdquo;
            </p>
          )}

          <p className="text-[#F5F5F5]/90 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            {burger.description}
          </p>

          <div className="flex items-center justify-center gap-6">
            <span className="font-display text-4xl neon-text">{formatPriceShort(burger.price)}</span>
            <Link href="/carta#burger-mes">
              <Button variant="primary" size="md">
                Ver en la Carta
              </Button>
            </Link>
          </div>
        </div>

        {/* Decoration: pink neon lines on sides */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[1px] h-24 bg-gradient-to-b from-transparent via-brand-pink to-transparent hidden md:block" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[1px] h-24 bg-gradient-to-b from-transparent via-brand-pink to-transparent hidden md:block" />
      </div>
    </section>
  );
}
