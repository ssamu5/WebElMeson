"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TodaySpecial } from "@/types";
import { formatDateEs, todayString } from "@/lib/utils/formatDate";

interface Props {
  initial: TodaySpecial | null;
}

export default function TodayLocation({ initial }: Props) {
  const [today, setToday] = useState<TodaySpecial | null>(initial);
  const todayStr = todayString();
  const isToday = today?.special_date === todayStr;

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("today_special_ft")
      .on("postgres_changes", { event: "*", schema: "public", table: "today_special" }, (payload) => {
        setToday(payload.new as TodaySpecial);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-3 h-3 rounded-full ${isToday ? "bg-green-400 animate-pulse shadow-[0_0_8px_#4ade80]" : "bg-muted"}`} />
          <span className="font-display text-xs uppercase tracking-[0.3em] text-[#F5F5F5]">
            {isToday ? "Abiertos Ahora · Hoy Estamos En" : "Próxima Parada"}
          </span>
        </div>

        {today && today.special_message ? (
          <div className="glass-card rounded-xl p-6 md:p-8 border border-brand-pink/20 hover:border-brand-pink/40 transition-all duration-300">
            <p className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-[#F5F5F5] mb-2">
              {today.special_message}
            </p>

            {today.special_date && (
              <p className="text-muted text-sm font-display uppercase tracking-wider mb-6">
                {formatDateEs(today.special_date)}
              </p>
            )}

            {today.featured_burgers && today.featured_burgers.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-display uppercase tracking-widest text-brand-pink mb-2">Hoy en la carta</p>
                <div className="flex flex-wrap gap-2">
                  {today.featured_burgers.map((b) => (
                    <span
                      key={b}
                      className="font-display text-sm uppercase tracking-wider text-[#F5F5F5] bg-dark border border-brand-pink/30 px-3 py-1 rounded-sm"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {today.extra_note && (
              <p className="text-brand-amber text-sm italic">{today.extra_note}</p>
            )}
          </div>
        ) : (
          <div className="glass-card rounded-xl p-6 md:p-8 border border-dark-border text-center">
            <p className="font-display text-2xl uppercase tracking-wider text-muted">
              Hoy no hay servicio
            </p>
            <p className="text-muted text-sm mt-2">Consulta el calendario para ver las próximas paradas</p>
          </div>
        )}
      </div>
    </section>
  );
}
