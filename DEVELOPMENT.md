# Development Guide

This guide will help you set up and contribute to the Hyperlink Powerups Chrome extension.

## Prerequisites

- Node.js (version 14 or higher)
- Google Chrome browser
- Git

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chrome-hyperlink-powerups.git
   cd chrome-hyperlink-powerups
   ```

2. **Install dependencies** (if any are added in the future)
   ```bash
   npm install
   ```

## Development Workflow

### For Development

1. **Load the extension in Chrome for development:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the root directory of this project
   - The extension will be loaded and ready for testing

2. **Make changes to the source files:**
   - Edit files in the `src/` directory
   - The extension will automatically reload when you refresh the page

3. **Test your changes:**
   - Visit websites with links that open in new tabs
   - Test the link selection feature
   - Check the browser console for any errors

### For Production

1. **Build the extension:**
   ```bash
   npm run build
   ```

2. **Load the built extension:**
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist/` folder

## Project Structure

```
src/
├── assets/           # Extension icons (PNG files)
├── background/       # Background service worker scripts
├── content/          # Content scripts that run on web pages
├── options/          # Options page (HTML, CSS, JS)
└── utils/            # Shared utility functions (future use)
```

## File Descriptions

### Core Files

- **`manifest.json`**: Extension configuration, permissions, and file references
- **`src/background/background.js`**: Background service worker that manages extension state
- **`src/content/content.js`**: Content script that modifies link behavior and provides link selection
- **`src/options/options.html`**: Options page for user configuration
- **`src/options/options.js`**: Options page functionality

### Build Files

- **`build.js`**: Build script that copies files to `dist/` and updates paths
- **`package.json`**: Project configuration and scripts
- **`dist/`**: Generated directory containing the built extension

## Available Scripts

- `npm run build`: Build the extension for distribution
- `npm run dev`: Development mode instructions
- `npm run dist`: Build and prepare for distribution

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
   - Load the extension in Chrome
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

### Build errors
- Ensure Node.js is installed
- Check that all source files exist
- Verify file permissions

## Release Process

1. **Update version numbers:**
   - Update version in `manifest.json`
   - Update version in `package.json`

2. **Build the extension:**
   ```bash
   npm run build
   ```

3. **Test the built extension:**
   - Load from `dist/` directory
   - Test all functionality

4. **Create a release:**
   - Tag the release in Git
   - Upload the `dist/` folder as a release asset

## Support

If you encounter issues:

1. Check the troubleshooting section in README.md
2. Search existing issues on GitHub
3. Create a new issue with detailed information
4. Include browser version and extension version 