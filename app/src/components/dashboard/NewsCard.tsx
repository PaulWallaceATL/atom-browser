import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { cn } from "../../lib/cn";
import { cardHover, spring } from "../../lib/motion";

interface NewsCardProps {
  title: string;
  source: string;
  time: string;
  snippet: string;
  category: string;
  thumbnail?: string;
  onOpen: () => void;
  onSummarize: () => void;
}

const categoryColors: Record<string, string> = {
  Tech: "bg-blue-500/10 text-blue-400",
  AI: "bg-violet-500/10 text-violet-400",
  Markets: "bg-emerald-500/10 text-emerald-400",
  Science: "bg-amber-500/10 text-amber-400",
  Business: "bg-rose-500/10 text-rose-400",
};

export function NewsCard({
  title,
  source,
  time,
  snippet,
  category,
  thumbnail,
  onOpen,
  onSummarize,
}: NewsCardProps) {
  return (
    <motion.article
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      transition={spring}
      onClick={onOpen}
      className="group cursor-pointer rounded-xl border border-border-subtle bg-surface p-4 transition-colors hover:border-border"
    >
      <div className="flex gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-primary leading-snug line-clamp-2">
            {title}
          </h3>
          <p className="mt-1 text-xs text-muted">
            {source} · {time}
          </p>
          <p className="mt-1.5 text-xs text-secondary line-clamp-2 leading-relaxed">
            {snippet}
          </p>
        </div>
        {thumbnail && (
          <div
            className="shrink-0 w-20 h-[60px] rounded-lg bg-cover bg-center bg-elevated"
            style={{ backgroundImage: `url(${thumbnail})` }}
          />
        )}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={spring}
          onClick={(e) => {
            e.stopPropagation();
            onSummarize();
          }}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-secondary hover:text-primary hover:bg-elevated transition-colors cursor-pointer"
        >
          <Sparkles className="w-3 h-3" />
          Summarize
        </motion.button>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
            categoryColors[category] ?? "bg-elevated text-secondary",
          )}
        >
          {category}
        </span>
      </div>
    </motion.article>
  );
}
