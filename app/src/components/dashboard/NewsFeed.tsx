import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/cn";
import { spring, staggerContainer, staggerItem } from "../../lib/motion";
import { NewsCard } from "./NewsCard";
import { fetchNews, STUB_ARTICLES, type NewsArticle } from "../../lib/news";

const categories = ["All", "Tech", "AI", "Markets", "For You"];

export function NewsFeed() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [liveArticles, setLiveArticles] = useState<Record<string, NewsArticle[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const results: Record<string, NewsArticle[]> = {};
      const fetches = ["Tech", "AI", "Markets"].map(async (cat) => {
        const articles = await fetchNews(cat);
        if (articles.length > 0) results[cat] = articles;
      });
      await Promise.allSettled(fetches);
      if (!cancelled) {
        setLiveArticles(results);
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const getArticles = (): NewsArticle[] => {
    const hasLive = Object.keys(liveArticles).length > 0;

    if (activeCategory === "All" || activeCategory === "For You") {
      if (hasLive) {
        return Object.values(liveArticles).flat().sort(() => 0.5 - Math.random()).slice(0, 8);
      }
      return STUB_ARTICLES;
    }

    if (hasLive && liveArticles[activeCategory]?.length) {
      return liveArticles[activeCategory];
    }

    return STUB_ARTICLES.filter((a) => a.category === activeCategory);
  };

  const filtered = getArticles();

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            transition={spring}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "rounded-full px-3 py-1 text-[11px] font-medium transition-colors cursor-pointer",
              activeCategory === cat
                ? "text-[var(--accent)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]",
            )}
            style={activeCategory === cat ? { background: "var(--accent-soft)" } : undefined}
          >
            {cat}
          </motion.button>
        ))}
        {loading && (
          <span className="text-[10px] text-[var(--text-muted)] ml-auto">Fetching live news...</span>
        )}
      </div>

      <motion.div
        key={activeCategory}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {filtered.map((article) => (
          <motion.div key={article.id} variants={staggerItem}>
            <NewsCard
              title={article.title}
              source={article.source}
              time={article.time}
              snippet={article.snippet}
              category={article.category}
              thumbnail={article.thumbnail}
              onOpen={() => {
                if (article.url) window.open(article.url, "_blank");
              }}
              onSummarize={() => {}}
            />
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-8 text-[var(--text-muted)] text-sm">
            No articles in this category yet.
          </div>
        )}
      </motion.div>
    </div>
  );
}
