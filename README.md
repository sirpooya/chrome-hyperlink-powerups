# Hyperlink Powerups - Chrome Extension

A Chrome extension that forces all links on webpages to open in the same tab instead of new windows or tabs, with additional link selection features.

## Features

- **Same Tab Navigation**: Removes `target="_blank"` and `target="_new"` attributes from all links
- **Dynamic Content Support**: Handles dynamically added content through MutationObserver
- **Link Selection**: Select and copy multiple links by dragging your mouse

- **Customizable**: Configure your own link selection key
- **Works on all websites**: Lightweight and efficient

## Project Structure

```
chrome-hyperlink-powerups/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── content.js            # Content script
├── options.html          # Options page
├── options.js            # Options logic
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── package.json          # Project configuration
└── README.md            # This file
```

## Installation

### Simple Setup

1. **Clone this repository:**
   ```bash
   git clone https://github.com/yourusername/chrome-hyperlink-powerups.git
   cd chrome-hyperlink-powerups
   ```

2. **Load the extension in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked" and select this project folder
   - The extension will be installed and active

That's it! No build process needed - the extension works directly from the source files.

## Usage

### Basic Functionality

Once installed, the extension will automatically:
- Work on all websites you visit
- Force all links to open in the same tab
- Show a console message when active

### Link Selection Feature

1. Open the extension options page
2. Set your custom shortcut key (default: "Z")
3. Hold down your custom key
4. Click and drag to create a selection box
5. Release to copy all links in the selected area to clipboard

### Link Selection

- **Custom Key + Drag**: Select and copy multiple links

## Development

### File Structure

- **`manifest.json`**: Extension configuration, permissions, and file references
- **`background.js`**: Background service worker that manages extension state
- **`content.js`**: Content script that modifies link behavior and provides link selection
- **`options.html`**: Options page for user configuration
- **`options.js`**: Options page functionality
- **`icons/`**: Extension icons in different sizes

### Development Workflow

1. **Edit files directly** in the project folder
2. **Reload the extension** in Chrome when you make changes:
   - Go to `chrome://extensions/`
   - Click the refresh icon on your extension
3. **Test your changes** on any website

## How It Works

The extension uses multiple components:

1. **Background Script**: Manages extension state and handles keyboard shortcuts
2. **Content Script**: Modifies link behavior and provides link selection functionality
3. **Options Page**: Allows users to configure settings
4. **Manifest**: Defines extension permissions and structure

### Link Modification Process

1. **Modifies existing links**: Removes `target` attributes from all links on page load
2. **Handles dynamic content**: Uses MutationObserver to catch newly added links
3. **Intercepts clicks**: Prevents default behavior for links that would open new windows
4. **Forces same-tab navigation**: Redirects all link clicks to open in the current tab

## Testing

To test the extension:

1. Install the extension
2. Visit any website with links that open in new tabs
3. Click on those links - they should now open in the same tab
4. Test the link selection feature by holding your custom key and dragging
5. Check the browser console for any error messages

## Troubleshooting

- If links still open in new tabs, try refreshing the page
- Check the browser console for any error messages
- Ensure the extension is enabled in `chrome://extensions/`
- Verify that all files are in the correct locations

## Permissions

This extension requires:
- `activeTab`: To run content scripts on web pages
- `storage`: To save user settings

No personal data is collected or transmitted by this extension.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License. 