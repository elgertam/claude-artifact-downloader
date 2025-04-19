// Initialize extension when installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('Claude Artifact Downloader extension installed');
  
  // Set default preferences
  chrome.storage.sync.get(['flatMode', 'darkMode'], (result) => {
    if (result.flatMode === undefined) {
      chrome.storage.sync.set({ flatMode: false });
    }
    
    if (result.darkMode === undefined) {
      // Check if user prefers dark mode
      const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      chrome.storage.sync.set({ darkMode: prefersDarkMode });
    }
  });
});

// Listen for content script errors
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'logError') {
    console.error('Error in content script:', message.error);
    sendResponse({ received: true });
  }
});

// Handle permissions
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'hasPermissions') {
    chrome.permissions.contains(
      { permissions: message.permissions, origins: message.origins },
      (hasPermissions) => {
        sendResponse({ hasPermissions });
      }
    );
    return true; // Indicate async response
  }
  
  if (message.action === 'requestPermissions') {
    chrome.permissions.request(
      { permissions: message.permissions, origins: message.origins },
      (granted) => {
        sendResponse({ granted });
      }
    );
    return true; // Indicate async response
  }
});

// Inject content script when navigating to Claude
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('claude.ai/chat')) {
    // Notify the content script to initialize
    chrome.tabs.sendMessage(tabId, { action: 'initialize' })
      .catch((error) => {
        // This is expected if the content script hasn't been loaded yet
        console.log('Content script not yet loaded, this is normal');
      });
  }
});