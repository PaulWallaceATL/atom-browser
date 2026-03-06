import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/cn";
import { spring, slideUp } from "../../lib/motion";
import { useThemeStore } from "../../stores/theme";
import { Toggle } from "../ui/Toggle";
import {
  Palette,
  ShieldCheck,
  KeyRound,
  Blocks,
  Info,
  Sun,
  Moon,
  Monitor,
  ExternalLink,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Section = "appearance" | "privacy" | "keychain" | "connectors" | "about";

const navItems: { id: Section; label: string; icon: LucideIcon }[] = [
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "privacy", label: "Privacy", icon: ShieldCheck },
  { id: "keychain", label: "Keychain", icon: KeyRound },
  { id: "connectors", label: "Connectors", icon: Blocks },
  { id: "about", label: "About", icon: Info },
];

/* ─── Appearance ────────────────────────────────────────────────────── */

function AppearanceSettings() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const themes: { id: "dark" | "light" | "auto"; label: string; icon: LucideIcon; accent: string }[] = [
    { id: "dark", label: "Dark", icon: Moon, accent: "from-indigo-600 to-slate-900" },
    { id: "light", label: "Light", icon: Sun, accent: "from-amber-200 to-sky-200" },
    { id: "auto", label: "Auto", icon: Monitor, accent: "from-violet-500 to-fuchsia-500" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-sm font-medium text-primary mb-1">Theme</h3>
        <p className="text-xs text-muted">Choose how Atom looks.</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {themes.map((t) => {
          const active = theme === t.id;
          const Icon = t.icon;
          return (
            <motion.button
              key={t.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={spring}
              onClick={() => setTheme(t.id)}
              className={cn(
                "flex flex-col items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                active
                  ? "border-accent bg-accent-soft shadow-md shadow-glow-soft"
                  : "border-border-subtle bg-glass hover:border-border",
              )}
            >
              <div
                className={cn(
                  "w-full aspect-[4/3] rounded-lg bg-gradient-to-br flex items-center justify-center",
                  t.accent,
                )}
              >
                <Icon className="w-6 h-6 text-white/80" />
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  active ? "text-accent" : "text-secondary",
                )}
              >
                {t.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Privacy ───────────────────────────────────────────────────────── */

function PrivacySettings() {
  const [blockTrackers, setBlockTrackers] = useState(true);
  const [httpsOnly, setHttpsOnly] = useState(true);
  const [doNotTrack, setDoNotTrack] = useState(false);
  const [clearOnClose, setClearOnClose] = useState(false);

  const toggles: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }[] = [
    { label: "Block Trackers", desc: "Prevent cross-site tracking and fingerprinting", value: blockTrackers, onChange: setBlockTrackers },
    { label: "HTTPS-Only Mode", desc: "Automatically upgrade connections to HTTPS", value: httpsOnly, onChange: setHttpsOnly },
    { label: "Do Not Track", desc: "Send DNT header with all requests", value: doNotTrack, onChange: setDoNotTrack },
    { label: "Clear Data on Close", desc: "Erase browsing data when Atom is closed", value: clearOnClose, onChange: setClearOnClose },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-sm font-medium text-primary mb-1">Privacy & Security</h3>
        <p className="text-xs text-muted">Control how Atom handles your data.</p>
      </div>
      <div className="flex flex-col divide-y divide-border-subtle">
        {toggles.map((t) => (
          <div key={t.label} className="flex items-center justify-between py-3.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm text-primary">{t.label}</span>
              <span className="text-xs text-muted">{t.desc}</span>
            </div>
            <Toggle checked={t.value} onChange={t.onChange} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Keychain ──────────────────────────────────────────────────────── */

function KeychainSettings() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-sm font-medium text-primary mb-1">Keychain</h3>
        <p className="text-xs text-muted">
          Manage saved passwords and credentials.
        </p>
      </div>
      <div
        className={cn(
          "flex items-center justify-between p-4 rounded-xl",
          "bg-glass border border-border-subtle",
        )}
      >
        <div className="flex items-center gap-3">
          <KeyRound className="w-5 h-5 text-accent" />
          <div className="flex flex-col gap-0.5">
            <span className="text-sm text-primary">Open Keychain Manager</span>
            <span className="text-xs text-muted">
              View, edit, and delete saved credentials
            </span>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-muted" />
      </div>
    </div>
  );
}

/* ─── Connectors ────────────────────────────────────────────────────── */

function ConnectorSettings() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-sm font-medium text-primary mb-1">Connectors</h3>
        <p className="text-xs text-muted">
          Manage integrations with third-party services.
        </p>
      </div>
      <div
        className={cn(
          "flex items-center justify-between p-4 rounded-xl",
          "bg-glass border border-border-subtle",
        )}
      >
        <div className="flex items-center gap-3">
          <Blocks className="w-5 h-5 text-accent" />
          <div className="flex flex-col gap-0.5">
            <span className="text-sm text-primary">Open Connector Directory</span>
            <span className="text-xs text-muted">
              Browse, connect, and configure services
            </span>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-muted" />
      </div>
    </div>
  );
}

/* ─── About ─────────────────────────────────────────────────────────── */

function AboutSettings() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-sm font-medium text-primary mb-1">About Atom</h3>
        <p className="text-xs text-muted">Browser information and credits.</p>
      </div>
      <div className="flex flex-col gap-4">
        <div
          className={cn(
            "flex flex-col gap-3 p-5 rounded-xl",
            "bg-glass border border-border-subtle",
          )}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <span className="text-base font-bold text-white">A</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-primary">
                Atom Browser
              </span>
              <span className="text-xs text-muted">Version 0.1.0-alpha</span>
            </div>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Atom is an AI-native browser that understands context, connects to
            your tools, and takes action on your behalf. Built with privacy and
            user agency at its core.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-xs text-muted">
          <div className="flex justify-between">
            <span>Engine</span>
            <span className="text-secondary">Chromium (via Tauri/WebView)</span>
          </div>
          <div className="flex justify-between">
            <span>Framework</span>
            <span className="text-secondary">React + Tauri</span>
          </div>
          <div className="flex justify-between">
            <span>License</span>
            <span className="text-secondary">MIT</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Section renderer ──────────────────────────────────────────────── */

const sections: Record<Section, () => JSX.Element> = {
  appearance: AppearanceSettings,
  privacy: PrivacySettings,
  keychain: KeychainSettings,
  connectors: ConnectorSettings,
  about: AboutSettings,
};

/* ─── Main ──────────────────────────────────────────────────────────── */

export function SettingsView() {
  const [active, setActive] = useState<Section>("appearance");
  const ActiveSection = sections[active];

  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex h-full rounded-xl overflow-hidden backdrop-blur-xl bg-glass border border-border-subtle"
    >
      <nav className="w-48 shrink-0 flex flex-col gap-0.5 p-3 border-r border-border-subtle">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              transition={spring}
              onClick={() => setActive(item.id)}
              className={cn(
                "flex items-center gap-2.5 h-9 px-3 rounded-lg text-sm transition-colors cursor-pointer text-left",
                isActive
                  ? "bg-accent-soft text-accent font-medium"
                  : "text-secondary hover:text-primary hover:bg-elevated",
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </motion.button>
          );
        })}
      </nav>

      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
          >
            <ActiveSection />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
