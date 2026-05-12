import React, { useState } from 'react';
import { useAppStore } from '../../../stores/appStore';
import { useWorkspaceStore } from '../../../stores/workspaceStore';
import { useSettingsStore } from '../../../stores/settingsStore';
import type { SideFlowApp } from '../../../types/app';
import './AppDock.css';

interface AppDockProps {
  onSettingsClick?: () => void;
}

export const AppDock: React.FC<AppDockProps> = ({ onSettingsClick }) => {
  const { apps, activeAppId, setActiveApp } = useAppStore();
  const { getActiveWorkspace, setActiveAppForWorkspace } = useWorkspaceStore();
  const { showShortcutHints } = useSettingsStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const workspace = getActiveWorkspace();
  const visibleApps = apps.filter((app) => workspace.appIds.includes(app.id));

  const handleAppClick = (app: SideFlowApp) => {
    setActiveApp(app.id);
    setActiveAppForWorkspace(workspace.id, app.id);
  };

  return (
    <nav className="app-dock" role="navigation" aria-label="App dock">
      <div className="dock-apps">
        {visibleApps.map((app, index) => {
          const isActive = activeAppId === app.id;
          const isHovered = hoveredId === app.id;

          return (
            <button
              key={app.id}
              className={`dock-app ${isActive ? 'dock-app--active' : ''}`}
              onClick={() => handleAppClick(app)}
              onMouseEnter={() => setHoveredId(app.id)}
              onMouseLeave={() => setHoveredId(null)}
              title={app.name}
              aria-label={`Open ${app.name}`}
              aria-pressed={isActive}
              id={`dock-app-${app.id}`}
            >
              {/* Active indicator line */}
              <span
                className={`dock-indicator ${isActive ? 'dock-indicator--active' : ''}`}
                style={{ backgroundColor: isActive ? app.color : 'transparent' }}
              />

              {/* App icon */}
              <span className="dock-icon" style={{ 
                '--app-color': app.color,
                '--app-color-dim': `${app.color}22`,
              } as React.CSSProperties}>
                {app.icon}
              </span>

              {/* Tooltip */}
              {isHovered && (
                <span className="dock-tooltip animate-scale-in">
                  {app.name}
                  {showShortcutHints && app.shortcutIndex && (
                    <kbd className="dock-shortcut">Alt+{app.shortcutIndex}</kbd>
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Separator */}
      <div className="dock-separator" />

      {/* Settings button */}
      <button
        className="dock-app dock-app--settings"
        title="Settings"
        aria-label="Open settings"
        id="dock-settings"
        onClick={onSettingsClick}
      >
        <span className="dock-icon dock-icon--settings">⚙️</span>
      </button>
    </nav>
  );
};
