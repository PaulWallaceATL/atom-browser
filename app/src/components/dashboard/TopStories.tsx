import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Newspaper, ShieldCheck, Target } from "lucide-react";
import { fetchNews, STUB_ARTICLES, type NewsArticle } from "../../lib/news";

interface TopStoriesProps {
  onNavigate: (url: string) => void;
}

function ScorePill({ value, label, icon: Icon }: { value?: number; label: string; icon: React.ElementType }) {
  if (value == null) return null;
  return (
    <span
      title={label === "Confidence" ? "Estimated source and claim reliability signal" : "Estimated match to your interests and current work"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 10,
        fontWeight: 500,
        padding: "2px 7px",
        borderRadius: 6,
        background: "var(--bg-elevated)",
        color: value >= 80 ? "var(--accent)" : "var(--text-muted)",
        border: "1px solid var(--border-subtle)",
        cursor: "default",
        whiteSpace: "nowrap" as const,
      }}
    >
      <Icon style={{ width: 10, height: 10 }} />
      {label} {value}
    </span>
  );
}

function StoryThumbnail({ src }: { src?: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div style={{
        width: 72,
        height: 50,
        borderRadius: 8,
        background: "var(--bg-elevated)",
        flexShrink: 0,
      }} />
    );
  }

  return (
    <img
      src={src}
      alt=""
      onError={() => setFailed(true)}
      style={{
        width: 72,
        height: 50,
        borderRadius: 8,
        objectFit: "cover",
        flexShrink: 0,
        background: "var(--bg-elevated)",
      }}
    />
  );
}

export function TopStories({ onNavigate }: TopStoriesProps) {
  const [articles, setArticles] = useState<NewsArticle[]>(STUB_ARTICLES.slice(0, 3));

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const results = await fetchNews("Tech");
      if (!cancelled && results.length > 0) setArticles(results.slice(0, 3));
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const handleHover = useCallback((e: React.MouseEvent, enter: boolean) => {
    const el = e.currentTarget as HTMLElement;
    el.style.background = enter ? "var(--bg-surface)" : "transparent";
    el.style.borderColor = enter ? "var(--accent)" : "transparent";
    el.style.boxShadow = enter ? "0 0 20px var(--glow-soft)" : "none";
  }, []);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <Newspaper style={{ width: 15, height: 15, color: "var(--text-muted)" }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
          Top Stories
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {articles.map((a, i) => (
          <motion.button
            key={a.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ x: 2 }}
            onClick={() => a.url ? onNavigate(a.url) : undefined}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              borderRadius: "var(--radius-md)",
              padding: "14px 16px",
              textAlign: "left",
              cursor: "pointer",
              background: "transparent",
              border: "1px solid transparent",
              transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            <StoryThumbnail src={a.thumbnail} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: 13,
                fontWeight: 500,
                lineHeight: 1.45,
                color: "var(--text-primary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              } as React.CSSProperties}>
                {a.title}
              </p>
              <p style={{ fontSize: 11, marginTop: 4, color: "var(--text-muted)" }}>
                {a.source} · {a.time}
              </p>
              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                <ScorePill value={a.truthScore} label="Confidence" icon={ShieldCheck} />
                <ScorePill value={a.relevanceScore} label="Relevance" icon={Target} />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
