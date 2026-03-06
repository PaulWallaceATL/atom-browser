export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  time: string;
  snippet: string;
  category: string;
  url: string;
  thumbnail?: string;
  truthScore?: number;
  relevanceScore?: number;
}

const FEEDS: Record<string, string> = {
  Tech: "https://feeds.arstechnica.com/arstechnica/technology-lab",
  AI: "https://techcrunch.com/category/artificial-intelligence/feed/",
  Markets: "https://feeds.finance.yahoo.com/rss/2.0/headline?s=^GSPC&region=US&lang=en-US",
};

const RSS_PROXY = "https://api.rss2json.com/v1/api.json?rss_url=";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function stripHtml(html: string): string {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || "").trim();
}

function syntheticScore(seed: string, base: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  return Math.min(98, Math.max(62, base + (Math.abs(hash) % 20) - 10));
}

export async function fetchNews(category: string): Promise<NewsArticle[]> {
  const feedUrl = FEEDS[category];
  if (!feedUrl) return [];

  try {
    const res = await fetch(`${RSS_PROXY}${encodeURIComponent(feedUrl)}`);
    if (!res.ok) return [];
    const data = await res.json();
    if (data.status !== "ok" || !data.items) return [];

    return data.items.slice(0, 8).map((item: Record<string, string>, i: number) => {
      const title = item.title || "Untitled";
      return {
        id: `${category}_${i}`,
        title,
        source: data.feed?.title || category,
        time: item.pubDate ? timeAgo(item.pubDate) : "",
        snippet: stripHtml(item.description || "").slice(0, 180),
        category,
        url: item.link || "",
        thumbnail: item.thumbnail || item.enclosure?.link || undefined,
        truthScore: syntheticScore(title, 82),
        relevanceScore: syntheticScore(title + "rel", 78),
      };
    });
  } catch {
    return [];
  }
}

export const STUB_ARTICLES: NewsArticle[] = [
  { id: "s1", title: "OpenAI unveils GPT-5 with real-time multimodal reasoning", source: "The Verge", time: "2h ago", snippet: "The latest model introduces native video understanding and can execute multi-step tasks across applications with minimal prompting.", category: "AI", url: "", thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=120&h=80&fit=crop", truthScore: 87, relevanceScore: 94 },
  { id: "s2", title: "Apple Silicon M5 chips enter mass production at TSMC", source: "Bloomberg", time: "3h ago", snippet: "The next-generation chips are built on TSMC's 2nm process and promise a 40% performance uplift over M4 with lower power draw.", category: "Tech", url: "", thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=120&h=80&fit=crop", truthScore: 91, relevanceScore: 82 },
  { id: "s3", title: "S&P 500 hits all-time high as Fed signals rate pause", source: "Reuters", time: "4h ago", snippet: "Markets rallied after the Federal Reserve indicated it would hold rates steady through Q3, citing balanced inflation data.", category: "Markets", url: "", thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=120&h=80&fit=crop", truthScore: 93, relevanceScore: 71 },
];
