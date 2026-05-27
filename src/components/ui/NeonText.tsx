import { cn } from "@/lib/utils/cn";

interface NeonTextProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  flicker?: boolean;
  className?: string;
}

export default function NeonText({
  children,
  as: Tag = "span",
  flicker = false,
  className,
}: NeonTextProps) {
  return (
    <Tag
      className={cn(
        "neon-text font-display uppercase tracking-wider",
        flicker && "animate-flicker",
        className
      )}
    >
      {children}
    </Tag>
  );
}
