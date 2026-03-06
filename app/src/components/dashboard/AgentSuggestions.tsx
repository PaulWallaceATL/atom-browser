import { type ElementType } from "react";
import { motion } from "motion/react";
import { Mail, Columns3, Calendar, Search } from "lucide-react";
import { spring } from "../../lib/motion";

interface Action {
  icon: ElementType;
  label: string;
  hint: string;
}

const actions: Action[] = [
  { icon: Mail, label: "Summarize inbox", hint: "3 unread" },
  { icon: Columns3, label: "Compare tabs", hint: "2 open" },
  { icon: Calendar, label: "Review meetings", hint: "Next at 1 PM" },
  { icon: Search, label: "Continue research", hint: "Quantum computing" },
];

export function AgentSuggestions() {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
      {actions.map((a) => (
        <motion.button
          key={a.label}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          transition={spring}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            borderRadius: "var(--radius-md)",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            cursor: "pointer",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          data-hover="glow"
          onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--accent)"; el.style.boxShadow = "0 0 16px var(--glow-soft)"; }}
          onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--border-subtle)"; el.style.boxShadow = "none"; }}
        >
          <a.icon style={{ width: 15, height: 15, color: "var(--accent)", flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{a.label}</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>· {a.hint}</span>
        </motion.button>
      ))}
    </div>
  );
}
