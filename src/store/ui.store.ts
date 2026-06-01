import { create } from "zustand";

interface UIState {
  isSidebarOpen: boolean;
  isMobileNavOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setMobileNavOpen: (open: boolean) => void;
  toggleMobileNav: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isMobileNavOpen: false,
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setMobileNavOpen: (isMobileNavOpen) => set({ isMobileNavOpen }),
  toggleMobileNav: () =>
    set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),
}));
