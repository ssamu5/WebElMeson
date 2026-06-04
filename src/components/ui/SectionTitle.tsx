import { cn } from "@/lib/utils/cn";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  neon?: boolean;
  rune?: boolean;
}

export default function SectionTitle({ title, subtitle, centered = false, className, neon = false, rune = false }: SectionTitleProps) {
  return (
    <div className={cn("mb-8", centered && "text-center", className)}>
      <h2 className={cn("text-4xl md:text-5xl", neon ? "neon-text animate-flicker" : "text-[#f0ece4]")}>
        {title}
      </h2>
      <div className={cn("mt-2 h-[2px] w-16 bg-brand-pink shadow-[0_0_8px_#B53863,0_0_16px_rgba(181,56,99,0.4)]", centered && "mx-auto")} />
      {subtitle && <p className="mt-3 text-muted text-sm md:text-base">{subtitle}</p>}
    </div>
  );
}
