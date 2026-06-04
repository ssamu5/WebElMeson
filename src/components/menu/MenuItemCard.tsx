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
        "relative flex items-start gap-3 rounded-xl border transition-all duration-200 overflow-hidden p-4",
        item.is_available
          ? "bg-dark-elevated border-dark-border hover:border-brand-pink/50 hover:shadow-[0_0_14px_rgba(217,48,96,0.15)] active:scale-[0.98] active:border-brand-pink active:bg-dark-secondary cursor-pointer"
          : "bg-dark-secondary border-dark-border opacity-50",
        variant === "featured" && item.is_available && "border-brand-pink/25"
      )}
    >
      {variant === "featured" && (
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-pink shadow-[0_0_6px_#E8189A]" />
      )}

      {/* Text */}
      <div className={cn("flex-1 min-w-0", variant === "featured" && "pl-2")}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display text-lg sm:text-xl uppercase tracking-wider text-brand-pink leading-tight flex-1">
            {item.name}
          </h3>
          <span className="font-display text-xl sm:text-2xl neon-text shrink-0 ml-1">
            {formatPriceShort(item.price)}
          </span>
        </div>

        {!item.is_available && (
          <span className="inline-block text-[10px] font-display uppercase tracking-wider text-red-400 border border-red-400/30 px-1.5 py-0.5 rounded-sm mb-1">
            Agotado
          </span>
        )}

        {item.description && (
          <p className="text-muted text-sm leading-relaxed">
            {item.description}
          </p>
        )}
      </div>

      {/* Thumbnail */}
      {item.image_url && (
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-lg overflow-hidden mt-0.5">
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
      )}
    </div>
  );
}
