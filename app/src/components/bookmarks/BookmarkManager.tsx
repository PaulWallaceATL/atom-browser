import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/cn";
import { staggerContainer, staggerItem, slideUp } from "../../lib/motion";
import { useBookmarkStore } from "../../stores/bookmarks";
import { Search, Globe, Trash2, Bookmark } from "lucide-react";

interface BookmarkManagerProps {
  onNavigate: (url: string) => void;
}

function groupBy<T>(items: T[], key: (item: T) => string): Record<string, T[]> {
  return items.reduce(
    (groups, item) => {
      const k = key(item);
      (groups[k] ||= []).push(item);
      return groups;
    },
    {} as Record<string, T[]>,
  );
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function truncateUrl(url: string, max = 48): string {
  try {
    const u = new URL(url);
    const display = u.hostname + u.pathname;
    return display.length > max ? display.slice(0, max) + "…" : display;
  } catch {
    return url.length > max ? url.slice(0, max) + "…" : url;
  }
}

export function BookmarkManager({ onNavigate }: BookmarkManagerProps) {
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const removeBookmark = useBookmarkStore((s) => s.removeBookmark);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return bookmarks;
    const q = query.toLowerCase();
    return bookmarks.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.url.toLowerCase().includes(q) ||
        b.folder.toLowerCase().includes(q),
    );
  }, [bookmarks, query]);

  const grouped = useMemo(
    () => groupBy(filtered, (b) => b.folder),
    [filtered],
  );

  const folders = Object.keys(grouped).sort();

  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col h-full gap-4"
    >
      <div
        className={cn(
          "relative flex items-center rounded-lg bg-glass border border-border-subtle",
          "h-9 px-3 text-sm",
          "focus-within:border-accent focus-within:shadow-[0_0_0_3px_var(--glow-soft)]",
          "transition-all duration-200",
        )}
      >
        <Search className="w-4 h-4 text-muted mr-2 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search bookmarks…"
          className="w-full h-full bg-transparent placeholder:text-muted"
        />
      </div>

      {folders.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 py-20 text-muted">
          <Bookmark className="w-10 h-10 opacity-40" />
          <p className="text-sm">No bookmarks yet</p>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6 overflow-y-auto flex-1 pr-1"
        >
          {folders.map((folder) => (
            <div key={folder} className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted uppercase tracking-wider px-1 mb-1">
                {folder}
              </span>
              {grouped[folder].map((bk) => (
                <motion.div
                  key={bk.id}
                  variants={staggerItem}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2 rounded-lg",
                    "hover:bg-elevated transition-colors cursor-pointer",
                  )}
                  onClick={() => onNavigate(bk.url)}
                >
                  <Globe className="w-4 h-4 text-muted shrink-0" />
                  <span className="text-sm text-primary truncate min-w-0 flex-1">
                    {bk.title}
                  </span>
                  <span className="text-xs text-muted truncate hidden sm:block max-w-[200px]">
                    {truncateUrl(bk.url)}
                  </span>
                  <span className="text-xs text-muted whitespace-nowrap hidden md:block">
                    {formatDate(bk.createdAt)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeBookmark(bk.id);
                    }}
                    className={cn(
                      "w-7 h-7 flex items-center justify-center rounded-md",
                      "text-muted opacity-0 group-hover:opacity-100",
                      "hover:text-error hover:bg-error/10 transition-all cursor-pointer",
                    )}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
