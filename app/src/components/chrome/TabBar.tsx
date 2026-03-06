import { motion, AnimatePresence } from "motion/react";
import { Plus, X } from "lucide-react";
import { cn } from "../../lib/cn";
import { spring } from "../../lib/motion";
import type { CSSProperties } from "react";

interface Tab {
  id: number;
  title: string;
  url: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTabId: number;
  onSelect: (id: number) => void;
  onAdd: () => void;
  onClose: (id: number) => void;
}

type DragStyle = CSSProperties & Record<string, unknown>;
const dragStyle: DragStyle = { WebkitAppRegion: "drag" };
const noDragStyle: DragStyle = { WebkitAppRegion: "no-drag" };

export default function TabBar({ tabs, activeTabId, onSelect, onAdd, onClose }: TabBarProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: "var(--tab-h)",
        padding: "0 16px",
        gap: 6,
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-subtle)",
        ...dragStyle,
      }}
    >
      {/* macOS traffic light spacer */}
      <div style={{ width: 68, flexShrink: 0 }} />

      {/* Tab strip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flex: 1,
          overflow: "hidden",
        }}
      >
        <AnimatePresence mode="popLayout">
          {tabs.map((tab) => {
            const active = tab.id === activeTabId;
            return (
              <motion.div
                key={tab.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92, width: 0 }}
                transition={spring}
                onClick={() => onSelect(tab.id)}
                className={cn(
                  "group relative flex items-center shrink-0 cursor-pointer transition-colors duration-150",
                  active ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                )}
                style={{
                  height: 30,
                  padding: "0 14px",
                  borderRadius: "var(--radius-sm)",
                  maxWidth: 200,
                  background: active ? "var(--bg-elevated)" : "transparent",
                  ...noDragStyle,
                } as React.CSSProperties}
              >
                {active && (
                  <motion.div
                    layoutId="tab-indicator"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 10,
                      right: 10,
                      height: 2,
                      borderRadius: 1,
                      background: "var(--accent)",
                    }}
                    transition={spring}
                  />
                )}
                <span style={{ fontSize: 12, lineHeight: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", userSelect: "none" }}>
                  {tab.title || "New Tab"}
                </span>
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={(e) => { e.stopPropagation(); onClose(tab.id); }}
                  style={{
                    marginLeft: 8,
                    padding: 2,
                    borderRadius: 3,
                    color: "var(--text-muted)",
                    opacity: 0,
                    transition: "opacity 0.15s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  className="group-hover:!opacity-100"
                >
                  <X size={11} />
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* New tab button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={onAdd}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 28,
          height: 28,
          borderRadius: "var(--radius-sm)",
          color: "var(--text-muted)",
          background: "transparent",
          border: "1px solid var(--border-subtle)",
          cursor: "pointer",
          flexShrink: 0,
          transition: "color 0.15s, border-color 0.15s",
          ...noDragStyle,
        } as React.CSSProperties}
        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "var(--border)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border-subtle)"; }}
      >
        <Plus size={13} />
      </motion.button>
    </div>
  );
}
