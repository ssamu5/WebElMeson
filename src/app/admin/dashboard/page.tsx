import Link from "next/link";
import Image from "next/image";

const SECTIONS = [
  {
    href: "/admin/dashboard/hoy",
    icon: "📍",
    title: "Hoy",
    desc: "Ubicación de hoy y burgers del día",
    priority: true,
  },
  {
    href: "/admin/dashboard/menu",
    icon: "🍔",
    title: "Menú",
    desc: "Activar/desactivar platos, editar precios",
    priority: false,
  },
  {
    href: "/admin/dashboard/calendario",
    icon: "📅",
    title: "Calendario",
    desc: "Gestionar eventos del foodtruck",
    priority: false,
  },
  {
    href: "/admin/dashboard/burger-mes",
    icon: "⭐",
    title: "Burger del Mes",
    desc: "Cambiar la burger especial de este mes",
    priority: false,
  },
  {
    href: "/admin/dashboard/notificaciones",
    icon: "🔔",
    title: "Notificaciones",
    desc: "Ver suscriptores y enviar avisos",
    priority: false,
  },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="relative w-10 h-10">
            <Image src="/images/logo-sm.webp" alt="El Mesón" fill className="object-contain" sizes="40px" />
          </div>
          <div>
            <h1 className="font-display text-xl uppercase tracking-wider text-[#F5F5F5]">Panel Admin</h1>
            <p className="text-muted text-xs uppercase tracking-widest">El Mesón Smashburgers</p>
          </div>
        </div>

        {/* Sections grid */}
        <div className="space-y-3">
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 hover:border-brand-pink/50 hover:bg-dark-elevated active:scale-98 ${
                s.priority ? "border-brand-pink/30 bg-dark-elevated" : "border-dark-border bg-dark-secondary"
              }`}
            >
              <span className="text-2xl shrink-0">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-display text-base uppercase tracking-wider text-[#F5F5F5]">{s.title}</p>
                <p className="text-muted text-xs mt-0.5">{s.desc}</p>
              </div>
              <ChevronRight />
            </Link>
          ))}
        </div>

        {/* Logout */}
        <div className="mt-8 pt-6 border-t border-dark-border">
          <LogoutButton />
        </div>

        {/* View site link */}
        <div className="mt-4 text-center">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted text-xs hover:text-brand-pink transition-colors duration-200"
          >
            Ver la web pública →
          </a>
        </div>
      </div>
    </div>
  );
}

function LogoutButton() {
  return (
    <form action="/api/admin/logout" method="POST">
      <button
        type="submit"
        className="w-full text-muted text-sm font-display uppercase tracking-wider border border-dark-border rounded-sm px-4 py-3 hover:border-red-500/50 hover:text-red-400 transition-all duration-200"
      >
        Cerrar Sesión
      </button>
    </form>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
