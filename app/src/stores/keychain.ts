import { create } from "zustand";
import { load as loadStore } from "@tauri-apps/plugin-store";

export interface Credential {
  id: string;
  domain: string;
  username: string;
  password: string;
  lastUsed: number;
  createdAt: number;
}

interface KeychainStore {
  credentials: Credential[];
  loaded: boolean;
  loadCredentials: () => Promise<void>;
  addCredential: (c: Omit<Credential, "id" | "createdAt" | "lastUsed">) => Promise<void>;
  updateCredential: (id: string, updates: Partial<Credential>) => Promise<void>;
  removeCredential: (id: string) => Promise<void>;
  findByDomain: (domain: string) => Credential[];
}

let _id = 0;
const uid = () => `cred_${Date.now()}_${++_id}`;

const STORE_FILE = "atom-keychain.json";

async function persistCredentials(credentials: Credential[]) {
  try {
    const store = await loadStore(STORE_FILE);
    await store.set("credentials", credentials);
    await store.save();
  } catch {
    // Tauri store unavailable (e.g., running in browser for dev) --
    // fall back to localStorage
    localStorage.setItem("atom-keychain-fallback", JSON.stringify(credentials));
  }
}

async function readCredentials(): Promise<Credential[]> {
  try {
    const store = await loadStore(STORE_FILE);
    const data = await store.get<Credential[]>("credentials");
    return data ?? [];
  } catch {
    try {
      const raw = localStorage.getItem("atom-keychain-fallback");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}

export const useKeychainStore = create<KeychainStore>()((set, get) => ({
  credentials: [],
  loaded: false,

  loadCredentials: async () => {
    const credentials = await readCredentials();
    set({ credentials, loaded: true });
  },

  addCredential: async (c) => {
    const entry: Credential = { ...c, id: uid(), createdAt: Date.now(), lastUsed: Date.now() };
    const next = [...get().credentials, entry];
    set({ credentials: next });
    await persistCredentials(next);
  },

  updateCredential: async (id, updates) => {
    const next = get().credentials.map((c) => (c.id === id ? { ...c, ...updates } : c));
    set({ credentials: next });
    await persistCredentials(next);
  },

  removeCredential: async (id) => {
    const next = get().credentials.filter((c) => c.id !== id);
    set({ credentials: next });
    await persistCredentials(next);
  },

  findByDomain: (domain) => get().credentials.filter((c) => c.domain.includes(domain)),
}));
