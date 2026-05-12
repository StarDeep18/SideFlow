/**
 * SideFlow Background Service Worker
 * Handles:
 * - Side panel lifecycle
 * - Keyboard shortcut commands
 * - Extension icon click → toggle side panel
 * - Message routing between popup/sidepanel/content scripts
 */

import { ACTIONS } from '../utils/constants';

// ---- Side Panel Setup ----

// Enable side panel on all URLs
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch(console.error);

// ---- Keyboard Shortcut Commands ----

chrome.commands.onCommand.addListener(async (command) => {
  // Handle app switching shortcuts (Alt+1 through Alt+4)
  const appSwitchMatch = command.match(/^switch-app-(\d+)$/);
  if (appSwitchMatch) {
    const index = parseInt(appSwitchMatch[1], 10);
    await sendToSidePanel({ action: ACTIONS.SWITCH_APP, payload: index });
    return;
  }

  // Handle command palette
  if (command === 'toggle-command-palette') {
    await sendToSidePanel({ action: ACTIONS.OPEN_COMMAND_PALETTE });
    return;
  }
});

// ---- Message Routing ----

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle messages from popup or content scripts
  if (message.target === 'sidepanel') {
    // Forward to side panel
    sendToSidePanel(message);
  }
  sendResponse({ received: true });
  return true;
});

// ---- Install / Update ----

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // First install — could open a welcome tab
    console.log('SideFlow installed successfully');
  } else if (details.reason === 'update') {
    console.log(`SideFlow updated to v${chrome.runtime.getManifest().version}`);
  }
});

// ---- Helpers ----

async function sendToSidePanel(message: { action: string; payload?: unknown }) {
  try {
    // Get the active tab to send a message to the side panel in that window
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      // Send to the side panel via runtime messaging
      await chrome.runtime.sendMessage(message);
    }
  } catch (error) {
    // Side panel might not be open — this is expected
    console.debug('Could not reach side panel:', error);
  }
}
