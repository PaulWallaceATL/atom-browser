export type SuggestionType = "navigate" | "search" | "news" | "images" | "tabs" | "history" | "ai" | "workflow";

export interface Suggestion {
  id: string;
  type: SuggestionType;
  label: string;
  secondary?: string;
  icon: string;
  url?: string;
  score: number;
}

interface MatchSource {
  type: SuggestionType;
  items: { label: string; secondary?: string; url?: string; icon: string }[];
}

const KNOWN_SITES: MatchSource = {
  type: "navigate",
  items: [
    { label: "Google", url: "https://google.com", icon: "Globe" },
    { label: "GitHub", url: "https://github.com", icon: "Github" },
    { label: "YouTube", url: "https://youtube.com", icon: "Play" },
    { label: "Gmail", url: "https://mail.google.com", icon: "Mail" },
    { label: "Twitter / X", url: "https://x.com", icon: "AtSign" },
    { label: "Reddit", url: "https://reddit.com", icon: "MessageCircle" },
    { label: "LinkedIn", url: "https://linkedin.com", icon: "Briefcase" },
    { label: "Notion", url: "https://notion.so", icon: "BookOpen" },
    { label: "Slack", url: "https://slack.com", icon: "MessageSquare" },
    { label: "Amazon", url: "https://amazon.com", icon: "ShoppingCart" },
    { label: "Netflix", url: "https://netflix.com", icon: "Tv" },
    { label: "Wikipedia", url: "https://wikipedia.org", icon: "BookOpen" },
    { label: "Stack Overflow", url: "https://stackoverflow.com", icon: "Code" },
    { label: "Figma", url: "https://figma.com", icon: "Figma" },
    { label: "Vercel", url: "https://vercel.com", icon: "Triangle" },
  ],
};

function fuzzyScore(query: string, target: string): number {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t === q) return 100;
  if (t.startsWith(q)) return 90;
  if (t.includes(q)) return 70;

  let qi = 0;
  let matched = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) { matched++; qi++; }
  }
  if (qi < q.length) return 0;
  return Math.round((matched / q.length) * 50);
}

export function getSuggestions(
  query: string,
  tabs: { id: number; title: string; url: string }[],
  bookmarks: { url: string; title: string }[],
): Suggestion[] {
  const q = query.trim();
  if (!q) return [];

  const results: Suggestion[] = [];
  let id = 0;

  // Always offer web, news, images, AI search
  results.push(
    { id: `s${id++}`, type: "search", label: `Search web for "${q}"`, icon: "Search", score: 85 },
    { id: `s${id++}`, type: "news", label: `Search news for "${q}"`, icon: "Newspaper", score: 75 },
    { id: `s${id++}`, type: "images", label: `Search images for "${q}"`, icon: "Image", score: 70 },
    { id: `s${id++}`, type: "ai", label: `Ask Atom AI about "${q}"`, icon: "Sparkles", score: 80 },
  );

  // Known sites
  for (const site of KNOWN_SITES.items) {
    const score = fuzzyScore(q, site.label);
    if (score > 30) {
      results.push({ id: `s${id++}`, type: "navigate", label: site.label, secondary: site.url, url: site.url, icon: site.icon, score: score + 5 });
    }
  }

  // Bookmarks
  for (const bk of bookmarks) {
    const score = Math.max(fuzzyScore(q, bk.title), fuzzyScore(q, bk.url));
    if (score > 30) {
      results.push({ id: `s${id++}`, type: "navigate", label: bk.title, secondary: bk.url, url: bk.url, icon: "Bookmark", score });
    }
  }

  // Open tabs
  for (const tab of tabs) {
    if (!tab.url) continue;
    const score = Math.max(fuzzyScore(q, tab.title), fuzzyScore(q, tab.url));
    if (score > 30) {
      results.push({ id: `s${id++}`, type: "tabs", label: tab.title || "Tab", secondary: tab.url, url: tab.url, icon: "AppWindow", score });
    }
  }

  // Workflow suggestion
  results.push({ id: `s${id++}`, type: "workflow", label: `Run research workflow: ${q}`, icon: "Workflow", score: 50 });

  results.sort((a, b) => b.score - a.score);

  // Dedupe navigations
  const seen = new Set<string>();
  return results.filter((r) => {
    const key = r.url || r.label;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 10);
}
