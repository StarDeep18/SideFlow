import { create } from 'zustand';
import type { SideFlowApp } from '../types/app';
import { DEFAULT_APPS } from '../types/app';
import { storage } from '../utils/storage';

interface AppState {
  apps: SideFlowApp[];
  activeAppId: string | null;
  isLoading: boolean;

  setActiveApp: (id: string) => void;
  addCustomApp: (app: SideFlowApp) => void;
  removeApp: (id: string) => void;
  reorderApps: (appIds: string[]) => void;
  getAppById: (id: string) => SideFlowApp | undefined;
  getAppByShortcutIndex: (index: number) => SideFlowApp | undefined;
  initialize: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  apps: DEFAULT_APPS,
  activeAppId: null,
  isLoading: false,

  setActiveApp: (id: string) => {
    set({ activeAppId: id });
  },

  addCustomApp: (app: SideFlowApp) => {
    set((state) => {
      const updated = [...state.apps, app];
      storage.set('sideflow_apps', updated);
      return { apps: updated };
    });
  },

  removeApp: (id: string) => {
    set((state) => {
      const updated = state.apps.filter((a) => a.id !== id);
      storage.set('sideflow_apps', updated);
      return {
        apps: updated,
        activeAppId: state.activeAppId === id ? null : state.activeAppId,
      };
    });
  },

  reorderApps: (appIds: string[]) => {
    set((state) => {
      const appMap = new Map(state.apps.map((a) => [a.id, a]));
      const reordered = appIds
        .map((id) => appMap.get(id))
        .filter(Boolean) as SideFlowApp[];
      storage.set('sideflow_apps', reordered);
      return { apps: reordered };
    });
  },

  getAppById: (id: string) => {
    return get().apps.find((a) => a.id === id);
  },

  getAppByShortcutIndex: (index: number) => {
    return get().apps.find((a) => a.shortcutIndex === index);
  },

  initialize: async () => {
    const saved = await storage.get<SideFlowApp[]>('sideflow_apps');
    if (saved && saved.length > 0) {
      set({ apps: saved });
    }
  },
}));
