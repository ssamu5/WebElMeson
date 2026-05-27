import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "pink" | "amber" | "dark" | "green" | "red";
  className?: string;
}

export default function Badge({ children, variant = "pink", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-display uppercase tracking-wider rounded-sm",
        variant === "pink" && "bg-brand-pink/20 text-brand-pink border border-brand-pink/30",
        variant === "amber" && "bg-brand-amber/20 text-brand-amber border border-brand-amber/30",
        variant === "dark" && "bg-dark-elevated text-muted border border-dark-border",
        variant === "green" && "bg-green-500/20 text-green-400 border border-green-500/30",
        variant === "red" && "bg-red-500/20 text-red-400 border border-red-500/30",
        className
      )}
    >
      {children}
    </span>
  );
}
