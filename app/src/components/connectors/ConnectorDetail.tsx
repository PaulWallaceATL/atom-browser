import { motion } from "motion/react";
import { cn } from "../../lib/cn";
import { spring, slideUp } from "../../lib/motion";
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
  Check,
  Wrench,
  X,
  Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ConnectorDetailProps {
  connector: Connector;
  onClose: () => void;
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

export function ConnectorDetail({
  connector,
  onClose,
  onConnect,
  onDisconnect,
}: ConnectorDetailProps) {
  const Icon = iconMap[connector.icon] ?? Box;
  const isConnected = connector.status === "connected";

  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        "flex flex-col gap-6 p-6 rounded-xl",
        "backdrop-blur-xl bg-glass border border-border-subtle",
        "shadow-lg shadow-glow-soft",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              isConnected
                ? "bg-accent-soft text-accent"
                : "bg-elevated text-muted",
            )}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-base font-semibold text-primary">
              {connector.name}
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  isConnected ? "bg-success" : "bg-muted/40",
                )}
              />
              <span className="text-xs text-muted">
                {isConnected ? "Connected" : "Available"}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-md text-muted hover:text-primary hover:bg-elevated transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-sm text-secondary leading-relaxed">
        {connector.description}
      </p>

      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium text-muted uppercase tracking-wider">
          Permissions
        </span>
        <div className="flex flex-col gap-2">
          {connector.permissions.map((perm) => (
            <div key={perm} className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-accent shrink-0" />
              <span className="text-sm text-secondary">{perm}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium text-muted uppercase tracking-wider">
          Available Tools
        </span>
        <div className="flex flex-wrap gap-2">
          {connector.tools.map((tool) => (
            <span
              key={tool}
              className={cn(
                "inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg",
                "text-xs bg-elevated text-secondary border border-border-subtle",
              )}
            >
              <Wrench className="w-3 h-3 text-muted" />
              {tool}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted uppercase tracking-wider">
          Recent Activity
        </span>
        <div className="flex items-center gap-2 py-4 text-muted">
          <Clock className="w-4 h-4 opacity-40" />
          <span className="text-xs">No recent activity</span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={spring}
        onClick={isConnected ? onDisconnect : onConnect}
        className={cn(
          "h-10 rounded-xl text-sm font-medium transition-colors cursor-pointer",
          isConnected
            ? "bg-elevated text-secondary border border-border-subtle hover:text-error hover:border-error/40"
            : "bg-accent text-base hover:bg-accent-hover shadow-md hover:shadow-lg hover:shadow-glow-soft",
        )}
      >
        {isConnected ? "Disconnect" : "Connect"}
      </motion.button>
    </motion.div>
  );
}
