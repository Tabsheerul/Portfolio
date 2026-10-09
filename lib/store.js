import { create } from 'zustand';

export const useAppStore = create((set) => ({
  // Loading state
  isLoading: true,
  loadingProgress: 0,
  setIsLoading: (val) => set({ isLoading: val }),
  setLoadingProgress: (val) => set({ loadingProgress: val }),
  
  // Cursor state
  cursorVariant: 'default',
  cursorText: '',
  setCursorVariant: (variant) => set({ cursorVariant: variant }),
  setCursorText: (text) => set({ cursorText: text }),
  
  // Navigation state
  isMenuOpen: false,
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  closeMenu: () => set({ isMenuOpen: false }),
  
  // Scroll state
  scrollDirection: 'down',
  isScrolled: false,
  setScrollDirection: (dir) => set({ scrollDirection: dir }),
  setIsScrolled: (val) => set({ isScrolled: val }),
}));
