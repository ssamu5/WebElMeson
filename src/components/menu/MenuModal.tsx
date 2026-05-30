"use client";

import { useEffect } from "react";
import Image from "next/image";
import { MenuItem, BurgerDelMes } from "@/types";
import { formatPriceShort } from "@/lib/utils/formatPrice";

type Item = MenuItem | BurgerDelMes;

interface Props {
  item: Item;
  onClose: () => void;
}

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
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Card */}
      <div
        className="relative z-10 w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(232,24,154,0.25)] border border-brand-pink/20 animate-slide-up"
        style={{ maxHeight: "92svh", display: "flex", flexDirection: "column" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── IMAGE BLOCK ── */}
        {item.image_url ? (
          <div className="relative flex-shrink-0 overflow-hidden bg-black" style={{ height: "52vw", maxHeight: 260 }}>
            {/* Blurred background fill — makes it look full even with letterboxing */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image_url}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-60"
            />
            {/* Sharp burger — contain so it's never cropped */}
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              className="object-contain relative z-10"
              sizes="(max-width: 640px) 100vw, 448px"
              priority
            />
            {/* Bottom fade into card */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-dark-elevated to-transparent z-20" />
          </div>
        ) : (
          <div className="flex-shrink-0 h-20 bg-dark flex items-center justify-center">
            <span className="text-5xl">🍔</span>
          </div>
        )}

        {/* ── CONTENT (scrollable) ── */}
        <div className="bg-dark-elevated flex-1 overflow-y-auto">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-dark-border" />
          </div>

          <div className="px-5 pb-10 pt-2 space-y-4">
            {/* Name + price */}
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-[#F5F5F5] leading-tight flex-1">
                {item.name}
              </h2>
              <span className="font-display text-3xl sm:text-4xl neon-text shrink-0">
                {formatPriceShort(item.price)}
              </span>
            </div>

            {/* Month badge */}
            {"month_year" in item && item.month_year && (
              <span className="inline-block font-display text-xs uppercase tracking-widest text-brand-pink border border-brand-pink/40 px-3 py-1 rounded-sm">
                {item.month_year}
              </span>
            )}

            {/* Pink separator */}
            <div className="h-[1px] bg-gradient-to-r from-brand-pink/60 via-brand-pink/20 to-transparent" />

            {/* Story */}
            {"story" in item && item.story && (
              <p className="text-[#F5F5F5]/60 text-sm italic leading-relaxed border-l-2 border-brand-pink/50 pl-3">
                &ldquo;{item.story}&rdquo;
              </p>
            )}

            {/* Ingredients / description */}
            {item.description && (
              <div>
                <p className="text-[10px] font-display uppercase tracking-widest text-brand-pink mb-2">Ingredientes</p>
                <p className="text-[#F5F5F5]/90 text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            )}

            {/* Allergens */}
            {isMenuItem(item) && item.allergens && item.allergens.length > 0 && (
              <p className="text-muted text-xs uppercase tracking-wider">
                Alérgenos: {item.allergens.join(", ")}
              </p>
            )}

            {/* Not available */}
            {isMenuItem(item) && !item.is_available && (
              <p className="text-red-400 text-xs font-display uppercase tracking-wider">
                ✗ No disponible hoy
              </p>
            )}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:text-brand-pink transition-colors border border-white/20"
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
