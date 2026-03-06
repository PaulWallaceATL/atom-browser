import { useState, useCallback, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { AnimatePresence } from "motion/react";

import TabBar from "./components/chrome/TabBar";
import AddressBar from "./components/chrome/AddressBar";
import BrowserView from "./components/chrome/BrowserView";
import Sidebar from "./components/chrome/Sidebar";
import { Dashboard } from "./components/dashboard/Dashboard";
import { CommandPalette } from "./components/ai/CommandPalette";
import { BookmarkManager } from "./components/bookmarks/BookmarkManager";
import { ConnectorDirectory } from "./components/connectors/ConnectorDirectory";
import { KeychainManager } from "./components/keychain/KeychainManager";
import { ComputerUsePanel } from "./components/computeruse/ComputerUsePanel";
import { SettingsView } from "./components/settings/SettingsView";
import CursorProvider from "./components/cursor/CursorProvider";

interface Tab {
  id: number;
  title: string;
  url: string;
}

type View = "browser" | "bookmarks" | "connectors" | "keychain" | "computeruse" | "settings";

let nextTabId = 2;

function resolveNavigationUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[a-zA-Z0-9]([a-zA-Z0-9-]*\.)+[a-zA-Z]{2,}(\/.*)?$/.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
}

function titleFromUrl(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ""); }
  catch { return "Loading..."; }
}

function showPage(url: string) {
  if (url) {
    invoke("navigate_to", { url }).catch((e) =>
      console.error("navigate_to failed:", e),
    );
  } else {
    invoke("hide_content_view").catch(() => {});
  }
}

export default function App() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 1, title: "New Tab", url: "" },
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [view, setView] = useState<View>("browser");

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const addTab = useCallback(() => {
    const id = nextTabId++;
    setTabs((prev) => [...prev, { id, title: "New Tab", url: "" }]);
    setActiveTabId(id);
    setView("browser");
    showPage("");
  }, []);

  const closeTab = useCallback(
    (id: number) => {
      setTabs((prev) => {
        const filtered = prev.filter((t) => t.id !== id);
        if (filtered.length === 0) {
          const newId = nextTabId++;
          setActiveTabId(newId);
          showPage("");
          return [{ id: newId, title: "New Tab", url: "" }];
        }
        if (activeTabId === id) {
          const next = filtered[filtered.length - 1];
          setActiveTabId(next.id);
          showPage(next.url);
        }
        return filtered;
      });
    },
    [activeTabId],
  );

  const selectTab = useCallback(
    (id: number) => {
      setActiveTabId(id);
      setView("browser");
      const tab = tabs.find((t) => t.id === id);
      showPage(tab?.url ?? "");
    },
    [tabs],
  );

  const navigate = useCallback(
    (input: string) => {
      const url = resolveNavigationUrl(input);
      if (!url) return;

      const title = titleFromUrl(url);
      setTabs((prev) =>
        prev.map((t) => (t.id === activeTabId ? { ...t, url, title } : t)),
      );
      setView("browser");
      showPage(url);
    },
    [activeTabId],
  );

  const handleCommandAction = useCallback(
    (action: { type: string; value: string }) => {
      setCommandPaletteOpen(false);
      if (action.type === "navigate") navigate(action.value);
      else if (action.type === "view") setView(action.value as View);
      else if (action.type === "setting") setView("settings");
    },
    [navigate],
  );

  const showDashboard = view === "browser" && !activeTab.url;

  return (
    <CursorProvider>
      <div className="flex flex-col h-full" style={{ background: "var(--bg-base)" }}>
        <TabBar
          tabs={tabs}
          activeTabId={activeTabId}
          onSelect={selectTab}
          onAdd={addTab}
          onClose={closeTab}
        />
        <AddressBar
          url={activeTab.url}
          onNavigate={navigate}
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 relative overflow-hidden">
            {/* BrowserView always mounts when url exists so the native webview has a host */}
            {view === "browser" && activeTab.url && <BrowserView url={activeTab.url} />}

            {/* Dashboard overlays when no URL */}
            {showDashboard && (
              <div
                className="absolute inset-0 overflow-y-auto"
                style={{ background: "var(--bg-base)", zIndex: 1 }}
              >
                <Dashboard onNavigate={navigate} tabs={tabs} />
              </div>
            )}

            {view === "bookmarks" && (
              <div className="absolute inset-0 overflow-y-auto p-6" style={{ background: "var(--bg-base)", zIndex: 1 }}>
                <BookmarkManager onNavigate={(url: string) => { navigate(url); setView("browser"); }} />
              </div>
            )}

            {view === "connectors" && (
              <div className="absolute inset-0 overflow-y-auto p-6" style={{ background: "var(--bg-base)", zIndex: 1 }}>
                <ConnectorDirectory />
              </div>
            )}

            {view === "keychain" && (
              <div className="absolute inset-0 overflow-y-auto p-6" style={{ background: "var(--bg-base)", zIndex: 1 }}>
                <KeychainManager />
              </div>
            )}

            {view === "computeruse" && (
              <div className="absolute inset-0 overflow-y-auto p-6" style={{ background: "var(--bg-base)", zIndex: 1 }}>
                <ComputerUsePanel />
              </div>
            )}

            {view === "settings" && (
              <div className="absolute inset-0 overflow-hidden" style={{ background: "var(--bg-base)", zIndex: 1 }}>
                <SettingsView />
              </div>
            )}
          </div>

          <AnimatePresence>
            {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} currentUrl={activeTab.url || undefined} />}
          </AnimatePresence>
        </div>

        <CommandPalette
          open={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          onAction={handleCommandAction}
          tabs={tabs}
        />
      </div>
    </CursorProvider>
  );
}
