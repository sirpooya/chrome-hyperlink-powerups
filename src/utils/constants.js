// Shared constants for the Hyperlink Powerups extension

// Default settings
export const DEFAULT_SETTINGS = {
    shortcutKey: 'Z'
};

// Styling constants for link selection
export const SELECTION_BOX_STYLE = {
    width: '2px',
    style: 'dotted',
    color: 'orange',
    background: '#FFA5001A',
    borderRadius: '8px'
};

export const LINK_BOX_STYLE = {
    width: '2px',
    style: 'dashed',
    color: '#0061CA',
    background: 'transparent',
    borderRadius: '96px',
    textColor: 'inherit'
};

export const TOAST_STYLE = {
    background: 'black',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '14px',
    maxWidth: '300px'
};

// Z-index for overlay elements
export const Z_INDEX = 2147483647;

// Extension messages
export const MESSAGES = {
    EXTENSION_LOADED: 'Hyperlink Powerups: Extension loaded (disabled by default)',
    EXTENSION_ENABLED: 'Extension Enabled',
    EXTENSION_DISABLED: 'Extension Disabled',
    NO_LINKS_FOUND: 'No links found in selection',
    LINKS_COPIED: 'Copied {count} links to clipboard!'
};

// Chrome storage keys
export const STORAGE_KEYS = {
    SETTINGS: 'settings',
    SHORTCUT_KEY: 'shortcutKey'
}; 