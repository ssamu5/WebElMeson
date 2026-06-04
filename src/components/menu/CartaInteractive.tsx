"use client";

import { useState } from "react";
import { MenuItem, BurgerDelMes, MenuCategory, CATEGORY_LABELS } from "@/types";
import { formatPriceShort } from "@/lib/utils/formatPrice";
import MenuItemCard from "./MenuItemCard";
import MenuModal from "./MenuModal";
import SectionTitle from "@/components/ui/SectionTitle";

type AnyItem = MenuItem | BurgerDelMes;

interface Props {
  items: MenuItem[];
  burger: BurgerDelMes | null;
}

const CATS_BEFORE: MenuCategory[] = ["raciones", "smash_10", "smash_13"];
const CATS_AFTER: MenuCategory[] = ["postres"];

const CATEGORY_RUNES: Record<MenuCategory, string> = {
  raciones: "ᚠ",
  smash_10: "ᚦ",
  smash_13: "ᛏ",
  postres: "ᚾ",
};

function CategorySection({
  cat,
  items,
  onSelect,
}: {
  cat: MenuCategory;
  items: MenuItem[];
  onSelect: (item: MenuItem) => void;
}) {
  return (
    <section id={cat}>
      <SectionTitle title={CATEGORY_LABELS[cat]} runeChar={CATEGORY_RUNES[cat]} centered />
      <div className="space-y-2">
        {items.map((item, idx) => (
          <button
            key={item.id}
            className="w-full text-left scroll-reveal-bounce focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink rounded-lg ripple-container card-active-glow"
            style={{ animationDelay: `${idx * 60}ms` }}
            onClick={() => onSelect(item)}
            aria-label={`Ver ${item.name}`}
          >
            <MenuItemCard item={item} />
          </button>
        ))}
        {items.length === 0 && (
          <p className="text-muted text-sm italic py-4">Próximamente...</p>
        )}
      </div>
    </section>
  );
}

export default function CartaInteractive({ items, burger }: Props) {
  const [selected, setSelected] = useState<AnyItem | null>(null);

  const byCategory = (["raciones", "smash_10", "smash_13", "postres"] as MenuCategory[]).reduce(
    (acc, cat) => ({ ...acc, [cat]: items.filter((i) => i.category === cat) }),
    {} as Record<MenuCategory, MenuItem[]>
  );

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-16">
        {/* Raciones, Smash €10, Smash €13 */}
        {CATS_BEFORE.map((cat) => (
          <CategorySection key={cat} cat={cat} items={byCategory[cat]} onSelect={setSelected} />
        ))}

        {/* Burger del Mes — before Postres */}
        {burger && (
          <section id="burger-mes" className="relative">
            <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-brand-pink/5 via-transparent to-brand-pink/5 pointer-events-none" />
            <div className="relative">
              <div className="mb-4 text-center">
                <span style={{ display: "block", color: "#D93060", opacity: 0.85, fontSize: "2rem", letterSpacing: "0.25em", marginBottom: 8, lineHeight: 1 }}>ᛟ</span>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <h2 className="text-3xl sm:text-4xl neon-text animate-flicker">
                    Burger del Mes
                  </h2>
                  {burger.month_year && (
                    <span className="font-display text-xs uppercase tracking-widest text-brand-pink border border-brand-pink/30 px-2 py-1 rounded-sm">
                      {burger.month_year}
                    </span>
                  )}
                </div>
                <div className="mt-2 h-[2px] w-16 bg-brand-pink shadow-[0_0_8px_#D93060] mx-auto" />
              </div>

              <button
                className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink rounded-xl"
                onClick={() => setSelected(burger)}
              >
                <div className="glass-card rounded-xl overflow-hidden border border-brand-pink/30 hover:border-brand-pink/60 hover:shadow-[0_0_24px_rgba(232,24,154,0.25)] transition-all duration-300 active:scale-[0.99]">
                  {burger.image_url && (
                    <div className="relative w-full aspect-[16/7] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={burger.image_url} alt={burger.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-elevated/90 via-dark-elevated/20 to-transparent" />
                    </div>
                  )}
                  <div className="p-5 text-center">
                    <div className="flex items-center justify-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-[#F5F5F5] break-words w-full text-center">
                        {burger.name}
                      </h3>
                      <span className="font-display text-2xl neon-text shrink-0">
                        {formatPriceShort(burger.price)}
                      </span>
                    </div>
                    {burger.description && (
                      <p className="text-muted text-sm leading-relaxed line-clamp-2">{burger.description}</p>
                    )}
                    <p className="text-brand-pink text-xs font-display uppercase tracking-widest mt-3">
                      Toca para ver más →
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </section>
        )}

        {/* Postres — after Burger del Mes */}
        {CATS_AFTER.map((cat) => (
          <CategorySection key={cat} cat={cat} items={byCategory[cat]} onSelect={setSelected} />
        ))}
      </div>

      {selected && <MenuModal item={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
