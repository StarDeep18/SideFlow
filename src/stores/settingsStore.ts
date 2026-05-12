import { create } from 'zustand';
import type { Settings, ThemeId } from '../types/settings';
import { DEFAULT_SETTINGS } from '../types/settings';
import { storage } from '../utils/storage';

interface SettingsState extends Settings {
  setTheme: (theme: ThemeId) => void;
  setSidebarWidth: (width: number) => void;
  setAnimations: (enabled: boolean) => void;
  setAccentColor: (color: string) => void;
  setOnboardingComplete: (complete: boolean) => void;
  toggleShortcutHints: () => void;
  initialize: () => Promise<void>;
  persist: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...DEFAULT_SETTINGS,

  setTheme: (theme: ThemeId) => {
    set({ theme });
    get().persist();
    applyTheme(theme);
  },

  setSidebarWidth: (width: number) => {
    set({ sidebarWidth: width });
    get().persist();
  },

  setAnimations: (enabled: boolean) => {
    set({ animationsEnabled: enabled });
    get().persist();
  },

  setAccentColor: (color: string) => {
    set({ accentColor: color });
    get().persist();
    document.documentElement.style.setProperty('--accent', color);
  },

  setOnboardingComplete: (complete: boolean) => {
    set({ onboardingComplete: complete });
    get().persist();
  },

  toggleShortcutHints: () => {
    set((state) => ({ showShortcutHints: !state.showShortcutHints }));
    get().persist();
  },

  initialize: async () => {
    const saved = await storage.get<Settings>(storage.keys.SETTINGS);
    if (saved) {
      set(saved);
      applyTheme(saved.theme);
      document.documentElement.style.setProperty('--accent', saved.accentColor);
    } else {
      applyTheme(DEFAULT_SETTINGS.theme);
    }
  },

  persist: () => {
    const { setTheme, setSidebarWidth, setAnimations, setAccentColor, setOnboardingComplete, toggleShortcutHints, initialize, persist, ...settings } = get();
    storage.set(storage.keys.SETTINGS, settings);
  },
}));

function applyTheme(theme: ThemeId) {
  document.documentElement.setAttribute('data-theme', theme);
}
