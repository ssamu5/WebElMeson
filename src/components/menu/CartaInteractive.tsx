"use client";

import { useState, useEffect } from "react";
import { MenuItem, MenuCategory, CATEGORY_LABELS } from "@/types";
import { formatPriceShort } from "@/lib/utils/formatPrice";
import MenuItemCard from "./MenuItemCard";
import MenuModal from "./MenuModal";
import SectionTitle from "@/components/ui/SectionTitle";

interface Props {
  items: MenuItem[];
  burger: MenuItem | null;
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
  cat, items, onSelect, hoveredId, pressedId, setPressedId,
}: {
  cat: MenuCategory;
  items: MenuItem[];
  onSelect: (item: MenuItem) => void;
  hoveredId: string | null;
  pressedId: string | null;
  setPressedId: (id: string | null) => void;
}) {
  return (
    <section id={cat}>
      <SectionTitle title={CATEGORY_LABELS[cat]} runeChar={CATEGORY_RUNES[cat]} centered />
      <div className="space-y-2">
        {items.map((item, idx) => {
          const isActive = hoveredId === item.id || pressedId === item.id;
          return (
            <button
              key={item.id}
              data-item-id={item.id}
              className="w-full text-left scroll-reveal-bounce focus:outline-none rounded-lg ripple-container"
              style={{
                animationDelay: `${idx * 60}ms`,
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                transform: isActive ? "scale(1.02)" : "scale(1)",
                boxShadow: isActive ? "0 0 20px rgba(217,48,96,0.45), 0 0 40px rgba(217,48,96,0.2)" : "none",
              }}
              onClick={() => onSelect(item)}
              onPointerDown={() => setPressedId(item.id)}
              onPointerUp={() => setPressedId(null)}
              onPointerLeave={() => setPressedId(null)}
              onPointerCancel={() => setPressedId(null)}
              aria-label={`Ver ${item.name}`}
            >
              <MenuItemCard item={item} highlighted={isActive} />
            </button>
          );
        })}
        {items.length === 0 && (
          <p className="text-muted text-sm italic py-4">Próximamente...</p>
        )}
      </div>
    </section>
  );
}

export default function CartaInteractive({ items, burger }: Props) {
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pressedId, setPressedId] = useState<string | null>(null);

  // Filter burger out of its category to avoid duplicate display
  const burgerId = burger?.id;
  const byCategory = (["raciones", "smash_10", "smash_13", "postres"] as MenuCategory[]).reduce(
    (acc, cat) => ({
      ...acc,
      [cat]: items.filter((i) => i.category === cat && i.id !== burgerId),
    }),
    {} as Record<MenuCategory, MenuItem[]>
  );

  // Detect which card the finger is over while sliding
  useEffect(() => {
    function onTouchMove(e: TouchEvent) {
      const t = e.touches[0];
      const el = document.elementFromPoint(t.clientX, t.clientY) as HTMLElement | null;
      const card = el?.closest("[data-item-id]") as HTMLElement | null;
      setHoveredId(card ? card.getAttribute("data-item-id") : null);
    }
    function onTouchEnd() { setHoveredId(null); }
    document.addEventListener("touchmove",  onTouchMove, { passive: true });
    document.addEventListener("touchend",   onTouchEnd);
    document.addEventListener("touchcancel",onTouchEnd);
    return () => {
      document.removeEventListener("touchmove",  onTouchMove);
      document.removeEventListener("touchend",   onTouchEnd);
      document.removeEventListener("touchcancel",onTouchEnd);
    };
  }, []);

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-16">
        {/* Raciones, Smash €10, Smash €13 */}
        {CATS_BEFORE.map((cat) => (
          <CategorySection key={cat} cat={cat} items={byCategory[cat]} onSelect={setSelected} hoveredId={hoveredId} pressedId={pressedId} setPressedId={setPressedId} />
        ))}

        {/* Burger del Mes — before Postres */}
        {!burger ? (
          <section id="burger-mes" className="relative text-center">
            <span style={{ display: "block", color: "#D93060", opacity: 0.85, fontSize: "2rem", letterSpacing: "0.25em", marginBottom: 8, lineHeight: 1 }}>ᛟ</span>
            <h2 className="text-4xl md:text-5xl uppercase tracking-wider neon-text">
              Burger del Mes
            </h2>
            <div className="mt-2 h-[2px] w-16 bg-brand-pink shadow-[0_0_8px_#D93060,0_0_16px_rgba(217,48,96,0.4)] mx-auto mb-6" />
            <p className="text-muted text-sm uppercase tracking-widest font-display">Próximamente</p>
          </section>
        ) : (
          <section id="burger-mes" className="relative">
            <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-brand-pink/5 via-transparent to-brand-pink/5 pointer-events-none" />
            <div className="relative">
              <div className="relative mb-4 text-center">
                <span style={{ display: "block", color: "#D93060", opacity: 0.85, fontSize: "2rem", letterSpacing: "0.25em", marginBottom: 8, lineHeight: 1 }}>ᛟ</span>
                <h2 className="text-4xl md:text-5xl uppercase tracking-wider neon-text animate-flicker">
                  Burger del Mes
                </h2>
                <div className="mt-2 h-[2px] w-16 bg-brand-pink shadow-[0_0_8px_#D93060,0_0_16px_rgba(217,48,96,0.4)] mx-auto" />
                {burger.burger_month_label && (
                  <span className="absolute top-0 right-0 font-rawhide text-xs uppercase tracking-widest text-brand-pink border border-brand-pink/30 px-2 py-1 rounded-sm">
                    {burger.burger_month_label}
                  </span>
                )}
              </div>

              <button
                className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink rounded-xl"
                style={{
                  transition: "box-shadow 0.15s ease, transform 0.15s ease",
                  transform: pressedId === burger.id ? "scale(1.01)" : "scale(1)",
                  boxShadow: pressedId === burger.id ? "0 0 24px rgba(232,24,154,0.6), 0 0 48px rgba(232,24,154,0.3)" : "none",
                }}
                onClick={() => setSelected(burger)}
                onPointerDown={() => setPressedId(burger.id)}
                onPointerUp={() => setPressedId(null)}
                onPointerLeave={() => setPressedId(null)}
                onPointerCancel={() => setPressedId(null)}
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
                      <span className="font-display text-2xl neon-text-soft shrink-0">
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
          <CategorySection key={cat} cat={cat} items={byCategory[cat]} onSelect={setSelected} hoveredId={hoveredId} pressedId={pressedId} setPressedId={setPressedId} />
        ))}
      </div>

      {selected && <MenuModal item={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
