// background.js
chrome.runtime.onInstalled.addListener(() => {
  console.log('Bookmark Research Extension installed.');
});

chrome.tabs.onCreated.addListener((tab) => {
  console.log('Tab created:', tab);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log('Tab updated:', tab);
});

chrome.tabs.onRemoved.addListener((tabId) => {
  console.log('Tab removed:', tabId);
});

chrome.action.onClicked.addListener((tab) => {
  console.log('Extension button clicked on tab:', tab);
  chrome.tabs.sendMessage(tab.id, {message: 'toggle_clipper'});
});