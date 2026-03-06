import { type ReactNode } from "react";
import { cn } from "../../lib/cn";

type Variant = "default" | "accent" | "success" | "warning" | "error";
type Size = "sm" | "md";

interface BadgeProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  default: "bg-elevated text-secondary border border-border-subtle",
  accent: "bg-accent-soft text-accent",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  error: "bg-error/10 text-error",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-5 px-2 text-[10px]",
  md: "h-6 px-2.5 text-xs",
};

export function Badge({ children, variant = "default", size = "md" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium leading-none whitespace-nowrap",
        variantClasses[variant],
        sizeClasses[size],
      )}
    >
      {children}
    </span>
  );
}
