import { motion } from "motion/react";
import { cn } from "../../lib/cn";
import { staggerContainer, staggerItem } from "../../lib/motion";
import { useComputerUseStore, type ActionStatus } from "../../stores/computeruse";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const statusConfig: Record<
  ActionStatus,
  { icon: LucideIcon; color: string; spin?: boolean }
> = {
  running: { icon: Loader2, color: "text-accent", spin: true },
  done: { icon: CheckCircle2, color: "text-success" },
  denied: { icon: XCircle, color: "text-error" },
  error: { icon: AlertTriangle, color: "text-error" },
  pending: { icon: Clock, color: "text-muted" },
};

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function ActionFeed() {
  const actions = useComputerUseStore((s) => s.actions);

  if (actions.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted">
        <p className="text-xs">Waiting for actions…</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="relative flex flex-col gap-0 pl-6"
    >
      <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />

      {actions.map((action) => {
        const config = statusConfig[action.status];
        const Icon = config.icon;

        return (
          <motion.div
            key={action.id}
            variants={staggerItem}
            className={cn(
              "relative flex items-start gap-3 py-2.5",
              action.sensitive && "border-l-2 border-warning/60 -ml-[1px] pl-[23px]",
            )}
          >
            <div
              className={cn(
                "absolute left-[-13px] w-6 h-6 rounded-full flex items-center justify-center",
                "bg-surface border border-border",
              )}
            >
              <Icon
                className={cn(
                  "w-3.5 h-3.5",
                  config.color,
                  config.spin && "animate-spin",
                )}
              />
            </div>

            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <span className="text-sm text-primary">{action.description}</span>
              {action.status === "running" && action.confidence > 0 && (
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="h-1 w-20 rounded-full bg-elevated overflow-hidden">
                    <motion.div
                      className="h-full bg-accent rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${action.confidence * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="text-[10px] text-muted">
                    {Math.round(action.confidence * 100)}%
                  </span>
                </div>
              )}
            </div>

            <span className="text-[10px] text-muted whitespace-nowrap mt-0.5">
              {formatTime(action.timestamp)}
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
