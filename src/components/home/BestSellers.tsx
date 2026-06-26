import Link from "next/link";
import Image from "next/image";
import { MenuItem } from "@/types";
import { formatPriceShort } from "@/lib/utils/formatPrice";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";

interface Props { items: MenuItem[]; }

export default function BestSellers({ items }: Props) {
  if (!items.length) return null;

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <SectionTitle title="Los Más Pedidos" subtitle="Las burgers que enamoran a todos los que las prueban" centered />

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {items.map((item, idx) => (
          <div key={item.id} className="scroll-reveal-bounce" style={{ animationDelay: `${idx * 80}ms` }}>
            <BestSellerCard item={item} />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <Link href="/carta">
          <Button variant="neon" size="md" className="font-display">Ver la Carta Completa</Button>
        </Link>
      </div>
    </section>
  );
}

function BestSellerCard({ item }: { item: MenuItem }) {
  return (
    <div className="glass-card rounded-xl overflow-hidden hover:border-brand-pink/50 hover:shadow-[0_0_20px_rgba(232,24,154,0.2)] transition-all duration-300 group">
      {item.image_url && (
        <div className="relative w-full aspect-square overflow-hidden">
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 48vw, 280px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/10 to-transparent" />
          <div className="absolute top-2 left-2">
            <span className="font-rawhide text-[10px] uppercase tracking-widest text-white bg-brand-pink px-2 py-0.5 rounded-sm">
              Best Seller
            </span>
          </div>
          <div className="absolute bottom-2 right-2">
            <span className="font-display text-xl price-shimmer drop-shadow-[0_0_8px_rgba(217,48,96,0.9)]">
              {formatPriceShort(item.price)}
            </span>
          </div>
        </div>
      )}

      <div className="p-3">
        <h3 className="font-display text-base sm:text-lg uppercase tracking-wider text-[#F5F5F5] group-hover:text-brand-pink transition-colors duration-200 leading-tight">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-muted text-xs leading-relaxed mt-1 line-clamp-2">{item.description}</p>
        )}
        {!item.image_url && (
          <span className="font-display text-xl neon-text-soft mt-2 block">{formatPriceShort(item.price)}</span>
        )}
      </div>
    </div>
  );
}
