import { createClient } from "@/lib/supabase/server";
import HeroSection from "@/components/home/HeroSection";
import BurgerDelMesSection from "@/components/home/BurgerDelMesSection";
import BestSellers from "@/components/home/BestSellers";
import FoodtruckTeaser from "@/components/home/FoodtruckTeaser";
import InstagramCTA from "@/components/home/InstagramCTA";
import { MenuItem } from "@/types";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: featuredItems }, { data: burgerMes }] = await Promise.all([
    supabase
      .from("menu_items")
      .select("*")
      .eq("is_featured", true)
      .eq("is_available", true)
      .order("sort_order")
      .limit(6),
    supabase
      .from("menu_items")
      .select("*")
      .eq("is_burger_of_month", true)
      .single(),
  ]);

  return (
    <>
      <HeroSection />
      <div className="scroll-reveal-flip">
        <BurgerDelMesSection initial={burgerMes as MenuItem | null} />
      </div>
      <div className="scroll-reveal">
        <BestSellers items={(featuredItems as MenuItem[]) ?? []} />
      </div>
      <div className="scroll-reveal-left">
        <FoodtruckTeaser />
      </div>
      <div className="scroll-reveal-scale">
        <InstagramCTA />
      </div>
    </>
  );
}
