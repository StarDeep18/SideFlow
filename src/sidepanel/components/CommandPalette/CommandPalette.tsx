import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useAppStore } from '../../../stores/appStore';
import { useWorkspaceStore } from '../../../stores/workspaceStore';
import { useSettingsStore } from '../../../stores/settingsStore';
import type { ThemeId } from '../../../types/settings';
import './CommandPalette.css';

interface Command {
  id: string;
  label: string;
  category: 'app' | 'workspace' | 'action' | 'theme';
  icon: string;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { apps, setActiveApp } = useAppStore();
  const { workspaces, switchWorkspace, getActiveWorkspace } = useWorkspaceStore();
  const { setTheme } = useSettingsStore();
  const workspace = getActiveWorkspace();

  // Build command list
  const commands = useMemo<Command[]>(() => {
    const cmds: Command[] = [];

    // App commands
    const visibleApps = apps.filter((a) => workspace.appIds.includes(a.id));
    visibleApps.forEach((app) => {
      cmds.push({
        id: `app-${app.id}`,
        label: `Open ${app.name}`,
        category: 'app',
        icon: app.icon,
        shortcut: app.shortcutIndex ? `Alt+${app.shortcutIndex}` : undefined,
        action: () => {
          setActiveApp(app.id);
          onClose();
        },
      });
    });

    // Workspace commands
    workspaces.forEach((ws) => {
      cmds.push({
        id: `workspace-${ws.id}`,
        label: `Switch to ${ws.name}`,
        category: 'workspace',
        icon: ws.icon,
        action: () => {
          switchWorkspace(ws.id);
          if (ws.activeAppId) setActiveApp(ws.activeAppId);
          onClose();
        },
      });
    });

    // Theme commands
    const themes: { id: ThemeId; label: string; icon: string }[] = [
      { id: 'dark', label: 'Dark', icon: '🌙' },
      { id: 'midnight', label: 'Midnight', icon: '🌌' },
      { id: 'nord', label: 'Nord', icon: '❄️' },
      { id: 'oled', label: 'OLED Black', icon: '⬛' },
    ];
    themes.forEach((t) => {
      cmds.push({
        id: `theme-${t.id}`,
        label: `Theme: ${t.label}`,
        category: 'theme',
        icon: t.icon,
        action: () => {
          setTheme(t.id);
          onClose();
        },
      });
    });

    // Action commands
    cmds.push({
      id: 'action-reload',
      label: 'Reload current app',
      category: 'action',
      icon: '↻',
      action: () => {
        // Dispatch reload event for WebView to handle
        window.dispatchEvent(new CustomEvent('sideflow:reload-app'));
        onClose();
      },
    });

    return cmds;
  }, [apps, workspaces, workspace]);

  // Filter commands by query
  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(q) ||
        cmd.category.toLowerCase().includes(q)
    );
  }, [commands, query]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filtered.length]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filtered[selectedIndex]) {
            filtered[selectedIndex].action();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
    [filtered, selectedIndex, onClose]
  );

  // Scroll selected item into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const item = list.children[selectedIndex] as HTMLElement;
    if (item) {
      item.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const categoryLabels: Record<string, string> = {
    app: 'Apps',
    workspace: 'Workspaces',
    theme: 'Themes',
    action: 'Actions',
  };

  // Group by category
  let lastCategory = '';

  return (
    <div className="cmd-overlay" onClick={onClose}>
      <div
        className="cmd-container animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="cmd-input-wrapper">
          <span className="cmd-input-icon">⌘</span>
          <input
            ref={inputRef}
            className="cmd-input"
            type="text"
            placeholder="Type a command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoComplete="off"
          />
          <kbd className="cmd-esc-hint">ESC</kbd>
        </div>

        {/* Results */}
        <div className="cmd-results" ref={listRef}>
          {filtered.length === 0 && (
            <div className="cmd-empty">No results found</div>
          )}
          {filtered.map((cmd, index) => {
            const showCategory = cmd.category !== lastCategory;
            lastCategory = cmd.category;

            return (
              <React.Fragment key={cmd.id}>
                {showCategory && (
                  <div className="cmd-category-label">
                    {categoryLabels[cmd.category] || cmd.category}
                  </div>
                )}
                <button
                  className={`cmd-item ${index === selectedIndex ? 'cmd-item--selected' : ''}`}
                  onClick={() => cmd.action()}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <span className="cmd-item-icon">{cmd.icon}</span>
                  <span className="cmd-item-label">{cmd.label}</span>
                  {cmd.shortcut && (
                    <kbd className="cmd-item-shortcut">{cmd.shortcut}</kbd>
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Footer hints */}
        <div className="cmd-footer">
          <span className="cmd-footer-hint">
            <kbd>↑↓</kbd> Navigate
          </span>
          <span className="cmd-footer-hint">
            <kbd>↵</kbd> Select
          </span>
          <span className="cmd-footer-hint">
            <kbd>Esc</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
};
