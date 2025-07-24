#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

// Files to copy to dist
const filesToCopy = [
    'manifest.json',
    'src/background/background.js',
    'src/content/content.js',
    'src/options/options.html',
    'src/options/options.js',
    'src/assets/icon16.png',
    'src/assets/icon48.png',
    'src/assets/icon128.png'
];

// Copy files to dist directory
filesToCopy.forEach(file => {
    const sourcePath = file;
    const destPath = path.join('dist', file);
    
    // Create directory structure if it doesn't exist
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Copy file
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied: ${file} -> dist/${file}`);
});

// Update manifest.json in dist to use relative paths
const distManifestPath = path.join('dist', 'manifest.json');
let manifestContent = fs.readFileSync(distManifestPath, 'utf8');

// Remove src/ prefix from paths in dist manifest
manifestContent = manifestContent.replace(/src\//g, '');

fs.writeFileSync(distManifestPath, manifestContent);
console.log('Updated manifest.json paths for distribution');

console.log('\nBuild completed! Extension files are ready in the dist/ directory.');
console.log('You can load the extension from the dist/ directory in Chrome.'); 