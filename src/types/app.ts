export interface SideFlowApp {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  category: 'messaging' | 'productivity' | 'ai' | 'media' | 'custom';
  shortcutIndex?: number; // 1-based index for Alt+N shortcuts
  canEmbed: boolean; // false = opens in new tab instead of iframe
}

export const DEFAULT_APPS: SideFlowApp[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    url: 'https://web.whatsapp.com',
    icon: '💬',
    color: '#25D366',
    category: 'messaging',
    shortcutIndex: 1,
    canEmbed: false, // JS frame-busting
  },
  {
    id: 'telegram',
    name: 'Telegram',
    url: 'https://web.telegram.org/k/',
    icon: '✈️',
    color: '#26A5E4',
    category: 'messaging',
    shortcutIndex: 2,
    canEmbed: false, // blocks iframe
  },
  {
    id: 'gmail',
    name: 'Gmail',
    url: 'https://mail.google.com',
    icon: '📧',
    color: '#EA4335',
    category: 'productivity',
    shortcutIndex: 3,
    canEmbed: false, // Google auth blocks iframe
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    url: 'https://chatgpt.com',
    icon: '🤖',
    color: '#10A37F',
    category: 'ai',
    shortcutIndex: 4,
    canEmbed: true,
  },
  {
    id: 'notion',
    name: 'Notion',
    url: 'https://notion.so',
    icon: '📝',
    color: '#FFFFFF',
    category: 'productivity',
    canEmbed: true,
  },
  {
    id: 'calendar',
    name: 'Calendar',
    url: 'https://calendar.google.com',
    icon: '📅',
    color: '#4285F4',
    category: 'productivity',
    canEmbed: false, // Google blocks iframe
  },
  {
    id: 'twitter',
    name: 'X / Twitter',
    url: 'https://x.com',
    icon: '🐦',
    color: '#1DA1F2',
    category: 'media',
    canEmbed: true,
  },
  {
    id: 'spotify',
    name: 'Spotify',
    url: 'https://open.spotify.com',
    icon: '🎵',
    color: '#1DB954',
    category: 'media',
    canEmbed: true,
  },
];
