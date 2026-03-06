import { useState, useCallback } from "react";
import { motion } from "motion/react";
import {
  X, Sparkles, Shield, Bookmark, Send, Loader2,
  FileText, Users, ShoppingBag, ListChecks, Save,
  CheckCircle, Circle, Bot,
} from "lucide-react";
import { summarizePage, type AISummary } from "../../lib/ai";
import { useBookmarkStore } from "../../stores/bookmarks";

interface SidebarProps {
  onClose: () => void;
  currentUrl?: string;
}

type Mode = "ai" | "shield" | "saved";

const quickActions = [
  { icon: FileText, label: "Summarize page" },
  { icon: ListChecks, label: "Extract key points" },
  { icon: Users, label: "Find contacts" },
  { icon: ShoppingBag, label: "Compare products" },
  { icon: Save, label: "Save to notes" },
];

export default function Sidebar({ onClose, currentUrl }: SidebarProps) {
  const [mode, setMode] = useState<Mode>("ai");

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 340, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        flexShrink: 0,
        background: "var(--bg-surface)",
        borderLeft: "1px solid var(--border)",
      }}
    >
      {/* Header */}
      <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles style={{ width: 16, height: 16, color: "var(--accent)" }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Atom AI</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "var(--radius-sm)", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", transition: "color 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--bg-elevated)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
          >
            <X size={15} />
          </motion.button>
        </div>

        {/* Mode segmented control */}
        <div style={{ display: "flex", gap: 2, padding: 3, borderRadius: "var(--radius-md)", background: "var(--bg-elevated)" }}>
          {([
            { id: "ai" as Mode, icon: Sparkles, label: "Assistant" },
            { id: "shield" as Mode, icon: Shield, label: "Shield" },
            { id: "saved" as Mode, icon: Bookmark, label: "Saved" },
          ]).map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                padding: "6px 0",
                borderRadius: 7,
                fontSize: 11,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s",
                background: mode === m.id ? "var(--bg-surface)" : "transparent",
                color: mode === m.id ? "var(--text-primary)" : "var(--text-muted)",
                border: "none",
                boxShadow: mode === m.id ? "0 1px 3px rgba(0,0,0,0.3)" : "none",
              }}
            >
              <m.icon style={{ width: 12, height: 12 }} />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {mode === "ai" && <AIPanel currentUrl={currentUrl} />}
        {mode === "shield" && <ShieldPanel />}
        {mode === "saved" && <SavedPanel />}
      </div>
    </motion.div>
  );
}

function AIPanel({ currentUrl }: { currentUrl?: string }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<AISummary | null>(null);

  const handleSummarize = useCallback(async () => {
    if (!currentUrl) return;
    setLoading(true);
    const result = await summarizePage(currentUrl);
    setSummary(result);
    setLoading(false);
  }, [currentUrl]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        {currentUrl ? (
          <div>
            {/* Context card */}
            <div style={{ padding: "12px 14px", borderRadius: "var(--radius-md)", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>Current page</p>
              <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } as React.CSSProperties}>{currentUrl}</p>
            </div>

            {/* Quick actions */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {quickActions.map((a) => (
                <button
                  key={a.label}
                  onClick={a.label === "Summarize page" ? handleSummarize : undefined}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "6px 10px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: 11,
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                    background: "transparent",
                    border: "1px solid var(--border-subtle)",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                >
                  <a.icon style={{ width: 12, height: 12 }} />
                  {a.label}
                </button>
              ))}
            </div>

            {/* Loading / result */}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 0", color: "var(--text-muted)", fontSize: 12 }}>
                <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                Analyzing page...
              </div>
            )}

            {summary && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ padding: "14px 16px", borderRadius: "var(--radius-md)", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
              >
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 10 }}>{summary.title}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {summary.bullets.map((b, i) => (
                    <li key={i} style={{ display: "flex", gap: 8, fontSize: 12, lineHeight: 1.5, color: "var(--text-secondary)" }}>
                      <span style={{ marginTop: 5, width: 4, height: 4, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
                      {b}
                    </li>
                  ))}
                </ul>
                {summary.sources.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                    {summary.sources.map((s) => (
                      <span key={s} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "var(--bg-glass)", color: "var(--text-muted)", border: "1px solid var(--border-subtle)" }}>{s}</span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        ) : (
          /* Empty state */
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: "40px 20px" }}>
            <Bot style={{ width: 32, height: 32, color: "var(--text-muted)", marginBottom: 16, opacity: 0.4 }} />
            <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>No page loaded</p>
            <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, maxWidth: 220 }}>
              Navigate to a page to summarize, extract, or ask questions about its content.
            </p>
          </div>
        )}
      </div>

      {/* Composer - pinned to bottom */}
      <div style={{ padding: "12px 16px 16px", borderTop: "1px solid var(--border-subtle)" }}>
        <form
          onSubmit={(e) => { e.preventDefault(); if (currentUrl) handleSummarize(); }}
          style={{ display: "flex", gap: 8, alignItems: "center" }}
        >
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            height: 36,
            borderRadius: "var(--radius-md)",
            padding: "0 12px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-subtle)",
            transition: "border-color 0.15s",
          }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about this page..."
              style={{ flex: 1, height: "100%", background: "transparent", border: "none", outline: "none", fontSize: 12, color: "var(--text-primary)" }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "var(--radius-md)",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Send size={14} />
          </motion.button>
        </form>
      </div>
    </div>
  );
}

function ShieldPanel() {
  const items = [
    { label: "Ad blocking active", ok: true },
    { label: "Tracker protection active", ok: true },
    { label: "HTTPS connection verified", ok: true },
    { label: "AtomNet disconnected", ok: false },
  ];
  return (
    <div style={{ padding: "16px 20px" }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", marginBottom: 14 }}>Security Status</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: item.ok ? "var(--success)" : "var(--text-muted)" }}>
            {item.ok ? <CheckCircle size={14} /> : <Circle size={14} />}
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function SavedPanel() {
  const { bookmarks } = useBookmarkStore();
  return (
    <div style={{ padding: "16px 20px" }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", marginBottom: 14 }}>Saved Pages</p>
      {bookmarks.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 16px" }}>
          <Bookmark style={{ width: 24, height: 24, color: "var(--text-muted)", margin: "0 auto 12px", opacity: 0.4 }} />
          <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
            No bookmarks yet. Click the star in the address bar to save pages.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {bookmarks.slice(0, 20).map((b) => (
            <button
              key={b.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 10px",
                borderRadius: "var(--radius-sm)",
                fontSize: 12,
                color: "var(--text-secondary)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.15s",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-elevated)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <Bookmark style={{ width: 13, height: 13, color: "var(--text-muted)", flexShrink: 0 }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } as React.CSSProperties}>{b.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
