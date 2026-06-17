"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { MenuItem, MenuCategory, CATEGORY_LABELS } from "@/types";

export default function AdminHoyPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("menu_items")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        setItems((data as MenuItem[]) ?? []);
        setLoading(false);
      });
  }, []);

  async function toggle(item: MenuItem) {
    setSaving(item.id);
    const next = !item.is_today_special;
    const supabase = createClient();
    const { error } = await supabase
      .from("menu_items")
      .update({ is_today_special: next })
      .eq("id", item.id);
    if (!error) {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_today_special: next } : i))
      );
    }
    setSaving(null);
  }

  const categories: MenuCategory[] = ["raciones", "smash_10", "smash_13", "postres", "bebidas"];

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/dashboard" className="text-muted hover:text-brand-pink transition-colors">
            ← Volver
          </Link>
        </div>
        <h1 className="font-display text-2xl uppercase tracking-wider text-[#F5F5F5] mb-1">
          Foodtruck
        </h1>
        <p className="text-muted text-sm mb-6">
          Activa los productos disponibles en la foodtruck hoy. Se muestran en tiempo real en la web.
        </p>

        {loading ? (
          <p className="text-muted text-sm">Cargando...</p>
        ) : (
          <div className="space-y-6">
            {categories.map((cat) => {
              const catItems = items.filter((i) => i.category === cat);
              if (catItems.length === 0) return null;
              return (
                <section key={cat}>
                  <h2 className="font-display text-xs uppercase tracking-widest text-muted mb-3 border-b border-dark-border pb-2">
                    {CATEGORY_LABELS[cat]}
                  </h2>
                  <div className="space-y-2">
                    {catItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-dark-elevated border border-dark-border rounded-xl px-4 py-3"
                      >
                        <span className="font-display text-base text-[#f0ece4] uppercase tracking-wide">
                          {item.name}
                        </span>
                        <button
                          onClick={() => toggle(item)}
                          disabled={saving === item.id}
                          aria-label={item.is_today_special ? "Desactivar" : "Activar"}
                          className={`relative w-12 h-6 rounded-full transition-all duration-200 ${
                            item.is_today_special
                              ? "bg-brand-pink shadow-[0_0_8px_rgba(232,24,154,0.5)]"
                              : "bg-dark-border"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                              item.is_today_special ? "translate-x-6" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
