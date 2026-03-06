import { useMemo } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/cn";
import { spring, staggerContainer, staggerItem } from "../../lib/motion";
import { useBookmarkStore } from "../../stores/bookmarks";
import { X } from "lucide-react";

interface FavoritesGridProps {
  onNavigate: (url: string) => void;
}

const accentPalette = [
  "#a2a3e9",
  "#e879f9",
  "#818cf8",
  "#f472b6",
  "#60a5fa",
  "#34d399",
  "#fbbf24",
  "#f87171",
];

export function FavoritesGrid({ onNavigate }: FavoritesGridProps) {
  const favorites = useBookmarkStore((s) => s.favorites);
  const removeFavorite = useBookmarkStore((s) => s.removeFavorite);

  const sorted = useMemo(
    () => [...favorites].sort((a, b) => a.order - b.order),
    [favorites],
  );

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4"
    >
      {sorted.map((fav, i) => (
        <motion.button
          key={fav.id}
          variants={staggerItem}
          whileHover={{
            scale: 1.08,
            boxShadow: "0 0 16px var(--glow-soft)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={spring}
          onClick={() => onNavigate(fav.url)}
          className={cn(
            "group relative flex flex-col items-center gap-2 rounded-xl p-3",
            "backdrop-blur-xl bg-glass border border-border-subtle",
            "hover:border-border transition-colors cursor-pointer",
          )}
        >
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            whileHover={{ scale: 1.1 }}
            className={cn(
              "absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full",
              "bg-elevated border border-border-subtle",
              "flex items-center justify-center",
              "opacity-0 group-hover:opacity-100 transition-opacity",
              "hover:bg-error/20 hover:border-error/40 cursor-pointer",
            )}
            onClick={(e) => {
              e.stopPropagation();
              removeFavorite(fav.id);
            }}
          >
            <X className="w-3 h-3 text-muted group-hover:text-error" />
          </motion.button>

          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-white"
            style={{ background: accentPalette[i % accentPalette.length] }}
          >
            {fav.title.charAt(0).toUpperCase()}
          </div>
          <span className="text-[11px] text-secondary truncate w-full text-center">
            {fav.title}
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
}
