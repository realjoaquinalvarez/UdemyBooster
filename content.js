(function() {
  let lastUrl = location.href;
  let autoReloadIntervalId = null;
  let hideControlsStyle = null;
  let autoFocusActive = false;
  let titleHidden = false;

  // Function to start auto-reload
  function startAutoReload() {
    if (autoReloadIntervalId === null) {
      autoReloadIntervalId = setInterval(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
          lastUrl = currentUrl;
          location.reload();
        }
      }, 1000); // Check every second
    }
  }

  // Function to stop auto-reload
  function stopAutoReload() {
    if (autoReloadIntervalId !== null) {
      clearInterval(autoReloadIntervalId);
      autoReloadIntervalId = null;
    }
  }

  // Function to hide video controls
  function hideVideoControls() {
    hideControlsStyle = document.createElement('style');
    hideControlsStyle.type = 'text/css';
    hideControlsStyle.id = 'udemy-hide-controls-style';
    hideControlsStyle.innerHTML = `
      [class*="shaka-control-bar--control-bar-container--"] {
        display: none !important;
      }
    `;
    document.head.appendChild(hideControlsStyle);
    // Hide title if in fullscreen
    if (document.fullscreenElement) {
      hideVideoTitle();
    }
  }

  // Function to show video controls
  function showVideoControls() {
    if (hideControlsStyle) {
      hideControlsStyle.remove();
      hideControlsStyle = null;
    }
    // Show title if it was hidden
    if (titleHidden) {
      showVideoTitle();
    }
  }

  // Function to hide the video title in fullscreen
  function hideVideoTitle() {
    const titleElement = document.querySelector('.ud-text-xl.video-viewer--title-overlay--YZQuH');
    if (titleElement) {
      titleElement.style.display = 'none';
      titleHidden = true;
    }
  }

  // Function to show the video title
  function showVideoTitle() {
    const titleElement = document.querySelector('.ud-text-xl.video-viewer--title-overlay--YZQuH');
    if (titleElement) {
      titleElement.style.display = '';
      titleHidden = false;
    }
  }

  // Function to handle fullscreen changes
  function handleFullscreenChange() {
    chrome.storage.sync.get(['hideControls'], function(result) {
      const isHideBarActive = result.hideControls === true;
      if (isHideBarActive) {
        if (document.fullscreenElement) {
          hideVideoTitle();
        } else {
          showVideoTitle();
        }
      }
    });
  }

  // Function to create in-page buttons
  function createInPageButtons() {
    const existingContainer = document.getElementById('udemy-extension-container');
    if (existingContainer) return;

    const container = document.createElement('div');
    container.id = 'udemy-extension-container';
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.left = '20px';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';
    container.style.zIndex = '1000';

    const buttonStyle = `
      padding: 10px 15px;
      background-color: #4caf50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      transition: background-color 0.3s;
      display: flex;
      align-items: center;
      gap: 5px;
    `;

    // Auto-Refresh Button
    const autoRefreshButton = document.createElement('button');
    autoRefreshButton.id = 'udemy-auto-refresh-button';
    autoRefreshButton.textContent = 'Auto-Refresh';
    autoRefreshButton.style.cssText = buttonStyle;
    autoRefreshButton.addEventListener('click', () => {
      chrome.storage.sync.get(['autoReload'], function(result) {
        const isActive = result.autoReload !== false;
        chrome.storage.sync.set({ autoReload: !isActive }, function() {
          autoRefreshButton.style.backgroundColor = !isActive ? '#4caf50' : '#f44336';
          autoRefreshButton.blur();
        });
      });
    });

    // Hide Bar Button
    const hideBarButton = document.createElement('button');
    hideBarButton.id = 'udemy-hide-bar-button';
    hideBarButton.innerHTML = 'Hide Bar <span style="font-size: 12px; opacity: 0.8;">(Shortcut: "v")</span>';
    hideBarButton.style.cssText = buttonStyle;
    hideBarButton.addEventListener('click', () => {
      chrome.storage.sync.get(['hideControls'], function(result) {
        const isActive = result.hideControls === true;
        chrome.storage.sync.set({ hideControls: !isActive }, function() {
          hideBarButton.style.backgroundColor = !isActive ? '#4caf50' : '#f44336';
          hideBarButton.blur();
        });
      });
    });

    // Auto-Focus Button
    const autoFocusButton = document.createElement('button');
    autoFocusButton.id = 'udemy-auto-focus-button';
    autoFocusButton.textContent = 'Auto-Focus';
    autoFocusButton.style.cssText = buttonStyle;
    autoFocusButton.addEventListener('click', () => {
      chrome.storage.sync.get(['autoFocus'], function(result) {
        const isActive = result.autoFocus === true;
        chrome.storage.sync.set({ autoFocus: !isActive }, function() {
          autoFocusButton.style.backgroundColor = !isActive ? '#4caf50' : '#f44336';
          autoFocusButton.blur();
        });
      });
    });

    // Hover Effects
    [autoRefreshButton, hideBarButton, autoFocusButton].forEach(button => {
      button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#45a049';
      });
      button.addEventListener('mouseout', () => {
        chrome.storage.sync.get(['autoReload', 'hideControls', 'autoFocus'], function(result) {
          if (button.id === 'udemy-auto-refresh-button') {
            const isActive = result.autoReload !== false;
            button.style.backgroundColor = isActive ? '#4caf50' : '#f44336';
          }
          if (button.id === 'udemy-hide-bar-button') {
            const isActive = result.hideControls === true;
            button.style.backgroundColor = isActive ? '#4caf50' : '#f44336';
          }
          if (button.id === 'udemy-auto-focus-button') {
            const isActive = result.autoFocus === true;
            button.style.backgroundColor = isActive ? '#4caf50' : '#f44336';
          }
        });
      });
    });

    // Append Buttons
    container.appendChild(autoRefreshButton);
    container.appendChild(hideBarButton);
    container.appendChild(autoFocusButton);
    document.body.appendChild(container);

    // Initialize Button Colors
    chrome.storage.sync.get(['autoReload', 'hideControls', 'autoFocus'], function(result) {
      autoRefreshButton.style.backgroundColor = result.autoReload !== false ? '#4caf50' : '#f44336';
      hideBarButton.style.backgroundColor = result.hideControls === true ? '#4caf50' : '#f44336';
      autoFocusButton.style.backgroundColor = result.autoFocus === true ? '#4caf50' : '#f44336';
    });

    // Show/Hide Buttons based on settings
    chrome.storage.sync.get(['showAutoRefreshButton', 'showHideBarButton', 'showAutoFocusButton'], function(result) {
      const showAutoRefresh = result.showAutoRefreshButton !== false;
      const showHideBar = result.showHideBarButton !== false;
      const showAutoFocus = result.showAutoFocusButton !== false;

      autoRefreshButton.style.display = showAutoRefresh ? 'flex' : 'none';
      hideBarButton.style.display = showHideBar ? 'flex' : 'none';
      autoFocusButton.style.display = showAutoFocus ? 'flex' : 'none';
    });
  }

  // Handle Keyboard Shortcut "v"
  function handleKeyboardShortcut(event) {
    if (event.key.toLowerCase() === 'v') {
      chrome.storage.sync.get(['hideControls'], function(result) {
        const isActive = result.hideControls === true;
        chrome.storage.sync.set({ hideControls: !isActive }, function() {
          // Optional: Show notification
        });
      });
    }
  }

  // Apply Auto-Focus
  function applyAutoFocus() {
    function waitForVideo(callback) {
      const video = document.querySelector('video');
      if (video) {
        callback(video);
      } else {
        setTimeout(() => waitForVideo(callback), 500);
      }
    }

    waitForVideo(function(video) {
      video.setAttribute('tabindex', '-1');

      document.addEventListener('focusin', function(event) {
        if (event.target !== video) {
          video.focus();
        }
      });

      const controlSelectors = [
        '[data-purpose="video-control-bar"]',
        '[class*="shaka-control-bar--control-bar-container--"]',
      ];

      controlSelectors.forEach(selector => {
        const controls = document.querySelectorAll(selector);
        controls.forEach(control => {
          control.addEventListener('click', () => {
            video.focus();
          });
        });
      });

      video.focus();

      const observer = new MutationObserver(() => {
        const currentVideo = document.querySelector('video');
        if (currentVideo && currentVideo !== video) {
          currentVideo.setAttribute('tabindex', '-1');
          currentVideo.focus();
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  // Initialize
  chrome.storage.sync.get([
    'autoReload', 
    'hideControls', 
    'autoFocus', 
    'showInPageButtons', 
    'showAutoRefreshButton', 
    'showHideBarButton', 
    'showAutoFocusButton'
  ], function(result) {
    if (result.autoReload !== false) startAutoReload();
    if (result.hideControls === true) hideVideoControls();
    if (result.autoFocus === true) applyAutoFocus();
    createInPageButtons();
    document.addEventListener('keydown', handleKeyboardShortcut);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
  });

  // Listen for Changes
  chrome.storage.onChanged.addListener(function(changes, area) {
    if (area === 'sync') {
      if ('autoReload' in changes) {
        const isActive = changes.autoReload.newValue !== false;
        isActive ? startAutoReload() : stopAutoReload();
        const btn = document.getElementById('udemy-auto-refresh-button');
        if (btn) btn.style.backgroundColor = isActive ? '#4caf50' : '#f44336';
      }

      if ('hideControls' in changes) {
        const isActive = changes.hideControls.newValue === true;
        isActive ? hideVideoControls() : showVideoControls();
        const btn = document.getElementById('udemy-hide-bar-button');
        if (btn) btn.style.backgroundColor = isActive ? '#4caf50' : '#f44336';
        // Handle hiding/showing title in fullscreen
        if (document.fullscreenElement) {
          isActive ? hideVideoTitle() : showVideoTitle();
        }
      }

      if ('autoFocus' in changes) {
        const isActive = changes.autoFocus.newValue === true;
        isActive ? applyAutoFocus() : location.reload();
        const btn = document.getElementById('udemy-auto-focus-button');
        if (btn) btn.style.backgroundColor = isActive ? '#4caf50' : '#f44336';
      }

      if ('showInPageButtons' in changes) {
        const isVisible = changes.showInPageButtons.newValue !== false;
        const container = document.getElementById('udemy-extension-container');
        if (container) {
          container.style.display = isVisible ? 'flex' : 'none';
        }
      }

      if ('showAutoRefreshButton' in changes) {
        const isVisible = changes.showAutoRefreshButton.newValue !== false;
        const btn = document.getElementById('udemy-auto-refresh-button');
        if (btn) btn.style.display = isVisible ? 'flex' : 'none';
      }

      if ('showHideBarButton' in changes) {
        const isVisible = changes.showHideBarButton.newValue !== false;
        const btn = document.getElementById('udemy-hide-bar-button');
        if (btn) btn.style.display = isVisible ? 'flex' : 'none';
      }

      if ('showAutoFocusButton' in changes) {
        const isVisible = changes.showAutoFocusButton.newValue !== false;
        const btn = document.getElementById('udemy-auto-focus-button');
        if (btn) btn.style.display = isVisible ? 'flex' : 'none';
      }
    }
  });

  // Functions to hide/show video title
  function hideVideoTitle() {
    const titleElement = document.querySelector('.ud-text-xl.video-viewer--title-overlay--YZQuH');
    if (titleElement) {
      titleElement.style.display = 'none';
      titleHidden = true;
    }
  }

  function showVideoTitle() {
    const titleElement = document.querySelector('.ud-text-xl.video-viewer--title-overlay--YZQuH');
    if (titleElement) {
      titleElement.style.display = '';
      titleHidden = false;
    }
  }
})();
