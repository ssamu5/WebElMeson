import { Metadata } from "next";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { GalleryImage } from "@/types";
import { SITE_CONFIG } from "@/lib/constants/siteConfig";

export const metadata: Metadata = {
  title: "Galería",
  description: "Fotos de El Mesón Smashburgers: el foodtruck, las burgers y los eventos por Navarra.",
};
export const revalidate = 300;

// Static images as fallback (pre-loaded brand photos)
const STATIC_IMAGES: Omit<GalleryImage, "id" | "created_at">[] = [
  { url: "/images/foodtruck-frente.webp", alt_text: "El Mesón Foodtruck — Vista frontal", caption: null, category: "foodtruck", sort_order: 1, is_visible: true },
  { url: "/images/foodtruck-derecha.webp", alt_text: "El Mesón Foodtruck — Vista lateral derecha", caption: null, category: "foodtruck", sort_order: 2, is_visible: true },
  { url: "/images/foodtruck-izquierda.webp", alt_text: "El Mesón Foodtruck — Vista lateral izquierda", caption: null, category: "foodtruck", sort_order: 3, is_visible: true },
  { url: "/images/caja-exterior.webp", alt_text: "Packaging El Mesón — Exterior", caption: "El packaging vikingo", category: "burgers", sort_order: 4, is_visible: true },
  { url: "/images/caja-interior.webp", alt_text: "Packaging El Mesón — Interior", caption: "La Leyenda de los Dioses", category: "burgers", sort_order: 5, is_visible: true },
  { url: "/images/neon-burger.webp", alt_text: "Neon Burger — El Mesón", caption: null, category: "burgers", sort_order: 6, is_visible: true },
  { url: "/images/neon-nombre.webp", alt_text: "Neon — El Mesón Smashburgers", caption: null, category: "foodtruck", sort_order: 7, is_visible: true },
  { url: "/images/camiseta.webp", alt_text: "Camiseta oficial El Mesón", caption: "Merch oficial", category: "eventos", sort_order: 8, is_visible: true },
];

export default async function GaleriaPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order");

  const dbImages = (data as GalleryImage[]) ?? [];
  // Merge: DB images first, then static ones (DB images take priority)
  const allImages = dbImages.length > 0 ? dbImages : STATIC_IMAGES;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative py-20 px-4 text-center border-b border-dark-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-brand-pink/5 to-transparent" />
        <h1 className="relative font-display text-6xl sm:text-7xl md:text-8xl uppercase tracking-wider text-[#F5F5F5]">
          La Galería
        </h1>
        <p className="relative text-muted text-sm mt-2 uppercase tracking-widest font-display">
          El Mesón en imágenes
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {allImages.map((img, i) => (
            <div
              key={(img as GalleryImage).id || i}
              className="relative overflow-hidden rounded-lg break-inside-avoid group cursor-pointer"
            >
              <div className="relative">
                <Image
                  src={img.url}
                  alt={img.alt_text || "El Mesón Smashburgers"}
                  width={400}
                  height={400}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-brand-pink/0 group-hover:bg-brand-pink/10 transition-all duration-300" />
                <div className="absolute inset-0 border border-transparent group-hover:border-brand-pink/30 rounded-lg transition-all duration-300" />
                {/* Caption */}
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-[#F5F5F5] text-xs font-display uppercase tracking-wider">{img.caption}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instagram CTA */}
      <div className="py-12 px-4 text-center border-t border-dark-border">
        <p className="text-muted text-sm mb-4">Más fotos y stories en tiempo real</p>
        <a
          href={SITE_CONFIG.instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-display text-base uppercase tracking-wider text-brand-pink border border-brand-pink/50 px-6 py-3 hover:bg-brand-pink hover:text-white hover:border-brand-pink transition-all duration-300"
        >
          <InstagramIcon />
          {SITE_CONFIG.instagram.handle}
        </a>
      </div>
    </div>
  );
}

function InstagramIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;
}
