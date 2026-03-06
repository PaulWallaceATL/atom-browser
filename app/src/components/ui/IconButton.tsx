import { type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/cn";
import { spring } from "../../lib/motion";

type Size = "sm" | "md" | "lg";

interface IconButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  size?: Size;
  tooltip?: string;
  active?: boolean;
}

const sizeClasses: Record<Size, string> = {
  sm: "w-7 h-7 text-sm",
  md: "w-8 h-8 text-base",
  lg: "w-10 h-10 text-lg",
};

export function IconButton({
  children,
  className,
  onClick,
  size = "md",
  tooltip,
  active,
}: IconButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.08, backgroundColor: "var(--bg-elevated)" }}
      whileTap={{ scale: 0.92 }}
      transition={spring}
      onClick={onClick}
      title={tooltip}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-colors duration-150",
        "text-secondary hover:text-primary cursor-pointer",
        sizeClasses[size],
        active && "text-accent bg-accent-soft",
        className,
      )}
    >
      {children}
    </motion.button>
  );
}
