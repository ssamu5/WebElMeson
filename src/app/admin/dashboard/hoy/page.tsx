"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TodaySpecial } from "@/types";
import Link from "next/link";

function todayDate() {
  return new Date().toISOString().split("T")[0];
}

export default function AdminHoyPage() {
  const [data, setData] = useState<Partial<TodaySpecial>>({
    special_date: todayDate(),
    special_message: "",
    featured_burgers: [],
    extra_note: "",
  });
  const [burgersInput, setBurgersInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("today_special")
      .select("*")
      .order("special_date", { ascending: false })
      .limit(1)
      .single()
      .then(({ data: row }) => {
        if (row) {
          setData(row as TodaySpecial);
          setBurgersInput((row.featured_burgers ?? []).join(", "));
        }
        setFetchLoading(false);
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const burgers = burgersInput
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);

    const payload = {
      special_date: data.special_date || todayDate(),
      special_message: data.special_message || "",
      featured_burgers: burgers,
      extra_note: data.extra_note || "",
      updated_at: new Date().toISOString(),
    };

    const supabase = createClient();

    // Upsert based on date
    const { error } = await supabase
      .from("today_special")
      .upsert(payload, { onConflict: "special_date" });

    setLoading(false);
    if (!error) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      alert("Error al guardar: " + error.message);
    }
  }

  if (fetchLoading) {
    return <AdminPageShell title="Hoy"><p className="text-muted text-sm">Cargando...</p></AdminPageShell>;
  }

  return (
    <AdminPageShell title="Hoy — Ubicación y Burgers">
      <form onSubmit={handleSave} className="space-y-5">
        <Field label="Fecha">
          <input
            type="date"
            value={data.special_date || ""}
            onChange={(e) => setData((d) => ({ ...d, special_date: e.target.value }))}
            className={INPUT_CLASS}
          />
        </Field>

        <Field label="Mensaje de ubicación (ej: 'Hoy en Tudela — Plaza de los Fueros, 20:00h')">
          <input
            type="text"
            value={data.special_message || ""}
            onChange={(e) => setData((d) => ({ ...d, special_message: e.target.value }))}
            placeholder="Hoy en Fustiñana — Plaza San Isidro, 20:00h"
            className={INPUT_CLASS}
          />
        </Field>

        <Field label="Burgers de hoy (separadas por coma)">
          <input
            type="text"
            value={burgersInput}
            onChange={(e) => setBurgersInput(e.target.value)}
            placeholder="Third Strike, Super Smash Bros, Emmysfaction"
            className={INPUT_CLASS}
          />
          <p className="text-muted text-xs mt-1">Escribe los nombres de las burgers que vas a ofrecer hoy</p>
        </Field>

        <Field label="Nota extra (opcional)">
          <input
            type="text"
            value={data.extra_note || ""}
            onChange={(e) => setData((d) => ({ ...d, extra_note: e.target.value }))}
            placeholder="¡Últimas unidades de Rocky!"
            className={INPUT_CLASS}
          />
        </Field>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-pink text-white font-display text-sm uppercase tracking-wider py-4 hover:bg-brand-pink-dark disabled:opacity-50 transition-colors duration-200 rounded-sm"
        >
          {loading ? "Guardando..." : success ? "✓ Guardado" : "Guardar y Publicar"}
        </button>

        {success && (
          <p className="text-green-400 text-sm text-center font-display uppercase tracking-wider">
            ✓ Cambios publicados en tiempo real
          </p>
        )}
      </form>
    </AdminPageShell>
  );
}

const INPUT_CLASS =
  "w-full bg-dark border border-dark-border rounded-sm px-4 py-3 text-[#F5F5F5] text-sm placeholder:text-muted focus:outline-none focus:border-brand-pink focus:shadow-[0_0_8px_rgba(232,24,154,0.2)] transition-all duration-200";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-display uppercase tracking-widest text-muted mb-2">{label}</label>
      {children}
    </div>
  );
}

function AdminPageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/dashboard" className="text-muted hover:text-brand-pink transition-colors">
            ← Volver
          </Link>
        </div>
        <h1 className="font-display text-2xl uppercase tracking-wider text-[#F5F5F5] mb-6">{title}</h1>
        <div className="glass-card rounded-xl p-5">{children}</div>
      </div>
    </div>
  );
}
