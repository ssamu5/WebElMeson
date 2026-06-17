import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import MenuCategoryTabs from "@/components/menu/MenuCategoryTabs";
import CartaInteractive from "@/components/menu/CartaInteractive";
import { MenuItem } from "@/types";

export const metadata: Metadata = { title: "Carta" };
export const revalidate = 60;

export default async function CartaPage() {
  const supabase = await createClient();

  const [{ data: allItems }, { data: burgerMes }] = await Promise.all([
    supabase
      .from("menu_items")
      .select("*")
      .eq("is_available", true)
      .order("sort_order"),
    supabase
      .from("menu_items")
      .select("*")
      .eq("is_burger_of_month", true)
      .single(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative py-14 px-4 text-center border-b border-dark-border">
        <div className="absolute inset-0 bg-gradient-radial from-brand-pink/5 to-transparent" />
        <h1 className="relative metal text-6xl sm:text-8xl text-[#F5F5F5]" style={{ letterSpacing: "0.08em" }}>
          La Carta
        </h1>
        <p className="relative text-muted text-xs sm:text-sm mt-2 uppercase tracking-widest font-garamond">
          Fustiñana, Navarra · Ingredientes frescos cada día
        </p>
      </div>

      <MenuCategoryTabs />

      <CartaInteractive
        items={(allItems as MenuItem[]) ?? []}
        burger={(burgerMes as MenuItem) ?? null}
      />
    </div>
  );
}
