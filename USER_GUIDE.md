# User Guide - Claude Artifact Downloader

This guide will walk you through using the Claude Artifact Downloader extension to extract and save artifacts from your Claude AI conversations.

## Getting Started

### Prerequisites

- The extension must be installed (see [Installation Guide](INSTALLATION.md))
- You must be logged into [Claude AI](https://claude.ai)
- You must be in a conversation that contains artifacts

### Basic Workflow

The basic workflow for using the extension is:

1. Navigate to a Claude conversation containing artifacts
2. Click the extension icon in your browser toolbar
3. Scan for artifacts in the conversation
4. Review the found artifacts
5. Download the artifacts as a zip file

## Detailed Instructions

### Step 1: Open a Claude Conversation

- Navigate to [Claude AI](https://claude.ai)
- Open an existing conversation containing artifacts, or create a new one
- If creating a new conversation, ask Claude to create artifacts for you (e.g., code, markdown documents, diagrams)

### Step 2: Access the Extension

- Click the Claude Artifact Downloader icon in your browser toolbar
- The extension popup will appear

### Step 3: Scan for Artifacts

- Click the "Scan for Artifacts" button in the popup
- The extension will analyze the current conversation
- You'll see a loading indicator while scanning is in progress
- If artifacts are found, they will be listed in the popup
- If no artifacts are found, you'll see a message indicating this

### Step 4: Review Artifacts

- Each found artifact will be displayed with:
  - Title (as assigned by Claude)
  - Type (Code, Markdown, Mermaid Diagram, etc.)
  - Checkbox for selection (checked by default)
- You can select or deselect artifacts using the checkboxes
- At least one artifact must be selected to enable the download button

### Step 5: Download Artifacts

- Click the "Download All" button
- The selected artifacts will be packaged into a zip file
- Your browser will prompt you to save the zip file
- Choose a location on your computer to save the file

### Step 6: Access Downloaded Artifacts

- Navigate to the location where you saved the zip file
- Extract the zip file using your system's extraction tool
- Open the extracted folder to access your artifacts

## Configuration Options

The extension provides two configuration options:

### Flat Mode

Flat Mode determines how your downloaded artifacts are organized:

- **Disabled (default)**:
  - Artifacts are organized into directories by type (code, markdown, html, etc.)
  - Code artifacts are further organized by language (python, javascript, etc.)
  - A detailed README.md is generated with comprehensive artifact information

- **Enabled**:
  - All artifacts are placed in the root directory of the zip file
  - A simpler README.md is generated with basic information

To toggle Flat Mode:

- Click the switch next to "Flat Mode" in the extension popup
- Your preference will be saved for future downloads

### Dark Mode

The extension interface can be switched between light and dark themes:

- **Light Mode (default)**: Light background with dark text
- **Dark Mode**: Dark background with light text

To toggle Dark Mode:

- Click the switch next to "Dark Mode" in the extension popup
- Your preference will be saved for future use

## Artifact Organization

### File Structure (Flat Mode Disabled - Default)

When Flat Mode is disabled (the default), the downloaded zip file will have the following organized structure:

```tree
claude-artifacts-[timestamp]/
├── README.md
├── code/
│   ├── python/
│   │   └── example_script.py
│   ├── javascript/
│   │   └── example_code.js
│   └── other/
│       └── example_code.txt
├── markdown/
│   └── document.md
├── diagrams/
│   └── flowchart.mmd
├── html/
│   └── webpage.html
├── svg/
│   └── image.svg
└── react/
    └── component.jsx
```

### File Structure (Flat Mode Enabled)

When Flat Mode is enabled, the downloaded zip file will have a simpler, flat structure:

```tree
claude-artifacts-[timestamp]/
├── README.md
├── example_script.py
├── example_code.js
├── document.md
├── flowchart.mmd
├── webpage.html
├── image.svg
└── component.jsx
```

### README.md Content

The generated README.md file contains:

- Download timestamp
- List of artifacts with:
  - Title
  - Type
  - Language (if applicable)
  - Filename
  - Creation timestamp

## Tips and Best Practices

### Getting the Most Out of the Extension

- **Scan after new artifacts**: Re-scan the conversation after Claude creates new artifacts
- **Descriptive file naming**: Suggest descriptive names when asking Claude to create artifacts
- **Organized requests**: Ask Claude to create related artifacts together for better organization
- **Using Enhanced Mode**: Keep Enhanced Mode enabled for better organization of multiple artifacts
- **Checking contents**: Always review the artifact contents before downloading to ensure they match your expectations

### Artifact Type Handling

The extension handles different artifact types as follows:

- **Code**: Saved with appropriate language-specific extensions (.py, .js, etc.)
- **Markdown**: Saved with .md extension
- **Mermaid Diagrams**: Saved with .mmd extension
- **HTML**: Saved with .html extension
- **SVG**: Saved with .svg extension
- **React Components**: Saved with .jsx extension

### Working with Downloaded Artifacts

After downloading and extracting artifacts:

- **Code artifacts**: Can be opened in your preferred code editor or IDE
- **Markdown artifacts**: Can be viewed in any markdown reader or editor
- **Mermaid diagrams**: Can be rendered using Mermaid-compatible tools
- **HTML artifacts**: Can be opened in any web browser
- **SVG artifacts**: Can be opened in browsers, vector editors, or image viewers
- **React components**: Can be integrated into React projects

## Troubleshooting

### Common Issues and Solutions

#### "No artifacts found" message

**Possible causes:**

- The current conversation doesn't contain any artifacts
- You're not on a Claude conversation page
- API connection issue

**Solutions:**

- Verify you're on a Claude conversation page containing artifacts
- Refresh the page and try scanning again
- Check if you're logged into Claude

#### Cannot download artifacts

**Possible causes:**

- Download permission not granted
- Network issue
- Browser download settings

**Solutions:**

- Check browser permissions for the extension
- Verify your internet connection
- Check browser download settings

#### Error messages

The extension will display specific error messages to help diagnose issues:

- API connection errors
- Authentication issues
- Parsing problems

Follow the instructions in the error message to resolve the issue.

## Privacy and Security

### Data Handling

- The extension accesses conversation data only when you click "Scan for Artifacts"
- All processing happens locally in your browser
- No data is sent to external servers
- The extension only accesses Claude conversations

### Permissions

The extension requires several permissions to function:

- **activeTab**: To access the current tab when you click the extension
- **downloads**: To download the zip file
- **scripting**: To extract information from the page
- **storage**: To save your preferences
- **host_permissions for claude.ai**: To access the Claude API

## Getting Help

If you encounter issues or have questions:

1. Check this User Guide and the [Troubleshooting](TROUBLESHOOTING.md) document
2. Visit the [GitHub repository](https://github.com/yourusername/claude-artifact-downloader)
3. Open an issue on GitHub if your problem persists
