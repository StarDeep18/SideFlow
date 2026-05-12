import React, { useEffect, useState } from 'react';
import { AppDock } from './components/AppDock/AppDock';
import { WebView } from './components/WebView/WebView';
import { WorkspaceSwitcher } from './components/WorkspaceSwitcher/WorkspaceSwitcher';
import { Onboarding } from './components/Onboarding/Onboarding';
import { CommandPalette } from './components/CommandPalette/CommandPalette';
import { Settings } from './components/Settings/Settings';
import { useAppStore } from '../stores/appStore';
import { useWorkspaceStore } from '../stores/workspaceStore';
import { useSettingsStore } from '../stores/settingsStore';
import { ACTIONS } from '../utils/constants';
import './App.css';

const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const { initialize: initApps, setActiveApp, getAppByShortcutIndex } = useAppStore();
  const { initialize: initWorkspaces, getActiveWorkspace } = useWorkspaceStore();
  const { initialize: initSettings, onboardingComplete } = useSettingsStore();

  // Initialize all stores from persistent storage
  useEffect(() => {
    const init = async () => {
      await Promise.all([
        initApps(),
        initWorkspaces(),
        initSettings(),
      ]);

      // Restore the active app from the current workspace
      const workspace = getActiveWorkspace();
      if (workspace.activeAppId) {
        setActiveApp(workspace.activeAppId);
      }

      setIsReady(true);
    };

    init();
  }, []);

  // Listen for messages from background service worker (keyboard shortcuts)
  useEffect(() => {
    const handleMessage = (message: { action: string; payload?: unknown }) => {
      switch (message.action) {
        case ACTIONS.SWITCH_APP: {
          const index = message.payload as number;
          const app = getAppByShortcutIndex(index);
          if (app) {
            setActiveApp(app.id);
          }
          break;
        }
        case ACTIONS.OPEN_COMMAND_PALETTE:
          setShowCommandPalette(true);
          break;
      }
    };

    try {
      chrome?.runtime?.onMessage?.addListener(handleMessage);
      return () => {
        chrome?.runtime?.onMessage?.removeListener(handleMessage);
      };
    } catch {
      // Dev mode fallback — no chrome runtime
    }
  }, []);

  // Global keyboard shortcut: Ctrl+K for command palette (works inside side panel)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isReady) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner animate-spin">⚡</div>
      </div>
    );
  }

  if (!onboardingComplete) {
    return <Onboarding />;
  }

  return (
    <div className="app-root">
      <AppDock onSettingsClick={() => setShowSettings(true)} />
      <div className="app-main">
        <WorkspaceSwitcher />
        <WebView />
      </div>

      {/* Overlays */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />
      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
};

export default App;
