import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Sparkles, Workflow, AppWindow, Clock,
  Globe, Newspaper, Image, Bookmark, Github,
  Mail, AtSign, MessageCircle, Briefcase, BookOpen,
  MessageSquare, ShoppingCart, Tv, Code, Figma,
  Triangle, Play,
} from "lucide-react";
import { spring } from "../../lib/motion";
import { getSuggestions, type Suggestion, type SuggestionType } from "../../lib/search";
import { useBookmarkStore } from "../../stores/bookmarks";

interface OmniboxProps {
  onSubmit: (query: string) => void;
  tabs?: { id: number; title: string; url: string }[];
}

const placeholders = [
  "Search the web, enter a URL, or ask Atom AI",
  "Ask Atom AI anything...",
  "Run a workflow...",
  "Search open tabs...",
];

const modes = [
  { label: "Web", icon: Search },
  { label: "AI", icon: Sparkles },
  { label: "Workflows", icon: Workflow },
  { label: "Tabs", icon: AppWindow },
  { label: "History", icon: Clock },
];

const iconMap: Record<string, React.ElementType> = {
  Search, Globe, Newspaper, Image, Sparkles, Workflow, AppWindow, Bookmark,
  Github, Mail, AtSign, MessageCircle, Briefcase, BookOpen, MessageSquare,
  ShoppingCart, Tv, Code, Figma, Triangle, Play,
};

const typeLabels: Record<SuggestionType, string> = {
  navigate: "Go to",
  search: "Search",
  news: "News",
  images: "Images",
  tabs: "Tab",
  history: "History",
  ai: "Atom AI",
  workflow: "Workflow",
};

export function Omnibox({ onSubmit, tabs = [] }: OmniboxProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [phIdx, setPhIdx] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const bookmarks = useBookmarkStore((s) => s.bookmarks);

  const suggestions = useMemo(
    () => getSuggestions(query, tabs, bookmarks),
    [query, tabs, bookmarks],
  );

  const showDropdown = focused && query.length > 0 && suggestions.length > 0;

  useEffect(() => {
    const id = setInterval(() => setPhIdx((i) => (i + 1) % placeholders.length), 3500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { setActiveIdx(0); }, [query]);

  const selectSuggestion = useCallback((s: Suggestion) => {
    if (s.url) {
      onSubmit(s.url);
    } else if (s.type === "search") {
      onSubmit(query);
    } else if (s.type === "news") {
      onSubmit(`https://news.google.com/search?q=${encodeURIComponent(query)}`);
    } else if (s.type === "images") {
      onSubmit(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`);
    } else if (s.type === "ai") {
      onSubmit(query);
    } else {
      onSubmit(query);
    }
    setQuery("");
  }, [onSubmit, query]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showDropdown) {
      if (e.key === "Enter" && query.trim()) { onSubmit(query.trim()); setQuery(""); }
      return;
    }
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); selectSuggestion(suggestions[activeIdx]); }
    else if (e.key === "Escape") { inputRef.current?.blur(); }
  }, [showDropdown, suggestions, activeIdx, selectSuggestion, query, onSubmit]);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", position: "relative" }}>
      <motion.div
        animate={
          focused
            ? { boxShadow: "0 0 0 2px var(--accent), 0 0 32px var(--glow-soft)" }
            : { boxShadow: "0 0 0 1px var(--border)" }
        }
        transition={spring}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          height: 48,
          borderRadius: showDropdown ? "var(--radius-lg) var(--radius-lg) 0 0" : "var(--radius-lg)",
          background: "var(--bg-surface)",
          overflow: "hidden",
          zIndex: 20,
        }}
      >
        <Search style={{ marginLeft: 18, width: 16, height: 16, color: "var(--text-muted)", flexShrink: 0 }} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={handleKeyDown}
          style={{ flex: 1, height: "100%", background: "transparent", border: "none", outline: "none", padding: "0 14px", fontSize: 14, color: "var(--text-primary)", userSelect: "text" } as React.CSSProperties}
        />
        <AnimatePresence mode="wait">
          {!query && (
            <motion.span
              key={phIdx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 0.35, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              style={{ position: "absolute", left: 44, fontSize: 14, color: "var(--text-muted)", pointerEvents: "none", userSelect: "none" }}
            >
              {placeholders[phIdx]}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Suggestion dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            style={{
              position: "absolute",
              top: 48,
              left: 0,
              right: 0,
              zIndex: 19,
              background: "var(--bg-surface)",
              borderRadius: "0 0 var(--radius-lg) var(--radius-lg)",
              border: "1px solid var(--border)",
              borderTop: "1px solid var(--border-subtle)",
              maxHeight: 360,
              overflowY: "auto",
              boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
              padding: "4px 0",
            }}
          >
            {suggestions.map((s, i) => {
              const Icon = iconMap[s.icon] || Globe;
              const isActive = i === activeIdx;
              return (
                <button
                  key={s.id}
                  onMouseDown={(e) => { e.preventDefault(); selectSuggestion(s); }}
                  onMouseEnter={() => setActiveIdx(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    width: "100%",
                    padding: "10px 16px",
                    background: isActive ? "var(--bg-elevated)" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.1s",
                  }}
                >
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: "var(--radius-sm)",
                    background: isActive ? "var(--accent-soft)" : "var(--bg-elevated)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Icon style={{ width: 14, height: 14, color: isActive ? "var(--accent)" : "var(--text-muted)" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } as React.CSSProperties}>{s.label}</p>
                    {s.secondary && (
                      <p style={{ fontSize: 11, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 1 } as React.CSSProperties}>{s.secondary}</p>
                    )}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 500, color: isActive ? "var(--accent)" : "var(--text-muted)", flexShrink: 0, textTransform: "uppercase" as const, letterSpacing: "0.04em" }}>
                    {typeLabels[s.type]}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mode chips */}
      {!showDropdown && (
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 14 }}>
          {modes.map((mode) => (
            <button
              key={mode.label}
              type="button"
              style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 999, fontSize: 12, fontWeight: 500, color: "var(--text-muted)", background: "transparent", border: "none", cursor: "pointer", transition: "color 0.15s, background 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "var(--bg-elevated)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
            >
              <mode.icon style={{ width: 13, height: 13 }} />
              {mode.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
