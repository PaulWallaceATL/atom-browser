import { useState, type CSSProperties } from "react";

interface SettingToggleProps {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

const containerStyle: CSSProperties = {
  padding: 24,
  maxWidth: 600,
  margin: "0 auto",
};

const sectionStyle: CSSProperties = {
  marginBottom: 32,
};

const headingStyle: CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
  marginBottom: 16,
  color: "var(--text-primary)",
};

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 0",
  borderBottom: "1px solid var(--border)",
};

const toggleTrackStyle = (on: boolean): CSSProperties => ({
  width: 36,
  height: 20,
  borderRadius: 10,
  background: on ? "var(--accent)" : "var(--bg-tertiary)",
  position: "relative",
  cursor: "pointer",
  transition: "background 0.2s",
  flexShrink: 0,
});

const toggleKnobStyle = (on: boolean): CSSProperties => ({
  position: "absolute",
  top: 2,
  left: on ? 18 : 2,
  width: 16,
  height: 16,
  borderRadius: "50%",
  background: "var(--text-primary)",
  transition: "left 0.2s",
});

function SettingToggle({ label, description, enabled, onChange }: SettingToggleProps) {
  return (
    <div style={rowStyle}>
      <div style={{ marginRight: 16 }}>
        <div style={{ fontWeight: 500, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
          {description}
        </div>
      </div>
      <div
        style={toggleTrackStyle(enabled)}
        onClick={() => onChange(!enabled)}
        role="switch"
        aria-checked={enabled}
      >
        <div style={toggleKnobStyle(enabled)} />
      </div>
    </div>
  );
}

export default function Settings() {
  const [adBlock, setAdBlock] = useState(true);
  const [trackerBlock, setTrackerBlock] = useState(true);
  const [httpsOnly, setHttpsOnly] = useState(false);
  const [atomNet, setAtomNet] = useState(false);

  return (
    <div style={containerStyle}>
      <div style={sectionStyle}>
        <div style={headingStyle}>Privacy & Security</div>
        <SettingToggle
          label="Ad Blocking"
          description="Block ads using EasyList and community filter lists"
          enabled={adBlock}
          onChange={setAdBlock}
        />
        <SettingToggle
          label="Tracker Protection"
          description="Block known trackers using EasyPrivacy lists"
          enabled={trackerBlock}
          onChange={setTrackerBlock}
        />
        <SettingToggle
          label="HTTPS-Only Mode"
          description="Automatically upgrade connections to HTTPS when possible"
          enabled={httpsOnly}
          onChange={setHttpsOnly}
        />
      </div>

      <div style={sectionStyle}>
        <div style={headingStyle}>AtomNet</div>
        <SettingToggle
          label="Enable AtomNet"
          description="Route traffic through the anonymity network for enhanced privacy"
          enabled={atomNet}
          onChange={setAtomNet}
        />
      </div>

      <div style={sectionStyle}>
        <div style={headingStyle}>Atom Shield (Pro)</div>
        <div
          style={{
            padding: 16,
            background: "var(--bg-tertiary)",
            borderRadius: "var(--radius-md)",
            color: "var(--text-secondary)",
          }}
        >
          Upgrade to Atom Pro to unlock AI-powered phishing detection,
          malicious script analysis, and the AI Privacy Assistant.
        </div>
      </div>
    </div>
  );
}
