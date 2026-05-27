import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  neon?: boolean;
  glass?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className, neon, glass, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-lg border transition-all duration-200",
        glass
          ? "glass-card"
          : "bg-dark-elevated border-dark-border",
        neon && "hover:border-brand-pink hover:shadow-[0_0_12px_rgba(232,24,154,0.3)]",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
