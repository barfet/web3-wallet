chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
  });
  
  // Add more background script logic here
  console.log('Background script running');
  export {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'createNewWallet') {
    // Implement wallet creation logic here
    // For now, we'll just simulate a successful response
    sendResponse({ success: true });
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: chrome.runtime.getURL('onboarding.html') });
});