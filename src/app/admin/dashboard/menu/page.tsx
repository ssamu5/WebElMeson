"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MenuItem, MenuCategory, CATEGORY_LABELS } from "@/types";
import { formatPriceShort } from "@/lib/utils/formatPrice";
import Link from "next/link";

const CATEGORIES: MenuCategory[] = ["raciones", "smash_10", "smash_13", "postres"];

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("menu_items")
      .select("*")
      .order("category")
      .order("sort_order")
      .then(({ data }) => {
        if (data) setItems(data as MenuItem[]);
        setLoading(false);
      });
  }, []);

  async function toggleAvailability(item: MenuItem) {
    setSaving(item.id);
    const supabase = createClient();
    const { data } = await supabase
      .from("menu_items")
      .update({ is_available: !item.is_available })
      .eq("id", item.id)
      .select()
      .single();
    if (data) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? (data as MenuItem) : i)));
    }
    setSaving(null);
  }

  async function toggleFeatured(item: MenuItem) {
    setSaving(item.id);
    const supabase = createClient();
    const { data } = await supabase
      .from("menu_items")
      .update({ is_featured: !item.is_featured })
      .eq("id", item.id)
      .select()
      .single();
    if (data) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? (data as MenuItem) : i)));
    }
    setSaving(null);
  }

  const byCategory = CATEGORIES.reduce(
    (acc, cat) => ({ ...acc, [cat]: items.filter((i) => i.category === cat) }),
    {} as Record<MenuCategory, MenuItem[]>
  );

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/dashboard" className="text-muted hover:text-brand-pink transition-colors text-sm">
            ← Volver
          </Link>
        </div>
        <h1 className="font-display text-2xl uppercase tracking-wider text-[#F5F5F5] mb-2">Gestionar Menú</h1>
        <p className="text-muted text-xs mb-6">Toca el switch para activar/desactivar. ⭐ = aparece en la página de inicio.</p>

        {loading && <p className="text-muted text-sm">Cargando...</p>}

        <div className="space-y-8">
          {CATEGORIES.map((cat) => (
            <section key={cat}>
              <h2 className="font-display text-sm uppercase tracking-widest text-brand-pink mb-3 border-b border-dark-border pb-2">
                {CATEGORY_LABELS[cat]}
              </h2>
              <div className="space-y-2">
                {byCategory[cat].map((item) => (
                  <div
                    key={item.id}
                    className={`glass-card rounded-lg p-4 flex items-center gap-3 ${saving === item.id ? "opacity-50" : ""}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm uppercase tracking-wider text-[#F5F5F5] leading-tight">
                        {item.name}
                      </p>
                      <p className="text-muted text-xs mt-0.5">{formatPriceShort(item.price)}</p>
                    </div>

                    {/* Featured toggle */}
                    <button
                      onClick={() => toggleFeatured(item)}
                      className={`text-lg transition-all duration-200 ${item.is_featured ? "opacity-100" : "opacity-20 hover:opacity-50"}`}
                      title="Destacar en inicio"
                      disabled={saving === item.id}
                    >
                      ⭐
                    </button>

                    {/* Available toggle */}
                    <button
                      onClick={() => toggleAvailability(item)}
                      disabled={saving === item.id}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 shrink-0 ${
                        item.is_available ? "bg-brand-pink" : "bg-dark-border"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 rounded-full bg-white transform transition-transform duration-200 ${
                          item.is_available ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
