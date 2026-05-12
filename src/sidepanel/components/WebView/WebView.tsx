import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useAppStore } from '../../../stores/appStore';
import './WebView.css';

export const WebView: React.FC = () => {
  const { activeAppId, getAppById } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [loadedApps, setLoadedApps] = useState<Set<string>>(new Set());
  const iframeRefs = useRef<Map<string, HTMLIFrameElement>>(new Map());

  const activeApp = activeAppId ? getAppById(activeAppId) : null;

  // Track which embeddable apps have been loaded
  useEffect(() => {
    if (activeAppId && activeApp?.canEmbed && !loadedApps.has(activeAppId)) {
      setIsLoading(true);
      setLoadedApps((prev) => new Set(prev).add(activeAppId));
    }
  }, [activeAppId, activeApp]);

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Empty state — no app selected
  if (!activeApp) {
    return (
      <div className="webview-empty">
        <div className="webview-empty-content animate-fade-in">
          <span className="webview-empty-icon">⚡</span>
          <h2 className="webview-empty-title">SideFlow</h2>
          <p className="webview-empty-text">
            Select an app from the dock to get started
          </p>
          <div className="webview-empty-shortcuts">
            <span className="webview-shortcut-hint">
              <kbd>Alt + 1-2</kbd> Switch apps
            </span>
            <span className="webview-shortcut-hint">
              <kbd>Ctrl+K</kbd> Command palette
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Non-embeddable app — show "Open in Tab" card
  if (!activeApp.canEmbed) {
    return (
      <div className="webview-container">
        <div className="webview-header">
          <div className="webview-header-info">
            <span className="webview-header-icon">{activeApp.icon}</span>
            <span className="webview-header-name">{activeApp.name}</span>
          </div>
        </div>
        <div className="webview-blocked">
          <div className="webview-blocked-card animate-slide-up">
            <span className="webview-blocked-icon">{activeApp.icon}</span>
            <h3 className="webview-blocked-title">{activeApp.name}</h3>
            <p className="webview-blocked-text">
              This app doesn't support sidebar embedding due to security restrictions.
            </p>
            <button
              className="webview-blocked-btn"
              style={{ '--btn-color': activeApp.color } as React.CSSProperties}
              onClick={() => window.open(activeApp.url, '_blank')}
            >
              Open in New Tab ↗
            </button>
            <p className="webview-blocked-hint">
              Tip: You can keep it in a pinned tab alongside SideFlow
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Embeddable app — iframe view
  return (
    <div className="webview-container">
      {/* Loading bar */}
      {isLoading && (
        <div className="webview-loading-bar">
          <div className="webview-loading-progress" />
        </div>
      )}

      {/* Header bar */}
      <div className="webview-header">
        <div className="webview-header-info">
          <span className="webview-header-icon">{activeApp.icon}</span>
          <span className="webview-header-name">{activeApp.name}</span>
        </div>
        <div className="webview-header-actions">
          <button
            className="webview-header-btn"
            title="Reload"
            onClick={() => {
              const iframe = iframeRefs.current.get(activeApp.id);
              if (iframe) {
                setIsLoading(true);
                iframe.src = iframe.src;
              }
            }}
          >
            ↻
          </button>
          <button
            className="webview-header-btn"
            title="Open in new tab"
            onClick={() => window.open(activeApp.url, '_blank')}
          >
            ↗
          </button>
        </div>
      </div>

      {/* Iframe panel */}
      <div className="webview-frame-container">
        {Array.from(loadedApps).map((appId) => {
          const app = getAppById(appId);
          if (!app || !app.canEmbed) return null;
          const isVisible = appId === activeAppId;

          return (
            <iframe
              key={appId}
              ref={(el) => {
                if (el) iframeRefs.current.set(appId, el);
              }}
              src={app.url}
              className={`webview-frame ${isVisible ? 'webview-frame--visible' : ''}`}
              title={app.name}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-storage-access-by-user-activation"
              allow="clipboard-read; clipboard-write; camera; microphone; fullscreen"
              onLoad={isVisible ? handleIframeLoad : undefined}
            />
          );
        })}
      </div>
    </div>
  );
};
