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
        <div
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/88 backdrop-blur-sm" />

          {/* Panel */}
          <div
            className="relative z-10 w-full max-w-sm px-4 pb-6 sm:pb-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-muted text-[10px] font-display uppercase tracking-widest">
                {flipped ? "← Toca para ver leyenda" : "Toca para ver por producto →"}
              </p>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-dark-elevated border border-dark-border flex items-center justify-center text-muted hover:text-white hover:border-brand-pink transition-colors"
                aria-label="Cerrar"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Flip card */}
            <div
              className="relative cursor-pointer rounded-xl overflow-hidden select-none"
              style={{ height: "72svh", perspective: "1200px" }}
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
                }}
              >
                {/* Front — leyenda de los 14 alérgenos */}
                <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>
                  <Image
                    src="/images/alergenos-leyenda.png"
                    alt="Los 14 alérgenos principales numerados con icono y nombre"
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 90vw, 384px"
                    priority
                  />
                </div>
                {/* Back — lista de productos con sus números */}
                <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                  <Image
                    src="/images/alergenos-productos.png"
                    alt="Alérgenos por producto de la carta"
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 90vw, 384px"
                  />
                </div>
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
