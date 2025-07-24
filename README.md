# Same Tab Link Opener - Chrome Extension

A Chrome extension that forces all links on webpages to open in the same tab instead of new windows or tabs.

## Features

- Removes `target="_blank"` and `target="_new"` attributes from all links
- Handles dynamically added content through MutationObserver
- Intercepts click events on links that would open new windows/tabs
- Works on all websites
- Lightweight and efficient

## Installation

### Method 1: Load as Unpacked Extension (Recommended for Development)

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the folder containing this extension
5. The extension will be installed and active

### Method 2: Create Extension Package

1. Zip all the files in this directory
2. Rename the zip file to `.crx` extension
3. Drag and drop the `.crx` file into Chrome's extensions page

## How It Works

The extension uses a content script that:

1. **Modifies existing links**: Removes `target` attributes from all links on page load
2. **Handles dynamic content**: Uses MutationObserver to catch newly added links
3. **Intercepts clicks**: Prevents default behavior for links that would open new windows
4. **Forces same-tab navigation**: Redirects all link clicks to open in the current tab

## Files

- `manifest.json` - Extension configuration and permissions
- `content.js` - Main content script that modifies link behavior
- `README.md` - This documentation file

## Usage

Once installed, the extension will automatically:
- Work on all websites you visit
- Force all links to open in the same tab
- Show a console message when active

## Testing

To test the extension:

1. Install the extension
2. Visit any website with links that open in new tabs
3. Click on those links - they should now open in the same tab
4. Check the browser console for the "Extension loaded and active" message

## Troubleshooting

- If links still open in new tabs, try refreshing the page
- Check the browser console for any error messages
- Ensure the extension is enabled in `chrome://extensions/`

## Permissions

This extension requires:
- `activeTab` - To run content scripts on web pages

No personal data is collected or transmitted by this extension.

## License

This project is open source and available under the MIT License. 