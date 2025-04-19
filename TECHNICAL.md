# Claude Artifact Downloader - Technical Documentation

This document provides a detailed technical overview of the Claude Artifact Downloader extension, focusing on the API implementation, data flow, and architecture.

## API Implementation

### Endpoint Overview

The extension uses the following Claude API endpoints:

1. **Organization Retrieval**:
   - Endpoint: `https://claude.ai/api/organizations`
   - Method: `GET`
   - Purpose: Retrieve the organization ID required for subsequent API calls
   - Response: Array of organization objects containing UUIDs

2. **Conversation Data**:
   - Endpoint: `https://claude.ai/api/organizations/{orgId}/chat_conversations/{conversationId}`
   - Method: `GET`
   - Purpose: Retrieve complete conversation data including messages and artifacts
   - Response: Conversation object with messages array containing artifact data

### Authentication

The extension relies on the user's existing authentication with Claude. API requests include:
- `credentials: 'include'` to send cookies with requests
- Content-Type headers set to `application/json`

This approach avoids having to handle authentication directly, making the extension simpler and more secure.

### API Response Structure

#### Organization Object

```json
[
  {
    "uuid": "org_12345abcde",
    "name": "Personal",
    "is_active": true,
    "role": "OWNER",
    "capabilities": {
      // Capability flags
    }
  }
]
```

#### Conversation Object

```json
{
  "uuid": "chat_12345abcde",
  "name": "Conversation Name",
  "summary": "Conversation summary",
  "created_at": "2025-04-15T10:30:00.000Z",
  "updated_at": "2025-04-15T10:35:00.000Z",
  "chat_messages": [
    {
      "id": "msg_12345",
      "sender": "human",
      "text": "Can you create a code artifact for me?",
      "created_at": "2025-04-15T10:30:00.000Z"
    },
    {
      "id": "msg_67890",
      "sender": "assistant",
      "text": "Here's a code artifact for you.",
      "created_at": "2025-04-15T10:32:00.000Z",
      "artifacts": [
        {
          "id": "art_12345",
          "mime_type": "application/vnd.ant.code",
          "title": "Example Code",
          "language": "javascript",
          "content": "function example() {\n  console.log('Hello world');\n}"
        }
      ]
    }
  ]
}
```

## Data Flow Architecture

The extension follows a modular architecture with clear separation of concerns:

1. **Popup Interface** → **Content Script** → **Claude API** → **Processing** → **Download**

### Detailed Flow

1. **User Interaction**
   - User clicks "Scan for Artifacts" in the popup
   - Popup sends message to the content script

2. **API Request Chain**
   - Content script extracts conversation ID from the URL
   - Content script requests organization ID from the organizations endpoint
   - Content script requests conversation data using the organization ID and conversation ID

3. **Data Processing**
   - Content script parses the conversation data
   - Content script extracts artifacts from assistant messages
   - Content script builds artifact metadata

4. **Artifact Organization**
   - When "Download All" is clicked, the extension organizes artifacts based on user preferences
   - In enhanced mode, artifacts are organized by type and language in subdirectories
   - A README is generated with details about each artifact

5. **Packaging & Download**
   - JSZip library creates a zip file containing all artifacts
   - Chrome downloads API initiates the download
   - Fallback mechanism uses a dynamic anchor element if Chrome API fails

## Extension Components

### manifest.json

This is the configuration file for the Chrome extension, defining:
- Permissions required
- Extension metadata
- Script execution contexts
- Browser action (popup) details

### popup/

Contains the user interface components:
- **popup.html**: The main extension popup structure
- **popup.css**: Styling for the popup, including dark/light mode
- **popup.js**: User interaction handling and messaging to content script

### content.js

Core functionality implementation:
- API communication
- Conversation parsing
- Artifact extraction
- Zip file creation and downloading

### background.js

Provides extension lifecycle management:
- Initialization on installation
- Default preference setting
- Event handling for tab updates
- Error logging

## Key Technical Features

### In-Memory Processing

The extension processes artifacts entirely in memory:
1. Artifacts are extracted from the API response
2. JSZip creates the zip file in memory
3. The zip is converted to a blob and downloaded

This approach avoids storing sensitive data on disk and provides better performance.

### Self-Contained Design

The extension runs entirely within the browser and requires:
- No external servers
- No permanent storage beyond user preferences
- No cross-origin requests except to Claude's own API

### Configuration Parameters

The extension provides two main configuration options:

1. **Enhanced Mode**
   - When enabled:
     - Organizes artifacts into type-based directories
     - Creates language subdirectories for code artifacts
     - Generates more detailed README
   - When disabled:
     - Flat structure with all artifacts in root directory
     - Simpler README

2. **Dark Mode**
   - Toggles between light and dark themes
   - Preference is stored in browser storage
   - Default is based on system preferences

## Error Handling

### Comprehensive Error Detection

The extension implements error handling at multiple levels:

1. **API Communication Errors**
   - Network failures
   - Authentication issues
   - Rate limiting
   - Malformed responses

2. **Artifact Processing Errors**
   - Missing or corrupted artifact data
   - Unsupported artifact types
   - Invalid content

3. **Download Errors**
   - Chrome API failures
   - Storage permission issues
   - Zip creation errors

### Recovery Strategies

1. **API Failure Recovery**
   - Clear error messages displayed to user
   - Instruction prompts for common errors (e.g., "Please refresh the page and try again")

2. **Download Fallbacks**
   - Primary: Chrome downloads API
   - Fallback: Dynamic anchor element + click
   - Last resort: Data URL generation

## Browser Compatibility

The extension is compatible with:
- Chrome (version 88+)
- Edge (version 88+)
- Other Chromium-based browsers that support Manifest V3

## Security Considerations

### Data Privacy

- All processing happens locally in the browser
- No data is sent to external servers
- API requests only occur with Claude's own backend

### Permission Usage

- **activeTab**: Used only when the user interacts with the extension
- **downloads**: Used only when the user clicks "Download All"
- **scripting**: Used to extract conversation ID from URL
- **storage**: Used only for saving user preferences

### Content Security

- All dynamically created content is sanitized
- No external scripts are loaded
- JSZip is the only external library, loaded from a trusted CDN

## Future Enhancements

Planned technical improvements:

1. **Selective Artifact Download**
   - Allow users to choose specific artifacts for download
   - Implement individual artifact download option

2. **Custom Naming Schemes**
   - Allow users to define custom naming patterns
   - Support for customizable directory structures

3. **Local Storage Option**
   - Optional caching of artifacts for faster repeated downloads
   - Auto-sync with previous downloads to create artifact collections

4. **Batch Processing**
   - Support for scanning multiple conversations
   - Bulk downloading from conversation history

## Implementation Challenges

### API Limitations

- Claude's API is not publicly documented
- Endpoints may change without notice
- Rate limiting is not explicitly documented

### Artifact Variability

- Different artifact types require specialized handling
- Code artifacts require language-specific file extensions
- Some artifacts may have unusual character encoding

## Performance Optimization

The extension implements several optimizations:

1. **Lazy Loading**
   - JSZip library is loaded only when needed
   - API requests are made only when explicitly triggered

2. **Memory Management**
   - Large blobs are revoked after download
   - Temporary objects are properly cleaned up

3. **UI Responsiveness**
   - Asynchronous processing with proper UI feedback
   - Loading indicators for long operations
   - Throttled UI updates during processing

## Testing Methodology

The extension was tested across various scenarios:

1. **API Interaction Testing**
   - Success cases with different organization structures
   - Error handling with various API failure modes
   - Rate limiting and timeout handling

2. **Artifact Extraction Testing**
   - Various artifact types and combinations
   - Edge cases (empty artifacts, very large artifacts)
   - Special characters and encoding issues

3. **UI Testing**
   - Dark/light mode switching
   - Responsive design for different window sizes
   - Accessibility validation

## Appendix: API Endpoint Details

### Organizations Endpoint

- URL: `https://claude.ai/api/organizations`
- Method: GET
- Headers: 
  ```
  Content-Type: application/json
  ```
- Authentication: Uses existing Claude session cookies
- Response Format: JSON array of organization objects

### Conversation Endpoint

- URL: `https://claude.ai/api/organizations/{orgId}/chat_conversations/{conversationId}`
- Method: GET
- Parameters:
  - `orgId`: Organization UUID from the organizations endpoint
  - `conversationId`: UUID from the current URL
- Headers: 
  ```
  Content-Type: application/json
  ```
- Authentication: Uses existing Claude session cookies
- Response Format: JSON conversation object with nested messages and artifacts