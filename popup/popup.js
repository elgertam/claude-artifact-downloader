document.addEventListener('DOMContentLoaded', () => {
  const scanButton = document.getElementById('scanButton');
  const downloadButton = document.getElementById('downloadButton');
  const flatModeToggle = document.getElementById('flatMode');
  const darkModeToggle = document.getElementById('darkMode');
  const statusMessage = document.getElementById('statusMessage');
  const artifactsList = document.getElementById('artifactsList');
  const errorArea = document.getElementById('errorArea');
  const errorMessage = document.getElementById('errorMessage');
  const spinner = document.getElementById('spinner');
  
  // Load preferences
  chrome.storage.sync.get(['flatMode', 'darkMode'], (result) => {
    flatModeToggle.checked = result.flatMode || false;
    darkModeToggle.checked = result.darkMode || false;
    
    if (darkModeToggle.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  });
  
  // Save preferences when changed
  flatModeToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ flatMode: flatModeToggle.checked });
  });
  
  darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    chrome.storage.sync.set({ darkMode: darkModeToggle.checked });
  });
  
  // Scan for artifacts
  scanButton.addEventListener('click', async () => {
    resetUI();
    setLoading(true);
    
    try {
      // Get the current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Verify we're on a Claude page
      if (!tab.url.includes('claude.ai/chat')) {
        throw new Error('Please navigate to a Claude chat page to use this extension.');
      }
      
      // Get artifacts from the page
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'scanArtifacts' });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (!response.artifacts || response.artifacts.length === 0) {
        statusMessage.textContent = 'No artifacts found in this conversation.';
        return;
      }
      
      // Display artifacts
      displayArtifacts(response.artifacts);
      downloadButton.disabled = false;
      statusMessage.textContent = `Found ${response.artifacts.length} artifact(s).`;
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  });
  
  // Download artifacts
  downloadButton.addEventListener('click', async () => {
    setLoading(true);
    statusMessage.textContent = 'Preparing artifacts for download...';
    
    try {
      // Get selected artifacts
      const selectedArtifacts = getSelectedArtifacts();
      
      if (selectedArtifacts.length === 0) {
        throw new Error('Please select at least one artifact to download.');
      }
      
      // Get the current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Request download
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'downloadArtifacts',
        artifacts: selectedArtifacts,
        flatMode: flatModeToggle.checked
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      statusMessage.textContent = 'Artifacts downloaded successfully!';
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  });
  
  function displayArtifacts(artifacts) {
    artifactsList.innerHTML = '';
    
    artifacts.forEach((artifact, index) => {
      const item = document.createElement('div');
      item.className = 'artifact-item';
      
      const info = document.createElement('div');
      
      const title = document.createElement('div');
      title.className = 'artifact-title';
      title.textContent = artifact.title || `Artifact ${index + 1}`;
      
      const type = document.createElement('div');
      type.className = 'artifact-type';
      type.textContent = getReadableType(artifact.type);
      
      info.appendChild(title);
      info.appendChild(type);
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'checkbox';
      checkbox.checked = true;
      checkbox.dataset.id = artifact.id;
      
      item.appendChild(info);
      item.appendChild(checkbox);
      
      artifactsList.appendChild(item);
    });
  }
  
  function getReadableType(type) {
    const typeMap = {
      'application/vnd.ant.code': 'Code',
      'text/markdown': 'Markdown',
      'application/vnd.ant.mermaid': 'Mermaid Diagram',
      'application/vnd.ant.react': 'React Component',
      'text/html': 'HTML',
      'image/svg+xml': 'SVG Image'
    };
    
    return typeMap[type] || type;
  }
  
  function getSelectedArtifacts() {
    const checkboxes = artifactsList.querySelectorAll('.checkbox:checked');
    const selectedIds = Array.from(checkboxes).map(checkbox => checkbox.dataset.id);
    
    // Get artifacts with selected IDs from background script
    return selectedIds;
  }
  
  function resetUI() {
    errorArea.classList.add('hidden');
    artifactsList.innerHTML = '';
    downloadButton.disabled = true;
    statusMessage.textContent = '';
  }
  
  function setLoading(isLoading) {
    scanButton.disabled = isLoading;
    downloadButton.disabled = isLoading || artifactsList.children.length === 0;
    
    if (isLoading) {
      spinner.classList.remove('hidden');
    } else {
      spinner.classList.add('hidden');
    }
  }
  
  function showError(message) {
    errorArea.classList.remove('hidden');
    errorMessage.textContent = message;
    statusMessage.textContent = 'Error occurred. Please try again.';
  }
});