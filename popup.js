// Default settings
const DEFAULT_SETTINGS = {
    shortcutKey: 'Z',
    forceSameTab: true
};

// DOM elements
const shortcutKeyInput = document.getElementById('shortcutKey');
const forceSameTabToggle = document.getElementById('forceSameTab');
const statusDiv = document.getElementById('status');
const openOptionsLink = document.getElementById('openOptions');

// Load settings when popup opens
document.addEventListener('DOMContentLoaded', loadSettings);

// Handle shortcut key input validation
shortcutKeyInput.addEventListener('input', function(e) {
    // Only allow letters A-Z
    let value = e.target.value.toUpperCase();
    value = value.replace(/[^A-Z]/g, '');
    e.target.value = value;
    
    // Auto-save when valid input is entered
    if (value && /^[A-Z]$/.test(value)) {
        saveSettings();
    }
});

// Handle toggle switch
forceSameTabToggle.addEventListener('change', function() {
    saveSettings();
});

// Handle opening full options page
openOptionsLink.addEventListener('click', function(e) {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
});

// Load settings from Chrome storage
function loadSettings() {
    chrome.storage.sync.get(DEFAULT_SETTINGS, function(items) {
        shortcutKeyInput.value = items.shortcutKey;
        forceSameTabToggle.checked = items.forceSameTab;
    });
}

// Save settings to Chrome storage
function saveSettings() {
    const shortcutKey = shortcutKeyInput.value.trim().toUpperCase();
    const forceSameTab = forceSameTabToggle.checked;
    
    // Validate shortcut key
    if (!shortcutKey || !/^[A-Z]$/.test(shortcutKey)) {
        showStatus('Please enter a valid letter (A-Z)', 'error');
        return;
    }
    
    // Save to Chrome storage
    chrome.storage.sync.set({
        shortcutKey: shortcutKey,
        forceSameTab: forceSameTab
    }, function() {
        if (chrome.runtime.lastError) {
            showStatus('Error saving settings: ' + chrome.runtime.lastError.message, 'error');
        } else {
            showStatus('Settings saved!', 'success');
            
            // Notify all tabs about settings change
            chrome.tabs.query({}, function(tabs) {
                tabs.forEach(function(tab) {
                    chrome.tabs.sendMessage(tab.id, {
                        action: 'settingsUpdated'
                    }).catch(() => {
                        // Ignore errors for tabs without content script
                    });
                });
            });
        }
    });
}

// Show status message
function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    
    // Hide status after 3 seconds
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 3000);
} 