import { create } from 'zustand';

interface UIState {
  showNewGameModal: boolean;
  showLoadGameModal: boolean;
  showSettingsModal: boolean;
  showHamburgerMenu: boolean;
  setShowNewGameModal: (show: boolean) => void;
  setShowLoadGameModal: (show: boolean) => void;
  setShowSettingsModal: (show: boolean) => void;
  setShowHamburgerMenu: (show: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  showNewGameModal: false,
  showLoadGameModal: false,
  showSettingsModal: false,
  showHamburgerMenu: false,
  setShowNewGameModal: (show) => set({ showNewGameModal: show }),
  setShowLoadGameModal: (show) => set({ showLoadGameModal: show }),
  setShowSettingsModal: (show) => set({ showSettingsModal: show }),
  setShowHamburgerMenu: (show) => set({ showHamburgerMenu: show }),
}));
