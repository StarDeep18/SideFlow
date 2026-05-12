import type { SideFlowApp } from './app';

export interface Workspace {
  id: string;
  name: string;
  icon: string;
  color: string;
  activeAppId: string | null;
  appIds: string[]; // IDs of apps visible in this workspace
  createdAt: number;
}

export const DEFAULT_WORKSPACES: Workspace[] = [
  {
    id: 'work',
    name: 'Work',
    icon: '💼',
    color: '#6366F1',
    activeAppId: 'gmail',
    appIds: ['gmail', 'chatgpt', 'notion', 'calendar', 'twitter'],
    createdAt: Date.now(),
  },
  {
    id: 'study',
    name: 'Study',
    icon: '📚',
    color: '#F59E0B',
    activeAppId: 'chatgpt',
    appIds: ['chatgpt', 'notion', 'calendar', 'spotify'],
    createdAt: Date.now(),
  },
  {
    id: 'personal',
    name: 'Personal',
    icon: '🏠',
    color: '#10B981',
    activeAppId: 'whatsapp',
    appIds: ['whatsapp', 'telegram', 'twitter', 'spotify', 'gmail'],
    createdAt: Date.now(),
  },
];
