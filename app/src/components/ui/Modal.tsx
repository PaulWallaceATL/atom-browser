import { type ReactNode, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/cn";
import { spring } from "../../lib/motion";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
}

export function Modal({ open, onClose, children, title, className }: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-overlay" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={spring}
            className={cn(
              "relative z-10 w-full max-w-lg mx-4",
              "backdrop-blur-xl bg-glass rounded-xl border border-border-subtle",
              "shadow-lg shadow-glow-soft",
              className,
            )}
          >
            {title && (
              <div className="flex items-center justify-between px-6 pt-5 pb-0">
                <h2 className="text-base font-semibold text-primary">{title}</h2>
                <button
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-md text-muted hover:text-primary hover:bg-elevated transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
