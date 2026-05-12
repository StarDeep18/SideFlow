import type { Settings } from '../types/settings';
import type { Workspace } from '../types/workspace';

const KEYS = {
  SETTINGS: 'sideflow_settings',
  WORKSPACES: 'sideflow_workspaces',
  ACTIVE_WORKSPACE: 'sideflow_active_workspace',
} as const;

/**
 * Wrapper around Chrome Storage API with fallback to localStorage
 * for development outside extension context.
 */
export const storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      if (chrome?.storage?.local) {
        const result = await chrome.storage.local.get(key);
        return (result[key] as T) ?? null;
      }
    } catch {
      // Fallback to localStorage
    }
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  },

  async set(key: string, value: unknown): Promise<void> {
    try {
      if (chrome?.storage?.local) {
        await chrome.storage.local.set({ [key]: value });
        return;
      }
    } catch {
      // Fallback to localStorage
    }
    localStorage.setItem(key, JSON.stringify(value));
  },

  async remove(key: string): Promise<void> {
    try {
      if (chrome?.storage?.local) {
        await chrome.storage.local.remove(key);
        return;
      }
    } catch {
      // Fallback
    }
    localStorage.removeItem(key);
  },

  keys: KEYS,
};
