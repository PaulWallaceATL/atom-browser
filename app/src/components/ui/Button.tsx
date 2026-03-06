import { type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/cn";
import { spring } from "../../lib/motion";

type Variant = "primary" | "secondary" | "ghost" | "glass" | "ai";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
}

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
  md: "h-9 px-4 text-sm gap-2 rounded-lg",
  lg: "h-11 px-6 text-sm gap-2.5 rounded-xl",
};

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-base font-medium shadow-md hover:bg-accent-hover",
  secondary:
    "bg-elevated text-primary border border-border font-medium hover:bg-surface",
  ghost:
    "text-secondary hover:text-primary hover:bg-elevated",
  glass:
    "backdrop-blur-xl bg-glass text-primary border border-border-subtle hover:border-border",
  ai: "text-primary font-medium relative overflow-hidden",
};

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="2"
      />
      <path
        d="M14 8a6 6 0 0 0-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  disabled,
  loading,
  icon,
  onClick,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileHover={isDisabled ? undefined : { scale: 1.02 }}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      transition={spring}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        "inline-flex items-center justify-center transition-colors duration-150",
        "cursor-pointer disabled:opacity-40 disabled:pointer-events-none",
        sizeClasses[size],
        variantClasses[variant],
        variant === "primary" && "hover:shadow-lg hover:shadow-glow-soft",
        className,
      )}
    >
      {variant === "ai" && <AiGradientBorder />}
      {loading ? (
        <Spinner className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

function AiGradientBorder() {
  return (
    <>
      <span
        className="absolute inset-0 rounded-[inherit] p-px"
        style={{
          background:
            "linear-gradient(135deg, var(--accent), #e879f9, var(--accent))",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <motion.span
        className="absolute inset-0 rounded-[inherit] opacity-40 blur-md"
        animate={{
          background: [
            "linear-gradient(135deg, var(--accent), #e879f9, var(--accent))",
            "linear-gradient(270deg, var(--accent), #e879f9, var(--accent))",
            "linear-gradient(135deg, var(--accent), #e879f9, var(--accent))",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      <span className="absolute inset-px rounded-[inherit] bg-elevated" />
    </>
  );
}
