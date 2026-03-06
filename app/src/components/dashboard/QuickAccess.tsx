import { useMemo } from "react";
import { motion } from "motion/react";
import { useBookmarkStore } from "../../stores/bookmarks";

interface QuickAccessProps {
  onNavigate: (url: string) => void;
}

const palette = ["#a2a3e9", "#e879f9", "#818cf8", "#f472b6", "#60a5fa", "#34d399", "#fbbf24", "#f87171"];

function faviconUrl(url: string): string {
  try { return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`; }
  catch { return ""; }
}

export function QuickAccess({ onNavigate }: QuickAccessProps) {
  const favorites = useBookmarkStore((s) => s.favorites);
  const sorted = useMemo(() => [...favorites].sort((a, b) => a.order - b.order), [favorites]);

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
      {sorted.map((fav, i) => (
        <motion.button
          key={fav.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03, duration: 0.3 }}
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate(fav.url)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            width: 68,
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: 0,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "var(--bg-elevated)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              border: "1px solid transparent",
              transition: "box-shadow 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 24px var(--glow-accent)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "transparent"; }}
            data-hover="glow"
          >
            <img
              src={faviconUrl(fav.url)}
              alt=""
              style={{ width: 24, height: 24 }}
              onError={(e) => {
                const t = e.currentTarget;
                t.style.display = "none";
                const fb = t.nextElementSibling as HTMLElement | null;
                if (fb) fb.style.display = "flex";
              }}
            />
            <span
              style={{
                display: "none",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 14,
                background: palette[i % palette.length],
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              {fav.title.charAt(0).toUpperCase()}
            </span>
          </div>
          <span style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {fav.title}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
