"use client";

import { create } from "zustand";

type ToastKind = "success" | "error" | "info";

type ToastItem = {
  id: string;
  title: string;
  kind: ToastKind;
};

type ToastStore = {
  items: ToastItem[];
  push: (title: string, kind?: ToastKind) => void;
  remove: (id: string) => void;
};

export const useToast = create<ToastStore>((set) => ({
  items: [],
  push: (title, kind = "info") =>
    set((state) => ({
      items: [...state.items, { id: crypto.randomUUID(), title, kind }]
    })),
  remove: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id)
    }))
}));
