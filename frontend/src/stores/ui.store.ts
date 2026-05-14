import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  searchOpen: boolean
  commandOpen: boolean
  setSidebarOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
  setCommandOpen: (open: boolean) => void
  toggleSidebar: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  searchOpen: false,
  commandOpen: false,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setCommandOpen: (open) => set({ commandOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))
