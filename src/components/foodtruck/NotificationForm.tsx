"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

// Common towns in the Ribera de Navarra area (expandable from admin panel later)
const TOWNS = [
  "Fustiñana", "Tudela", "Corella", "Cintruénigo", "Cascante",
  "Murchante", "Fitero", "Ablitas", "Buñuel", "Ribaforada",
  "Cabanillas", "Fontellas", "Valtierra", "Arguedas", "Milagro",
];

export default function NotificationForm() {
  const [selectedTowns, setSelectedTowns] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function toggleTown(town: string) {
    setSelectedTowns((prev) =>
      prev.includes(town) ? prev.filter((t) => t !== town) : [...prev, town]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || selectedTowns.length === 0) {
      setErrorMsg("Selecciona al menos un pueblo e introduce tu email.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, towns: selectedTowns }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Algo salió mal. Inténtalo de nuevo.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Error de conexión. Inténtalo de nuevo.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section className="py-16 px-4">
        <div className="max-w-xl mx-auto">
          <div className="glass-card rounded-xl p-8 text-center border border-green-500/30">
            <div className="w-12 h-12 rounded-full border-2 border-green-400 flex items-center justify-center mx-auto mb-4">
              <CheckIcon />
            </div>
            <h3 className="font-display text-2xl uppercase tracking-wider text-[#F5F5F5] mb-2">
              ¡Ya estás suscrito!
            </h3>
            <p className="text-muted text-sm">
              Te hemos enviado un email de confirmación. Una vez que lo confirmes, te avisaremos cuando vengamos a{" "}
              <span className="text-[#F5F5F5]">{selectedTowns.join(", ")}</span>.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-xl mx-auto">
        <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-[#F5F5F5] mb-2">
          Avísame
        </h2>
        <div className="mt-1 mb-3 h-[2px] w-16 bg-brand-pink shadow-[0_0_8px_#E8189A]" />
        <p className="text-muted text-sm mb-8">
          Recibe una notificación cuando vengamos a tu pueblo. Sin spam, solo cuando sea relevante para ti.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Town selection */}
          <div>
            <label className="block text-xs font-display uppercase tracking-widest text-[#F5F5F5] mb-3">
              ¿A qué pueblos quieres que te avisemos?
            </label>
            <div className="flex flex-wrap gap-2">
              {TOWNS.map((town) => (
                <button
                  key={town}
                  type="button"
                  onClick={() => toggleTown(town)}
                  className={`px-3 py-1.5 text-sm font-display uppercase tracking-wider rounded-sm border transition-all duration-200 ${
                    selectedTowns.includes(town)
                      ? "bg-brand-pink border-brand-pink text-white shadow-[0_0_8px_rgba(232,24,154,0.4)]"
                      : "border-dark-border text-muted hover:border-brand-pink/50 hover:text-[#F5F5F5]"
                  }`}
                >
                  {town}
                </button>
              ))}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="notif-email" className="block text-xs font-display uppercase tracking-widest text-[#F5F5F5] mb-2">
              Tu email
            </label>
            <input
              id="notif-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full bg-dark-elevated border border-dark-border rounded-sm px-4 py-3 text-[#F5F5F5] text-sm placeholder:text-muted focus:outline-none focus:border-brand-pink focus:shadow-[0_0_8px_rgba(232,24,154,0.2)] transition-all duration-200"
            />
          </div>

          {errorMsg && (
            <p className="text-red-400 text-xs font-display uppercase tracking-wider">{errorMsg}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            disabled={status === "loading"}
          >
            {status === "loading" ? "Suscribiendo..." : "Suscribirme"}
          </Button>

          <p className="text-muted text-xs text-center">
            Recibirás un email de confirmación. Puedes darte de baja en cualquier momento.
          </p>
        </form>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}
