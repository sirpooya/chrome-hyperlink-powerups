#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

// Files to copy to dist with their destination paths
const filesToCopy = [
    { src: 'manifest.json', dest: 'manifest.json' },
    { src: 'src/background/background.js', dest: 'background/background.js' },
    { src: 'src/content/content.js', dest: 'content/content.js' },
    { src: 'src/options/options.html', dest: 'options/options.html' },
    { src: 'src/options/options.js', dest: 'options/options.js' },
    { src: 'src/assets/icon16.png', dest: 'assets/icon16.png' },
    { src: 'src/assets/icon48.png', dest: 'assets/icon48.png' },
    { src: 'src/assets/icon128.png', dest: 'assets/icon128.png' }
];

// Copy files to dist directory
filesToCopy.forEach(file => {
    const sourcePath = file.src;
    const destPath = path.join('dist', file.dest);
    
    // Create directory structure if it doesn't exist
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Copy file
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied: ${file.src} -> dist/${file.dest}`);
});

console.log('\nBuild completed! Extension files are ready in the dist/ directory.');
console.log('You can load the extension from the dist/ directory in Chrome.'); 