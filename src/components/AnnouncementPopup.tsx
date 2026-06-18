"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Announcement } from "@/types";

export default function AnnouncementPopup() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const now = new Date().toISOString();
    supabase
      .from("announcements")
      .select("*")
      .eq("is_active", true)
      .lte("start_at", now)
      .gte("end_at", now)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          setAnnouncement(data as Announcement);
          setVisible(true);
        }
      });
  }, []);

  if (!visible || !announcement) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setVisible(false)}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md rounded-2xl p-[2px] bg-gradient-to-b from-brand-pink via-brand-pink-glow to-brand-pink-dark shadow-[0_0_60px_rgba(232,24,154,0.45)] animate-slide-up">
        <div className="relative bg-[#0d0d0d] rounded-2xl pt-14 px-6 pb-6 overflow-hidden">
          {/* Glow background */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-brand-pink/25 blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={() => setVisible(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-dark-elevated border border-dark-border flex items-center justify-center text-muted hover:text-white hover:border-brand-pink transition-colors z-10"
            aria-label="Cerrar"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Logo */}
          <div className="relative z-10 flex justify-center mb-4">
            <div className="relative w-20 h-20 rounded-full bg-dark border-2 border-brand-pink shadow-[0_0_25px_rgba(232,24,154,0.6)] flex items-center justify-center overflow-hidden">
              <Image src="/images/logo-sm.webp" alt="El Mesón" fill className="object-contain p-2" sizes="80px" />
            </div>
          </div>

          <div className="relative z-10 text-center">
            <h2 className="font-display text-2xl uppercase tracking-wider text-[#F5F5F5] mb-3">
              {announcement.title}
            </h2>
            <p className="text-[#f0ece4]/80 text-sm leading-relaxed">
              {announcement.message}
            </p>
          </div>

          <button
            onClick={() => setVisible(false)}
            className="relative z-10 mt-6 w-full bg-brand-pink text-white font-display text-xs uppercase tracking-wider py-3 rounded-sm shadow-[0_0_20px_rgba(232,24,154,0.5)] hover:bg-brand-pink-dark transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
