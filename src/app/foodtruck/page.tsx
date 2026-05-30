import { Metadata } from "next";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import TodayLocation from "@/components/foodtruck/TodayLocation";
import FoodtruckCalendar from "@/components/foodtruck/FoodtruckCalendar";
import NotificationForm from "@/components/foodtruck/NotificationForm";
import { FoodtruckLocation, TodaySpecial } from "@/types";

export const metadata: Metadata = {
  title: "Foodtruck",
  description: "El Mesón Smashburgers recorre Navarra este verano. Consulta el calendario y activa las notificaciones para tu pueblo.",
};
export const revalidate = 60;

export default async function FoodtruckPage() {
  const supabase = await createClient();

  const [{ data: locationsData }, { data: todayData }] = await Promise.all([
    supabase.from("foodtruck_locations").select("*").gte("event_date", new Date().toISOString().split("T")[0]).order("event_date").limit(50),
    supabase.from("today_special").select("*").order("special_date", { ascending: false }).limit(1).single(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[55vw] sm:min-h-[45vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/foodtruck-frente.webp"
            alt="El Mesón Foodtruck"
            fill
            className="object-cover object-center opacity-45"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/50 via-dark/30 to-dark" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(232,24,154,0.08),transparent)]" />
        </div>
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-brand-pink/50 to-transparent" />

        <div className="relative z-10 text-center px-4 py-16 sm:py-24">
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl uppercase tracking-wider text-white leading-none drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
            El Mesón,
          </h1>
          <p className="font-display text-3xl sm:text-4xl uppercase tracking-wider neon-text animate-flicker mt-1">
            Donde Tú Estés
          </p>
          <p className="text-[#F5F5F5]/70 text-sm sm:text-base mt-4 max-w-sm mx-auto leading-relaxed">
            Este verano llevamos nuestras smash burgers a festivales, fiestas patronales y pueblos de toda la Ribera.
          </p>
        </div>
      </section>

      {/* Visual highlights */}
      <section className="border-y border-dark-border bg-dark-secondary">
        <div className="max-w-4xl mx-auto grid grid-cols-3 divide-x divide-dark-border">
          {[
            { label: "Burgers / hora", value: "200+" },
            { label: "Años de experiencia", value: "4" },
            { label: "Hechas al momento", value: "45s" },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center justify-center py-6 px-3 text-center gap-1">
              <span className="font-display text-3xl sm:text-4xl neon-text">{value}</span>
              <span className="text-muted text-[11px] sm:text-xs uppercase tracking-wider leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <TodayLocation initial={todayData as TodaySpecial | null} />
      <div className="border-t border-dark-border/50" />
      <FoodtruckCalendar initial={(locationsData as FoodtruckLocation[]) ?? []} />
      <div className="border-t border-dark-border/50" />
      <NotificationForm />
    </div>
  );
}
