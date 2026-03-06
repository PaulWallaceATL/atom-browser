import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "dark" | "light" | "auto";

interface ThemeStore {
  theme: Theme;
  resolved: "dark" | "light";
  setTheme: (t: Theme) => void;
}

function resolveTheme(theme: Theme): "dark" | "light" {
  if (theme !== "auto") return theme;
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function applyTheme(resolved: "dark" | "light") {
  document.documentElement.setAttribute("data-theme", resolved);
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, _get) => ({
      theme: "dark",
      resolved: "dark",
      setTheme: (theme) => {
        const resolved = resolveTheme(theme);
        applyTheme(resolved);
        set({ theme, resolved });
      },
    }),
    { name: "atom-theme" },
  ),
);

export function initTheme() {
  const { theme, setTheme } = useThemeStore.getState();
  const resolved = resolveTheme(theme);
  applyTheme(resolved);
  useThemeStore.setState({ resolved });

  if (theme === "auto") {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const handler = () => setTheme("auto");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }
}
