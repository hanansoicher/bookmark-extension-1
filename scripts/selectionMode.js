// selectionMode.js
let selections = []; // Array to store selected elements
let isSelectionMode = false; // Flag to indicate if selection mode is active

function enableGeneralContentSelection() {
  isSelectionMode = true;
  document.body.addEventListener('mouseenter', highlightElement, true);
  document.body.addEventListener('click', selectElement, true);
}

function highlightElement(e) {
  if (!isSelectionMode) return;
  e.stopPropagation();
  e.preventDefault();
  resetHighlight(); // Reset any previously highlighted elements
  e.target.style.border = '2px solid red'; // Example highlight style
}

function selectElement(e) {
  if (!isSelectionMode) return;
  e.stopPropagation();
  e.preventDefault();
  selections.push(e.target.outerHTML); // Store the selected element
  e.target.style.border = '2px solid green'; // Highlight the selected element
}

function confirmSelections() {
  if (!isSelectionMode) return;
  chrome.runtime.sendMessage({ action: 'elementsSelected', content: selections.join('\n') }); // Join selections with a newline for display
  resetSelection(); // Clean up and exit selection mode
}

function resetHighlight() {
  // Remove highlight styles from all elements
  document.querySelectorAll('*').forEach(el => {
    el.style.border = ''; // Reset custom highlight style
  });
}

function resetSelection() {
  document.body.removeEventListener('mouseenter', highlightElement, true);
  document.body.removeEventListener('click', selectElement, true);
  selections = [];
  isSelectionMode = false;
}

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'enableGeneralSelection') {
    enableGeneralContentSelection();
  } else if (request.action === 'confirmSelections') {
    confirmSelections();
  }
});