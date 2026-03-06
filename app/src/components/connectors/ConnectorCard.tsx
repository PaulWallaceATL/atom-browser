import { motion } from "motion/react";
import { cn } from "../../lib/cn";
import { spring } from "../../lib/motion";
import type { Connector } from "../../stores/connectors";
import {
  Mail,
  Calendar,
  HardDrive,
  MessageSquare,
  BookOpen,
  Users,
  SquareKanban,
  Github,
  Figma,
  Table,
  Box,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ConnectorCardProps {
  connector: Connector;
  onConnect: () => void;
  onDisconnect: () => void;
}

const iconMap: Record<string, LucideIcon> = {
  Mail,
  Calendar,
  HardDrive,
  MessageSquare,
  BookOpen,
  Users,
  SquareKanban,
  Github,
  Figma,
  Table,
};

const categoryLabels: Record<string, string> = {
  email: "Email",
  calendar: "Calendar",
  storage: "Storage",
  chat: "Chat",
  crm: "CRM",
  pm: "Project Mgmt",
  knowledge: "Knowledge",
  dev: "Developer",
  design: "Design",
};

export function ConnectorCard({
  connector,
  onConnect,
  onDisconnect,
}: ConnectorCardProps) {
  const Icon = iconMap[connector.icon] ?? Box;
  const isConnected = connector.status === "connected";

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4, boxShadow: "0 0 24px var(--glow-soft)" }}
      transition={spring}
      className={cn(
        "flex flex-col gap-3 p-4 rounded-xl",
        "backdrop-blur-xl bg-glass border border-border-subtle",
        "hover:border-border transition-colors cursor-pointer",
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            isConnected
              ? "bg-accent-soft text-accent"
              : "bg-elevated text-muted",
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              isConnected ? "bg-success" : "bg-muted/40",
            )}
          />
          <span className="text-[10px] text-muted">
            {isConnected ? "Connected" : "Available"}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-primary">
          {connector.name}
        </span>
        <span
          className={cn(
            "inline-flex self-start items-center h-5 px-2 rounded-full",
            "text-[10px] font-medium bg-elevated text-secondary border border-border-subtle",
          )}
        >
          {categoryLabels[connector.category] ?? connector.category}
        </span>
      </div>

      <p className="text-xs text-muted leading-relaxed line-clamp-2">
        {connector.description}
      </p>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={spring}
        onClick={(e) => {
          e.stopPropagation();
          isConnected ? onDisconnect() : onConnect();
        }}
        className={cn(
          "mt-auto h-8 rounded-lg text-xs font-medium transition-colors cursor-pointer",
          isConnected
            ? "bg-elevated text-secondary border border-border-subtle hover:text-error hover:border-error/40"
            : "bg-accent text-base hover:bg-accent-hover shadow-md",
        )}
      >
        {isConnected ? "Disconnect" : "Connect"}
      </motion.button>
    </motion.div>
  );
}
