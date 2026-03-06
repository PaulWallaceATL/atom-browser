import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/cn";
import { fadeIn, spring } from "../../lib/motion";
import { ChevronDown, ExternalLink } from "lucide-react";

interface AISummaryCardProps {
  title: string;
  summary: string[];
  sources: string[];
  actions: { label: string; onClick: () => void }[];
  loading: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
}

function SkeletonLine({ width }: { width: string }) {
  return (
    <div
      className="h-3 rounded-full bg-elevated animate-pulse"
      style={{ width }}
    />
  );
}

export function AISummaryCard({
  title,
  summary,
  sources,
  actions,
  loading,
  expanded,
  onToggleExpand,
}: AISummaryCardProps) {
  const visibleBullets = expanded ? summary : summary.slice(0, 3);
  const canExpand = summary.length > 3;

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="backdrop-blur-xl bg-glass rounded-xl border border-border-subtle p-5"
    >
      {loading ? (
        <div className="space-y-3">
          <SkeletonLine width="60%" />
          <SkeletonLine width="90%" />
          <SkeletonLine width="75%" />
        </div>
      ) : (
        <>
          <h3 className="text-sm font-medium text-primary mb-3">{title}</h3>

          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={expanded ? "expanded" : "collapsed"}
              initial={{ height: "auto", opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: "auto", opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-1.5 mb-3"
            >
              {visibleBullets.map((bullet, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, ...spring }}
                  className="flex gap-2 text-sm text-secondary leading-relaxed"
                >
                  <span className="text-accent mt-1 shrink-0">•</span>
                  <span>{bullet}</span>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>

          {canExpand && (
            <button
              onClick={onToggleExpand}
              className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors mb-3 cursor-pointer"
            >
              <ChevronDown
                size={14}
                className={cn(
                  "transition-transform duration-200",
                  expanded && "rotate-180",
                )}
              />
              {expanded
                ? "Show less"
                : `Show ${summary.length - 3} more`}
            </button>
          )}

          {sources.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {sources.map((source) => (
                <span
                  key={source}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-elevated text-[11px] text-muted border border-border-subtle"
                >
                  <ExternalLink size={10} />
                  {source}
                </span>
              ))}
            </div>
          )}

          {actions.length > 0 && (
            <div className="flex items-center gap-2 pt-3 border-t border-border-subtle">
              {actions.map((action) => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={spring}
                  onClick={action.onClick}
                  className="px-3 py-1.5 rounded-lg text-xs text-secondary hover:text-primary hover:bg-elevated transition-colors cursor-pointer"
                >
                  {action.label}
                </motion.button>
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
