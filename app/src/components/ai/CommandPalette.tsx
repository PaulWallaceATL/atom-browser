import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/cn";
import {
  scaleIn,
  fadeIn,
  staggerContainer,
  staggerItem,
} from "../../lib/motion";
import {
  Search,
  Sparkles,
  Brain,
  Tags,
  Eye,
  Shield,
  Plug,
  KeyRound,
  Bookmark,
  Monitor,
  Globe,
  Command,
} from "lucide-react";

interface Tab {
  id: number;
  title: string;
  url: string;
}

interface Action {
  type: string;
  value: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onAction: (action: Action) => void;
  tabs: Tab[];
}

interface CommandItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  section: string;
  action: Action;
}

const ICON_SIZE = 16;

function buildItems(tabs: Tab[]): CommandItem[] {
  const tabItems: CommandItem[] = tabs.map((t) => ({
    id: `tab-${t.id}`,
    icon: <Globe size={ICON_SIZE} />,
    label: t.title || t.url,
    section: "Tabs",
    action: { type: "switch-tab", value: String(t.id) },
  }));

  const aiActions: CommandItem[] = [
    {
      id: "ai-summarize",
      icon: <Sparkles size={ICON_SIZE} />,
      label: "Summarize page",
      shortcut: "⌘⇧S",
      section: "Actions",
      action: { type: "ai", value: "summarize" },
    },
    {
      id: "ai-explain",
      icon: <Brain size={ICON_SIZE} />,
      label: "Explain page",
      shortcut: "⌘⇧E",
      section: "Actions",
      action: { type: "ai", value: "explain" },
    },
    {
      id: "ai-extract",
      icon: <Tags size={ICON_SIZE} />,
      label: "Extract entities",
      shortcut: "⌘⇧X",
      section: "Actions",
      action: { type: "ai", value: "extract" },
    },
  ];

  const settingsItems: CommandItem[] = [
    {
      id: "set-appearance",
      icon: <Eye size={ICON_SIZE} />,
      label: "Appearance",
      section: "Settings",
      action: { type: "settings", value: "appearance" },
    },
    {
      id: "set-privacy",
      icon: <Shield size={ICON_SIZE} />,
      label: "Privacy",
      section: "Settings",
      action: { type: "settings", value: "privacy" },
    },
    {
      id: "set-connectors",
      icon: <Plug size={ICON_SIZE} />,
      label: "Connectors",
      section: "Settings",
      action: { type: "settings", value: "connectors" },
    },
    {
      id: "set-keychain",
      icon: <KeyRound size={ICON_SIZE} />,
      label: "Keychain",
      section: "Settings",
      action: { type: "settings", value: "keychain" },
    },
  ];

  const navItems: CommandItem[] = [
    {
      id: "nav-bookmarks",
      icon: <Bookmark size={ICON_SIZE} />,
      label: "Bookmarks",
      shortcut: "⌘B",
      section: "Navigation",
      action: { type: "navigate", value: "bookmarks" },
    },
    {
      id: "nav-connectors",
      icon: <Plug size={ICON_SIZE} />,
      label: "Connectors",
      section: "Navigation",
      action: { type: "navigate", value: "connectors" },
    },
    {
      id: "nav-computer-use",
      icon: <Monitor size={ICON_SIZE} />,
      label: "Computer Use",
      section: "Navigation",
      action: { type: "navigate", value: "computer-use" },
    },
  ];

  return [...tabItems, ...aiActions, ...settingsItems, ...navItems];
}

const sectionOrder = ["Tabs", "Actions", "Settings", "Navigation"];

export function CommandPalette({
  open,
  onClose,
  onAction,
  tabs,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const allItems = useMemo(() => buildItems(tabs), [tabs]);

  const filtered = useMemo(() => {
    if (!query) return allItems;
    const q = query.toLowerCase();
    return allItems.filter((item) => item.label.toLowerCase().includes(q));
  }, [query, allItems]);

  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of filtered) {
      const list = map.get(item.section) ?? [];
      list.push(item);
      map.set(item.section, list);
    }
    return sectionOrder
      .filter((s) => map.has(s))
      .map((s) => ({ section: s, items: map.get(s)! }));
  }, [filtered]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const select = useCallback(
    (item: CommandItem) => {
      onAction(item.action);
      onClose();
    },
    [onAction, onClose],
  );

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[activeIndex]) select(filtered[activeIndex]);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, filtered, activeIndex, onClose, select]);

  useEffect(() => {
    if (!listRef.current) return;
    const active = listRef.current.querySelector("[data-active='true']");
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  let flatIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[18vh]"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 max-w-lg w-full mx-4 backdrop-blur-xl bg-glass rounded-xl border border-border-subtle shadow-2xl shadow-black/40 overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle">
              <Search size={16} className="text-muted shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands…"
                className="flex-1 bg-transparent text-sm text-primary placeholder:text-muted outline-none"
              />
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-elevated text-[10px] text-muted border border-border-subtle">
                <Command size={10} /> K
              </kbd>
            </div>

            <div
              ref={listRef}
              className="max-h-[360px] overflow-y-auto overscroll-contain py-2"
            >
              {filtered.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-muted">
                  No results for &ldquo;{query}&rdquo;
                </div>
              )}

              {grouped.map((group) => (
                <motion.div
                  key={group.section}
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="px-4 pt-3 pb-1.5">
                    <span className="text-[11px] font-medium text-muted uppercase tracking-wider">
                      {group.section}
                    </span>
                  </div>
                  {group.items.map((item) => {
                    flatIndex++;
                    const isActive = flatIndex === activeIndex;
                    const idx = flatIndex;
                    return (
                      <motion.button
                        key={item.id}
                        variants={staggerItem}
                        data-active={isActive}
                        onClick={() => select(item)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={cn(
                          "flex items-center gap-3 w-full px-4 py-2 text-left text-sm transition-colors cursor-pointer",
                          isActive
                            ? "bg-accent/10 text-primary"
                            : "text-secondary hover:text-primary",
                        )}
                      >
                        <span
                          className={cn(
                            "shrink-0",
                            isActive ? "text-accent" : "text-muted",
                          )}
                        >
                          {item.icon}
                        </span>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.shortcut && (
                          <span className="ml-auto text-[11px] text-muted font-mono">
                            {item.shortcut}
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </motion.div>
              ))}
            </div>

            <div className="px-4 py-2 border-t border-border-subtle flex items-center gap-4 text-[11px] text-muted">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-px rounded bg-elevated border border-border-subtle">
                  ↑↓
                </kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-px rounded bg-elevated border border-border-subtle">
                  ↵
                </kbd>
                Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-px rounded bg-elevated border border-border-subtle">
                  esc
                </kbd>
                Close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
