import { useState, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/cn";
import { slideUp, staggerContainer, staggerItem, spring } from "../../lib/motion";
import { useConnectorStore, type ConnectorCategory } from "../../stores/connectors";
import { ConnectorCard } from "./ConnectorCard";
import { Blocks } from "lucide-react";
import { connectConnector, disconnectConnector } from "../../lib/connectors";

type FilterTab = "all" | ConnectorCategory;

const tabs: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "email", label: "Email" },
  { id: "calendar", label: "Calendar" },
  { id: "storage", label: "Storage" },
  { id: "chat", label: "Chat" },
  { id: "crm", label: "CRM" },
  { id: "pm", label: "Projects" },
  { id: "knowledge", label: "Knowledge" },
  { id: "dev", label: "Dev" },
  { id: "design", label: "Design" },
];

export function ConnectorDirectory() {
  const connectors = useConnectorStore((s) => s.connectors);
  const storeConnect = useConnectorStore((s) => s.connect);
  const storeDisconnect = useConnectorStore((s) => s.disconnect);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = useCallback(async (id: string) => {
    setConnecting(id);
    const success = await connectConnector(id);
    if (success) storeConnect(id);
    setConnecting(null);
  }, [storeConnect]);

  const handleDisconnect = useCallback(async (id: string) => {
    await disconnectConnector(id);
    storeDisconnect(id);
  }, [storeDisconnect]);

  const filtered = useMemo(
    () =>
      activeTab === "all"
        ? connectors
        : connectors.filter((c) => c.category === activeTab),
    [connectors, activeTab],
  );

  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col h-full gap-5"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <Blocks className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-primary">Connectors</h2>
        </div>
        <p className="text-xs text-muted">
          Integrate services so Atom can act on your behalf — read emails, manage
          files, update tasks, and more.
        </p>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-1 -mb-1 scrollbar-none">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={spring}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "h-7 px-3 rounded-full text-xs font-medium whitespace-nowrap",
              "transition-colors cursor-pointer",
              activeTab === tab.id
                ? "bg-accent text-base"
                : "text-muted hover:text-primary hover:bg-elevated",
            )}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        key={activeTab}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto flex-1 pr-1"
      >
        {filtered.map((connector) => (
          <motion.div key={connector.id} variants={staggerItem}>
            <ConnectorCard
              connector={connecting === connector.id ? { ...connector, status: "available" as const } : connector}
              onConnect={() => handleConnect(connector.id)}
              onDisconnect={() => handleDisconnect(connector.id)}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
