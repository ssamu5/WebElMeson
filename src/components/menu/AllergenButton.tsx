"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function AllergenButton() {
  const [open, setOpen] = useState(false);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!open) { setFlipped(false); return; }
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", fn);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative inline-flex items-center gap-1.5 mt-4 text-muted hover:text-brand-pink transition-colors text-[10px] font-display uppercase tracking-widest border border-dark-border hover:border-brand-pink/50 px-3 py-1.5 rounded-sm group"
        aria-label="Ver información de alérgenos"
      >
        <AllergenIcon className="text-brand-pink/60 group-hover:text-brand-pink transition-colors" />
        Alérgenos
      </button>

      {open && (
        /* Fullscreen overlay — z-[200] para ir por encima del botón FAB y la navbar */
        <div className="fixed inset-0 z-[200] flex flex-col bg-black/92 backdrop-blur-sm">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 pt-safe pt-4 pb-2 shrink-0">
            <p className="text-white/50 text-[10px] font-display uppercase tracking-widest">
              {flipped ? "← Toca para ver leyenda" : "Toca la imagen para voltear →"}
            </p>
            <button
              onClick={() => setOpen(false)}
              className="w-9 h-9 rounded-full bg-dark-elevated border border-dark-border flex items-center justify-center text-muted hover:text-white hover:border-brand-pink transition-colors shrink-0"
              aria-label="Cerrar"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Flip card — ocupa todo el espacio restante, con padding lateral */}
          <div
            className="flex-1 px-4 pb-4 cursor-pointer select-none"
            style={{ perspective: "1200px" }}
            onClick={() => setFlipped((f) => !f)}
            aria-label={flipped ? "Ver leyenda de alérgenos" : "Ver alérgenos por producto"}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                transformStyle: "preserve-3d",
                transition: "transform 650ms cubic-bezier(0.4, 0, 0.2, 1)",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                position: "relative",
              }}
            >
              {/* Front — leyenda de los 14 alérgenos */}
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>
                <Image
                  src="/images/alergenos-leyenda.jpg"
                  alt="Los 14 alérgenos principales numerados con icono y nombre"
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
              {/* Back — lista de productos con sus números */}
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                <Image
                  src="/images/alergenos-productos.jpg"
                  alt="Alérgenos por producto de la carta"
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AllergenIcon({ className }: { className?: string }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
