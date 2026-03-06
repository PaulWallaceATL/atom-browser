import { motion } from "motion/react";
import { cn } from "../../lib/cn";
import { spring } from "../../lib/motion";
import { useComputerUseStore } from "../../stores/computeruse";
import {
  Pause,
  Play,
  Square,
  Hand,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export function SessionControls() {
  const status = useComputerUseStore((s) => s.status);
  const task = useComputerUseStore((s) => s.task);
  const actions = useComputerUseStore((s) => s.actions);
  const pauseSession = useComputerUseStore((s) => s.pauseSession);
  const resumeSession = useComputerUseStore((s) => s.resumeSession);
  const endSession = useComputerUseStore((s) => s.endSession);
  const updateAction = useComputerUseStore((s) => s.updateAction);

  const pendingAction = actions.find((a) => a.status === "pending");
  const isPaused = status === "paused";

  const statusLabels: Record<string, string> = {
    active: "Running",
    paused: "Paused",
    completed: "Done",
    idle: "Idle",
  };

  const statusVariants: Record<string, string> = {
    active: "bg-success/10 text-success",
    paused: "bg-warning/10 text-warning",
    completed: "bg-accent-soft text-accent",
    idle: "bg-elevated text-muted",
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <span className="text-sm text-primary truncate">{task}</span>
        </div>
        <span
          className={cn(
            "inline-flex items-center h-5 px-2 rounded-full text-[10px] font-medium",
            statusVariants[status] ?? statusVariants.idle,
          )}
        >
          {statusLabels[status] ?? status}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={spring}
          onClick={isPaused ? resumeSession : pauseSession}
          className={cn(
            "h-8 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5",
            "bg-elevated text-secondary border border-border-subtle",
            "hover:border-border hover:text-primary transition-colors cursor-pointer",
          )}
        >
          {isPaused ? (
            <Play className="w-3.5 h-3.5" />
          ) : (
            <Pause className="w-3.5 h-3.5" />
          )}
          {isPaused ? "Resume" : "Pause"}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={spring}
          onClick={endSession}
          className={cn(
            "h-8 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5",
            "bg-error/10 text-error border border-error/20",
            "hover:bg-error/20 transition-colors cursor-pointer",
          )}
        >
          <Square className="w-3.5 h-3.5" />
          Stop
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={spring}
          onClick={endSession}
          className={cn(
            "h-8 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5",
            "bg-elevated text-secondary border border-border-subtle",
            "hover:border-accent hover:text-accent transition-colors cursor-pointer",
          )}
        >
          <Hand className="w-3.5 h-3.5" />
          Take Over
        </motion.button>
      </div>

      {pendingAction && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className={cn(
            "flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg",
            "bg-warning/5 border border-warning/20",
          )}
        >
          <span className="text-xs text-warning flex-1 truncate">
            Approve: {pendingAction.description}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={spring}
              onClick={() => updateAction(pendingAction.id, "running")}
              className={cn(
                "h-7 px-2.5 rounded-md text-xs font-medium flex items-center gap-1",
                "bg-success/10 text-success hover:bg-success/20",
                "transition-colors cursor-pointer",
              )}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Approve
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={spring}
              onClick={() => updateAction(pendingAction.id, "denied")}
              className={cn(
                "h-7 px-2.5 rounded-md text-xs font-medium flex items-center gap-1",
                "bg-error/10 text-error hover:bg-error/20",
                "transition-colors cursor-pointer",
              )}
            >
              <XCircle className="w-3.5 h-3.5" />
              Deny
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
