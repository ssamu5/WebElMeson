"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { BurgerDelMes } from "@/types";
import { formatPriceShort } from "@/lib/utils/formatPrice";
import Button from "@/components/ui/Button";

interface Props { initial: BurgerDelMes | null; }

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
    <section>
      <div className="h-[1px] bg-gradient-to-r from-transparent via-brand-pink/40 to-transparent" />

      {/* Title */}
      <div className="flex justify-center pt-10 pb-5 px-4">
        <h3 className="font-playfair text-3xl sm:text-4xl uppercase tracking-wider neon-text">
          Burger del Mes
        </h3>
      </div>

      {/* Photo — full width, prominent, no text on top */}
      {burger.image_url && (
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] overflow-hidden">
          <Image
            src={burger.image_url}
            alt={burger.name}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        </div>
      )}

      {/* Text — clearly below the photo */}
      <div className="px-4 py-8 text-center max-w-2xl mx-auto">
        <h2 className="font-rawhide text-3xl sm:text-4xl md:text-5xl neon-text-soft mb-3 leading-tight break-words w-full">
          {burger.name}
        </h2>

        {burger.story && (
          <p className="text-[#F5F5F5]/60 text-sm sm:text-base italic mb-4 leading-relaxed">
            &ldquo;{burger.story}&rdquo;
          </p>
        )}

        {burger.description && (
          <p className="text-[#F5F5F5]/85 text-sm sm:text-base mb-8 leading-relaxed">
            {burger.description}
          </p>
        )}

        <div className="flex items-center justify-center gap-5">
          <span className="font-rawhide text-4xl neon-text-soft">{formatPriceShort(burger.price)}</span>
          <Link href="/carta#burger-mes">
            <Button variant="primary" size="md" className="font-rawhide">Ver en la Carta</Button>
          </Link>
        </div>
      </div>

      <div className="h-[1px] bg-gradient-to-r from-transparent via-brand-pink/20 to-transparent" />
    </section>
  );
}
