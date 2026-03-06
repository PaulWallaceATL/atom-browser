import { create } from "zustand";

export type ConnectorCategory =
  | "email"
  | "calendar"
  | "storage"
  | "chat"
  | "crm"
  | "pm"
  | "knowledge"
  | "dev"
  | "design";

export type ConnectorStatus = "available" | "connected" | "error";

export interface Connector {
  id: string;
  name: string;
  icon: string;
  category: ConnectorCategory;
  description: string;
  status: ConnectorStatus;
  permissions: string[];
  tools: string[];
  lastUsed?: number;
}

interface ConnectorStore {
  connectors: Connector[];
  connect: (id: string) => void;
  disconnect: (id: string) => void;
  getByCategory: (cat: ConnectorCategory) => Connector[];
}

const INITIAL_CONNECTORS: Connector[] = [
  { id: "gmail", name: "Gmail", icon: "Mail", category: "email", description: "Read, send, and manage email", status: "available", permissions: ["Read emails", "Send emails", "Manage labels"], tools: ["Search emails", "Draft reply", "Summarize inbox"] },
  { id: "gcal", name: "Google Calendar", icon: "Calendar", category: "calendar", description: "View and manage calendar events", status: "available", permissions: ["Read events", "Create events"], tools: ["List events", "Schedule meeting", "Check availability"] },
  { id: "gdrive", name: "Google Drive", icon: "HardDrive", category: "storage", description: "Access and manage files", status: "available", permissions: ["Read files", "Upload files"], tools: ["Search files", "Share document", "Create folder"] },
  { id: "slack", name: "Slack", icon: "MessageSquare", category: "chat", description: "Send messages and manage channels", status: "available", permissions: ["Read messages", "Send messages"], tools: ["Send message", "Search conversations", "List channels"] },
  { id: "notion", name: "Notion", icon: "BookOpen", category: "knowledge", description: "Access workspaces and pages", status: "available", permissions: ["Read pages", "Create pages"], tools: ["Search pages", "Create document", "Update database"] },
  { id: "hubspot", name: "HubSpot", icon: "Users", category: "crm", description: "Manage contacts and deals", status: "available", permissions: ["Read contacts", "Update deals"], tools: ["Search contacts", "Log activity", "Update deal stage"] },
  { id: "linear", name: "Linear", icon: "SquareKanban", category: "pm", description: "Manage issues and projects", status: "available", permissions: ["Read issues", "Create issues"], tools: ["Create issue", "Update status", "List projects"] },
  { id: "github", name: "GitHub", icon: "Github", category: "dev", description: "Manage repos and pull requests", status: "available", permissions: ["Read repos", "Create PRs"], tools: ["Search code", "Create PR", "Review changes"] },
  { id: "figma", name: "Figma", icon: "Figma", category: "design", description: "Access design files and components", status: "available", permissions: ["Read files", "Export assets"], tools: ["Search designs", "Export component", "View prototype"] },
  { id: "airtable", name: "Airtable", icon: "Table", category: "knowledge", description: "Access bases and records", status: "available", permissions: ["Read records", "Create records"], tools: ["Query records", "Create entry", "Update field"] },
];

export const useConnectorStore = create<ConnectorStore>()((set, get) => ({
  connectors: INITIAL_CONNECTORS,
  connect: (id) =>
    set((s) => ({
      connectors: s.connectors.map((c) =>
        c.id === id ? { ...c, status: "connected" as const, lastUsed: Date.now() } : c,
      ),
    })),
  disconnect: (id) =>
    set((s) => ({
      connectors: s.connectors.map((c) =>
        c.id === id ? { ...c, status: "available" as const } : c,
      ),
    })),
  getByCategory: (cat) => get().connectors.filter((c) => c.category === cat),
}));
