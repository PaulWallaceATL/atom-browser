import { create } from "zustand";

export type SessionStatus = "idle" | "active" | "paused" | "completed";
export type ActionStatus = "pending" | "running" | "done" | "denied" | "error";

export interface AgentAction {
  id: string;
  description: string;
  status: ActionStatus;
  sensitive: boolean;
  confidence: number;
  timestamp: number;
  detail?: string;
}

interface ComputerUseStore {
  status: SessionStatus;
  task: string;
  actions: AgentAction[];
  startSession: (task: string) => void;
  endSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  addAction: (a: Omit<AgentAction, "id" | "timestamp">) => void;
  updateAction: (id: string, status: ActionStatus) => void;
}

let _id = 0;
const uid = () => `act_${Date.now()}_${++_id}`;

export const useComputerUseStore = create<ComputerUseStore>()((set) => ({
  status: "idle",
  task: "",
  actions: [],
  startSession: (task) =>
    set({ status: "active", task, actions: [] }),
  endSession: () =>
    set({ status: "completed" }),
  pauseSession: () =>
    set({ status: "paused" }),
  resumeSession: () =>
    set({ status: "active" }),
  addAction: (a) =>
    set((s) => ({
      actions: [...s.actions, { ...a, id: uid(), timestamp: Date.now() }],
    })),
  updateAction: (id, status) =>
    set((s) => ({
      actions: s.actions.map((a) => (a.id === id ? { ...a, status } : a)),
    })),
}));
