import { useState, useEffect, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { invoke } from "@tauri-apps/api/core";
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Star,
  Shield,
  PanelRightOpen,
  Command,
} from "lucide-react";
import { useBookmarkStore } from "../../stores/bookmarks";

interface AddressBarProps {
  url: string;
  onNavigate: (url: string) => void;
  onToggleSidebar: () => void;
  onOpenCommandPalette?: () => void;
}

const iconBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  borderRadius: "var(--radius-sm)",
  color: "var(--text-muted)",
  background: "none",
  border: "none",
  cursor: "pointer",
  transition: "color 0.15s, background 0.15s",
  flexShrink: 0,
};

export default function AddressBar({ url, onNavigate, onToggleSidebar, onOpenCommandPalette }: AddressBarProps) {
  const [inputValue, setInputValue] = useState(url);
  const [focused, setFocused] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmarkStore();
  const bookmarked = url ? isBookmarked(url) : false;

  useEffect(() => { setInputValue(url); }, [url]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onNavigate(inputValue);
    if (e.key === "Escape") (e.target as HTMLInputElement).blur();
  };

  const goBack = () => invoke("go_back").catch(() => {});
  const goForward = () => invoke("go_forward").catch(() => {});
  const reload = () => invoke("reload_page").catch(() => {});

  const hoverIcon = (e: React.MouseEvent, enter: boolean) => {
    const el = e.currentTarget as HTMLElement;
    el.style.color = enter ? "var(--text-secondary)" : "var(--text-muted)";
    el.style.background = enter ? "var(--bg-elevated)" : "transparent";
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: "var(--toolbar-h)",
        padding: "0 16px",
        gap: 8,
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Left nav group */}
      <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={goBack}
          style={iconBtnStyle}
          title="Back"
          onMouseEnter={(e) => hoverIcon(e, true)}
          onMouseLeave={(e) => hoverIcon(e, false)}
        >
          <ArrowLeft size={15} />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={goForward}
          style={iconBtnStyle}
          title="Forward"
          onMouseEnter={(e) => hoverIcon(e, true)}
          onMouseLeave={(e) => hoverIcon(e, false)}
        >
          <ArrowRight size={15} />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={reload}
          style={iconBtnStyle}
          title="Reload"
          onMouseEnter={(e) => hoverIcon(e, true)}
          onMouseLeave={(e) => hoverIcon(e, false)}
        >
          <RotateCw size={14} />
        </motion.button>
      </div>

      {/* Omnibox */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          height: 34,
          borderRadius: "var(--radius-md)",
          padding: "0 14px",
          gap: 8,
          background: focused ? "var(--bg-elevated)" : "var(--bg-glass)",
          border: `1px solid ${focused ? "var(--accent)" : "var(--border)"}`,
          boxShadow: focused ? "0 0 0 3px var(--glow-soft)" : "none",
          transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
        }}
      >
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search or enter URL"
          spellCheck={false}
          style={{
            flex: 1,
            height: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 13,
            color: "var(--text-primary)",
            userSelect: "text",
          } as React.CSSProperties}
        />
        {!focused && (
          <button
            onClick={onOpenCommandPalette}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              fontSize: 10,
              color: "var(--text-muted)",
              opacity: 0.5,
              background: "none",
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.5"; }}
          >
            <Command size={10} />K
          </button>
        )}
      </div>

      {/* Right action group */}
      <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
        {url && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => toggleBookmark(url, inputValue || url)}
            style={{
              ...iconBtnStyle,
              color: bookmarked ? "var(--accent)" : "var(--text-muted)",
            }}
            title={bookmarked ? "Remove bookmark" : "Bookmark this page"}
            onMouseEnter={(e) => { if (!bookmarked) (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
            onMouseLeave={(e) => { if (!bookmarked) (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
          >
            <Star size={15} fill={bookmarked ? "currentColor" : "none"} />
          </motion.button>
        )}
        <div style={{ ...iconBtnStyle, color: "var(--success)", cursor: "default" }} title="Atom Shield: Active">
          <Shield size={15} />
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onToggleSidebar}
          style={iconBtnStyle}
          title="Toggle Sidebar"
          onMouseEnter={(e) => hoverIcon(e, true)}
          onMouseLeave={(e) => hoverIcon(e, false)}
        >
          <PanelRightOpen size={15} />
        </motion.button>
      </div>
    </div>
  );
}
