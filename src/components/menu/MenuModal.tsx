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
  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

      {/* Modal card */}
      <div
        className="relative z-10 w-full sm:max-w-md bg-dark-elevated border border-dark-border rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(232,24,154,0.2)] animate-slide-up sm:animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        {item.image_url ? (
          <div className="relative w-full aspect-[4/3] bg-dark">
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 448px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-elevated via-transparent to-transparent" />
          </div>
        ) : (
          <div className="w-full h-24 bg-dark flex items-center justify-center">
            <span className="text-4xl">🍔</span>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-dark/80 backdrop-blur flex items-center justify-center text-[#F5F5F5] hover:text-brand-pink transition-colors border border-dark-border"
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="px-5 pb-8 pt-4 space-y-3">
          {/* Name + price */}
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-[#F5F5F5] leading-tight flex-1">
              {item.name}
            </h2>
            <span className="font-display text-3xl neon-text shrink-0">
              {formatPriceShort(item.price)}
            </span>
          </div>

          {/* Month badge for burger del mes */}
          {"month_year" in item && item.month_year && (
            <span className="inline-block font-display text-xs uppercase tracking-widest text-brand-pink border border-brand-pink/40 px-2.5 py-1 rounded-sm">
              {item.month_year}
            </span>
          )}

          {/* Story (burger del mes) */}
          {"story" in item && item.story && (
            <p className="text-muted text-sm italic border-l-2 border-brand-pink/50 pl-3 leading-relaxed">
              &ldquo;{item.story}&rdquo;
            </p>
          )}

          {/* Description / ingredients */}
          {item.description && (
            <p className="text-[#F5F5F5]/85 text-sm sm:text-base leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Allergens */}
          {isMenuItem(item) && item.allergens && item.allergens.length > 0 && (
            <p className="text-muted text-xs uppercase tracking-wider pt-1">
              Alérgenos: {item.allergens.join(", ")}
            </p>
          )}

          {/* Availability */}
          {isMenuItem(item) && !item.is_available && (
            <p className="text-red-400 text-xs font-display uppercase tracking-wider">
              ✗ No disponible hoy
            </p>
          )}

          {/* Drag indicator for mobile */}
          <div className="flex justify-center pt-2">
            <div className="w-10 h-1 rounded-full bg-dark-border" />
          </div>
        </div>
      </div>
    </div>
  );
}
