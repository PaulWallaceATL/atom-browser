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

// Tauri uses -webkit-app-region for window drag zones.
// React's CSSProperties doesn't include vendor-prefixed drag properties,
// so we extend it to avoid type errors.
type DragCSSProperties = CSSProperties & Record<string, unknown>;

const containerStyle: DragCSSProperties = {
  display: "flex",
  alignItems: "center",
  height: "var(--tab-height)",
  background: "var(--bg-secondary)",
  borderBottom: "1px solid var(--border)",
  paddingLeft: 8,
  WebkitAppRegion: "drag",
};

const tabStyle = (active: boolean): DragCSSProperties => ({
  display: "flex",
  alignItems: "center",
  gap: 6,
  height: 28,
  padding: "0 12px",
  borderRadius: "var(--radius-sm)",
  background: active ? "var(--bg-tertiary)" : "transparent",
  color: active ? "var(--text-primary)" : "var(--text-secondary)",
  fontSize: 12,
  cursor: "pointer",
  whiteSpace: "nowrap",
  overflow: "hidden",
  maxWidth: 180,
  WebkitAppRegion: "no-drag",
});

const closeBtnStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 16,
  height: 16,
  borderRadius: 4,
  fontSize: 14,
  lineHeight: 1,
  color: "var(--text-muted)",
};

const addBtnStyle: DragCSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  borderRadius: "var(--radius-sm)",
  fontSize: 18,
  color: "var(--text-secondary)",
  WebkitAppRegion: "no-drag",
};

export default function TabBar({
  tabs,
  activeTabId,
  onSelect,
  onAdd,
  onClose,
}: TabBarProps) {
  return (
    <div style={containerStyle}>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          style={tabStyle(tab.id === activeTabId)}
          onClick={() => onSelect(tab.id)}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            {tab.title}
          </span>
          <button
            style={closeBtnStyle}
            onClick={(e) => {
              e.stopPropagation();
              onClose(tab.id);
            }}
          >
            &times;
          </button>
        </div>
      ))}
      <button style={addBtnStyle} onClick={onAdd}>
        +
      </button>
    </div>
  );
}
