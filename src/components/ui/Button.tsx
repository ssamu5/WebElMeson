"use client";

import { cn } from "@/lib/utils/cn";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "neon" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", fullWidth, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-display tracking-wider uppercase transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none",
          // sizes
          size === "sm" && "text-sm px-4 py-2",
          size === "md" && "text-base px-6 py-3",
          size === "lg" && "text-lg px-8 py-4",
          // variants
          variant === "primary" &&
            "bg-brand-pink text-white hover:bg-brand-pink-dark active:scale-95",
          variant === "neon" &&
            "bg-transparent text-brand-pink border-2 border-brand-pink hover:bg-brand-pink hover:text-white",
          variant === "ghost" &&
            "bg-transparent text-[#F5F5F5] hover:text-brand-pink hover:bg-white/5",
          variant === "outline" &&
            "bg-transparent text-[#F5F5F5] border border-dark-border hover:border-brand-pink hover:text-brand-pink",
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
