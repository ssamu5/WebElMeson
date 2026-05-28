import Link from "next/link";
import Image from "next/image";
import { MenuItem } from "@/types";
import { formatPriceShort } from "@/lib/utils/formatPrice";
import SectionTitle from "@/components/ui/SectionTitle";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface Props {
  items: MenuItem[];
}

export default function BestSellers({ items }: Props) {
  if (!items.length) return null;

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <SectionTitle
        title="Los Más Pedidos"
        subtitle="Las burgers que enamoran a todos los que las prueban"
        centered
      />

      {/* Mobile: horizontal scroll. Desktop: grid */}
      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-x-auto no-scrollbar pb-4 md:pb-0 scroll-snap-x">
        {items.map((item) => (
          <BestSellerCard key={item.id} item={item} />
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <Link href="/carta">
          <Button variant="neon" size="md">
            Ver la Carta Completa
          </Button>
        </Link>
      </div>
    </section>
  );
}

function BestSellerCard({ item }: { item: MenuItem }) {
  const isSmash = item.category === "smash_10" || item.category === "smash_13";

  return (
    <div className="scroll-snap-start min-w-[280px] md:min-w-0 flex-shrink-0 md:flex-shrink glass-card rounded-lg overflow-hidden hover:border-brand-pink/50 hover:shadow-[0_0_20px_rgba(232,24,154,0.2)] transition-all duration-300 group">
      {/* Photo */}
      {item.image_url && (
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 280px, 320px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent" />
          {/* Price overlay */}
          <div className="absolute bottom-3 right-3">
            <span className="font-display text-2xl amber-text drop-shadow-[0_0_8px_rgba(255,140,0,0.8)]">
              {formatPriceShort(item.price)}
            </span>
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Badge */}
        <div className="flex items-center justify-between mb-2">
          <Badge variant="pink">
            {isSmash ? "Smash Burger" : item.category === "raciones" ? "Ración" : "Postre"}
          </Badge>
          {item.is_featured && (
            <span className="text-[10px] font-display uppercase tracking-widest text-brand-amber">⭐ Top</span>
          )}
        </div>

        {/* Name */}
        <h3 className="font-display text-xl uppercase tracking-wider text-[#F5F5F5] mb-1 group-hover:text-brand-pink transition-colors duration-200">
          {item.name}
        </h3>

        {/* Description */}
        {item.description && (
          <p className="text-muted text-xs leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Price (if no image) */}
        {!item.image_url && (
          <div className="mt-3">
            <span className="font-display text-2xl amber-text">{formatPriceShort(item.price)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
