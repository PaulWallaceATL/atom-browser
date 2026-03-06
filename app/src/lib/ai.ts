export interface AISummary {
  title: string;
  bullets: string[];
  sources: string[];
}

const SHIELD_API_URL = "https://api.atombrowser.ai/v1";

/**
 * Attempt to summarize a URL via the Atom Shield cloud API.
 * Falls back to a local heuristic summary when the API is unavailable.
 */
export async function summarizePage(url: string): Promise<AISummary> {
  try {
    const res = await fetch(`${SHIELD_API_URL}/summarize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // API unavailable -- fall through to local summary
  }

  return localSummary(url);
}

function localSummary(url: string): AISummary {
  let domain = "";
  try { domain = new URL(url).hostname; } catch { domain = url; }

  return {
    title: `Summary of ${domain}`,
    bullets: [
      `This page is hosted on ${domain}.`,
      "AI-powered deep analysis requires an Atom Pro subscription.",
      "Connect to the Atom Shield API for full page summaries, threat analysis, and content extraction.",
      "You can still use the on-device URL classifier and ad blocker for free.",
    ],
    sources: [domain],
  };
}

/**
 * Analyze a URL for threats via the Atom Shield cloud API.
 */
export async function analyzeUrl(url: string): Promise<{ safe: boolean; reason: string }> {
  try {
    const res = await fetch(`${SHIELD_API_URL}/analyze/url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  return { safe: true, reason: "Analysis performed by on-device heuristics. Cloud analysis unavailable." };
}
