import { create } from 'zustand';
import type { Workspace } from '../types/workspace';
import { DEFAULT_WORKSPACES } from '../types/workspace';
import { storage } from '../utils/storage';

interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspaceId: string;

  switchWorkspace: (id: string) => void;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  setActiveAppForWorkspace: (workspaceId: string, appId: string) => void;
  getActiveWorkspace: () => Workspace;
  initialize: () => Promise<void>;
  persist: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: DEFAULT_WORKSPACES,
  activeWorkspaceId: 'work',

  switchWorkspace: (id: string) => {
    set({ activeWorkspaceId: id });
    storage.set(storage.keys.ACTIVE_WORKSPACE, id);
  },

  updateWorkspace: (id: string, updates: Partial<Workspace>) => {
    set((state) => {
      const updated = state.workspaces.map((w) =>
        w.id === id ? { ...w, ...updates } : w
      );
      storage.set(storage.keys.WORKSPACES, updated);
      return { workspaces: updated };
    });
  },

  setActiveAppForWorkspace: (workspaceId: string, appId: string) => {
    set((state) => {
      const updated = state.workspaces.map((w) =>
        w.id === workspaceId ? { ...w, activeAppId: appId } : w
      );
      storage.set(storage.keys.WORKSPACES, updated);
      return { workspaces: updated };
    });
  },

  getActiveWorkspace: () => {
    const state = get();
    return (
      state.workspaces.find((w) => w.id === state.activeWorkspaceId) ??
      state.workspaces[0]
    );
  },

  initialize: async () => {
    const [savedWorkspaces, savedActiveId] = await Promise.all([
      storage.get<Workspace[]>(storage.keys.WORKSPACES),
      storage.get<string>(storage.keys.ACTIVE_WORKSPACE),
    ]);

    if (savedWorkspaces && savedWorkspaces.length > 0) {
      set({ workspaces: savedWorkspaces });
    }
    if (savedActiveId) {
      set({ activeWorkspaceId: savedActiveId });
    }
  },

  persist: () => {
    const state = get();
    storage.set(storage.keys.WORKSPACES, state.workspaces);
    storage.set(storage.keys.ACTIVE_WORKSPACE, state.activeWorkspaceId);
  },
}));
