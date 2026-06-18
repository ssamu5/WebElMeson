"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { FoodtruckItem } from "@/types";
import { formatPriceShort } from "@/lib/utils/formatPrice";

interface Props {
  initial: FoodtruckItem[];
}

export default function TodayBurgersList({ initial }: Props) {
  const [items, setItems] = useState<FoodtruckItem[]>(initial);

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
      <p className="text-muted text-sm italic">
        Hoy no hay productos especiales activados — consulta la carta habitual.
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 text-left">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-3 bg-dark-elevated border border-dark-border rounded-xl p-4"
        >
          {item.image_url && (
            <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden">
              <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="64px" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-display text-lg uppercase tracking-wider text-brand-pink leading-tight">
              {item.name}
            </p>
            {item.description && (
              <p className="text-muted text-xs mt-0.5 line-clamp-2">{item.description}</p>
            )}
            <p className="font-display text-base price-shimmer mt-1">{formatPriceShort(item.price)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
