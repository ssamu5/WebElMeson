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
        "relative flex flex-col sm:flex-row sm:items-start gap-3 py-4 px-4 rounded-lg border transition-all duration-200",
        item.is_available
          ? "bg-dark-elevated border-dark-border hover:border-brand-pink/30 hover:bg-dark-elevated/80"
          : "bg-dark-secondary border-dark-border opacity-50",
        variant === "featured" && item.is_available && "border-brand-pink/20 bg-dark-elevated/90"
      )}
    >
      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <h3 className="font-display text-lg uppercase tracking-wider text-[#F5F5F5] leading-tight">
            {item.name}
          </h3>
          {!item.is_available && (
            <span className="text-[10px] font-display uppercase tracking-wider text-red-400 border border-red-400/30 px-1.5 py-0.5 rounded-sm shrink-0">
              Agotado
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-muted text-xs sm:text-sm mt-1 leading-relaxed">{item.description}</p>
        )}
        {item.allergens && item.allergens.length > 0 && (
          <p className="text-muted text-[10px] mt-1 uppercase tracking-wider">
            Alérgenos: {item.allergens.join(", ")}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="shrink-0 sm:self-center">
        <span className="font-display text-2xl neon-text tabular-nums">
          {formatPriceShort(item.price)}
        </span>
      </div>

      {/* Neon left border accent for featured items */}
      {variant === "featured" && (
        <div className="absolute left-0 top-3 bottom-3 w-[2px] bg-brand-pink rounded-full shadow-[0_0_6px_#E8189A]" />
      )}
    </div>
  );
}
