"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { MenuItem, MenuCategory, CATEGORY_LABELS } from "@/types";
import { formatPriceShort } from "@/lib/utils/formatPrice";

const CATEGORIES: MenuCategory[] = ["raciones", "smash_10", "smash_13", "postres"];

type FormState = {
  id: string | null;
  name: string;
  description: string;
  category: MenuCategory;
  price: string;
  image_url: string;
  is_featured: boolean;
  is_available: boolean;
};

const EMPTY_FORM: FormState = {
  id: null,
  name: "",
  description: "",
  category: "smash_10",
  price: "",
  image_url: "",
  is_featured: false,
  is_available: true,
};

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [panel, setPanel] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [burgerPicker, setBurgerPicker] = useState(false);
  const [burgerMonthLabel, setBurgerMonthLabel] = useState("");
  const [savingBurger, setSavingBurger] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  useEffect(() => {
    const client = createClient();
    client
      .from("menu_items")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        setItems((data as MenuItem[]) ?? []);
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openEdit(item: MenuItem) {
    setPanel({
      id: item.id,
      name: item.name,
      description: item.description ?? "",
      category: item.category,
      price: String(item.price),
      image_url: item.image_url ?? "",
      is_featured: item.is_featured,
      is_available: item.is_available,
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
    const path = `public/${itemId}-${Date.now()}.${ext}`;
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
      // UPDATE existing
      let imageUrl = panel.image_url;
      if (imageFile) {
        const uploaded = await uploadImage(panel.id);
        if (uploaded) imageUrl = uploaded;
      }
      const { data, error } = await supabase
        .from("menu_items")
        .update({
          name: panel.name.trim(),
          description: panel.description.trim() || null,
          category: panel.category,
          price: priceNum,
          image_url: imageUrl || null,
          is_featured: panel.is_featured,
          is_available: panel.is_available,
        })
        .eq("id", panel.id)
        .select()
        .single();
      if (!error && data) {
        setItems((prev) => prev.map((i) => (i.id === panel.id ? (data as MenuItem) : i)));
      }
    } else {
      // INSERT new
      const maxSort = items.length > 0 ? Math.max(...items.map((i) => i.sort_order)) + 1 : 0;
      const { data, error } = await supabase
        .from("menu_items")
        .insert({
          name: panel.name.trim(),
          description: panel.description.trim() || null,
          category: panel.category,
          price: priceNum,
          image_url: null,
          is_featured: panel.is_featured,
          is_available: panel.is_available,
          sort_order: maxSort,
        })
        .select()
        .single();
      if (!error && data) {
        const newItem = data as MenuItem;
        let imageUrl: string | null = null;
        if (imageFile) {
          imageUrl = await uploadImage(newItem.id);
          if (imageUrl) {
            await supabase.from("menu_items").update({ image_url: imageUrl }).eq("id", newItem.id);
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
    await supabase.from("menu_items").delete().eq("id", panel.id);
    setItems((prev) => prev.filter((i) => i.id !== panel.id));
    setSaving(false);
    closePanel();
  }

  async function toggleAvailable(item: MenuItem, e: React.MouseEvent) {
    e.stopPropagation();
    setTogglingId(item.id);
    const next = !item.is_available;
    const { error } = await supabase
      .from("menu_items")
      .update({ is_available: next })
      .eq("id", item.id);
    if (!error) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_available: next } : i)));
    }
    setTogglingId(null);
  }

  async function setBurgerOfMonth(item: MenuItem) {
    if (!burgerMonthLabel.trim()) return alert("Escribe el mes y año (ej: Junio 2026)");
    setSavingBurger(true);
    // Clear any existing burger of month
    await supabase
      .from("menu_items")
      .update({ is_burger_of_month: false, burger_month_label: null })
      .eq("is_burger_of_month", true);
    // Set new one — la desactivamos de la carta normal (toggle off) ya que se muestra en su sección especial
    const { error } = await supabase
      .from("menu_items")
      .update({ is_burger_of_month: true, burger_month_label: burgerMonthLabel.trim(), is_available: false })
      .eq("id", item.id);
    if (!error) {
      setItems((prev) =>
        prev.map((i) => ({
          ...i,
          is_burger_of_month: i.id === item.id,
          burger_month_label: i.id === item.id ? burgerMonthLabel.trim() : null,
          is_available: i.id === item.id ? false : i.is_available,
        }))
      );
    }
    setSavingBurger(false);
    setBurgerPicker(false);
    setBurgerMonthLabel("");
  }

  const currentBurgerOfMonth = items.find((i) => i.is_burger_of_month);
  const burgerCandidates = items.filter((i) =>
    i.category === "smash_10" || i.category === "smash_13"
  );
  const byCategory = CATEGORIES.reduce(
    (acc, cat) => ({ ...acc, [cat]: items.filter((i) => i.category === cat) }),
    {} as Record<MenuCategory, MenuItem[]>
  );

  return (
    <div className="min-h-screen px-4 py-8 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/dashboard" className="text-muted hover:text-brand-pink transition-colors text-sm">
            ← Volver
          </Link>
        </div>
        <h1 className="font-display text-2xl uppercase tracking-wider text-[#F5F5F5] mb-1">Carta</h1>
        <p className="text-muted text-xs mb-6">Toca un producto para editarlo. El switch activa/desactiva en la carta.</p>

        {loading && <p className="text-muted text-sm">Cargando...</p>}

        {/* Burger del Mes section */}
        <div className="glass-card rounded-xl p-4 mb-8 border border-brand-pink/20">
          <h2 className="font-display text-sm uppercase tracking-widest text-brand-pink mb-3">
            Burger del Mes
          </h2>
          {currentBurgerOfMonth ? (
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="font-display text-base text-[#f0ece4] uppercase">{currentBurgerOfMonth.name}</p>
                <p className="text-muted text-xs">{currentBurgerOfMonth.burger_month_label}</p>
              </div>
              <button
                onClick={() => setBurgerPicker(true)}
                className="text-xs text-brand-pink border border-brand-pink/40 px-3 py-1.5 rounded-sm hover:bg-brand-pink/10 transition-colors"
              >
                Cambiar
              </button>
              <button
                onClick={async () => {
                  if (!confirm("¿Quitar la Burger del Mes?")) return;
                  const supabase = createClient();
                  await supabase
                    .from("menu_items")
                    .update({ is_burger_of_month: false, burger_month_label: null })
                    .eq("is_burger_of_month", true);
                  setItems((prev) =>
                    prev.map((i) => ({ ...i, is_burger_of_month: false, burger_month_label: null }))
                  );
                }}
                className="text-xs text-muted border border-dark-border px-3 py-1.5 rounded-sm hover:text-red-400 hover:border-red-400/40 transition-colors"
              >
                Quitar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setBurgerPicker(true)}
              className="w-full text-sm text-muted border border-dashed border-dark-border rounded-lg py-3 hover:border-brand-pink/50 hover:text-brand-pink transition-colors"
            >
              + Seleccionar Burger del Mes
            </button>
          )}
        </div>

        {/* Item list by category */}
        <div className="space-y-8">
          {CATEGORIES.map((cat) => (
            <section key={cat}>
              <h2 className="font-display text-xs uppercase tracking-widest text-brand-pink mb-3 border-b border-dark-border pb-2">
                {CATEGORY_LABELS[cat]}
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
                        {item.is_burger_of_month && (
                          <span className="ml-2 text-[10px] text-brand-pink font-display normal-case tracking-normal border border-brand-pink/40 px-1 py-0.5 rounded-sm">
                            Burger del Mes
                          </span>
                        )}
                      </p>
                      <p className="text-muted text-xs mt-0.5">{formatPriceShort(item.price)}</p>
                    </div>
                    <button
                      onClick={(e) => toggleAvailable(item, e)}
                      disabled={togglingId === item.id}
                      aria-label={item.is_available ? "Desactivar" : "Activar"}
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${
                        item.is_available ? "bg-brand-pink" : "bg-dark-border"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                          item.is_available ? "translate-x-5" : "translate-x-0"
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
                  onChange={(e) => setPanel((p) => p && { ...p, category: e.target.value as MenuCategory })}
                  className={INPUT_CLASS}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
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

              {/* Toggles */}
              <div className="space-y-3 pt-1">
                <ToggleRow
                  label="Aparece en la carta"
                  value={panel.is_available}
                  onChange={(v) => setPanel((p) => p && { ...p, is_available: v })}
                />
                <ToggleRow
                  label="Destacar en inicio (Los Más Pedidos)"
                  value={panel.is_featured}
                  onChange={(v) => setPanel((p) => p && { ...p, is_featured: v })}
                />
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

      {/* Burger del Mes picker */}
      {burgerPicker && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setBurgerPicker(false)} />
          <div className="relative bg-[#111] rounded-t-2xl p-5 pb-10 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg uppercase tracking-wider text-[#F5F5F5]">Burger del Mes</h2>
              <button onClick={() => setBurgerPicker(false)} className="text-muted hover:text-white text-2xl leading-none">×</button>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-display uppercase tracking-widest text-muted mb-2">Mes y año (ej: Junio 2026)</label>
              <input
                type="text"
                value={burgerMonthLabel}
                onChange={(e) => setBurgerMonthLabel(e.target.value)}
                placeholder="Junio 2026"
                className={INPUT_CLASS}
              />
            </div>

            <p className="text-xs font-display uppercase tracking-widest text-muted mb-3">Selecciona la burger:</p>
            <div className="space-y-2">
              {burgerCandidates.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setBurgerOfMonth(item)}
                  disabled={savingBurger}
                  className="w-full flex items-center gap-3 glass-card rounded-lg px-4 py-3 text-left hover:border-brand-pink/50 transition-colors active:opacity-70"
                >
                  {item.image_url && (
                    <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0">
                      <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="40px" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-display text-sm uppercase tracking-wide text-[#F5F5F5]">{item.name}</p>
                    <p className="text-muted text-xs">{CATEGORY_LABELS[item.category]} — {formatPriceShort(item.price)}</p>
                  </div>
                  {item.is_burger_of_month && (
                    <span className="text-brand-pink text-xs">✓ Actual</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const INPUT_CLASS =
  "w-full bg-dark border border-dark-border rounded-sm px-4 py-3 text-[#F5F5F5] text-sm placeholder:text-muted focus:outline-none focus:border-brand-pink transition-all duration-200";

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[#f0ece4] font-display uppercase tracking-wide text-xs">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${
          value ? "bg-brand-pink" : "bg-dark-border"
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
