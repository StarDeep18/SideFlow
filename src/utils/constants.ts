/** App category labels */
export const CATEGORY_LABELS = {
  messaging: 'Messaging',
  productivity: 'Productivity',
  ai: 'AI',
  media: 'Media',
  custom: 'Custom',
} as const;

/** Sidebar width constraints */
export const SIDEBAR = {
  MIN_WIDTH: 320,
  MAX_WIDTH: 800,
  DEFAULT_WIDTH: 420,
} as const;

/** Animation durations in ms */
export const ANIMATION = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 400,
} as const;

/** Extension messaging actions */
export const ACTIONS = {
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SWITCH_APP: 'SWITCH_APP',
  SWITCH_WORKSPACE: 'SWITCH_WORKSPACE',
  OPEN_COMMAND_PALETTE: 'OPEN_COMMAND_PALETTE',
} as const;
