import React from 'react';
import { useWorkspaceStore } from '../../../stores/workspaceStore';
import { useAppStore } from '../../../stores/appStore';
import './WorkspaceSwitcher.css';

export const WorkspaceSwitcher: React.FC = () => {
  const { workspaces, activeWorkspaceId, switchWorkspace, getActiveWorkspace } = useWorkspaceStore();
  const { setActiveApp } = useAppStore();

  const handleSwitch = (workspaceId: string) => {
    if (workspaceId === activeWorkspaceId) return;
    switchWorkspace(workspaceId);

    // Restore the active app for the target workspace
    const target = workspaces.find((w) => w.id === workspaceId);
    if (target?.activeAppId) {
      setActiveApp(target.activeAppId);
    }
  };

  return (
    <div className="workspace-switcher" role="tablist" aria-label="Workspaces">
      {workspaces.map((ws) => {
        const isActive = ws.id === activeWorkspaceId;
        return (
          <button
            key={ws.id}
            className={`workspace-btn ${isActive ? 'workspace-btn--active' : ''}`}
            onClick={() => handleSwitch(ws.id)}
            role="tab"
            aria-selected={isActive}
            title={ws.name}
            id={`workspace-${ws.id}`}
          >
            <span
              className="workspace-dot"
              style={{ backgroundColor: isActive ? ws.color : 'transparent', borderColor: ws.color }}
            />
            <span className="workspace-icon">{ws.icon}</span>
          </button>
        );
      })}
    </div>
  );
};
