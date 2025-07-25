// Default settings
const DEFAULT_SETTINGS = {
    shortcutKey: 'Z',
    forceSameTab: true
};

// Track if extension is enabled for current tab
let isEnabled = {};

// Initialize when extension loads
chrome.runtime.onInstalled.addListener(() => {
    console.log('Hyperlink Powerups extension installed');
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSettings') {
        // Send settings to content script
        chrome.storage.sync.get(DEFAULT_SETTINGS, function(items) {
            sendResponse(items);
        });
        return true; // Keep message channel open for async response
    }
    
    if (request.action === 'toggleEnabled') {
        const tabId = sender.tab.id;
        isEnabled[tabId] = !isEnabled[tabId];
        sendResponse({ enabled: isEnabled[tabId] });
    }
    
    if (request.action === 'isEnabled') {
        const tabId = sender.tab.id;
        sendResponse({ enabled: isEnabled[tabId] || false });
    }
});



// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        // Enable extension by default for new pages
        isEnabled[tabId] = true;
        console.log('New page loaded, extension enabled by default');
        
        // Send message to content script to enable it
        chrome.tabs.sendMessage(tabId, {
            action: 'toggleExtension',
            enabled: true
        }).catch(() => {
            // Content script might not be loaded yet, that's okay
            console.log('Content script not ready yet');
        });
    }
});

// Handle tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
    delete isEnabled[tabId];
}); 