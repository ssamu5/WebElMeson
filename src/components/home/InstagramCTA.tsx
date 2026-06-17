import { SITE_CONFIG } from "@/lib/constants/siteConfig";

export default function InstagramCTA() {
  return (
    <section className="py-16 px-4 text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-brand-pink/50 animate-glow-pulse">
          <InstagramIcon />
        </div>
        <h2 className="metal text-3xl sm:text-4xl text-[#F5F5F5] mb-2">
          Síguenos
        </h2>
        <p className="text-muted text-sm mb-6">
          Fotos, anuncios y la próxima burger del mes en exclusiva
        </p>
        <a
          href={SITE_CONFIG.instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full sm:w-auto sm:inline-flex items-center justify-center gap-3 font-display text-base sm:text-lg uppercase tracking-wide sm:tracking-wider text-[#F5F5F5] border-2 border-brand-pink/50 px-5 sm:px-8 py-4 hover:border-brand-pink hover:text-brand-pink hover:shadow-[0_0_16px_rgba(232,24,154,0.4)] transition-all duration-300"
        >
          <InstagramIcon />
          {SITE_CONFIG.instagram.handle}
        </a>
      </div>
    </section>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-brand-pink"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}
