// Default settings
const DEFAULT_SETTINGS = {
    shortcutKey: 'Z'
};

// Track if extension is enabled for current tab
let isEnabled = {};

// Initialize when extension loads
chrome.runtime.onInstalled.addListener(() => {
    console.log('Tab Link Ops extension installed');
    initializeCommands();
});

// Function to initialize commands with retry logic
function initializeCommands() {
    // Wait a bit for the API to be available
    setTimeout(() => {
        try {
            // Check if commands API exists and is properly loaded
            if (typeof chrome !== 'undefined' && 
                chrome.commands && 
                typeof chrome.commands.onCommand !== 'undefined') {
                
                chrome.commands.onCommand.addListener((command) => {
                    if (command === 'toggle-extension') {
                        toggleExtension();
                    }
                });
                console.log('Commands API initialized successfully');
            } else {
                console.log('Commands API not available, retrying...');
                // Retry once more after a longer delay
                setTimeout(initializeCommands, 1000);
            }
        } catch (error) {
            console.log('Error initializing commands API:', error);
        }
    }, 100);
}

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
    
    if (request.action === 'showToast') {
        // Show Chrome toast notification
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon48.png',
            title: 'Tab Link Ops',
            message: request.message
        });
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
            }).catch(() => {
                // Content script might not be loaded yet, that's okay
                console.log('Content script not ready yet');
            });
            
            console.log('Extension toggled:', isEnabled[tabId] ? 'ON' : 'OFF');
        }
    });
}

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        // Reset enabled state for new page
        isEnabled[tabId] = false;
        console.log('New page loaded, extension disabled');
    }
});

// Handle tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
    delete isEnabled[tabId];
}); 