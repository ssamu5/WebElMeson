"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { NotificationSubscriber } from "@/types";
import Link from "next/link";

export default function AdminNotificacionesPage() {
  const [subscribers, setSubscribers] = useState<NotificationSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [towns, setTowns] = useState<string[]>([]);
  const [selectedTowns, setSelectedTowns] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("notification_subscribers")
      .select("*")
      .eq("confirmed", true)
      .eq("is_active", true)
      .order("subscribed_at", { ascending: false })
      .then(({ data }) => {
        const subs = (data as NotificationSubscriber[]) ?? [];
        setSubscribers(subs);
        // Extract unique towns
        const allTowns = Array.from(new Set(subs.flatMap((s) => s.towns))).sort();
        setTowns(allTowns);
        setLoading(false);
      });
  }, []);

  function toggleTown(town: string) {
    setSelectedTowns((prev) => prev.includes(town) ? prev.filter((t) => t !== town) : [...prev, town]);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!message || selectedTowns.length === 0) return;
    setSending(true);
    setResult(null);

    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ towns: selectedTowns, message, subject }),
    });

    const data = await res.json();
    setSending(false);
    if (res.ok) {
      setResult({ sent: data.sent });
      setMessage("");
      setSubject("");
      setSelectedTowns([]);
    } else {
      alert("Error: " + data.error);
    }
  }

  const confirmedCount = subscribers.length;
  const targetCount = subscribers.filter((s) => s.towns.some((t) => selectedTowns.includes(t))).length;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/admin/dashboard" className="text-muted hover:text-brand-pink transition-colors text-sm">
            ← Volver
          </Link>
        </div>
        <h1 className="font-display text-2xl uppercase tracking-wider text-[#F5F5F5] mb-2">Notificaciones</h1>
        <p className="text-muted text-xs mb-6">{confirmedCount} suscriptores confirmados</p>

        {/* Send notification form */}
        <form onSubmit={handleSend} className="glass-card rounded-xl p-5 space-y-4 mb-8">
          <h2 className="font-display text-sm uppercase tracking-widest text-brand-pink">Enviar Notificación</h2>

          <div>
            <label className="block text-xs font-display uppercase tracking-widest text-muted mb-2">Pueblos destinatarios</label>
            {towns.length === 0 ? (
              <p className="text-muted text-sm italic">No hay pueblos registrados aún</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {towns.map((town) => (
                  <button
                    key={town}
                    type="button"
                    onClick={() => toggleTown(town)}
                    className={`px-3 py-1 text-xs font-display uppercase tracking-wider rounded-sm border transition-all ${
                      selectedTowns.includes(town)
                        ? "bg-brand-pink border-brand-pink text-white"
                        : "border-dark-border text-muted hover:border-brand-pink/50"
                    }`}
                  >
                    {town}
                  </button>
                ))}
              </div>
            )}
            {selectedTowns.length > 0 && (
              <p className="text-brand-pink text-xs mt-2 font-display uppercase tracking-wider">
                → {targetCount} suscriptor{targetCount !== 1 ? "es" : ""} recibirán el email
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-display uppercase tracking-widest text-muted mb-2">Asunto (opcional)</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="📍 ¡Mañana en vuestro pueblo!"
              className={IC}
            />
          </div>

          <div>
            <label className="block text-xs font-display uppercase tracking-widest text-muted mb-2">Mensaje</label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="¡Mañana estamos en Fustiñana! Plaza Mayor, de 20:00 a 23:00h. Os esperamos con las burgers cargadas."
              className={IC + " resize-none"}
            />
          </div>

          <button
            type="submit"
            disabled={sending || selectedTowns.length === 0 || !message}
            className="w-full bg-brand-pink text-white font-display text-sm uppercase tracking-wider py-4 hover:bg-brand-pink-dark disabled:opacity-50 transition-colors rounded-sm"
          >
            {sending ? "Enviando..." : `Enviar a ${targetCount} suscriptor${targetCount !== 1 ? "es" : ""}`}
          </button>

          {result && (
            <p className="text-green-400 text-sm text-center font-display uppercase tracking-wider">
              ✓ Enviado a {result.sent} suscriptor{result.sent !== 1 ? "es" : ""}
            </p>
          )}
        </form>

        {/* Subscribers list */}
        <h2 className="font-display text-sm uppercase tracking-widest text-[#F5F5F5] mb-3">Lista de Suscriptores</h2>
        {loading ? (
          <p className="text-muted text-sm">Cargando...</p>
        ) : subscribers.length === 0 ? (
          <p className="text-muted text-sm italic">No hay suscriptores confirmados aún</p>
        ) : (
          <div className="space-y-2">
            {subscribers.map((sub) => (
              <div key={sub.id} className="glass-card rounded-lg px-4 py-3">
                <p className="text-sm text-[#F5F5F5]">{sub.email}</p>
                <p className="text-muted text-xs mt-0.5">{sub.towns.join(" · ")}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const IC = "w-full bg-dark border border-dark-border rounded-sm px-3 py-2.5 text-[#F5F5F5] text-sm placeholder:text-muted focus:outline-none focus:border-brand-pink transition-all duration-200";
