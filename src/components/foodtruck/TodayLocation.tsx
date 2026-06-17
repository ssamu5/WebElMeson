"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FoodtruckLocation } from "@/types";
import { todayString } from "@/lib/utils/formatDate";

interface Props {
  initial: FoodtruckLocation | null;
}

export default function TodayLocation({ initial }: Props) {
  const [loc, setLoc] = useState<FoodtruckLocation | null>(initial);

  useEffect(() => {
    const supabase = createClient();
    const today = todayString();

    async function fetchToday() {
      const { data } = await supabase
        .from("foodtruck_locations")
        .select("*")
        .lte("start_date", today)
        .gte("end_date", today)
        .limit(1)
        .single();
      setLoc(data as FoodtruckLocation | null);
    }

    const channel = supabase
      .channel("today_location_ft")
      .on("postgres_changes", { event: "*", schema: "public", table: "foodtruck_locations" }, fetchToday)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-3 h-3 rounded-full ${loc ? "bg-green-400 animate-pulse shadow-[0_0_8px_#4ade80]" : "bg-muted"}`} />
          <span className="font-playfair text-xs uppercase tracking-[0.3em] text-[#F5F5F5]">
            {loc ? "Abiertos Ahora · Hoy Estamos En" : "Dónde Estamos Hoy"}
          </span>
        </div>

        {loc ? (
          <div className="glass-card rounded-xl p-6 md:p-8 border border-brand-pink/20 hover:border-brand-pink/40 transition-all duration-300">
            <p className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-[#F5F5F5] mb-2">
              {loc.event_name}
            </p>

            <p className="text-brand-pink text-sm font-rawhide uppercase tracking-wider mb-4">
              {loc.start_time?.slice(0, 5)} – {loc.end_time?.slice(0, 5)}
            </p>

            {loc.address && (
              <p className="text-muted text-sm mb-4">{loc.address}</p>
            )}

            {loc.special_note && (
              <p className="text-brand-amber text-sm italic mb-4">{loc.special_note}</p>
            )}

            {loc.maps_url && (
              <a
                href={loc.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-rawhide uppercase tracking-wider text-brand-pink border border-brand-pink/40 px-4 py-2 hover:bg-brand-pink hover:text-white transition-all duration-200 rounded-sm"
              >
                <MapIcon />
                Ver en Google Maps
              </a>
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

function MapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
