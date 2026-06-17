"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Announcement } from "@/types";

const EMPTY_FORM = {
  title: "",
  message: "",
  start_at: "",
  end_at: "",
  is_active: true,
};

function toLocalDatetimeValue(iso: string) {
  if (!iso) return "";
  return iso.slice(0, 16);
}

function toISOString(local: string) {
  if (!local) return "";
  return new Date(local).toISOString();
}

export default function AdminAnunciosPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  async function fetchAnnouncements() {
    const supabase = createClient();
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setAnnouncements(data as Announcement[]);
    setLoading(false);
  }

  function startEdit(a: Announcement) {
    setEditing(a.id);
    setForm({
      title: a.title,
      message: a.message,
      start_at: toLocalDatetimeValue(a.start_at),
      end_at: toLocalDatetimeValue(a.end_at),
      is_active: a.is_active,
    });
  }

  function cancelEdit() {
    setEditing(null);
    setForm(EMPTY_FORM);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return alert("Título y mensaje son obligatorios.");
    if (!form.start_at || !form.end_at) return alert("Las fechas son obligatorias.");
    setSaving(true);
    const supabase = createClient();
    const payload = {
      title: form.title.trim(),
      message: form.message.trim(),
      start_at: toISOString(form.start_at),
      end_at: toISOString(form.end_at),
      is_active: form.is_active,
    };

    if (editing) {
      await supabase
        .from("announcements")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", editing);
      setEditing(null);
    } else {
      await supabase.from("announcements").insert(payload);
    }

    setForm(EMPTY_FORM);
    setSaving(false);
    await fetchAnnouncements();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este anuncio?")) return;
    setDeleting(id);
    const supabase = createClient();
    await supabase.from("announcements").delete().eq("id", id);
    setDeleting(null);
    await fetchAnnouncements();
  }

  async function toggleActive(a: Announcement) {
    const supabase = createClient();
    await supabase.from("announcements").update({ is_active: !a.is_active }).eq("id", a.id);
    setAnnouncements((prev) =>
      prev.map((x) => (x.id === a.id ? { ...x, is_active: !a.is_active } : x))
    );
  }

  const now = new Date();
  const active = announcements.filter((a) => a.is_active && new Date(a.start_at) <= now && new Date(a.end_at) >= now);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/admin/dashboard" className="text-muted hover:text-brand-pink transition-colors text-sm">
            ← Volver
          </Link>
        </div>
        <h1 className="font-display text-2xl uppercase tracking-wider text-[#F5F5F5] mb-1">Anuncios</h1>
        <p className="text-muted text-xs mb-6">
          Los anuncios activos aparecen como popup cada vez que alguien abre la web.
          {active.length > 0 && (
            <span className="ml-2 text-brand-pink font-display uppercase tracking-wider">
              · {active.length} activo{active.length > 1 ? "s" : ""} ahora
            </span>
          )}
        </p>

        {/* Form */}
        <form onSubmit={handleSave} className="glass-card rounded-xl p-5 space-y-4 mb-8">
          <h2 className="font-display text-sm uppercase tracking-widest text-brand-pink">
            {editing ? "Editar Anuncio" : "Nuevo Anuncio"}
          </h2>

          <Field label="Título">
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="¡Abrimos este finde en Tudela!"
              className={IC}
            />
          </Field>

          <Field label="Mensaje">
            <textarea
              required
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="Ven a vernos el sábado y domingo en la Plaza de los Fueros..."
              rows={4}
              className={IC + " resize-none"}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Mostrar desde">
              <input
                type="datetime-local"
                required
                value={form.start_at}
                onChange={(e) => setForm((f) => ({ ...f, start_at: e.target.value }))}
                className={IC}
              />
            </Field>
            <Field label="Mostrar hasta">
              <input
                type="datetime-local"
                required
                value={form.end_at}
                min={form.start_at}
                onChange={(e) => setForm((f) => ({ ...f, end_at: e.target.value }))}
                className={IC}
              />
            </Field>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-[#f0ece4] font-display uppercase tracking-widest text-xs">Activo</span>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                form.is_active ? "bg-brand-pink" : "bg-dark-border"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                  form.is_active ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-brand-pink text-white font-display text-sm uppercase tracking-wider py-3 hover:bg-brand-pink-dark disabled:opacity-50 transition-colors duration-200 rounded-sm"
            >
              {saving ? "Guardando..." : editing ? "Actualizar" : "Publicar"}
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

        {/* Announcements list */}
        <h2 className="font-display text-sm uppercase tracking-widest text-[#F5F5F5] mb-3">
          Todos los anuncios ({announcements.length})
        </h2>
        {loading && <p className="text-muted text-sm">Cargando...</p>}
        <div className="space-y-3">
          {announcements.map((a) => {
            const isLive = a.is_active && new Date(a.start_at) <= now && new Date(a.end_at) >= now;
            return (
              <div
                key={a.id}
                className={`glass-card rounded-xl p-4 ${deleting === a.id ? "opacity-50" : ""}`}
              >
                <div className="flex items-start justify-between gap-3 mb-1">
                  <p className="font-display text-sm uppercase tracking-wider text-[#F5F5F5] leading-tight flex-1">
                    {a.title}
                    {isLive && (
                      <span className="ml-2 text-[10px] text-green-400 border border-green-400/30 px-1.5 py-0.5 rounded-sm normal-case tracking-normal font-sans">
                        en directo
                      </span>
                    )}
                  </p>
                  <button
                    onClick={() => toggleActive(a)}
                    className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 mt-0.5 ${
                      a.is_active ? "bg-brand-pink" : "bg-dark-border"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                        a.is_active ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
                <p className="text-muted text-xs mb-2 line-clamp-2">{a.message}</p>
                <p className="text-muted text-[10px]">
                  {new Date(a.start_at).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" })}
                  {" → "}
                  {new Date(a.end_at).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" })}
                </p>
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => startEdit(a)}
                    className="text-xs font-display uppercase tracking-wider text-muted hover:text-brand-pink transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    disabled={deleting === a.id}
                    className="text-xs font-display uppercase tracking-wider text-muted hover:text-red-400 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
          {!loading && announcements.length === 0 && (
            <p className="text-muted text-sm italic">No hay anuncios creados.</p>
          )}
        </div>
      </div>
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
