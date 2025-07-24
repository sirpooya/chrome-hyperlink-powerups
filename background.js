// Default settings
const DEFAULT_SETTINGS = {
    shortcutKey: 'Z'
};

// Track if extension is enabled for current tab
let isEnabled = {};

// Initialize when extension loads
chrome.runtime.onInstalled.addListener(() => {
    console.log('Tab Link Ops extension installed');
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
    if (command === 'toggle-extension') {
        toggleExtension();
    }
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

// Toggle extension for current active tab
function toggleExtension() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs[0]) {
            const tabId = tabs[0].id;
            isEnabled[tabId] = !isEnabled[tabId];
            
            // Send message to content script
            chrome.tabs.sendMessage(tabId, {
                action: 'toggleExtension',
                enabled: isEnabled[tabId]
            });
            
            // Show notification
            const status = isEnabled[tabId] ? 'enabled' : 'disabled';
            chrome.action.setBadgeText({
                text: isEnabled[tabId] ? 'ON' : 'OFF',
                tabId: tabId
            });
            chrome.action.setBadgeBackgroundColor({
                color: isEnabled[tabId] ? '#4CAF50' : '#F44336',
                tabId: tabId
            });
        }
    });
}

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        // Reset enabled state for new page
        isEnabled[tabId] = false;
        chrome.action.setBadgeText({
            text: 'OFF',
            tabId: tabId
        });
        chrome.action.setBadgeBackgroundColor({
            color: '#F44336',
            tabId: tabId
        });
    }
});

// Handle tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
    delete isEnabled[tabId];
}); 