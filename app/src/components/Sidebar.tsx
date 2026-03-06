import type { CSSProperties } from "react";

interface SidebarProps {
  onClose: () => void;
}

const containerStyle: CSSProperties = {
  width: "var(--sidebar-width)",
  minWidth: "var(--sidebar-width)",
  height: "100%",
  background: "var(--bg-secondary)",
  borderLeft: "1px solid var(--border)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 16px",
  borderBottom: "1px solid var(--border)",
  fontWeight: 600,
  fontSize: 14,
};

const contentStyle: CSSProperties = {
  flex: 1,
  padding: 16,
  overflowY: "auto",
  color: "var(--text-secondary)",
  fontSize: 13,
  lineHeight: 1.6,
};

const sectionStyle: CSSProperties = {
  marginBottom: 20,
};

const sectionTitleStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "var(--text-muted)",
  marginBottom: 8,
};

export default function Sidebar({ onClose }: SidebarProps) {
  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <span>Atom Shield</span>
        <button
          onClick={onClose}
          style={{
            fontSize: 18,
            color: "var(--text-muted)",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
      </div>
      <div style={contentStyle}>
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>AI Privacy Assistant</div>
          <div>
            Ask questions about the current page's privacy policy,
            trackers, or security posture. Available with Atom Pro.
          </div>
        </div>
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Shield Status</div>
          <div style={{ color: "var(--success)" }}>
            &#x2713; Ad blocking active
          </div>
          <div style={{ color: "var(--success)" }}>
            &#x2713; Tracker protection active
          </div>
          <div style={{ color: "var(--text-muted)" }}>
            &#x25CB; AtomNet disconnected
          </div>
        </div>
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Page Security</div>
          <div>Navigate to a page to see its threat analysis.</div>
        </div>
      </div>
    </div>
  );
}
