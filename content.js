// Store artifacts data
let conversationArtifacts = [];

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'scanArtifacts') {
    scanArtifacts()
      .then(artifacts => {
        conversationArtifacts = artifacts;
        sendResponse({ artifacts });
      })
      .catch(error => {
        console.error('Error scanning artifacts:', error);
        sendResponse({ error: error.message });
      });

    return true; // Indicate we will respond asynchronously
  }

  if (message.action === 'downloadArtifacts') {
    const selectedIds = message.artifacts;
    const selectedArtifacts = conversationArtifacts.filter(a => selectedIds.includes(a.id));

    downloadArtifacts(selectedArtifacts, message.flatMode)
      .then(() => {
        sendResponse({ success: true });
      })
      .catch(error => {
        console.error('Error downloading artifacts:', error);
        sendResponse({ error: error.message });
      });

    return true; // Indicate we will respond asynchronously
  }
});

/**
 * Scans the current conversation for artifacts
 * Uses Claude API to fetch conversation data
 */
async function scanArtifacts() {
  try {
    // Extract organization ID and conversation ID
    const orgId = await getOrganizationId();
    const conversationId = getConversationIdFromUrl();

    if (!orgId) {
      throw new Error('Could not retrieve organization ID');
    }

    if (!conversationId) {
      throw new Error('Could not extract conversation ID from URL');
    }

    // Fetch conversation data
    const conversation = await fetchConversation(orgId, conversationId);

    if (!conversation) {
      throw new Error('Could not fetch conversation data');
    }

    // Extract artifacts from conversation
    const artifacts = extractArtifactsFromConversation(conversation);

    return artifacts;
  } catch (error) {
    console.error('Error scanning artifacts:', error);
    throw error;
  }
}

/**
 * Gets the organization ID from Claude API
 */
async function getOrganizationId() {
  try {
    const response = await fetch('https://claude.ai/api/organizations', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch organizations: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.length) {
      throw new Error('No organizations found');
    }

    // Return the first organization's ID
    return data[0].uuid;
  } catch (error) {
    console.error('Error getting organization ID:', error);
    throw error;
  }
}

/**
 * Extracts the conversation ID from the URL
 */
function getConversationIdFromUrl() {
  const urlMatch = window.location.pathname.match(/\/chat\/([\w-]+)/);
  return urlMatch ? urlMatch[1] : null;
}

/**
 * Fetches conversation data from Claude API
 */
async function fetchConversation(orgId, conversationId) {
  try {
    const response = await fetch(`https://claude.ai/api/organizations/${orgId}/chat_conversations/${conversationId}?tree=True&rendering_mode=messages&render_all_tools=true`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch conversation: ${response.status}`);
    }

    const jsonBody = await response.json();
    return jsonBody;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
}

function extractArtifactsFromConversation(conversation, enhancedMode = true) {
  const artifacts = [];

  if (!conversation || !conversation.chat_messages) {
    return artifacts;
  }

  // Iterate through all messages in the conversation
  for (const message of conversation.chat_messages) {
    // Skip user messages, only look for assistant messages
    if (message.sender !== 'assistant') continue;

    // Process each content block in the message
    if (!message.content || !Array.isArray(message.content)) continue;

    for (const content of message.content) {
      // Look for tool_use blocks that are artifacts
      if (content.type === 'tool_use' && content.name === 'artifacts') {
        try {
          const artifact = {
            id: content.input.id,
            title: content.input.title,
            content: content.input.content,
            language: content.input.language || 'text',
            type: content.input.type || 'text/plain',
          };

          // Determine file extension based on language
          const fileExtension = getFileExtension(artifact.type, artifact.language);

          // Normalize filename
          let filename = artifact.title.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
          if (!filename.endsWith(fileExtension)) {
            filename += fileExtension;
          }

          // Determine directory path based on title pattern
          const dirPath = enhancedMode ? determineDirectoryPath(artifact.title) : '';

          // Add directory path if it exists
          const fullPath = dirPath ? `${dirPath}/${filename}` : filename;

          artifacts.push({
            ...artifact,
            filename: fullPath,
            originalName: artifact.title
          });
        } catch (error) {
          console.warn(`Error processing artifact: ${error.message}`);
        }
      }
    }
  }

  return artifacts;
}

/**
 * Determines the appropriate directory path based on the artifact title
 */
function determineDirectoryPath(title) {
  // Look for patterns like src/lib/component.js
  const pathMatch = title.match(/^(.*\/)[^\/]+$/);
  if (pathMatch) {
    return pathMatch[1];
  }

  // Special case for file extensions that usually indicate a specific directory
  if (title.endsWith('.py')) return 'python';
  if (title.endsWith('.js')) return 'javascript';
  if (title.endsWith('.ts')) return 'typescript';
  if (title.endsWith('.html')) return 'html';
  if (title.endsWith('.css')) return 'css';
  if (title.endsWith('.md')) return 'docs';

  return '';
}

/**
 * Creates a ZIP file with artifacts and triggers download
 */
async function downloadArtifacts(artifacts) {
  try {
    await loadJSZip();

    // Create a new JSZip instance
    const zip = new JSZip();

    // Track directories to create README files for each
    const directories = new Set();

    // Add artifacts to ZIP
    artifacts.forEach(artifact => {
      // Check if artifact has a directory path
      if (artifact.filename.includes('/')) {
        const dir = artifact.filename.substring(0, artifact.filename.lastIndexOf('/'));
        directories.add(dir);
      }

      zip.file(artifact.filename, artifact.content);
    });

    // Create EXTRACT.md
    const readme = generateExtract(artifacts);
    zip.file('EXTRACT.md', readme);

    // Create EXTRACT.md for each directory
    directories.forEach(dir => {
      const dirArtifacts = artifacts.filter(a => a.filename.startsWith(dir + '/'));

      if (dirArtifacts.length > 0) {
        const dirReadme = generateDirectoryExtract(dir, dirArtifacts);
        zip.file(`${dir}/EXTRACT.md`, dirReadme);
      }
    });

    // Generate ZIP file
    const content = await zip.generateAsync({ type: 'blob' });

    // Get conversation title for filename
    const conversationTitle = document.title.replace(' - Claude', '') || 'claude-conversation';
    const safeTitle = conversationTitle.replace(/[^a-zA-Z0-9_\-]/g, '_');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${safeTitle}-artifacts-${timestamp}.zip`;

    // Check if chrome.downloads is available
    if (chrome.downloads && chrome.downloads.download) {
      // Use Chrome downloads API
      chrome.downloads.download({
        url: URL.createObjectURL(content),
        filename: filename,
        saveAs: true
      });
    } else {
      // Fallback to creating a download link
      console.log("Chrome downloads API not available, using fallback download method");

      // Create a download link
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(content);
      downloadLink.download = filename;

      // Append to body, click, and remove
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }

    return true;
  } catch (error) {
    console.error('Error in downloadArtifacts:', error);
    throw error;
  }
}

/**
 * Prepares artifact file with proper filepath and content
 */
function prepareArtifactFile(artifact, flatMode) {
  let filename = sanitizeFilename(artifact.title);
  let extension = getFileExtension(artifact.type, artifact.language);

  // Add extension if not present
  if (!filename.endsWith(extension)) {
    filename += extension;
  }

  // Determine filepath based on flat mode
  let filepath = filename;

  if (!flatMode) {
    // In organized mode (not flat), organize by type
    const typeFolder = getTypeFolderName(artifact.type);
    filepath = `${typeFolder}/${filename}`;

    // For code artifacts, add language subfolder if available
    if (artifact.type === 'application/vnd.ant.code' && artifact.language) {
      filepath = `${typeFolder}/${artifact.language}/${filename}`;
    }
  }

  return {
    filepath,
    content: artifact.content
  };
}

/**
 * Sanitizes filename to be safe for filesystem
 */
function sanitizeFilename(filename) {
  if (!filename) return 'untitled';

  // Replace invalid characters with dash
  return filename
    .replace(/[<>:"/\\|?*]/g, '-')
    .replace(/\s+/g, '_')
    .trim();
}

/**
 * Gets appropriate file extension based on artifact type and language
 */
function getFileExtension(type, language) {
  const typeExtMap = {
    'text/markdown': '.md',
    'text/html': '.html',
    'image/svg+xml': '.svg',
    'application/vnd.ant.mermaid': '.mmd',
    'application/vnd.ant.react': '.jsx'
  };

  // Special handling for code artifacts based on language
  if (type === 'application/vnd.ant.code') {
    const langExtMap = {
      'javascript': '.js',
      'typescript': '.ts',
      'python': '.py',
      'java': '.java',
      'c': '.c',
      'cpp': '.cpp',
      'csharp': '.cs',
      'php': '.php',
      'ruby': '.rb',
      'go': '.go',
      'rust': '.rs',
      'swift': '.swift',
      'kotlin': '.kt',
      'bash': '.sh',
      'powershell': '.ps1',
      'sql': '.sql',
      'html': '.html',
      'css': '.css',
      'json': '.json',
      'yaml': '.yml',
      'dockerfile': 'Dockerfile',
      'plaintext': '.txt'
    };

    return langExtMap[language] || '.txt';
  }

  return typeExtMap[type] || '.txt';
}

/**
 * Gets folder name for organizing artifacts by type
 */
function getTypeFolderName(type) {
  const typeFolderMap = {
    'application/vnd.ant.code': 'code',
    'text/markdown': 'markdown',
    'text/html': 'html',
    'image/svg+xml': 'svg',
    'application/vnd.ant.mermaid': 'diagrams',
    'application/vnd.ant.react': 'react'
  };

  return typeFolderMap[type] || 'other';
}

/**
 * Generates EXTRACT.md with artifact information
 */
function generateExtract(artifacts) {
  const now = new Date().toLocaleString();
  let readme = `# Claude Artifacts\n\nDownloaded on: ${now}\n\n## Artifacts\n\n`;

  for (const artifact of artifacts) {
    const extension = getFileExtension(artifact.type, artifact.language);
    const filename = sanitizeFilename(artifact.title) + (sanitizeFilename(artifact.title).endsWith(extension) ? '' : extension);
    const type = getReadableType(artifact.type);
    const language = artifact.language ? ` (${artifact.language.toUpperCase()})` : '';

    readme += `### ${artifact.title}\n\n`;
    readme += `- **Type**: ${type}${language}\n`;
    readme += `- **Filename**: \`${filename}\`\n`;

    if (artifact.timestamp) {
      const timestamp = new Date(artifact.timestamp).toLocaleString();
      readme += `- **Created**: ${timestamp}\n`;
    }

    readme += '\n';
  }

  readme += `\n## About\n\nThese artifacts were extracted using the Claude Artifact Downloader Chrome extension.\n`;

  return readme;
}

/**
 * Generates a EXTRACT.md file for a specific directory
 */
function generateDirectoryExtract(directory, artifacts) {
  let readme = `# ${directory}/\n\n`;
  readme += `This directory contains ${artifacts.length} artifact${artifacts.length === 1 ? '' : 's'} extracted from a Claude AI conversation.\n\n`;

  readme += '## Files\n\n';

  artifacts.forEach(artifact => {
    const filename = artifact.filename.substring(artifact.filename.lastIndexOf('/') + 1);
    readme += `- **${filename}**: ${artifact.originalName} (${artifact.language})\n`;
  });

  return readme;
}

/**
 * Gets human-readable type name
 */
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

/**
 * Loads JSZip library
 */
async function loadJSZip() {
  return new Promise((resolve, reject) => {
    // Check if JSZip is already loaded
    if (window.JSZip) {
      resolve();
      return;
    }

    // Load JSZip if not already available
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Failed to load JSZip library'));
    document.body.appendChild(script);
  });
}
