import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/cn";
import { slideUp, spring } from "../../lib/motion";
import { useComputerUseStore } from "../../stores/computeruse";
import { SessionControls } from "./SessionControls";
import { ActionFeed } from "./ActionFeed";
import { Monitor, Play, RotateCcw, CheckCircle2 } from "lucide-react";

export function ComputerUsePanel() {
  const status = useComputerUseStore((s) => s.status);
  const task = useComputerUseStore((s) => s.task);
  const actions = useComputerUseStore((s) => s.actions);
  const startSession = useComputerUseStore((s) => s.startSession);
  const [taskInput, setTaskInput] = useState("");

  const handleStart = () => {
    if (!taskInput.trim()) return;
    startSession(taskInput.trim());
    setTaskInput("");
  };

  const completedCount = actions.filter((a) => a.status === "done").length;

  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        "flex flex-col h-full rounded-xl",
        "backdrop-blur-xl bg-glass border border-border-subtle",
        "shadow-lg shadow-glow-soft overflow-hidden",
      )}
    >
      <div className="flex items-center gap-2.5 px-5 pt-5 pb-4 border-b border-border-subtle">
        <Monitor className="w-5 h-5 text-accent" />
        <h2 className="text-base font-semibold text-primary">Computer Use</h2>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        {status === "idle" && (
          <div className="flex flex-col items-center justify-center flex-1 gap-5 px-6 py-12">
            <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center">
              <Monitor className="w-7 h-7 text-accent" />
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-sm font-medium text-primary">
                Start an agent session
              </span>
              <span className="text-xs text-muted max-w-[280px]">
                Describe a task and Atom will take actions on your computer
                autonomously.
              </span>
            </div>
            <div className="flex items-center gap-2 w-full max-w-md">
              <div
                className={cn(
                  "relative flex items-center flex-1 rounded-lg bg-glass border border-border-subtle",
                  "h-10 px-3 text-sm",
                  "focus-within:border-accent focus-within:shadow-[0_0_0_3px_var(--glow-soft)]",
                  "transition-all duration-200",
                )}
              >
                <input
                  type="text"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder="e.g. Book a flight to NYC for next Friday"
                  className="w-full h-full bg-transparent placeholder:text-muted"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleStart();
                  }}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={spring}
                onClick={handleStart}
                disabled={!taskInput.trim()}
                className={cn(
                  "h-10 px-4 rounded-lg text-sm font-medium flex items-center gap-2",
                  "bg-accent text-base hover:bg-accent-hover",
                  "shadow-md hover:shadow-lg hover:shadow-glow-soft",
                  "transition-all cursor-pointer",
                  "disabled:opacity-40 disabled:pointer-events-none",
                )}
              >
                <Play className="w-4 h-4" />
                Start Session
              </motion.button>
            </div>
          </div>
        )}

        {(status === "active" || status === "paused") && (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="px-5 pt-4 pb-3 border-b border-border-subtle">
              <SessionControls />
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ActionFeed />
            </div>
          </div>
        )}

        {status === "completed" && (
          <div className="flex flex-col items-center justify-center flex-1 gap-5 px-6 py-12">
            <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-success" />
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-sm font-medium text-primary">
                Session Complete
              </span>
              <span className="text-xs text-muted">
                "{task}" — {completedCount} action{completedCount !== 1 ? "s" : ""} completed
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={spring}
              onClick={() => useComputerUseStore.setState({ status: "idle", task: "", actions: [] })}
              className={cn(
                "h-9 px-4 rounded-lg text-sm font-medium flex items-center gap-2",
                "bg-elevated text-secondary border border-border-subtle",
                "hover:border-border hover:text-primary",
                "transition-colors cursor-pointer",
              )}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              New Session
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
