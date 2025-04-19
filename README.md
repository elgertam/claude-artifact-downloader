# Claude Artifact Downloader

A Chrome browser extension for downloading artifacts from Claude AI conversations. This extension uses the Claude API to reliably extract artifacts rather than scraping the DOM.

## Features

- 🔍 Scan Claude conversations for artifacts
- 📦 Download all artifacts as a neatly organized zip file
- 🏷️ Preserve artifact titles, types, and language information
- 📂 Organize artifacts into directories based on type
- 📝 Generate README files with artifact information
- 🌓 Support for dark and light modes

## Installation

### From Source

1. Clone this repository or download it as a ZIP file
2. Extract the contents to a folder
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" (toggle in the top-right corner)
5. Click "Load unpacked" and select the extension folder
6. The extension should now be installed and ready to use

## Usage

1. Navigate to a Claude conversation at [claude.ai](https://claude.ai/)
2. Click the extension icon in your browser toolbar
3. Click "Scan for Artifacts" to detect artifacts in the conversation
4. Review the list of detected artifacts
5. Click "Download All" to save the artifacts as a zip file

### Flat Mode

Toggle "Flat Mode" in the extension popup to:

- When disabled (default): Organize artifacts into directories by type (code, markdown, html, etc.)
- When enabled: Place all artifacts in the root directory without categorization
- The organization preference affects both file structure and README detail level

## Technical Details

### API Approach

This extension interacts with the Claude API to extract artifacts, providing several advantages:

1. **Reliability**: Does not depend on Claude's UI structure, making it more resistant to website changes
2. **Completeness**: Extracts all artifacts with their full metadata
3. **Error Handling**: Better error detection and reporting for API failures

### API Endpoints Used

- Organization ID: `https://claude.ai/api/organizations`
- Conversation data: `https://claude.ai/api/organizations/{orgId}/chat_conversations/{conversationId}`

### Architecture

- **manifest.json**: Contains extension configuration and permissions
- **popup/**: Contains the user interface (HTML, CSS, JavaScript)
- **content.js**: Handles communication with the Claude API
- **background.js**: Manages extension state and initialization

### Error Handling

- API failures are detected and reported with specific error messages
- Network errors are caught and displayed to the user
- Fallback mechanisms for downloading when Chrome's download API is unavailable

## Development

### Prerequisites

- Chrome/Chromium-based browser
- Basic knowledge of HTML, CSS, and JavaScript

### Local Development

1. Clone the repository
2. Make changes to the code
3. Load the extension in Chrome as described in the installation steps
4. Reload the extension after making changes (from the extensions page)

### Building for Distribution

1. Update the version number in `manifest.json`
2. Update the setup scripts with any new files or changes
3. Test the extension thoroughly
4. Package the extension using Chrome's "Pack Extension" feature

## Permissions

This extension requires the following permissions:

- `activeTab`: To interact with the Claude tab
- `downloads`: To download artifacts
- `scripting`: To execute scripts in the Claude tab
- `storage`: To save user preferences
- `host_permissions` for `https://claude.ai/*`: To access the Claude API

## Limitations

- Works only with Claude's web interface at claude.ai
- Requires being logged into Claude
- Cannot download artifacts from conversations you don't have access to

## Troubleshooting

### Common Issues

**Extension not detecting artifacts:**

- Make sure you're on a Claude conversation page
- Try refreshing the page and scanning again
- Check if you're logged into Claude

**Download fails:**

- Check your Chrome download settings
- Make sure you have sufficient disk space
- Try disabling other extensions that might interfere with downloads

## Privacy

This extension:

- Only accesses data from Claude conversations
- Does not send your data to any external servers
- All processing happens locally in your browser
- No tracking or analytics are included

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Acknowledgments

- [JSZip](https://stuk.github.io/jszip/) for zip file creation
- Anthropic for creating Claude AI
