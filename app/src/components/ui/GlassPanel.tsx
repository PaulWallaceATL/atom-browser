import { type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/cn";
import { slideUp } from "../../lib/motion";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-8",
};

export function GlassPanel({
  children,
  className,
  glow,
  padding = "md",
}: GlassPanelProps) {
  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        "backdrop-blur-xl bg-glass rounded-xl border border-border-subtle",
        paddingClasses[padding],
        glow && "shadow-lg shadow-glow-soft",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
