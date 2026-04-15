import { create } from "zustand";

export type DrawerMode = "add" | "update";

interface UiState {
  isDrawerOpen: boolean;
  drawerMode: DrawerMode;
  openAddDrawer: () => void;
  openUpdateDrawer: () => void;
  closeDrawer: () => void;
}

export const useUiStore = create<UiState>(set => ({
  isDrawerOpen: false,
  drawerMode: "add",
  openAddDrawer: () => set({ isDrawerOpen: true, drawerMode: "add" }),
  openUpdateDrawer: () => set({ isDrawerOpen: true, drawerMode: "update" }),
  closeDrawer: () => set({ isDrawerOpen: false }),
}));
