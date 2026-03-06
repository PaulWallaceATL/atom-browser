import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/cn";
import {
  fadeIn,
  staggerContainer,
  staggerItem,
  spring,
  springGentle,
} from "../../lib/motion";
import {
  X,
  Sparkles,
  CheckSquare,
  Square,
  ArrowRight,
  Send,
  Building2,
  User,
  MapPin,
  Calendar,
  Search as SearchIcon,
  Save,
} from "lucide-react";

interface GenerativePanelProps {
  open: boolean;
  onClose: () => void;
}

const slideFromRight = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: springGentle },
  exit: { x: "100%", opacity: 0, transition: { duration: 0.2 } },
};

interface CheckItem {
  id: string;
  label: string;
  checked: boolean;
}

const DEMO_CHECKLIST: CheckItem[] = [
  { id: "c1", label: "Review AI-generated summary for accuracy", checked: true },
  { id: "c2", label: "Verify entity extraction results", checked: false },
  { id: "c3", label: "Export findings to workspace", checked: false },
];

const DEMO_TABLE = {
  headers: ["Feature", "GPT-4o", "Claude 3.5"],
  rows: [
    ["Context window", "128K tokens", "200K tokens"],
    ["Multimodal", "Yes", "Yes"],
    ["Tool use", "Functions", "Native"],
  ],
};

const DEMO_ENTITIES = [
  { icon: <Building2 size={12} />, label: "Company", value: "OpenAI" },
  { icon: <User size={12} />, label: "Person", value: "Sam Altman" },
  { icon: <MapPin size={12} />, label: "Location", value: "San Francisco" },
  { icon: <Calendar size={12} />, label: "Date", value: "March 2026" },
];

export function GenerativePanel({ open, onClose }: GenerativePanelProps) {
  const [checklist, setChecklist] = useState(DEMO_CHECKLIST);
  const [followUp, setFollowUp] = useState("");

  function toggleCheck(id: string) {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
          />

          <motion.aside
            variants={slideFromRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 z-50 h-full w-[400px] max-w-[90vw] flex flex-col backdrop-blur-xl bg-glass border-l border-border-subtle shadow-2xl shadow-black/30"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-accent" />
                <h2 className="text-sm font-medium text-primary">Atom AI</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={spring}
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-elevated transition-colors cursor-pointer"
              >
                <X size={16} />
              </motion.button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 space-y-6">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {/* Checklist */}
                <motion.section variants={staggerItem}>
                  <SectionLabel>Checklist</SectionLabel>
                  <div className="space-y-1">
                    {checklist.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-left hover:bg-elevated/60 transition-colors cursor-pointer"
                      >
                        {item.checked ? (
                          <CheckSquare
                            size={15}
                            className="text-accent shrink-0"
                          />
                        ) : (
                          <Square
                            size={15}
                            className="text-muted shrink-0"
                          />
                        )}
                        <span
                          className={cn(
                            item.checked && "line-through text-muted",
                            !item.checked && "text-secondary",
                          )}
                        >
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.section>

                {/* Comparison Table */}
                <motion.section variants={staggerItem} className="mt-6">
                  <SectionLabel>Comparison</SectionLabel>
                  <div className="rounded-lg border border-border-subtle overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-elevated/50">
                          {DEMO_TABLE.headers.map((h) => (
                            <th
                              key={h}
                              className="px-3 py-2 text-left font-medium text-muted"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {DEMO_TABLE.rows.map((row, i) => (
                          <tr
                            key={i}
                            className="border-t border-border-subtle"
                          >
                            {row.map((cell, j) => (
                              <td
                                key={j}
                                className={cn(
                                  "px-3 py-2",
                                  j === 0
                                    ? "font-medium text-primary"
                                    : "text-secondary",
                                )}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.section>

                {/* Entity Extraction */}
                <motion.section variants={staggerItem} className="mt-6">
                  <SectionLabel>Extracted Entities</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    {DEMO_ENTITIES.map((entity) => (
                      <span
                        key={entity.value}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs"
                      >
                        <span className="text-accent">{entity.icon}</span>
                        <span className="text-muted">{entity.label}:</span>
                        <span className="text-primary font-medium">
                          {entity.value}
                        </span>
                      </span>
                    ))}
                  </div>
                </motion.section>

                {/* Action Cards */}
                <motion.section variants={staggerItem} className="mt-6">
                  <SectionLabel>Actions</SectionLabel>
                  <div className="grid gap-2">
                    <ActionCard
                      icon={<SearchIcon size={14} />}
                      title="Research further"
                      description="Deep-dive into related topics"
                    />
                    <ActionCard
                      icon={<Save size={14} />}
                      title="Save to notes"
                      description="Export this analysis to your workspace"
                    />
                  </div>
                </motion.section>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-border-subtle shrink-0">
              <div className="flex items-center gap-2 rounded-lg bg-elevated/60 border border-border-subtle px-3 py-2 focus-within:border-accent focus-within:shadow-[0_0_0_3px_var(--glow-soft)] transition-all">
                <input
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  placeholder="Ask a follow-up…"
                  className="flex-1 bg-transparent text-sm text-primary placeholder:text-muted outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={spring}
                  className={cn(
                    "p-1 rounded-md transition-colors cursor-pointer",
                    followUp
                      ? "text-accent hover:bg-accent/10"
                      : "text-muted",
                  )}
                >
                  <Send size={14} />
                </motion.button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-medium text-muted uppercase tracking-wider mb-2">
      {children}
    </h3>
  );
}

function ActionCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.button
      whileHover={{
        scale: 1.01,
        boxShadow: "0 0 16px var(--glow-soft)",
      }}
      whileTap={{ scale: 0.98 }}
      transition={spring}
      className="flex items-center gap-3 w-full p-3 rounded-lg bg-elevated/40 border border-border-subtle text-left hover:border-accent/30 transition-colors cursor-pointer group"
    >
      <span className="p-2 rounded-md bg-accent/10 text-accent">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-primary">{title}</p>
        <p className="text-xs text-muted truncate">{description}</p>
      </div>
      <ArrowRight
        size={14}
        className="text-muted group-hover:text-accent transition-colors shrink-0"
      />
    </motion.button>
  );
}
