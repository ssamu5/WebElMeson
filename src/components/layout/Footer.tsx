import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/constants/siteConfig";

export default function Footer() {
  return (
    <footer className="bg-dark-secondary border-t border-dark-border mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image
                  src="/images/logo-sm.webp"
                  alt="El Mesón Smashburgers"
                  fill
                  className="object-contain"
                  sizes="48px"
                />
              </div>
              <div>
                <p className="font-display text-xl text-[#F5F5F5] uppercase tracking-wider">El Mesón</p>
                <p className="text-xs text-muted uppercase tracking-widest">Smashburgers</p>
              </div>
            </div>
            <p className="text-muted text-sm leading-relaxed">
              La leyenda de los dioses. Smash burgers artesanales con ingredientes frescos y recetas únicas en La Ribera de Navarra.
            </p>
            {/* Instagram */}
            <a
              href={SITE_CONFIG.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-brand-pink hover:text-brand-pink-glow transition-colors duration-200 text-sm font-display uppercase tracking-wider w-fit"
            >
              <InstagramIcon />
              {SITE_CONFIG.instagram.handle}
            </a>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-display text-sm text-[#F5F5F5] uppercase tracking-widest mb-4">Navegación</p>
            <ul className="flex flex-col gap-2">
              {[
                { href: "/", label: "Inicio" },
                { href: "/carta", label: "Carta" },
                { href: "/foodtruck", label: "Foodtruck" },
                { href: "/galeria", label: "Galería" },
                { href: "/info", label: "Info Adicional" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted hover:text-brand-pink transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-display text-sm text-[#F5F5F5] uppercase tracking-widest mb-4">Contacto</p>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <a
                  href={SITE_CONFIG.phone.localHref}
                  className="flex items-center gap-2 text-muted hover:text-brand-pink transition-colors duration-200"
                >
                  <PhoneIcon />
                  {SITE_CONFIG.phone.local}
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.emailHref}
                  className="flex items-center gap-2 text-muted hover:text-brand-pink transition-colors duration-200"
                >
                  <MailIcon />
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-muted">
                <MapIcon className="shrink-0 mt-0.5" />
                <span>{SITE_CONFIG.address}</span>
              </li>
              <li className="flex items-center gap-2 text-muted">
                <ClockIcon />
                {SITE_CONFIG.hours}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-dark-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted text-xs text-center">
            © {new Date().getFullYear()} El Mesón Smashburgers · Fustiñana, Navarra
          </p>
          <p className="text-muted text-xs font-display tracking-widest uppercase">
            #THE BEST F*CKING BURGER
          </p>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.34 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.77-.77a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
}
function MapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
