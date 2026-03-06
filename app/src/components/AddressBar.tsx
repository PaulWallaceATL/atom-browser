import { useState, useEffect, type CSSProperties, type KeyboardEvent } from "react";

interface AddressBarProps {
  url: string;
  onNavigate: (url: string) => void;
  onToggleSidebar: () => void;
}

const containerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  height: "var(--toolbar-height)",
  padding: "0 10px",
  background: "var(--bg-secondary)",
  borderBottom: "1px solid var(--border)",
};

const navBtnStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 30,
  height: 30,
  borderRadius: "var(--radius-sm)",
  fontSize: 16,
  color: "var(--text-secondary)",
};

const inputStyle: CSSProperties = {
  flex: 1,
  height: 30,
  padding: "0 12px",
  borderRadius: "var(--radius-lg)",
  border: "1px solid var(--border)",
  background: "var(--bg-tertiary)",
  color: "var(--text-primary)",
  fontSize: 13,
};

const shieldStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 30,
  height: 30,
  borderRadius: "var(--radius-sm)",
  fontSize: 14,
  color: "var(--success)",
};

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.includes(".") && !trimmed.includes(" ")) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export default function AddressBar({
  url,
  onNavigate,
  onToggleSidebar,
}: AddressBarProps) {
  const [inputValue, setInputValue] = useState(url);

  useEffect(() => {
    setInputValue(url);
  }, [url]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onNavigate(normalizeUrl(inputValue));
    }
  };

  return (
    <div style={containerStyle}>
      <button style={navBtnStyle} title="Back">
        &#8592;
      </button>
      <button style={navBtnStyle} title="Forward">
        &#8594;
      </button>
      <button style={navBtnStyle} title="Reload">
        &#8635;
      </button>

      <input
        style={inputStyle}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search or enter URL"
        spellCheck={false}
      />

      <span style={shieldStyle} title="Atom Shield: Active">
        &#x1F6E1;
      </span>

      <button style={navBtnStyle} onClick={onToggleSidebar} title="Toggle Sidebar">
        &#9776;
      </button>
    </div>
  );
}
