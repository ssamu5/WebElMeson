import { createClient } from "@/lib/supabase/server";
import HeroSection from "@/components/home/HeroSection";
import BurgerDelMesSection from "@/components/home/BurgerDelMesSection";
import BestSellers from "@/components/home/BestSellers";
import FoodtruckTeaser from "@/components/home/FoodtruckTeaser";
import InstagramCTA from "@/components/home/InstagramCTA";
import { BurgerDelMes, MenuItem, TodaySpecial } from "@/types";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: featuredItems }, { data: burgerMes }, { data: todayData }] =
    await Promise.all([
      supabase.from("menu_items").select("*").eq("is_featured", true).eq("is_available", true).order("sort_order").limit(6),
      supabase.from("burger_del_mes").select("*").eq("is_active", true).single(),
      supabase.from("today_special").select("*").order("special_date", { ascending: false }).limit(1).single(),
    ]);

  return (
    <>
      <HeroSection />
      <div className="scroll-reveal-flip"><BurgerDelMesSection initial={burgerMes as BurgerDelMes | null} /></div>
      <div className="scroll-reveal"><BestSellers items={(featuredItems as MenuItem[]) ?? []} /></div>
      <div className="scroll-reveal-left"><FoodtruckTeaser initial={todayData as TodaySpecial | null} /></div>
      <div className="scroll-reveal-scale"><InstagramCTA /></div>
    </>
  );
}
