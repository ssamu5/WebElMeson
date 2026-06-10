"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FoodtruckLocation } from "@/types";
import { formatMonthYear, formatDateEs } from "@/lib/utils/formatDate";
import { cn } from "@/lib/utils/cn";

interface Props {
  initial: FoodtruckLocation[];
}

export default function FoodtruckCalendar({ initial }: Props) {
  const [locations, setLocations] = useState<FoodtruckLocation[]>(initial);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("foodtruck_locations")
      .on("postgres_changes", { event: "*", schema: "public", table: "foodtruck_locations" }, () => {
        supabase.from("foodtruck_locations").select("*").order("event_date").then(({ data }) => {
          if (data) setLocations(data as FoodtruckLocation[]);
        });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const { year, month } = currentMonth;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startPad = firstDay === 0 ? 6 : firstDay - 1; // Monday start

  const eventsByDate = locations.reduce((acc, loc) => {
    acc[loc.event_date] = loc;
    return acc;
  }, {} as Record<string, FoodtruckLocation>);

  const selectedEvent = selectedDate ? eventsByDate[selectedDate] : null;

  function prevMonth() {
    setCurrentMonth(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }
    );
    setSelectedDate(null);
  }

  function nextMonth() {
    setCurrentMonth(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }
    );
    setSelectedDate(null);
  }

  function dateStr(day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-playfair text-4xl sm:text-5xl uppercase tracking-wider text-[#F5F5F5] mb-2">
          Calendario
        </h2>
        <div className="mt-1 mb-8 h-[2px] w-16 bg-brand-pink shadow-[0_0_8px_#E8189A]" />

        <div className="glass-card rounded-xl overflow-hidden">
          {/* Month navigation */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-dark-border">
            <button
              onClick={prevMonth}
              className="p-2 text-muted hover:text-brand-pink transition-colors"
              aria-label="Mes anterior"
            >
              <ChevronLeft />
            </button>
            <h3 className="font-rawhide text-xl uppercase tracking-wider text-[#F5F5F5]">
              {formatMonthYear(`${year}-${String(month + 1).padStart(2, "0")}-01`)}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 text-muted hover:text-brand-pink transition-colors"
              aria-label="Mes siguiente"
            >
              <ChevronRight />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-dark-border">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
              <div key={d} className="py-2 text-center text-xs font-rawhide uppercase tracking-wider text-muted">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {Array.from({ length: startPad }).map((_, i) => (
              <div key={`pad-${i}`} className="aspect-square border-b border-r border-dark-border/50" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const ds = dateStr(day);
              const hasEvent = !!eventsByDate[ds];
              const isSelected = selectedDate === ds;
              const isToday = ds === today;

              return (
                <button
                  key={day}
                  onClick={() => hasEvent ? setSelectedDate(isSelected ? null : ds) : undefined}
                  className={cn(
                    "aspect-square flex flex-col items-center justify-center text-sm transition-all duration-200 border-b border-r border-dark-border/30",
                    hasEvent
                      ? "cursor-pointer hover:bg-brand-pink/10"
                      : "cursor-default",
                    isSelected && "bg-brand-pink/20",
                    isToday && "font-bold"
                  )}
                >
                  <span
                    className={cn(
                      "w-7 h-7 flex items-center justify-center rounded-full text-sm font-rawhide",
                      isToday && !isSelected && "border border-brand-pink text-brand-pink",
                      isSelected && "bg-brand-pink text-white shadow-[0_0_8px_#E8189A]",
                      !isToday && !isSelected && hasEvent && "text-[#F5F5F5]",
                      !isToday && !isSelected && !hasEvent && "text-muted"
                    )}
                  >
                    {day}
                  </span>
                  {hasEvent && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-brand-pink mt-0.5 shadow-[0_0_4px_#E8189A]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected event popup */}
          {selectedEvent && (
            <div className="border-t border-brand-pink/30 bg-dark-elevated px-4 sm:px-6 py-4 animate-slide-up">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-rawhide text-xl uppercase tracking-wider text-[#F5F5F5]">
                    {selectedEvent.location_name}
                  </p>
                  <p className="text-muted text-sm mt-1">{formatDateEs(selectedEvent.event_date)}</p>
                  {selectedEvent.address && (
                    <p className="text-muted text-xs mt-1">{selectedEvent.address}</p>
                  )}
                  <p className="text-brand-pink text-sm font-rawhide uppercase tracking-wider mt-2">
                    {selectedEvent.start_time?.slice(0, 5)} – {selectedEvent.end_time?.slice(0, 5)}
                  </p>
                  {selectedEvent.special_note && (
                    <p className="text-brand-amber text-xs mt-2 italic">{selectedEvent.special_note}</p>
                  )}
                </div>
                {selectedEvent.maps_url && (
                  <a
                    href={selectedEvent.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-1.5 text-xs font-rawhide uppercase tracking-wider text-brand-pink border border-brand-pink/40 px-3 py-2 hover:bg-brand-pink hover:text-white transition-all duration-200"
                  >
                    <MapIcon />
                    Ir
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4 text-xs text-muted">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-pink shadow-[0_0_4px_#E8189A]" />
            <span>Estaremos ahí — toca para ver detalle</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChevronLeft() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
}
function ChevronRight() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
}
function MapIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
}
