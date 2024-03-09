// Function to inject the Clipper interface
function injectClipper() {
  // Inject HTML
  const clipperHtmlUrl = chrome.runtime.getURL('clipper.html');
  fetch(clipperHtmlUrl)
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('beforeend', data);
      // Once the HTML is injected, you can add event listeners or manipulate the DOM
    });

  // Inject CSS
  const clipperCssUrl = chrome.runtime.getURL('clipper.css');
  const link = document.createElement('link');
  link.href = clipperCssUrl;
  link.type = 'text/css';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'toggle_clipper') {
      const clipper = document.getElementById('clipper-extension');
      if (clipper) {
          clipper.classList.toggle('hidden');
      } else {
          injectClipper();
      }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const clipMultiSelect = document.getElementById('clip-multi-select');
  const clipFullPage = document.getElementById('clip-full-page');
  const clipScreenshot = document.getElementById('clip-screenshot');
  const clipContent = document.querySelector('.clip-content');

  clipMultiSelect.addEventListener('click', () => {
      // Trigger the multi-select functionality
      chrome.runtime.sendMessage({ action: 'enableGeneralSelection' });
      const content = selections.join('\n'); // Use the selections array from selectionMode.js
      displayContent(clipContent, content);
  });

  clipFullPage.addEventListener('click', () => {
      const content = document.documentElement.outerHTML; // Capture the entire HTML of the page
      displayContent(clipContent, content);
  });

  clipScreenshot.addEventListener('click', () => {
      // Implement the screenshot functionality
      const screenshotData = captureScreenshot(); // Placeholder function
      displayContent(clipContent, screenshotData);
  });
});

// save bookmark listener
document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.querySelector('.save-clip-btn');
  if (saveButton) {
      saveButton.addEventListener('click', () => {
          const selectedFormat = document.querySelector('input[name="clip-format"]:checked').value;
          let content = '';
          if (selectedFormat === 'multi-select') {
              content = selections.join('\n'); // Use the selections array from selectionMode.js
          } else if (selectedFormat === 'full-page') {
              content = document.documentElement.outerHTML; // Capture the entire HTML of the page
          }  
          const bookmarkData = {
              title: document.title, // You can modify this to be more specific or user-defined
              url: window.location.href,
              collections: '',
              tags: document.getElementById('clipper-tags').value.split(',').map(tag => tag.trim()),
              notes: document.getElementById('clipper-notes').value,
              content: content
          };

          saveBookmark(bookmarkData, (response) => {
              if (response.success) {
                  console.log('Bookmark saved successfully:', response.data);
                  // Close the clipper or provide feedback to the user
              } else {
                  console.error('Failed to save bookmark:', response.error);
                  // Show an error message to the user
              }
          });
      });
  }
});  

// Function to save bookmark data to the server
function saveBookmark(bookmarkData, callback) {
  fetch('http://localhost:3000/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookmarkData),
  })
  .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
  })
  .then(data => {
      console.log('Bookmark saved:', data);
      callback({ success: true, data: data });
  })
  .catch(error => {
      console.error('Error saving bookmark:', error);
      callback({ success: false, error: error });
  });
}

// Helper function to display content in the clip-content section
function displayContent(clipContentElement, content) {
  if (typeof content === 'string') {
      clipContentElement.textContent = content;
  } else {
      clipContentElement.innerHTML = content;
  }
}