import React from 'react';
import { useSettingsStore } from '../../../stores/settingsStore';
import type { ThemeId } from '../../../types/settings';
import './Settings.css';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const THEMES: { id: ThemeId; name: string; preview: string[] }[] = [
  { id: 'dark', name: 'Dark', preview: ['#0F0F14', '#16161D', '#6366F1'] },
  { id: 'midnight', name: 'Midnight', preview: ['#0A0E1A', '#0F1526', '#6366F1'] },
  { id: 'nord', name: 'Nord', preview: ['#2E3440', '#3B4252', '#88C0D0'] },
  { id: 'oled', name: 'OLED Black', preview: ['#000000', '#0A0A0A', '#6366F1'] },
];

const ACCENT_COLORS = [
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
];

export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const {
    theme,
    setTheme,
    accentColor,
    setAccentColor,
    animationsEnabled,
    setAnimations,
    showShortcutHints,
    toggleShortcutHints,
  } = useSettingsStore();

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div
        className="settings-panel animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="settings-header">
          <h2 className="settings-title">Settings</h2>
          <button className="settings-close" onClick={onClose} aria-label="Close settings">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="settings-content">
          {/* Theme Section */}
          <section className="settings-section">
            <h3 className="settings-section-title">Theme</h3>
            <div className="settings-themes">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  className={`settings-theme-card ${theme === t.id ? 'settings-theme-card--active' : ''}`}
                  onClick={() => setTheme(t.id)}
                >
                  <div className="settings-theme-preview">
                    {t.preview.map((color, i) => (
                      <div
                        key={i}
                        className="settings-theme-swatch"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="settings-theme-name">{t.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Accent Color */}
          <section className="settings-section">
            <h3 className="settings-section-title">Accent Color</h3>
            <div className="settings-accents">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color}
                  className={`settings-accent-btn ${accentColor === color ? 'settings-accent-btn--active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setAccentColor(color)}
                  aria-label={`Set accent color to ${color}`}
                />
              ))}
            </div>
          </section>

          {/* Toggles */}
          <section className="settings-section">
            <h3 className="settings-section-title">Preferences</h3>

            <label className="settings-toggle">
              <span className="settings-toggle-label">Animations</span>
              <div className="settings-switch-wrapper">
                <input
                  type="checkbox"
                  checked={animationsEnabled}
                  onChange={(e) => setAnimations(e.target.checked)}
                  className="settings-switch-input"
                />
                <span className="settings-switch" />
              </div>
            </label>

            <label className="settings-toggle">
              <span className="settings-toggle-label">Shortcut hints</span>
              <div className="settings-switch-wrapper">
                <input
                  type="checkbox"
                  checked={showShortcutHints}
                  onChange={() => toggleShortcutHints()}
                  className="settings-switch-input"
                />
                <span className="settings-switch" />
              </div>
            </label>
          </section>

          {/* About */}
          <section className="settings-section settings-about">
            <div className="settings-about-row">
              <span className="settings-about-label">Version</span>
              <span className="settings-about-value">1.0.0</span>
            </div>
            <div className="settings-about-row">
              <span className="settings-about-label">Built with</span>
              <span className="settings-about-value">⚡ SideFlow</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
