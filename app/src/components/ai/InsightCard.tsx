import { type ReactNode } from "react";
import { motion } from "motion/react";
import { spring } from "../../lib/motion";

interface InsightCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  action?: { label: string; onClick: () => void };
}

export function InsightCard({ icon, label, value, action }: InsightCardProps) {
  return (
    <motion.div
      whileHover={{
        boxShadow: "0 0 16px var(--glow-soft)",
        borderColor: "var(--accent)",
      }}
      transition={spring}
      className="flex items-center gap-3 px-3.5 py-3 rounded-lg backdrop-blur-xl bg-glass border border-border-subtle"
    >
      <span className="shrink-0 text-accent">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted leading-none mb-0.5">{label}</p>
        <p className="text-sm text-primary truncate">{value}</p>
      </div>
      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={spring}
          onClick={action.onClick}
          className="shrink-0 px-2.5 py-1 rounded-md text-xs text-accent hover:bg-accent/10 transition-colors cursor-pointer"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}
