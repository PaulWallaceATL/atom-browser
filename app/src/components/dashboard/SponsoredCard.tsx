import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

export function SponsoredCard() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        style={{
          borderRadius: "var(--radius-md)",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          padding: "18px 20px",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 500, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>Sponsored</span>
          <button onClick={() => setDismissed(true)} style={{ cursor: "pointer", color: "var(--text-muted)", background: "none", border: "none" }}>
            <X style={{ width: 13, height: 13 }} />
          </button>
        </div>
        <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>Arc Max for Teams</p>
        <p style={{ fontSize: 11, marginTop: 4, lineHeight: 1.5, color: "var(--text-muted)" }}>
          AI workspace for teams. Free for up to 10 users.
        </p>
        <button
          style={{
            marginTop: 12,
            width: "100%",
            height: 32,
            borderRadius: "var(--radius-sm)",
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
            background: "var(--bg-elevated)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-subtle)",
            transition: "border-color 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; }}
        >
          Learn more
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
