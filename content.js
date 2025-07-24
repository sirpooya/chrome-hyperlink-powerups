
(function() {
    'use strict';

    let isEnabled = false;
    let settings = { shortcutKey: 'Z' };
    let isDragging = false;
    let isKeyPressed = false;
    let startX, startY;
    let selectionBox = null;
    let countLabel = null;
    let selectedLinks = [];
    let linkBoxes = new Map(); // Store link selection boxes
    const Z_INDEX = 2147483647;

    // Function to modify existing links
    function modifyLinks() {
        if (!isEnabled) return;
        
        const links = document.querySelectorAll('a[target]');
        
        links.forEach(link => {
            // Remove target attribute to force same tab opening
            link.removeAttribute('target');
            
            // Also remove any onclick handlers that might open new windows
            if (link.onclick) {
                const originalOnclick = link.onclick;
                link.onclick = function(e) {
                    // Prevent the original onclick from executing
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Navigate to the href in the same tab
                    if (link.href) {
                        window.location.href = link.href;
                    }
                    
                    return false;
                };
            }
        });
    }

    // Function to handle dynamically added links
    function observeNewLinks() {
        const observer = new MutationObserver(function(mutations) {
            if (!isEnabled) return;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if the added node is a link with target
                            if (node.tagName === 'A' && node.hasAttribute('target')) {
                                node.removeAttribute('target');
                            }
                            
                            // Check for links within the added node
                            const links = node.querySelectorAll ? node.querySelectorAll('a[target]') : [];
                            links.forEach(link => {
                                link.removeAttribute('target');
                            });
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Function to handle click events on links that might open new windows
    function handleLinkClicks() {
        document.addEventListener('click', function(e) {
            if (!isEnabled) return;
            
            const link = e.target.closest('a');
            
            if (link) {
                // Check if link would open in new window/tab
                const target = link.getAttribute('target');
                const href = link.getAttribute('href');
                
                if (target && (target === '_blank' || target === '_new') && href) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Navigate in same tab
                    window.location.href = href;
                    return false;
                }
            }
        }, true);
    }

    // Function to create selection box (LinkClump style)
    function createSelectionBox() {
        if (selectionBox) {
            selectionBox.remove();
        }
        if (countLabel) {
            countLabel.remove();
        }
        
        // Create selection box
        selectionBox = document.createElement('span');
        selectionBox.style.cssText = `
            margin: 0px auto;
            border: 2px dotted #4285f4;
            position: absolute;
            z-index: ${Z_INDEX};
            visibility: hidden;
            pointer-events: none;
        `;
        
        // Create count label
        countLabel = document.createElement('span');
        countLabel.style.cssText = `
            z-index: ${Z_INDEX};
            position: absolute;
            visibility: hidden;
            left: 10px;
            width: 50px;
            top: 10px;
            height: 20px;
            font-size: 10px;
            font-family: Arial, sans-serif;
            color: black;
            background: white;
            border: 1px solid #ccc;
            padding: 2px;
            text-align: center;
            pointer-events: none;
        `;
        
        document.body.appendChild(selectionBox);
        document.body.appendChild(countLabel);
    }

    // Function to get element position (LinkClump style)
    function getElementPosition(element) {
        let x = 0;
        let y = 0;
        
        let parent = element;
        let style;
        let matrix;
        
        do {
            style = window.getComputedStyle(parent);
            matrix = new WebKitCSSMatrix(style.webkitTransform);
            x += parent.offsetLeft + matrix.m41;
            y += parent.offsetTop + matrix.m42;
        } while (parent = parent.offsetParent);
        
        parent = element;
        while (parent && parent !== document.body) {
            if (parent.scrollLeft) {
                x -= parent.scrollLeft;
            }
            if (parent.scrollTop) {
                y -= parent.scrollTop;
            }
            parent = parent.parentNode;
        }
        
        return { x, y };
    }

    // Function to create link selection box
    function createLinkBox(link) {
        const pos = getElementPosition(link);
        const width = link.offsetWidth;
        const height = link.offsetHeight;
        
        // Check for images within the link
        for (let k = 0; k < link.childNodes.length; k++) {
            if (link.childNodes[k].nodeName === 'IMG') {
                const pos2 = getElementPosition(link.childNodes[k]);
                if (pos.y >= pos2.y) {
                    pos.y = pos2.y;
                    width = Math.max(width, link.childNodes[k].offsetWidth);
                    height = Math.max(height, link.childNodes[k].offsetHeight);
                }
            }
        }
        
        const linkBox = document.createElement('span');
        linkBox.style.cssText = `
            margin: 0px auto;
            border: 2px dashed #ff0000;
            position: absolute;
            width: ${width}px;
            height: ${height}px;
            top: ${pos.y}px;
            left: ${pos.x}px;
            z-index: ${Z_INDEX};
            pointer-events: none;
            visibility: hidden;
        `;
        
        document.body.appendChild(linkBox);
        return linkBox;
    }

    // Function to update selection box (LinkClump style)
    function updateSelectionBox(currentX, currentY) {
        if (!selectionBox) return;
        
        // Get page dimensions
        const width = Math.max(
            document.documentElement.clientWidth,
            document.body.scrollWidth,
            document.documentElement.scrollWidth,
            document.body.offsetWidth,
            document.documentElement.offsetWidth
        );
        const height = Math.max(
            document.documentElement.clientHeight,
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight
        );
        
        // Constrain coordinates
        currentX = Math.min(currentX, width - 7);
        currentY = Math.min(currentY, height - 7);
        
        // Calculate box dimensions
        let x1, x2, y1, y2;
        if (currentX > startX) {
            x1 = startX;
            x2 = currentX;
        } else {
            x1 = currentX;
            x2 = startX;
        }
        if (currentY > startY) {
            y1 = startY;
            y2 = currentY;
        } else {
            y1 = currentY;
            y2 = startY;
        }
        
        // Update box position and size
        selectionBox.style.left = x1 + 'px';
        selectionBox.style.width = (x2 - x1) + 'px';
        selectionBox.style.top = y1 + 'px';
        selectionBox.style.height = (y2 - y1) + 'px';
        selectionBox.style.visibility = 'visible';
        
        // Update count label position
        if (countLabel) {
            countLabel.style.left = (currentX - 15) + 'px';
            countLabel.style.top = (currentY - 15) + 'px';
            countLabel.style.visibility = 'visible';
        }
        
        // Update link selection indicators
        updateLinkSelection(x1, x2, y1, y2);
    }

    // Function to update link selection indicators
    function updateLinkSelection(x1, x2, y1, y2) {
        const links = document.querySelectorAll('a[href]');
        const selectedLinksSet = new Set();
        
        links.forEach(link => {
            const href = link.href;
            if (href && href !== '#' && href !== 'javascript:void(0)' && !href.startsWith('javascript:')) {
                const pos = getElementPosition(link);
                const width = link.offsetWidth;
                const height = link.offsetHeight;
                
                // Check if link intersects with selection box
                if (pos.x < x2 && pos.x + width > x1 && pos.y < y2 && pos.y + height > y1) {
                    selectedLinksSet.add(href);
                    
                    // Show link selection box
                    if (!linkBoxes.has(link)) {
                        const linkBox = createLinkBox(link);
                        linkBoxes.set(link, linkBox);
                    }
                    linkBoxes.get(link).style.visibility = 'visible';
                } else {
                    // Hide link selection box
                    if (linkBoxes.has(link)) {
                        linkBoxes.get(link).style.visibility = 'hidden';
                    }
                }
            }
        });
        
        // Update count label
        if (countLabel) {
            countLabel.textContent = selectedLinksSet.size;
        }
        
        // Update selected links array
        selectedLinks = Array.from(selectedLinksSet).map(url => ({ url }));
    }

    // Function to get links in selection area (LinkClump style)
    function getLinksInSelection() {
        return selectedLinks;
    }

    // Function to copy links to clipboard
    function copyLinksToClipboard(links) {
        if (links.length === 0) {
            showNotification('No links found in selection', 'error');
            return;
        }
        
        const linkList = links.map(link => link.url).join('\n');
        
        navigator.clipboard.writeText(linkList).then(() => {
            showNotification(`Copied ${links.length} links to clipboard!`, 'success');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = linkList;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification(`Copied ${links.length} links to clipboard!`, 'success');
        });
    }

    // Function to clean up link boxes
    function cleanupLinkBoxes() {
        linkBoxes.forEach(box => {
            if (box && box.parentNode) {
                box.parentNode.removeChild(box);
            }
        });
        linkBoxes.clear();
    }

    // Function to prevent event escalation
    function preventEscalation(event) {
        event.stopPropagation();
        event.preventDefault();
    }

    // Function to handle mouse move
    function handleMouseMove(event) {
        preventEscalation(event);
        
        if (isDragging && selectionBox && isKeyPressed) {
            updateSelectionBox(event.pageX, event.pageY);
        }
    }

    // Function to handle mouse up
    function handleMouseUp(event) {
        preventEscalation(event);
        
        if (isDragging && isKeyPressed) {
            isDragging = false;
            
            if (selectionBox) {
                const links = getLinksInSelection();
                copyLinksToClipboard(links);
                
                // Hide selection box and count label
                selectionBox.style.visibility = 'hidden';
                if (countLabel) {
                    countLabel.style.visibility = 'hidden';
                }
                
                // Clean up link boxes
                cleanupLinkBoxes();
            }
            
            // Remove event listeners
            window.removeEventListener('mousemove', handleMouseMove, true);
            window.removeEventListener('mouseup', handleMouseUp, true);
            
            // Re-enable text selection
            document.body.style.userSelect = '';
            document.body.style.webkitUserSelect = '';
            document.body.style.mozUserSelect = '';
            document.body.style.msUserSelect = '';
        }
    }

    // Function to handle drag selection
    function handleDragSelection() {
        // Handle keyboard events for custom shortcut
        document.addEventListener('keydown', function(e) {
            if (e.key.toUpperCase() === settings.shortcutKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
                if (!isKeyPressed) {
                    isKeyPressed = true;
                    document.body.style.cursor = 'crosshair';
                    showNotification('Hold and drag to select links', 'info');
                }
            }
        });

        document.addEventListener('keyup', function(e) {
            if (e.key.toUpperCase() === settings.shortcutKey) {
                isKeyPressed = false;
                document.body.style.cursor = 'default';
                
                if (selectionBox) {
                    selectionBox.style.visibility = 'hidden';
                }
                if (countLabel) {
                    countLabel.style.visibility = 'hidden';
                }
                
                // Clean up link boxes
                cleanupLinkBoxes();
                
                if (isDragging) {
                    isDragging = false;
                    // Remove event listeners
                    window.removeEventListener('mousemove', handleMouseMove, true);
                    window.removeEventListener('mouseup', handleMouseUp, true);
                    
                    // Re-enable text selection
                    document.body.style.userSelect = '';
                    document.body.style.webkitUserSelect = '';
                    document.body.style.mozUserSelect = '';
                    document.body.style.msUserSelect = '';
                }
            }
        });

        // Handle mouse events
        document.addEventListener('mousedown', function(e) {
            if (isKeyPressed) {
                isDragging = true;
                startX = e.pageX;
                startY = e.pageY;
                selectedLinks = [];
                
                if (!selectionBox) {
                    createSelectionBox();
                }
                
                // Disable text selection
                document.body.style.userSelect = 'none';
                document.body.style.webkitUserSelect = 'none';
                document.body.style.mozUserSelect = 'none';
                document.body.style.msUserSelect = 'none';
                
                // Initialize box position
                updateSelectionBox(e.pageX, e.pageY);
                
                // Add event listeners
                window.addEventListener('mousemove', handleMouseMove, true);
                window.addEventListener('mouseup', handleMouseUp, true);
                
                preventEscalation(e);
            }
        });

        // Prevent default drag behavior when key is pressed
        document.addEventListener('dragstart', function(e) {
            if (isKeyPressed) {
                e.preventDefault();
            }
        });
    }

    // Function to show notification
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.textContent = message;
        
        const colors = {
            success: '#4CAF50',
            error: '#F44336',
            info: '#2196F3'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10001;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // Function to get settings from background script
    function getSettings() {
        chrome.runtime.sendMessage({ action: 'getSettings' }, function(response) {
            if (response) {
                settings = response;
            }
        });
    }

    // Function to check if extension is enabled for this tab
    function checkEnabledState() {
        chrome.runtime.sendMessage({ action: 'isEnabled' }, function(response) {
            if (response && response.enabled !== undefined) {
                isEnabled = response.enabled;
            }
        });
    }

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'toggleExtension') {
            isEnabled = request.enabled;
            showNotification(isEnabled ? 'Extension Enabled' : 'Extension Disabled');
            
            if (isEnabled) {
                modifyLinks();
            }
        }
    });

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            getSettings();
            checkEnabledState();
            observeNewLinks();
            handleLinkClicks();
            handleDragSelection();
        });
    } else {
        // DOM is already loaded
        getSettings();
        checkEnabledState();
        observeNewLinks();
        handleLinkClicks();
        handleDragSelection();
    }

    // Also run on window load to catch any late-loading content
    window.addEventListener('load', function() {
        if (isEnabled) {
            modifyLinks();
        }
    });

    console.log('Same Tab Link Opener: Extension loaded (disabled by default)');
})(); 