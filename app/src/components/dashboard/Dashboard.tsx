import { motion } from "motion/react";
import { BrandWordmark } from "./BrandWordmark";
import { Omnibox } from "./Omnibox";
import { QuickAccess } from "./QuickAccess";
import { AgentSuggestions } from "./AgentSuggestions";
import { AIBriefing } from "./AIBriefing";
import { TopStories } from "./TopStories";
import { SponsoredCard } from "./SponsoredCard";

interface DashboardProps {
  onNavigate: (url: string) => void;
  tabs?: { id: number; title: string; url: string }[];
}

export function Dashboard({ onNavigate, tabs = [] }: DashboardProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 860,
          padding: "0 40px",
          paddingTop: "6vh",
          paddingBottom: 80,
        }}
      >
        {/* Brand Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <BrandWordmark />
        </motion.div>

        {/* Hero: Omnibox */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
        >
          <Omnibox onSubmit={(query) => onNavigate(query)} tabs={tabs} />
        </motion.div>

        {/* Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          style={{ marginTop: 44 }}
        >
          <QuickAccess onNavigate={onNavigate} />
        </motion.div>

        {/* Recommended Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
          style={{ marginTop: 36 }}
        >
          <AgentSuggestions />
        </motion.div>

        {/* Lower: Stories + Briefing side by side */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          style={{
            marginTop: 40,
            display: "grid",
            gridTemplateColumns: "1fr 280px",
            gap: 32,
            alignItems: "start",
          }}
        >
          <TopStories onNavigate={onNavigate} />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <AIBriefing />
            <SponsoredCard />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
