chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
  });
  
  // Add more background script logic here
  console.log('Background script running');
  export {};

chrome.action.onClicked.addListener((tab) => {
  // Open the onboarding page directly when the extension icon is clicked
  chrome.tabs.create({ url: chrome.runtime.getURL('onboarding.html') });
});