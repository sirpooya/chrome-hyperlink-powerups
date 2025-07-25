# Development Guide

This guide will help you set up and contribute to the Hyperlink Powerups Chrome extension.

## Prerequisites

- Google Chrome browser
- Git

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chrome-hyperlink-powerups.git
   cd chrome-hyperlink-powerups
   ```

2. **Load the extension in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select this project folder
   - The extension will be loaded and ready for testing

## Development Workflow

### Making Changes

1. **Edit files directly** in the project folder
2. **Reload the extension** when you make changes:
   - Go to `chrome://extensions/`
   - Click the refresh icon on your extension
3. **Test your changes** on any website

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
└── README.md            # Documentation
```

## File Descriptions

### Core Files

- **`manifest.json`**: Extension configuration, permissions, and file references
- **`background.js`**: Background service worker that manages extension state
- **`content.js`**: Content script that modifies link behavior and provides link selection
- **`options.html`**: Options page for user configuration
- **`options.js`**: Options page functionality
- **`icons/`**: Extension icons in different sizes

## Testing

### Manual Testing

1. **Basic functionality:**
   - Visit a website with links that open in new tabs
   - Click the links - they should open in the same tab
   - Check browser console for extension messages

2. **Link selection feature:**
   - Open extension options and set a custom key
   - Hold the key and drag to select multiple links
   - Verify links are copied to clipboard

3. **Keyboard shortcuts:**
   - Press Ctrl+Shift+Z to toggle extension
   - Verify toggle functionality works

### Debugging

1. **Check extension logs:**
   - Open Chrome DevTools
   - Go to the "Console" tab
   - Look for messages from the extension

2. **Check background script:**
   - Go to `chrome://extensions/`
   - Find your extension
   - Click "service worker" link to open background script console

3. **Check content script:**
   - Open DevTools on any webpage
   - Check console for content script messages

## Contributing

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Follow the existing code style
   - Add comments for complex logic
   - Test thoroughly

3. **Test your changes:**
   - Reload the extension in Chrome
   - Test all functionality
   - Check for any console errors

4. **Submit a pull request:**
   - Describe your changes
   - Include any relevant screenshots
   - Mention any breaking changes

## Code Style

- Use consistent indentation (2 spaces)
- Use meaningful variable and function names
- Add comments for complex logic
- Follow JavaScript best practices
- Keep functions small and focused

## Common Issues

### Extension not loading
- Check that all files are in the correct locations
- Verify manifest.json paths are correct
- Check browser console for errors

### Links still opening in new tabs
- Refresh the page after loading the extension
- Check if the content script is running
- Verify the extension is enabled

## Release Process

1. **Update version numbers:**
   - Update version in `manifest.json`
   - Update version in `package.json`

2. **Test the extension:**
   - Load from the project directory
   - Test all functionality

3. **Create a release:**
   - Tag the release in Git
   - Upload the project folder as a release asset

## Support

If you encounter issues:

1. Check the troubleshooting section in README.md
2. Search existing issues on GitHub
3. Create a new issue with detailed information
4. Include browser version and extension version 