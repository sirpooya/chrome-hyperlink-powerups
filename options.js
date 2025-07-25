// Default settings
const DEFAULT_SETTINGS = {
    shortcutKey: 'Z',
    forceSameTab: true
};

// DOM elements
const shortcutKeyInput = document.getElementById('shortcutKey');
const forceSameTabToggle = document.getElementById('forceSameTab');
const settingsForm = document.getElementById('settingsForm');
const statusDiv = document.getElementById('status');

// Load settings when page loads
document.addEventListener('DOMContentLoaded', loadSettings);

// Handle form submission
settingsForm.addEventListener('submit', saveSettings);



// Handle input validation
shortcutKeyInput.addEventListener('input', function(e) {
    // Only allow letters A-Z
    let value = e.target.value.toUpperCase();
    value = value.replace(/[^A-Z]/g, '');
    e.target.value = value;
});

// Load settings from Chrome storage
function loadSettings() {
    chrome.storage.sync.get(DEFAULT_SETTINGS, function(items) {
        shortcutKeyInput.value = items.shortcutKey;
        forceSameTabToggle.checked = items.forceSameTab;
    });
}

// Save settings to Chrome storage
function saveSettings(e) {
    e.preventDefault();
    
    const shortcutKey = shortcutKeyInput.value.trim().toUpperCase();
    const forceSameTab = forceSameTabToggle.checked;
    
    // Validate input
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
            const statusMessage = `Settings saved successfully! Link forcing is ${forceSameTab ? 'enabled' : 'disabled'}. You can now use ${shortcutKey} for link selection.`;
            showStatus(statusMessage, 'success');
            
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
    
    // Hide status after 4 seconds
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 4000);
} 