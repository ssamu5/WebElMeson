"use client";

import { useEffect } from "react";
import Image from "next/image";
import { MenuItem, BurgerDelMes } from "@/types";
import { formatPriceShort } from "@/lib/utils/formatPrice";

type Item = MenuItem | BurgerDelMes;
interface Props { item: Item; onClose: () => void; }

function isMenuItem(item: Item): item is MenuItem {
  return "category" in item;
}

export default function MenuModal({ item, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      {/* Full-screen panel from bottom */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 flex flex-col animate-slide-up"
        style={{ height: "93svh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* PHOTO — takes top 60% */}
        <div className="relative flex-shrink-0 bg-dark" style={{ height: "58%" }}>
          {item.image_url ? (
            <>
              {/* Blurred bg fill */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image_url} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-50" />
              {/* Sharp image */}
              <Image
                src={item.image_url}
                alt={item.name}
                fill
                className="object-contain relative z-10"
                sizes="100vw"
                priority
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-dark">
              <div className="w-24 h-24 rounded-full bg-dark-elevated flex items-center justify-center border border-dark-border">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-brand-pink">
                  <path d="M18.75 3H5.25A2.25 2.25 0 0 0 3 5.25v.75a9 9 0 0 0 18 0v-.75A2.25 2.25 0 0 0 18.75 3ZM3 10.5A9 9 0 0 0 11.25 19v1.5H9a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5h-2.25V19A9 9 0 0 0 21 10.5H3Z" />
                </svg>
              </div>
            </div>
          )}
          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-dark-elevated to-transparent z-20" />
        </div>

        {/* CONTENT — bottom 42%, scrollable */}
        <div className="flex-1 bg-dark-elevated overflow-y-auto rounded-t-3xl -mt-6 relative z-30 border-t border-dark-border">
          {/* Handle */}
          <div className="flex justify-center pt-3">
            <div className="w-10 h-1 rounded-full bg-dark-border" />
          </div>

          <div className="px-5 pt-4 pb-24 space-y-3">
            {/* Name + price */}
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-[#F5F5F5] leading-tight flex-1">
                {item.name}
              </h2>
              <span className="font-display text-3xl sm:text-4xl neon-text shrink-0 pt-1">
                {formatPriceShort(item.price)}
              </span>
            </div>

            {"month_year" in item && item.month_year && (
              <span className="inline-block font-display text-xs uppercase tracking-widest text-brand-pink border border-brand-pink/40 px-3 py-1 rounded-sm">
                {item.month_year}
              </span>
            )}

            <div className="h-[1px] bg-gradient-to-r from-brand-pink/60 via-brand-pink/20 to-transparent" />

            {"story" in item && item.story && (
              <p className="text-[#F5F5F5]/55 text-sm italic leading-relaxed border-l-2 border-brand-pink/40 pl-3">
                &ldquo;{item.story}&rdquo;
              </p>
            )}

            {item.description && (
              <div>
                <p className="text-[10px] font-display uppercase tracking-widest text-brand-pink mb-2">Ingredientes</p>
                <p className="text-[#F5F5F5]/90 text-base leading-relaxed">{item.description}</p>
              </div>
            )}

            {isMenuItem(item) && item.allergens && item.allergens.length > 0 && (
              <p className="text-muted text-xs uppercase tracking-wider">
                Alérgenos: {item.allergens.join(", ")}
              </p>
            )}

            {isMenuItem(item) && !item.is_available && (
              <p className="text-red-400 text-xs font-display uppercase tracking-wider">No disponible hoy</p>
            )}
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 hover:border-brand-pink transition-colors"
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
