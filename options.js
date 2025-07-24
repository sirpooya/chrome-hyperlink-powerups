// Default settings
const DEFAULT_SETTINGS = {
    shortcutKey: 'Z'
};

// DOM elements
const shortcutKeyInput = document.getElementById('shortcutKey');
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
    });
}

// Save settings to Chrome storage
function saveSettings(e) {
    e.preventDefault();
    
    const shortcutKey = shortcutKeyInput.value.trim().toUpperCase();
    
    // Validate input
    if (!shortcutKey || !/^[A-Z]$/.test(shortcutKey)) {
        showStatus('Please enter a valid letter (A-Z)', 'error');
        return;
    }
    
    // Save to Chrome storage
    chrome.storage.sync.set({
        shortcutKey: shortcutKey
    }, function() {
        if (chrome.runtime.lastError) {
            showStatus('Error saving settings: ' + chrome.runtime.lastError.message, 'error');
        } else {
            showStatus('Settings saved successfully! You can now use ' + shortcutKey + ' for link selection.', 'success');
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