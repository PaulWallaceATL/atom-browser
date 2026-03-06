import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  folder: string;
  createdAt: number;
}

export interface Favorite {
  id: string;
  url: string;
  title: string;
  icon?: string;
  order: number;
}

interface BookmarkStore {
  bookmarks: Bookmark[];
  favorites: Favorite[];
  addBookmark: (b: Omit<Bookmark, "id" | "createdAt">) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (url: string) => boolean;
  toggleBookmark: (url: string, title: string) => void;
  addFavorite: (f: Omit<Favorite, "id" | "order">) => void;
  removeFavorite: (id: string) => void;
  reorderFavorites: (ids: string[]) => void;
}

let _id = 0;
const uid = () => `bk_${Date.now()}_${++_id}`;

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      favorites: [
        { id: "fav_1", url: "https://google.com", title: "Google", order: 0 },
        { id: "fav_2", url: "https://github.com", title: "GitHub", order: 1 },
        { id: "fav_3", url: "https://youtube.com", title: "YouTube", order: 2 },
        { id: "fav_4", url: "https://mail.google.com", title: "Gmail", order: 3 },
        { id: "fav_5", url: "https://notion.so", title: "Notion", order: 4 },
        { id: "fav_6", url: "https://x.com", title: "X", order: 5 },
        { id: "fav_7", url: "https://reddit.com", title: "Reddit", order: 6 },
        { id: "fav_8", url: "https://linkedin.com", title: "LinkedIn", order: 7 },
      ],
      addBookmark: (b) =>
        set((s) => ({
          bookmarks: [...s.bookmarks, { ...b, id: uid(), createdAt: Date.now() }],
        })),
      removeBookmark: (id) =>
        set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.id !== id) })),
      isBookmarked: (url) => get().bookmarks.some((b) => b.url === url),
      toggleBookmark: (url, title) => {
        const s = get();
        const existing = s.bookmarks.find((b) => b.url === url);
        if (existing) {
          set({ bookmarks: s.bookmarks.filter((b) => b.id !== existing.id) });
        } else {
          set({
            bookmarks: [
              ...s.bookmarks,
              { id: uid(), url, title, folder: "Unsorted", createdAt: Date.now() },
            ],
          });
        }
      },
      addFavorite: (f) =>
        set((s) => ({
          favorites: [...s.favorites, { ...f, id: uid(), order: s.favorites.length }],
        })),
      removeFavorite: (id) =>
        set((s) => ({ favorites: s.favorites.filter((f) => f.id !== id) })),
      reorderFavorites: (ids) =>
        set((s) => ({
          favorites: ids
            .map((id, i) => {
              const f = s.favorites.find((x) => x.id === id);
              return f ? { ...f, order: i } : null;
            })
            .filter(Boolean) as Favorite[],
        })),
    }),
    { name: "atom-bookmarks" },
  ),
);
