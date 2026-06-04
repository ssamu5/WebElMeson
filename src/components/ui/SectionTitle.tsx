import { cn } from "@/lib/utils/cn";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  neon?: boolean;
  runeChar?: string;
}

export default function SectionTitle({ title, subtitle, centered = false, className, neon = false, runeChar }: SectionTitleProps) {
  return (
    <div className={cn("mb-8", centered && "text-center", className)}>
      {runeChar && (
        <span style={{ display: "block", color: "#D93060", opacity: 0.65, fontSize: "1.1rem", letterSpacing: "0.3em", marginBottom: 6 }}>
          {runeChar}
        </span>
      )}
      <h2 className={cn("text-4xl md:text-5xl", neon ? "neon-text animate-flicker" : "text-[#f0ece4]")}>
        {title}
      </h2>
      <div className={cn("mt-2 h-[2px] w-16 bg-brand-pink shadow-[0_0_8px_#D93060,0_0_16px_rgba(217,48,96,0.4)]", centered && "mx-auto")} />
      {subtitle && <p className="mt-3 text-muted text-sm md:text-base">{subtitle}</p>}
    </div>
  );
}
