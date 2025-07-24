// Same Tab Link Opener - Content Script
// Forces all links to open in the same tab instead of new windows/tabs

(function() {
    'use strict';

    // Function to modify existing links
    function modifyLinks() {
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

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            modifyLinks();
            observeNewLinks();
            handleLinkClicks();
        });
    } else {
        // DOM is already loaded
        modifyLinks();
        observeNewLinks();
        handleLinkClicks();
    }

    // Also run on window load to catch any late-loading content
    window.addEventListener('load', function() {
        modifyLinks();
    });

    console.log('Same Tab Link Opener: Extension loaded and active');
})(); 