import { type ReactNode, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/cn";

interface TooltipProps {
  children: ReactNode;
  content: string;
  className?: string;
}

export function Tooltip({ children, content, className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  const show = useCallback(() => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setOpen(true), 400);
  }, []);

  const hide = useCallback(() => {
    clearTimeout(timeout.current);
    setOpen(false);
  }, []);

  return (
    <div
      className={cn("relative inline-flex", className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 2, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50",
              "px-2.5 py-1.5 rounded-md text-xs whitespace-nowrap",
              "bg-elevated text-primary border border-border-subtle",
              "pointer-events-none",
            )}
            style={{ boxShadow: "var(--shadow-md)" }}
          >
            {content}
            <span
              className="absolute top-full left-1/2 -translate-x-1/2 -mt-px"
              style={{
                width: 0,
                height: 0,
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderTop: "5px solid var(--bg-elevated)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
