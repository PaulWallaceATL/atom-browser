import type { CSSProperties } from "react";

interface BrowserViewProps {
  url: string;
}

const containerStyle: CSSProperties = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "var(--bg-primary)",
  color: "var(--text-muted)",
  fontSize: 14,
};

/**
 * Background layer beneath the native Tauri webview.
 *
 * When a URL is active, the Rust backend creates a native child webview
 * that overlays this div and renders the actual web page. This component
 * only shows the "new tab" landing page when no URL is set.
 */
export default function BrowserView({ url }: BrowserViewProps) {
  if (url) {
    return <div id="browser-view" style={containerStyle} />;
  }

  return (
    <div style={containerStyle}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>&#9883;</div>
        <div style={{ fontSize: 20, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>
          Atom Browser
        </div>
        <div>Enter a URL or search to get started</div>
      </div>
    </div>
  );
}
