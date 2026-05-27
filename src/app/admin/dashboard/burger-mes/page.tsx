"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BurgerDelMes } from "@/types";
import Link from "next/link";

export default function AdminBurgerMesPage() {
  const [current, setCurrent] = useState<BurgerDelMes | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", story: "", month_year: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("burger_del_mes")
      .select("*")
      .eq("is_active", true)
      .single()
      .then(({ data }) => {
        if (data) {
          const b = data as BurgerDelMes;
          setCurrent(b);
          setForm({
            name: b.name,
            description: b.description || "",
            price: String(b.price),
            story: b.story || "",
            month_year: b.month_year || "",
          });
        }
        setLoading(false);
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();

    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      story: form.story,
      month_year: form.month_year,
      is_active: true,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (current?.id) {
      ({ error } = await supabase.from("burger_del_mes").update(payload).eq("id", current.id));
    } else {
      ({ error } = await supabase.from("burger_del_mes").insert(payload));
    }

    setSaving(false);
    if (!error) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      alert("Error: " + error.message);
    }
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <Link href="/admin/dashboard" className="text-muted hover:text-brand-pink transition-colors text-sm">
            ← Volver
          </Link>
        </div>
        <h1 className="font-display text-2xl uppercase tracking-wider text-[#F5F5F5] mb-6">Burger del Mes</h1>

        {loading ? (
          <p className="text-muted text-sm">Cargando...</p>
        ) : (
          <form onSubmit={handleSave} className="glass-card rounded-xl p-5 space-y-4">
            <Field label="Nombre de la burger">
              <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Emmysfaction" className={IC} />
            </Field>

            <Field label="Mes y año (ej: Mayo 2026)">
              <input type="text" value={form.month_year} onChange={(e) => setForm((f) => ({ ...f, month_year: e.target.value }))} placeholder="Mayo 2026" className={IC} />
            </Field>

            <Field label="Precio (€)">
              <input type="number" required step="0.50" min="0" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="13" className={IC} />
            </Field>

            <Field label="Descripción de ingredientes">
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Cheddar, gouda, bacon jam, relish de pepinillos..."
                rows={3}
                className={IC + " resize-none"}
              />
            </Field>

            <Field label="Historia / lore (aparece en la web como cita)">
              <textarea
                value={form.story}
                onChange={(e) => setForm((f) => ({ ...f, story: e.target.value }))}
                placeholder="Inspirada en la búsqueda de la satisfacción perfecta..."
                rows={3}
                className={IC + " resize-none"}
              />
            </Field>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-brand-pink text-white font-display text-sm uppercase tracking-wider py-4 hover:bg-brand-pink-dark disabled:opacity-50 transition-colors rounded-sm"
            >
              {saving ? "Guardando..." : success ? "✓ Publicado" : "Publicar Burger del Mes"}
            </button>

            {success && (
              <p className="text-green-400 text-sm text-center font-display uppercase tracking-wider">
                ✓ Cambios visibles en la web
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

const IC = "w-full bg-dark border border-dark-border rounded-sm px-3 py-2.5 text-[#F5F5F5] text-sm placeholder:text-muted focus:outline-none focus:border-brand-pink transition-all duration-200";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-display uppercase tracking-widest text-muted mb-2">{label}</label>
      {children}
    </div>
  );
}
