import { motion } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";
import { spring } from "../../lib/motion";

const bullets = [
  "3 unread emails — 1 flagged urgent",
  "2 meetings today, next at 1 PM",
  "4 new results for your quantum research",
];

export function AIBriefing() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        borderRadius: "var(--radius-md)",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        overflow: "hidden",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      whileHover={{
        borderColor: "var(--accent)",
        boxShadow: "0 0 20px var(--glow-soft)",
      }}
      data-hover="glow"
    >
      <div style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Sparkles style={{ width: 15, height: 15, color: "var(--accent)" }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Your Briefing</span>
        </div>

        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {bullets.map((b) => (
            <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, lineHeight: 1.55, color: "var(--text-secondary)" }}>
              <span style={{ marginTop: 6, display: "block", width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
              {b}
            </li>
          ))}
        </ul>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={spring}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginTop: 14,
            fontSize: 11,
            fontWeight: 500,
            color: "var(--text-muted)",
            background: "none",
            border: "none",
            cursor: "pointer",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
        >
          <ArrowRight style={{ width: 13, height: 13 }} />
          Open briefing
        </motion.button>
      </div>
    </motion.div>
  );
}
