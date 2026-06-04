import { Metadata } from "next";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/constants/siteConfig";

export const metadata: Metadata = {
  title: "Info Adicional",
  description: "Todo sobre El Mesón Smashburgers. Historia, valores, contacto y cómo llegar.",
};

export default function InfoPage() {
  return (
    <div className="min-h-screen">
      <div className="relative py-16 px-4 text-center border-b border-dark-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-brand-pink/5 to-transparent" />
        <h1 className="relative metal text-6xl sm:text-7xl md:text-8xl text-[#F5F5F5]">
          Nuestra Historia
        </h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-20">

        {/* About */}
        <section className="space-y-6">
          <div className="space-y-4 text-[#F5F5F5]/80 text-sm sm:text-base leading-relaxed max-w-2xl">
            <p>
              El Mesón nació con una obsesión: hacer la mejor smash burger de La Ribera. Con 4 años de experiencia y cientos de recetas probadas, somos el referente de la smash burger artesanal en Navarra.
            </p>
            <p>
              Cada burger es un homenaje a la técnica: 90g de carne aplastada a fuego alto en plancha de acero, sellado perfecto, costra caramelizada. Todo lo que llevan lleva sentido.
            </p>
            <p className="font-display text-brand-pink uppercase tracking-wider text-lg">
              {SITE_CONFIG.subTagline}
            </p>
          </div>
        </section>

        {/* Values */}
        <section>
          <h2 className="font-display text-3xl uppercase tracking-wider text-[#F5F5F5] mb-2">Cómo trabajamos</h2>
          <div className="mt-1 mb-8 h-[2px] w-16 bg-brand-pink shadow-[0_0_8px_#E8189A]" />
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: "Ingredientes Frescos",
                text: "90% de los ingredientes son caseros o de proveedores locales. Sin congelados, sin atajos.",
              },
              {
                title: "Técnica Smash",
                text: "Aplastamos la carne en plancha a alta temperatura para crear una costra perfecta en cada burger.",
              },
              {
                title: "Identidad Propia",
                text: "Nombres únicos, recetas que no encontrarás en ningún otro sitio de Navarra.",
              },
            ].map((val) => (
              <div key={val.title} className="glass-card rounded-lg p-6 hover:border-brand-pink/30 transition-all duration-300">
                <div className="w-8 h-[2px] bg-brand-pink mb-4 shadow-[0_0_6px_#E8189A]" />
                <h3 className="font-display text-lg uppercase tracking-wider text-[#F5F5F5] mb-2">{val.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{val.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Photos grid */}
        <section>
          <h2 className="font-display text-3xl uppercase tracking-wider text-[#F5F5F5] mb-2">Nuestra Imagen</h2>
          <div className="mt-1 mb-6 h-[2px] w-16 bg-brand-pink shadow-[0_0_8px_#E8189A]" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { src: "/images/foodtruck-izquierda.webp", alt: "Foodtruck lateral" },
              { src: "/images/foodtruck-derecha.webp", alt: "Foodtruck derecha" },
              { src: "/images/camiseta.webp", alt: "Camiseta El Mesón" },
            ].map((img) => (
              <div key={img.src} className="relative aspect-square rounded-lg overflow-hidden group">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent group-hover:opacity-0 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="font-display text-3xl uppercase tracking-wider text-[#F5F5F5] mb-2">Contacto</h2>
          <div className="mt-1 mb-6 h-[2px] w-16 bg-brand-pink shadow-[0_0_8px_#E8189A]" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <ContactRow icon={<PhoneIcon />} label="Teléfono" href={SITE_CONFIG.phone.localHref} text={SITE_CONFIG.phone.local} />
              <ContactRow icon={<MailIcon />} label="Email" href={SITE_CONFIG.emailHref} text={SITE_CONFIG.email} />
              <ContactRow icon={<InstagramIcon />} label="Instagram" href={SITE_CONFIG.instagram.url} text={SITE_CONFIG.instagram.handle} external />
              <div className="pt-1">
                <p className="text-xs font-display uppercase tracking-widest text-muted mb-1">Dirección</p>
                <p className="text-[#F5F5F5] text-sm">{SITE_CONFIG.address}</p>
              </div>
              <div>
                <p className="text-xs font-display uppercase tracking-widest text-muted mb-1">Horario</p>
                <p className="text-[#F5F5F5] text-sm font-display uppercase tracking-wider">{SITE_CONFIG.hours}</p>
              </div>
            </div>
            <div className="relative h-64 md:h-auto min-h-[220px] rounded-lg overflow-hidden border border-dark-border">
              <iframe
                src="https://maps.google.com/maps?q=C%2F+San+Isidro+12+Fustinana+Navarra&output=embed&z=15"
                width="100%" height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación El Mesón Smashburgers"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ContactRow({ icon, label, href, text, external }: { icon: React.ReactNode; label: string; href: string; text: string; external?: boolean; }) {
  return (
    <div>
      <p className="text-xs font-display uppercase tracking-widest text-muted mb-1">{label}</p>
      <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}
        className="flex items-center gap-2 text-[#F5F5F5] hover:text-brand-pink transition-colors duration-200 text-sm">
        <span className="text-muted">{icon}</span>{text}
      </a>
    </div>
  );
}

function PhoneIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.34 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.77-.77a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
}
function MailIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
}
function InstagramIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;
}
