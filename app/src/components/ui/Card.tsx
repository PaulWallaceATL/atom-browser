import { type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/cn";
import { spring } from "../../lib/motion";

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hoverable, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={
        hoverable
          ? { scale: 1.01, y: -2, boxShadow: "0 0 20px var(--glow-soft)" }
          : undefined
      }
      transition={spring}
      onClick={onClick}
      className={cn(
        "rounded-lg bg-surface border border-border",
        hoverable && "cursor-pointer",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
