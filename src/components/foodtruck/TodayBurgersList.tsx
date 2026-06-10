"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TodaySpecial } from "@/types";

interface Props {
  initial: TodaySpecial | null;
}

export default function TodayBurgersList({ initial }: Props) {
  const [today, setToday] = useState<TodaySpecial | null>(initial);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("today_special_burgers")
      .on("postgres_changes", { event: "*", schema: "public", table: "today_special" }, (payload) => {
        setToday(payload.new as TodaySpecial);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  if (today?.featured_burgers && today.featured_burgers.length > 0) {
    return (
      <div className="flex flex-wrap justify-center gap-3">
        {today.featured_burgers.map((b) => (
          <span
            key={b}
            className="font-rawhide text-base sm:text-lg uppercase tracking-wider text-brand-pink-glow border border-brand-pink/40 px-4 py-2 rounded-sm"
          >
            {b}
          </span>
        ))}
      </div>
    );
  }

  return <p className="text-muted text-sm italic">Hoy no hay burgers especiales — consulta la carta habitual.</p>;
}
