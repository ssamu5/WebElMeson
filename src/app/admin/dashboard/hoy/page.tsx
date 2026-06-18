"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { FoodtruckItem, FoodtruckCategory, FOODTRUCK_CATEGORY_LABELS, MenuItem } from "@/types";
import { formatPriceShort } from "@/lib/utils/formatPrice";

const CATEGORIES: FoodtruckCategory[] = ["entrantes", "burgers", "postres", "bebidas"];

type FormState = {
  id: string | null;
  name: string;
  description: string;
  category: FoodtruckCategory;
  price: string;
  image_url: string;
  is_today_special: boolean;
};

const EMPTY_FORM: FormState = {
  id: null,
  name: "",
  description: "",
  category: "entrantes",
  price: "",
  image_url: "",
  is_today_special: true,
};

export default function AdminHoyPage() {
  const [items, setItems] = useState<FoodtruckItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [panel, setPanel] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [cartaPicker, setCartaPicker] = useState(false);
  const [cartaBurgers, setCartaBurgers] = useState<MenuItem[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  useEffect(() => {
    const client = createClient();
    client
      .from("foodtruck_items")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        setItems((data as FoodtruckItem[]) ?? []);
        setLoading(false);
      });
    client
      .from("menu_items")
      .select("*")
      .in("category", ["smash_10", "smash_13"])
      .order("sort_order")
      .then(({ data }) => setCartaBurgers((data as MenuItem[]) ?? []));
  }, []);

  function pickFromCarta(item: MenuItem) {
    setPanel({
      id: null,
      name: item.name,
      description: item.description ?? "",
      category: "burgers",
      price: String(item.price),
      image_url: item.image_url ?? "",
      is_today_special: true,
    });
    setImageFile(null);
    setImagePreview("");
    setCartaPicker(false);
  }

  function openEdit(item: FoodtruckItem) {
    setPanel({
      id: item.id,
      name: item.name,
      description: item.description ?? "",
      category: item.category,
      price: String(item.price),
      image_url: item.image_url ?? "",
      is_today_special: item.is_today_special,
    });
    setImageFile(null);
    setImagePreview("");
  }

  function openNew() {
    setPanel({ ...EMPTY_FORM });
    setImageFile(null);
    setImagePreview("");
  }

  function closePanel() {
    setPanel(null);
    setImageFile(null);
    setImagePreview("");
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function uploadImage(itemId: string): Promise<string | null> {
    if (!imageFile) return null;
    setUploading(true);
    const ext = imageFile.name.split(".").pop();
    const path = `public/foodtruck-${itemId}-${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage
      .from("menu-images")
      .upload(path, imageFile, { upsert: true });
    setUploading(false);
    if (error || !data) return null;
    const { data: urlData } = supabase.storage.from("menu-images").getPublicUrl(data.path);
    return urlData.publicUrl;
  }

  async function savePanel() {
    if (!panel) return;
    if (!panel.name.trim()) return alert("El nombre es obligatorio.");
    const priceNum = parseFloat(panel.price);
    if (isNaN(priceNum) || priceNum < 0) return alert("Precio no válido.");
    setSaving(true);

    if (panel.id) {
      let imageUrl = panel.image_url;
      if (imageFile) {
        const uploaded = await uploadImage(panel.id);
        if (uploaded) imageUrl = uploaded;
      }
      const { data, error } = await supabase
        .from("foodtruck_items")
        .update({
          name: panel.name.trim(),
          description: panel.description.trim() || null,
          category: panel.category,
          price: priceNum,
          image_url: imageUrl || null,
          is_today_special: panel.is_today_special,
        })
        .eq("id", panel.id)
        .select()
        .single();
      if (!error && data) {
        setItems((prev) => prev.map((i) => (i.id === panel.id ? (data as FoodtruckItem) : i)));
      }
    } else {
      const maxSort = items.length > 0 ? Math.max(...items.map((i) => i.sort_order)) + 1 : 0;
      const { data, error } = await supabase
        .from("foodtruck_items")
        .insert({
          name: panel.name.trim(),
          description: panel.description.trim() || null,
          category: panel.category,
          price: priceNum,
          image_url: null,
          is_today_special: panel.is_today_special,
          sort_order: maxSort,
        })
        .select()
        .single();
      if (!error && data) {
        const newItem = data as FoodtruckItem;
        let imageUrl: string | null = null;
        if (imageFile) {
          imageUrl = await uploadImage(newItem.id);
          if (imageUrl) {
            await supabase.from("foodtruck_items").update({ image_url: imageUrl }).eq("id", newItem.id);
            newItem.image_url = imageUrl;
          }
        }
        setItems((prev) => [...prev, newItem]);
      }
    }

    setSaving(false);
    closePanel();
  }

  async function deleteItem() {
    if (!panel?.id) return;
    if (!confirm(`¿Eliminar "${panel.name}"?`)) return;
    setSaving(true);
    await supabase.from("foodtruck_items").delete().eq("id", panel.id);
    setItems((prev) => prev.filter((i) => i.id !== panel.id));
    setSaving(false);
    closePanel();
  }

  async function toggleToday(item: FoodtruckItem, e: React.MouseEvent) {
    e.stopPropagation();
    setTogglingId(item.id);
    const next = !item.is_today_special;
    const { error } = await supabase
      .from("foodtruck_items")
      .update({ is_today_special: next })
      .eq("id", item.id);
    if (!error) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_today_special: next } : i)));
    }
    setTogglingId(null);
  }

  const byCategory = CATEGORIES.reduce(
    (acc, cat) => ({ ...acc, [cat]: items.filter((i) => i.category === cat) }),
    {} as Record<FoodtruckCategory, FoodtruckItem[]>
  );

  return (
    <div className="min-h-screen px-4 py-8 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/dashboard" className="text-muted hover:text-brand-pink transition-colors text-sm">
            ← Volver
          </Link>
        </div>
        <h1 className="font-display text-2xl uppercase tracking-wider text-[#F5F5F5] mb-1">Foodtruck</h1>
        <p className="text-muted text-xs mb-6">
          Productos exclusivos de la foodtruck (independientes de la carta del restaurante). Toca uno para editarlo. El switch lo activa para hoy.
        </p>

        <button
          onClick={() => setCartaPicker(true)}
          className="w-full mb-8 text-sm text-muted border border-dashed border-dark-border rounded-lg py-3 hover:border-brand-pink/50 hover:text-brand-pink transition-colors"
        >
          + Coger una burger de la carta
        </button>

        {loading && <p className="text-muted text-sm">Cargando...</p>}

        <div className="space-y-8">
          {CATEGORIES.map((cat) => (
            <section key={cat}>
              <h2 className="font-display text-xs uppercase tracking-widest text-brand-pink mb-3 border-b border-dark-border pb-2">
                {FOODTRUCK_CATEGORY_LABELS[cat]}
              </h2>
              <div className="space-y-2">
                {byCategory[cat].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => openEdit(item)}
                    className="glass-card rounded-lg px-4 py-3 flex items-center gap-3 cursor-pointer active:opacity-70"
                  >
                    {item.image_url && (
                      <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0">
                        <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="40px" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm uppercase tracking-wide text-[#F5F5F5] leading-tight truncate">
                        {item.name}
                      </p>
                      <p className="text-muted text-xs mt-0.5">{formatPriceShort(item.price)}</p>
                    </div>
                    <button
                      onClick={(e) => toggleToday(item, e)}
                      disabled={togglingId === item.id}
                      aria-label={item.is_today_special ? "Desactivar" : "Activar"}
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${
                        item.is_today_special
                          ? "bg-brand-pink shadow-[0_0_8px_rgba(232,24,154,0.5)]"
                          : "bg-dark-border"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                          item.is_today_special ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))}
                {byCategory[cat].length === 0 && (
                  <p className="text-muted text-xs italic">Sin productos todavía.</p>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Floating add button */}
      <button
        onClick={openNew}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-brand-pink text-white text-3xl shadow-[0_0_20px_rgba(232,24,154,0.5)] flex items-center justify-center hover:bg-brand-pink-dark transition-colors z-40"
        aria-label="Añadir producto"
      >
        +
      </button>

      {/* Edit/Create panel */}
      {panel && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={closePanel} />
          <div className="relative bg-[#111] rounded-t-2xl p-5 pb-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg uppercase tracking-wider text-[#F5F5F5]">
                {panel.id ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button onClick={closePanel} className="text-muted hover:text-white text-2xl leading-none">×</button>
            </div>

            <div className="space-y-4">
              {/* Image */}
              <div>
                <label className="block text-xs font-display uppercase tracking-widest text-muted mb-2">Imagen</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="relative w-full h-40 rounded-xl border border-dashed border-dark-border bg-dark-elevated flex items-center justify-center cursor-pointer overflow-hidden"
                >
                  {imagePreview || panel.image_url ? (
                    <Image
                      src={imagePreview || panel.image_url}
                      alt="Preview"
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                  ) : (
                    <span className="text-muted text-sm">Toca para subir foto</span>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-display uppercase tracking-widest text-muted mb-2">Nombre</label>
                <input
                  type="text"
                  value={panel.name}
                  onChange={(e) => setPanel((p) => p && { ...p, name: e.target.value })}
                  placeholder="Nombre del producto"
                  className={INPUT_CLASS}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-display uppercase tracking-widest text-muted mb-2">Descripción</label>
                <textarea
                  value={panel.description}
                  onChange={(e) => setPanel((p) => p && { ...p, description: e.target.value })}
                  placeholder="Ingredientes, descripción..."
                  rows={3}
                  className={INPUT_CLASS + " resize-none"}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-display uppercase tracking-widest text-muted mb-2">Apartado</label>
                <select
                  value={panel.category}
                  onChange={(e) => setPanel((p) => p && { ...p, category: e.target.value as FoodtruckCategory })}
                  className={INPUT_CLASS}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{FOODTRUCK_CATEGORY_LABELS[c]}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-display uppercase tracking-widest text-muted mb-2">Precio (€)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={panel.price}
                  onChange={(e) => setPanel((p) => p && { ...p, price: e.target.value })}
                  placeholder="10"
                  className={INPUT_CLASS}
                />
              </div>

              {/* Toggle */}
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-[#f0ece4] font-display uppercase tracking-widest text-xs">Activo hoy en la foodtruck</span>
                <button
                  type="button"
                  onClick={() => setPanel((p) => p && { ...p, is_today_special: !p.is_today_special })}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${
                    panel.is_today_special ? "bg-brand-pink" : "bg-dark-border"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                      panel.is_today_special ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Save */}
              <button
                onClick={savePanel}
                disabled={saving || uploading}
                className="w-full bg-brand-pink text-white font-display text-sm uppercase tracking-wider py-4 hover:bg-brand-pink-dark disabled:opacity-50 transition-colors rounded-sm mt-2"
              >
                {saving || uploading ? "Guardando..." : "Guardar"}
              </button>

              {/* Delete */}
              {panel.id && (
                <button
                  onClick={deleteItem}
                  disabled={saving}
                  className="w-full text-red-400 border border-red-400/30 font-display text-xs uppercase tracking-wider py-3 hover:bg-red-400/10 transition-colors rounded-sm"
                >
                  Eliminar producto
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Carta burger picker */}
      {cartaPicker && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setCartaPicker(false)} />
          <div className="relative bg-[#111] rounded-t-2xl p-5 pb-10 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg uppercase tracking-wider text-[#F5F5F5]">Elegir burger de la carta</h2>
              <button onClick={() => setCartaPicker(false)} className="text-muted hover:text-white text-2xl leading-none">×</button>
            </div>
            <p className="text-muted text-xs mb-4">
              Se copiará a la foodtruck para que puedas editarla (ingredientes, precio...) sin tocar la carta.
            </p>
            <div className="space-y-2">
              {cartaBurgers.map((item) => (
                <button
                  key={item.id}
                  onClick={() => pickFromCarta(item)}
                  className="w-full flex items-center gap-3 glass-card rounded-lg px-4 py-3 text-left hover:border-brand-pink/50 transition-colors active:opacity-70"
                >
                  {item.image_url && (
                    <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0">
                      <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="40px" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-display text-sm uppercase tracking-wide text-[#F5F5F5]">{item.name}</p>
                    <p className="text-muted text-xs">{formatPriceShort(item.price)}</p>
                  </div>
                </button>
              ))}
              {cartaBurgers.length === 0 && (
                <p className="text-muted text-sm italic">No hay burgers en la carta.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const INPUT_CLASS =
  "w-full bg-dark border border-dark-border rounded-sm px-4 py-3 text-[#F5F5F5] text-sm placeholder:text-muted focus:outline-none focus:border-brand-pink transition-all duration-200";
