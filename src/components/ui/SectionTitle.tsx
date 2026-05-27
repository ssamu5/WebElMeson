import { cn } from "@/lib/utils/cn";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  neon?: boolean;
}

export default function SectionTitle({
  title,
  subtitle,
  centered = false,
  className,
  neon = false,
}: SectionTitleProps) {
  return (
    <div className={cn("mb-8", centered && "text-center", className)}>
      <h2
        className={cn(
          "font-display text-4xl md:text-5xl uppercase tracking-wider",
          neon ? "neon-text animate-flicker" : "text-[#F5F5F5]"
        )}
      >
        {title}
      </h2>
      {/* Neon underline divider */}
      <div
        className={cn(
          "mt-2 h-[2px] w-16 bg-brand-pink",
          "shadow-[0_0_8px_#E8189A,0_0_16px_rgba(232,24,154,0.4)]",
          centered && "mx-auto"
        )}
      />
      {subtitle && (
        <p className="mt-3 text-muted text-sm md:text-base">{subtitle}</p>
      )}
    </div>
  );
}
