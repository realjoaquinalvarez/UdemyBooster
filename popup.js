document.addEventListener('DOMContentLoaded', function() {
  const toggleAutoRefresh = document.getElementById('toggle-auto-refresh');
  const statusAutoRefresh = document.getElementById('status-auto-refresh');
  
  const toggleHideBar = document.getElementById('toggle-hide-bar');
  const statusHideBar = document.getElementById('status-hide-bar');
  
  const toggleAutoFocus = document.getElementById('toggle-auto-focus');
  const statusAutoFocus = document.getElementById('status-auto-focus');

  const toggleShowButtons = document.getElementById('toggle-show-buttons');

  const toggleShowAutoRefreshButton = document.getElementById('toggle-show-auto-refresh-button');
  const toggleShowHideBarButton = document.getElementById('toggle-show-hide-bar-button');
  const toggleShowAutoFocusButton = document.getElementById('toggle-show-auto-focus-button');

  // Initialize the state
  chrome.storage.sync.get([
    'autoReload', 
    'hideControls', 
    'autoFocus', 
    'showInPageButtons',
    'showAutoRefreshButton', 
    'showHideBarButton', 
    'showAutoFocusButton'
  ], function(result) {
    // Auto-Refresh
    const isAutoRefreshActive = result.autoReload !== false; // Default active
    toggleAutoRefresh.checked = isAutoRefreshActive;
    statusAutoRefresh.textContent = isAutoRefreshActive ? 'Activated' : 'Deactivated';

    // Hide Bar
    const isHideBarActive = result.hideControls === true;
    toggleHideBar.checked = isHideBarActive;
    statusHideBar.textContent = isHideBarActive ? 'Activated' : 'Deactivated';

    // Auto-Focus
    const isAutoFocusActive = result.autoFocus === true;
    toggleAutoFocus.checked = isAutoFocusActive;
    statusAutoFocus.textContent = isAutoFocusActive ? 'Activated' : 'Deactivated';

    // Show/Hide All Buttons
    const showButtons = result.showInPageButtons !== false; // Default show
    toggleShowButtons.textContent = showButtons ? 'Hide All Buttons' : 'Show All Buttons';

    // Small Buttons
    const showAutoRefreshButton = result.showAutoRefreshButton !== false; // Default show
    toggleShowAutoRefreshButton.textContent = showAutoRefreshButton ? '1' : '1';
    
    const showHideBarButton = result.showHideBarButton !== false; // Default show
    toggleShowHideBarButton.textContent = showHideBarButton ? '2' : '2';
    
    const showAutoFocusButton = result.showAutoFocusButton !== false; // Default show
    toggleShowAutoFocusButton.textContent = showAutoFocusButton ? '3' : '3';
  });

  // Auto-Refresh Toggle
  toggleAutoRefresh.addEventListener('change', function() {
    const isActive = toggleAutoRefresh.checked;
    chrome.storage.sync.set({ autoReload: isActive }, function() {
      statusAutoRefresh.textContent = isActive ? 'Activated' : 'Deactivated';
    });
  });

  // Hide Bar Toggle
  toggleHideBar.addEventListener('change', function() {
    const isActive = toggleHideBar.checked;
    chrome.storage.sync.set({ hideControls: isActive }, function() {
      statusHideBar.textContent = isActive ? 'Activated' : 'Deactivated';
    });
  });

  // Auto-Focus Toggle
  toggleAutoFocus.addEventListener('change', function() {
    const isActive = toggleAutoFocus.checked;
    chrome.storage.sync.set({ autoFocus: isActive }, function() {
      statusAutoFocus.textContent = isActive ? 'Activated' : 'Deactivated';
    });
  });

  // Show/Hide All In-Page Buttons
  toggleShowButtons.addEventListener('click', function() {
    chrome.storage.sync.get(['showInPageButtons'], function(result) {
      const isVisible = result.showInPageButtons !== false; // Default show
      chrome.storage.sync.set({ showInPageButtons: !isVisible }, function() {
        toggleShowButtons.textContent = !isVisible ? 'Show All Buttons' : 'Hide All Buttons';
      });
    });
  });

  // Show/Hide Auto-Refresh Button
  toggleShowAutoRefreshButton.addEventListener('click', function() {
    chrome.storage.sync.get(['showAutoRefreshButton'], function(result) {
      const isVisible = result.showAutoRefreshButton !== false; // Default show
      chrome.storage.sync.set({ showAutoRefreshButton: !isVisible }, function() {
        toggleShowAutoRefreshButton.textContent = !isVisible ? '1' : '1';
      });
    });
  });

  // Show/Hide Hide Bar Button
  toggleShowHideBarButton.addEventListener('click', function() {
    chrome.storage.sync.get(['showHideBarButton'], function(result) {
      const isVisible = result.showHideBarButton !== false; // Default show
      chrome.storage.sync.set({ showHideBarButton: !isVisible }, function() {
        toggleShowHideBarButton.textContent = !isVisible ? '2' : '2';
      });
    });
  });

  // Show/Hide Auto-Focus Button
  toggleShowAutoFocusButton.addEventListener('click', function() {
    chrome.storage.sync.get(['showAutoFocusButton'], function(result) {
      const isVisible = result.showAutoFocusButton !== false; // Default show
      chrome.storage.sync.set({ showAutoFocusButton: !isVisible }, function() {
        toggleShowAutoFocusButton.textContent = !isVisible ? '3' : '3';
      });
    });
  });
});
