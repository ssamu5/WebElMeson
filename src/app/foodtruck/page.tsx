import { Metadata } from "next";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import TodayLocation from "@/components/foodtruck/TodayLocation";
import FoodtruckCalendar from "@/components/foodtruck/FoodtruckCalendar";
import { FoodtruckLocation, TodaySpecial } from "@/types";

export const metadata: Metadata = {
  title: "Foodtruck",
  description: "El Mesón Smashburgers recorre Navarra este verano. Consulta el calendario.",
};
export const revalidate = 60;

const WA_URL = "https://wa.me/34690657610?text=Hola%2C%20me%20gustar%C3%ADa%20contar%20con%20El%20Mes%C3%B3n%20Smashburgers%20para%20un%20evento.%20Te%20cuento%20la%20situaci%C3%B3n%3A";

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
          <Image src="/images/foodtruck-frente.webp" alt="El Mesón Foodtruck" fill className="object-cover object-center opacity-45" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/50 via-dark/30 to-dark" />
        </div>
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-brand-pink/50 to-transparent" />
        <div className="relative z-10 text-center px-4 py-16 sm:py-24">
          <h1 className="metal text-6xl sm:text-7xl md:text-8xl text-white leading-none drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
            El Mesón,
          </h1>
          <p className="font-display text-3xl sm:text-4xl uppercase tracking-wider neon-text animate-flicker mt-1">
            Donde Tú Estés
          </p>
          <p className="text-[#f0ece4]/70 text-sm sm:text-base mt-4 max-w-sm mx-auto leading-relaxed">
            Este verano llevamos nuestras smash burgers a festivales, fiestas patronales y pueblos de toda la Ribera.
          </p>
        </div>
      </section>

      {/* Stats */}
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

      {/* Event booking CTA */}
      <section className="py-16 px-4 border-t border-dark-border bg-dark-secondary">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl text-[#f0ece4] mb-4">
            ¿Tienes un evento especial?
          </h2>
          <p className="text-muted text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto">
            ¿Una boda, un cumpleaños, una fiesta, un festival o eres el encargado de un ayuntamiento? Lo que sea. Si quieres que asistamos a tu evento, escríbenos y lo hablamos.
          </p>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] text-white font-display text-lg uppercase tracking-wider px-8 py-4 rounded-[2px] hover:bg-[#1aad54] active:scale-95 transition-all duration-200 shadow-[0_0_20px_rgba(37,211,102,0.3)]"
          >
            <WhatsAppIcon />
            Escríbenos por WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}
