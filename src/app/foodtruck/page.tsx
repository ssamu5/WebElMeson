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
    supabase
      .from("foodtruck_locations")
      .select("*")
      .gte("event_date", new Date().toISOString().split("T")[0])
      .order("event_date")
      .limit(50),
    supabase
      .from("today_special")
      .select("*")
      .order("special_date", { ascending: false })
      .limit(1)
      .single(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/foodtruck-frente.webp"
            alt="El Mesón Foodtruck"
            fill
            className="object-cover object-center opacity-30"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/40 via-dark/50 to-dark" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-pink/50 to-transparent" />

        <div className="relative z-10 text-center px-4">
          <div className="relative w-24 h-24 mx-auto mb-4 animate-float">
            <Image
              src="/images/neon-burger.webp"
              alt="Neon Burger"
              fill
              className="object-contain drop-shadow-[0_0_20px_rgba(232,24,154,0.5)]"
              sizes="96px"
            />
          </div>
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl uppercase tracking-wider text-[#F5F5F5] leading-none">
            El Mesón,
          </h1>
          <p className="font-display text-3xl sm:text-4xl md:text-5xl uppercase tracking-wider neon-text animate-flicker mt-1">
            Donde Tú Estés
          </p>
          <p className="text-muted text-sm md:text-base mt-4 max-w-md mx-auto">
            Este verano llevamos nuestras smash burgers a festivales, fiestas patronales y pueblos de toda la Ribera de Navarra.
          </p>
        </div>
      </section>

      {/* About the foodtruck */}
      <section className="py-16 px-4 border-y border-dark-border bg-dark-secondary">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <div className="text-brand-pink text-3xl mb-3">🚚</div>
            <h3 className="font-display text-lg uppercase tracking-wider text-[#F5F5F5] mb-2">Foodtruck Profesional</h3>
            <p className="text-muted text-sm">Camión industrial diseñado para eventos. Cocina abierta, iluminación neon, hasta 200 burgers/hora.</p>
          </div>
          <div>
            <div className="text-brand-pink text-3xl mb-3">⚡</div>
            <h3 className="font-display text-lg uppercase tracking-wider text-[#F5F5F5] mb-2">45 Segundos</h3>
            <p className="text-muted text-sm">Tiempo de preparación por burger. Sin colas eternas. Smash en el momento, ingredientes del día.</p>
          </div>
          <div>
            <div className="text-brand-pink text-3xl mb-3">📍</div>
            <h3 className="font-display text-lg uppercase tracking-wider text-[#F5F5F5] mb-2">Tu Pueblo</h3>
            <p className="text-muted text-sm">Suscríbete y te avisamos cuando vengamos a tu pueblo. Tú decides, tú mandes.</p>
          </div>
        </div>
      </section>

      {/* Today's Location (real-time) */}
      <TodayLocation initial={todayData as TodaySpecial | null} />

      <div className="border-t border-dark-border/50" />

      {/* Calendar */}
      <FoodtruckCalendar initial={(locationsData as FoodtruckLocation[]) ?? []} />

      <div className="border-t border-dark-border/50" />

      {/* Notification subscription */}
      <NotificationForm />
    </div>
  );
}
