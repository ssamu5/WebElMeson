import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import MenuCategoryTabs from "@/components/menu/MenuCategoryTabs";
import MenuItemCard from "@/components/menu/MenuItemCard";
import SectionTitle from "@/components/ui/SectionTitle";
import { MenuItem, BurgerDelMes, MenuCategory, CATEGORY_LABELS } from "@/types";
import { formatPriceShort } from "@/lib/utils/formatPrice";

export const metadata: Metadata = { title: "Carta" };
export const revalidate = 60;

const CATEGORIES: MenuCategory[] = ["raciones", "smash_10", "smash_13", "postres"];

export default async function CartaPage() {
  const supabase = await createClient();

  const [{ data: allItems }, { data: burgerMes }] = await Promise.all([
    supabase.from("menu_items").select("*").order("sort_order"),
    supabase.from("burger_del_mes").select("*").eq("is_active", true).single(),
  ]);

  const items = (allItems as MenuItem[]) ?? [];
  const burger = burgerMes as BurgerDelMes | null;

  const byCategory = CATEGORIES.reduce(
    (acc, cat) => ({ ...acc, [cat]: items.filter((i) => i.category === cat) }),
    {} as Record<MenuCategory, MenuItem[]>
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative py-16 px-4 text-center border-b border-dark-border">
        <div className="absolute inset-0 bg-gradient-radial from-brand-pink/5 to-transparent" />
        <h1 className="relative font-display text-6xl sm:text-7xl md:text-8xl uppercase tracking-wider text-[#F5F5F5]">
          La Carta
        </h1>
        <p className="relative text-muted text-sm mt-2 uppercase tracking-widest font-display">
          Fustiñana, Navarra · Ingredientes frescos cada día
        </p>
      </div>

      {/* Sticky category tabs */}
      <MenuCategoryTabs />

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-16">
        {/* Standard categories */}
        {CATEGORIES.map((cat) => (
          <section key={cat} id={cat}>
            <SectionTitle title={CATEGORY_LABELS[cat]} />
            <div className="space-y-2">
              {byCategory[cat].map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
              {byCategory[cat].length === 0 && (
                <p className="text-muted text-sm italic py-4">Próximamente...</p>
              )}
            </div>
          </section>
        ))}

        {/* Burger del Mes — special section */}
        {burger && (
          <section id="burger-mes" className="relative">
            <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-brand-pink/5 via-transparent to-brand-pink/5 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="font-display text-4xl md:text-5xl uppercase tracking-wider neon-text animate-flicker">
                  Burger del Mes
                </h2>
                <span className="font-display text-xs uppercase tracking-widest text-brand-amber border border-brand-amber/30 px-2 py-1">
                  {burger.month_year}
                </span>
              </div>

              <div className="glass-card rounded-xl p-6 border-brand-pink/30 border hover:shadow-[0_0_20px_rgba(232,24,154,0.2)] transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h3 className="font-display text-3xl uppercase tracking-wider text-[#F5F5F5]">
                    {burger.name}
                  </h3>
                  <span className="font-display text-3xl neon-text shrink-0">
                    {formatPriceShort(burger.price)}
                  </span>
                </div>
                {burger.story && (
                  <p className="text-muted text-sm italic mb-3 border-l-2 border-brand-pink/50 pl-3">
                    &ldquo;{burger.story}&rdquo;
                  </p>
                )}
                {burger.description && (
                  <p className="text-[#F5F5F5]/80 text-sm leading-relaxed">{burger.description}</p>
                )}
                <p className="text-brand-amber text-xs font-display uppercase tracking-widest mt-4">
                  ⚠ Solo disponible este mes — ¡No te quedes sin probarla!
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
