"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Contraseña incorrecta.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <Image src="/images/logo-sm.webp" alt="El Mesón" fill className="object-contain" sizes="64px" />
          </div>
          <h1 className="font-display text-2xl uppercase tracking-widest text-[#F5F5F5]">Panel Admin</h1>
          <p className="text-muted text-xs mt-1 uppercase tracking-widest">El Mesón Smashburgers</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 space-y-4">
          <div>
            <label htmlFor="admin-pass" className="block text-xs font-display uppercase tracking-widest text-muted mb-2">
              Contraseña
            </label>
            <input
              id="admin-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoFocus
              className="w-full bg-dark border border-dark-border rounded-sm px-4 py-3 text-[#F5F5F5] placeholder:text-muted focus:outline-none focus:border-brand-pink focus:shadow-[0_0_8px_rgba(232,24,154,0.2)] transition-all duration-200"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs font-display uppercase tracking-wider">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-pink text-white font-display text-sm uppercase tracking-wider py-3 hover:bg-brand-pink-dark disabled:opacity-50 transition-colors duration-200"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
