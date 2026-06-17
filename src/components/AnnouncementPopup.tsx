"use client";

import { useEffect, useState } from "react";
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
      <div className="relative w-full max-w-md bg-[#111] border border-brand-pink/30 rounded-2xl p-6 shadow-[0_0_40px_rgba(232,24,154,0.2)] animate-slide-up">
        {/* Close button */}
        <button
          onClick={() => setVisible(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-dark-elevated border border-dark-border flex items-center justify-center text-muted hover:text-white hover:border-brand-pink transition-colors"
          aria-label="Cerrar"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Neon accent */}
        <div className="w-8 h-[2px] bg-brand-pink shadow-[0_0_8px_#E8189A] mb-4" />

        <h2 className="font-rawhide text-2xl uppercase tracking-wider text-[#F5F5F5] mb-3 pr-8">
          {announcement.title}
        </h2>
        <p className="text-[#f0ece4]/80 text-sm leading-relaxed">
          {announcement.message}
        </p>

        <button
          onClick={() => setVisible(false)}
          className="mt-6 w-full bg-brand-pink text-white font-display text-xs uppercase tracking-wider py-3 rounded-sm hover:bg-brand-pink-dark transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
