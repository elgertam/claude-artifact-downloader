# Installation Guide

This guide will walk you through installing the Claude Artifact Downloader extension for Chrome and other Chromium-based browsers.

## Prerequisites

- Chrome, Edge, or another Chromium-based browser
- Basic familiarity with browser extensions

## Installation Methods

### Method 1: Using Setup Scripts (Recommended)

#### For Linux/macOS Users

1. **Download the setup script**
   - Download `setup.sh` from this repository

2. **Make the script executable**
   ```bash
   chmod +x setup.sh
   ```

3. **Run the script**
   ```bash
   ./setup.sh
   ```

4. **Follow on-screen instructions**
   - The script will create all necessary files and guide you through loading the extension in Chrome

#### For Windows Users

1. **Download the setup script**
   - Download `setup.bat` from this repository

2. **Run the script**
   - Double-click `setup.bat` to run it
   - If you receive security warnings, you may need to right-click and select "Run as administrator"

3. **Follow on-screen instructions**
   - The script will create all necessary files and guide you through loading the extension in Chrome

### Method 2: Manual Installation

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/yourusername/claude-artifact-downloader.git
   ```
   
   Alternatively, download the ZIP file and extract it

2. **Open Chrome's extension management page**
   - Navigate to `chrome://extensions/`
   - Or select Menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the extension**
   - Click "Load unpacked"
   - Navigate to and select the extension directory

5. **Verify installation**
   - The extension should appear in your browser toolbar
   - If not, click the puzzle piece icon to access and pin the extension

## Troubleshooting Installation

### Common Issues

#### "Load unpacked" button not visible
- Make sure Developer mode is enabled (toggle in top-right corner)

#### "Manifest file missing or unreadable"
- Ensure all files are properly extracted and the directory structure is maintained
- Check that manifest.json exists in the root of the extension directory

#### Extension not appearing in toolbar
- Click the puzzle piece icon in your browser toolbar
- Find "Claude Artifact Downloader" in the list and pin it

#### Security warnings
- Chrome will warn that you're using an extension in developer mode
- This is normal for unpacked extensions
- Click "Keep" or "Continue" to proceed

#### Permission warnings
- The extension requires certain permissions to function
- Review the permissions and accept them if you're comfortable

## Verifying Successful Installation

1. **Check the extension icon**
   - The extension icon should appear in your browser toolbar
   - It should show the Claude Artifact Downloader logo

2. **Open a Claude conversation**
   - Navigate to [claude.ai](https://claude.ai)
   - Open an existing conversation or start a new one

3. **Click the extension icon**
   - The popup should open and display the user interface
   - You should see the "Scan for Artifacts" button

## Updating the Extension

When a new version is released, you have two options:

1. **Using setup scripts**
   - Run the setup script again to update all files

2. **Manual update**
   - Download the latest version
   - Replace the existing extension directory
   - Go to `chrome://extensions/`
   - Click the refresh icon on the Claude Artifact Downloader extension

## Uninstalling

1. **Go to `chrome://extensions/`**
2. **Find Claude Artifact Downloader**
3. **Click "Remove"**
4. **Confirm removal when prompted**

## Next Steps

After installation, proceed to the [User Guide](USER_GUIDE.md) to learn how to use the extension effectively.

## Support

If you encounter any issues during installation, please:

1. Check the [Troubleshooting](TROUBLESHOOTING.md) guide
2. Open an issue on GitHub if your problem persists