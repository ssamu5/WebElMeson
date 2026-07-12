"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FoodtruckItem, FoodtruckCategory, FOODTRUCK_CATEGORY_LABELS } from "@/types";
import SectionTitle from "@/components/ui/SectionTitle";
import FoodtruckItemCard from "./FoodtruckItemCard";
import FoodtruckModal from "./FoodtruckModal";

interface Props {
  initial: FoodtruckItem[];
}

const ORDER: FoodtruckCategory[] = ["entrantes", "burgers", "postres", "bebidas"];

const RUNES: Record<FoodtruckCategory, string> = {
  entrantes: "ᚠ",
  burgers: "ᚦ",
  postres: "ᚾ",
  bebidas: "ᛒ",
};

export default function TodayBurgersList({ initial }: Props) {
  const [items, setItems] = useState<FoodtruckItem[]>(initial);
  const [selected, setSelected] = useState<FoodtruckItem | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function fetchItems() {
      const { data } = await supabase
        .from("foodtruck_items")
        .select("*")
        .eq("is_today_special", true)
        .order("sort_order");
      if (data) setItems(data as FoodtruckItem[]);
    }

    const channel = supabase
      .channel("today_specials_list")
      .on("postgres_changes", { event: "*", schema: "public", table: "foodtruck_items" }, fetchItems)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (items.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="font-display text-xl uppercase tracking-widest text-muted">
          Hoy no hay servicio
        </p>
        <p className="text-muted/60 text-sm mt-2">
          Te esperamos en la próxima parada!
        </p>
      </div>
    );
  }

  const byCategory = ORDER.reduce(
    (acc, cat) => ({ ...acc, [cat]: items.filter((i) => i.category === cat) }),
    {} as Record<FoodtruckCategory, FoodtruckItem[]>
  );

  return (
    <>
      <div className="space-y-12 text-left">
        {ORDER.map((cat) => {
          const catItems = byCategory[cat];
          if (catItems.length === 0) return null;
          return (
            <section key={cat}>
              <SectionTitle title={FOODTRUCK_CATEGORY_LABELS[cat]} runeChar={RUNES[cat]} centered />
              <div className="space-y-2">
                {catItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className="w-full text-left focus:outline-none rounded-xl"
                    aria-label={`Ver ${item.name}`}
                  >
                    <FoodtruckItemCard item={item} />
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {selected && <FoodtruckModal item={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
