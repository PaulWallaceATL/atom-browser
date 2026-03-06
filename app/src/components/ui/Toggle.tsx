import { motion } from "motion/react";
import { cn } from "../../lib/cn";
import { spring } from "../../lib/motion";

type Size = "sm" | "md";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: Size;
}

const trackSize: Record<Size, string> = {
  sm: "w-8 h-[18px]",
  md: "w-10 h-[22px]",
};

const knobSize: Record<Size, { size: number; travel: number }> = {
  sm: { size: 14, travel: 14 },
  md: { size: 18, travel: 18 },
};

export function Toggle({ checked, onChange, size = "md" }: ToggleProps) {
  const { size: k, travel } = knobSize[size];

  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative rounded-full cursor-pointer transition-colors duration-200",
        trackSize[size],
        checked ? "bg-accent" : "bg-elevated border border-border",
      )}
    >
      <motion.span
        className="absolute top-1/2 block rounded-full"
        style={{
          width: k,
          height: k,
          background: checked ? "var(--bg-base)" : "var(--text-muted)",
          left: 2,
        }}
        animate={{ x: checked ? travel : 0, y: "-50%" }}
        transition={spring}
      />
    </button>
  );
}
