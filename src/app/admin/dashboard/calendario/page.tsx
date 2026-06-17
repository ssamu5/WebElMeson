"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FoodtruckLocation } from "@/types";
import { formatDateEs } from "@/lib/utils/formatDate";
import Link from "next/link";

const EMPTY_FORM = {
  start_date: "",
  end_date: "",
  event_name: "",
  address: "",
  maps_url: "",
  start_time: "20:00",
  end_time: "23:00",
  special_note: "",
  is_confirmed: true,
};

export default function AdminCalendarioPage() {
  const [locations, setLocations] = useState<FoodtruckLocation[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  async function fetchLocations() {
    const supabase = createClient();
    const { data } = await supabase
      .from("foodtruck_locations")
      .select("*")
      .order("start_date");
    if (data) setLocations(data as FoodtruckLocation[]);
    setLoading(false);
  }

  function startEdit(loc: FoodtruckLocation) {
    setEditing(loc.id);
    setForm({
      start_date: loc.start_date,
      end_date: loc.end_date,
      event_name: loc.event_name,
      address: loc.address || "",
      maps_url: loc.maps_url || "",
      start_time: loc.start_time || "20:00",
      end_time: loc.end_time || "23:00",
      special_note: loc.special_note || "",
      is_confirmed: loc.is_confirmed,
    });
  }

  function cancelEdit() {
    setEditing(null);
    setForm(EMPTY_FORM);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.end_date) setForm((f) => ({ ...f, end_date: f.start_date }));
    setSaving(true);
    const supabase = createClient();
    const payload = {
      ...form,
      end_date: form.end_date || form.start_date,
    };

    if (editing) {
      await supabase
        .from("foodtruck_locations")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", editing);
      setEditing(null);
    } else {
      await supabase.from("foodtruck_locations").insert(payload);
    }

    setForm(EMPTY_FORM);
    setSaving(false);
    await fetchLocations();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este evento?")) return;
    setDeleting(id);
    const supabase = createClient();
    await supabase.from("foodtruck_locations").delete().eq("id", id);
    setDeleting(null);
    await fetchLocations();
  }

  const today = new Date().toISOString().split("T")[0];
  const upcoming = locations.filter((l) => l.end_date >= today);
  const past = locations.filter((l) => l.end_date < today);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/admin/dashboard" className="text-muted hover:text-brand-pink transition-colors text-sm">
            ← Volver
          </Link>
        </div>
        <h1 className="font-display text-2xl uppercase tracking-wider text-[#F5F5F5] mb-6">Calendario Foodtruck</h1>

        {/* Form */}
        <form onSubmit={handleSave} className="glass-card rounded-xl p-5 space-y-4 mb-8">
          <h2 className="font-display text-sm uppercase tracking-widest text-brand-pink">
            {editing ? "Editar Evento" : "Añadir Evento"}
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Fecha inicio">
              <input
                type="date"
                required
                value={form.start_date}
                onChange={(e) => {
                  const v = e.target.value;
                  setForm((f) => ({ ...f, start_date: v, end_date: f.end_date || v }));
                }}
                className={IC}
              />
            </Field>
            <Field label="Fecha fin">
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
                placeholder={form.start_date}
                className={IC}
              />
            </Field>
          </div>

          <Field label="Nombre de las fiestas / evento">
            <input
              type="text"
              required
              value={form.event_name}
              onChange={(e) => setForm((f) => ({ ...f, event_name: e.target.value }))}
              placeholder="Fiestas de San Isidro — Fustiñana"
              className={IC}
            />
          </Field>

          <Field label="Dirección completa">
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="Plaza Mayor s/n, Fustiñana, Navarra"
              className={IC}
            />
          </Field>

          <Field label="Link Google Maps (opcional)">
            <input
              type="url"
              value={form.maps_url}
              onChange={(e) => setForm((f) => ({ ...f, maps_url: e.target.value }))}
              placeholder="https://maps.google.com/..."
              className={IC}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Hora inicio (diaria)">
              <input
                type="text"
                value={form.start_time}
                onChange={(e) => setForm((f) => ({ ...f, start_time: e.target.value }))}
                placeholder="20:00"
                className={IC}
              />
            </Field>
            <Field label="Hora fin (diaria)">
              <input
                type="text"
                value={form.end_time}
                onChange={(e) => setForm((f) => ({ ...f, end_time: e.target.value }))}
                placeholder="cierre (aprox 23:00)"
                className={IC}
              />
            </Field>
          </div>

          <Field label="Nota especial (opcional)">
            <input
              type="text"
              value={form.special_note}
              onChange={(e) => setForm((f) => ({ ...f, special_note: e.target.value }))}
              placeholder="¡Edición limitada de burgers!"
              className={IC}
            />
          </Field>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-brand-pink text-white font-display text-sm uppercase tracking-wider py-3 hover:bg-brand-pink-dark disabled:opacity-50 transition-colors duration-200 rounded-sm"
            >
              {saving ? "Guardando..." : editing ? "Actualizar" : "Añadir"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 font-display text-sm uppercase tracking-wider text-muted border border-dark-border rounded-sm hover:border-brand-pink/50 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Upcoming events */}
        <h2 className="font-display text-sm uppercase tracking-widest text-[#F5F5F5] mb-3">
          Próximos ({upcoming.length})
        </h2>
        {loading && <p className="text-muted text-sm">Cargando...</p>}
        <div className="space-y-2 mb-8">
          {upcoming.map((loc) => (
            <EventRow
              key={loc.id}
              loc={loc}
              onEdit={() => startEdit(loc)}
              onDelete={() => handleDelete(loc.id)}
              isDeleting={deleting === loc.id}
            />
          ))}
          {!loading && upcoming.length === 0 && (
            <p className="text-muted text-sm italic">No hay eventos programados</p>
          )}
        </div>

        {/* Past events */}
        {past.length > 0 && (
          <details className="glass-card rounded-lg p-4">
            <summary className="font-display text-sm uppercase tracking-widest text-muted cursor-pointer">
              Eventos pasados ({past.length})
            </summary>
            <div className="mt-3 space-y-2">
              {past.slice(-10).map((loc) => (
                <EventRow
                  key={loc.id}
                  loc={loc}
                  onEdit={() => startEdit(loc)}
                  onDelete={() => handleDelete(loc.id)}
                  isDeleting={deleting === loc.id}
                />
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

function EventRow({
  loc,
  onEdit,
  onDelete,
  isDeleting,
}: {
  loc: FoodtruckLocation;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const isSameDay = loc.start_date === loc.end_date;
  const dateLabel = isSameDay
    ? formatDateEs(loc.start_date)
    : `${formatDateEs(loc.start_date)} → ${formatDateEs(loc.end_date)}`;

  return (
    <div className={`glass-card rounded-lg px-4 py-3 flex items-center gap-3 ${isDeleting ? "opacity-50" : ""}`}>
      <div className="flex-1 min-w-0">
        <p className="font-display text-sm uppercase tracking-wider text-[#F5F5F5] truncate">{loc.event_name}</p>
        <p className="text-muted text-xs">
          {dateLabel} · {loc.start_time?.slice(0, 5)}–{loc.end_time?.slice(0, 5)}
        </p>
      </div>
      <button
        onClick={onEdit}
        className="text-xs font-display uppercase tracking-wider text-muted hover:text-brand-pink transition-colors shrink-0"
      >
        Editar
      </button>
      <button
        onClick={onDelete}
        disabled={isDeleting}
        className="text-xs font-display uppercase tracking-wider text-muted hover:text-red-400 transition-colors shrink-0"
      >
        ✕
      </button>
    </div>
  );
}

const IC =
  "w-full bg-dark border border-dark-border rounded-sm px-3 py-2.5 text-[#F5F5F5] text-sm placeholder:text-muted focus:outline-none focus:border-brand-pink transition-all duration-200";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-display uppercase tracking-widest text-muted mb-1">{label}</label>
      {children}
    </div>
  );
}
