import Image from "next/image";
import { MenuItem } from "@/types";
import { formatPriceShort } from "@/lib/utils/formatPrice";
import { cn } from "@/lib/utils/cn";

interface Props {
  item: MenuItem;
  variant?: "default" | "featured";
}

export default function MenuItemCard({ item, variant = "default" }: Props) {
  return (
    <div
      className={cn(
        "relative flex items-center gap-3 rounded-lg border transition-all duration-200 overflow-hidden",
        item.is_available
          ? "bg-dark-elevated border-dark-border hover:border-brand-pink/40 hover:shadow-[0_0_12px_rgba(232,24,154,0.12)] active:border-brand-pink/60"
          : "bg-dark-secondary border-dark-border opacity-50",
        variant === "featured" && item.is_available && "border-brand-pink/20"
      )}
    >
      {/* Featured accent */}
      {variant === "featured" && (
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-pink shadow-[0_0_6px_#E8189A]" />
      )}

      {/* Text content */}
      <div className={cn("flex-1 min-w-0 py-3 pr-3", variant === "featured" ? "pl-4" : "pl-3")}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <h3 className="font-display text-base sm:text-lg uppercase tracking-wider text-[#F5F5F5] leading-tight">
              {item.name}
            </h3>
            {!item.is_available && (
              <span className="text-[10px] font-display uppercase tracking-wider text-red-400 border border-red-400/30 px-1.5 py-0.5 rounded-sm shrink-0">
                Agotado
              </span>
            )}
          </div>
          {/* Price — always visible, right-aligned */}
          <span className="font-display text-xl sm:text-2xl neon-text tabular-nums shrink-0 ml-2">
            {formatPriceShort(item.price)}
          </span>
        </div>

        {item.description && (
          <p className="text-muted text-xs sm:text-sm mt-1 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}
      </div>

      {/* Thumbnail image */}
      {item.image_url && (
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-md overflow-hidden mr-3 my-2">
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover"
            sizes="80px"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-dark/20" />
        </div>
      )}
    </div>
  );
}
