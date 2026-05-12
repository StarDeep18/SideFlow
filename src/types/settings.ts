export type ThemeId = 'dark' | 'midnight' | 'nord' | 'oled';

export interface Settings {
  theme: ThemeId;
  sidebarWidth: number;
  animationsEnabled: boolean;
  showShortcutHints: boolean;
  autoHideSidebar: boolean;
  accentColor: string;
  onboardingComplete: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  sidebarWidth: 420,
  animationsEnabled: true,
  showShortcutHints: true,
  autoHideSidebar: false,
  accentColor: '#6366F1',
  onboardingComplete: false,
};
