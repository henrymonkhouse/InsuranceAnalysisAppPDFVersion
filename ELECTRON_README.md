# Insurance Data App - Electron Desktop Version

This is a complete Electron desktop application for managing insurance data and syncing with Excel files.

## 🚀 Features

- **Desktop Application**: Runs as a native desktop app on Windows, macOS, and Linux
- **Excel Integration**: Full Excel file processing with enhanced file dialogs
- **Cross-Platform**: Works on all major operating systems
- **Enhanced File Management**: Native save dialogs and file operations
- **Offline Capable**: No internet connection required once installed

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)

## 🛠️ Installation & Setup

### 1. Install Dependencies

First, install all required dependencies:

```bash
# Install root Electron dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### 2. Development Mode

To run the app in development mode:

```bash
# Option 1: Use the automated script
./start-electron-dev.sh

# Option 2: Manual steps
# Build the React client
cd client && npm run build

# Start the server
cd ../server && npm start &

# Start Electron (in a new terminal)
cd .. && npm run electron
```

### 3. Build for Production

To create a distributable package:

```bash
# Build the client
npm run build-client

# Create distributable packages
npm run dist
```

This will create installers in the `dist/` directory:
- **Windows**: `.exe` installer
- **macOS**: `.dmg` file
- **Linux**: `.AppImage` file

## 📁 Project Structure

```
insurance-data-app/
├── electron/              # Electron main process files
│   ├── main.js            # Main Electron process
│   └── preload.js         # Preload script for secure IPC
├── client/                # React frontend
├── server/                # Node.js backend
│   ├── data/              # Excel files and templates
│   ├── services/          # Excel processing services
│   └── utils/             # Cross-platform utilities
├── package.json           # Electron app configuration
└── start-electron-dev.sh  # Development startup script
```

## ⚙️ Configuration

### Environment Variables

The app automatically detects when running in Electron mode and adjusts:

- **ELECTRON_MODE**: Set to 'true' when running in Electron
- **NODE_ENV**: 'development' or 'production'
- **PORT**: Server port (5000 in Electron, 3001 in browser)

### File Paths

The app uses cross-platform path utilities that handle:
- Development vs production paths
- Resource files in packaged apps
- User data directories
- Excel template locations

## 🎯 Key Features

### Enhanced File Operations

- **Native Save Dialogs**: Uses OS-native file save dialogs
- **File Path Management**: Automatic handling of packaged app file paths
- **Excel File Handling**: Robust Excel file operations with fallback templates

### IPC Communication

Secure communication between Electron main and renderer processes:
- App version display
- Native dialog integration
- Window controls
- File system operations

### Cross-Platform Compatibility

- **Windows**: NSIS installer
- **macOS**: DMG with app signing support
- **Linux**: AppImage portable format

## 🔧 Development Commands

```bash
# Development mode with live server
npm run electron-dev

# Build client only
npm run build-client

# Package without installer
npm run pack

# Create distributable installers
npm run dist

# Build everything
npm run build
```

## 🐛 Troubleshooting

### Common Issues

1. **Server Not Starting**: Check that port 5000 is available
2. **Excel Files Missing**: Ensure template files exist in `server/data/`
3. **Build Failures**: Clear `node_modules` and reinstall dependencies

### Debug Mode

To run with debugging enabled:

```bash
# Enable Electron dev tools
DEBUG=* npm run electron-dev
```

### File Paths in Production

The app automatically copies Excel templates to the correct locations when packaged. If you encounter file path issues:

1. Check the console for path information
2. Verify Excel templates are in the `extraResources` section
3. Ensure `initializeDataDirectory()` runs successfully

## 📦 Distribution

### Code Signing (macOS)

For macOS distribution, you'll need to configure code signing:

1. Add your Apple Developer certificate
2. Update `package.json` with your team ID
3. Run `npm run dist` with signing enabled

### Windows Distribution

For Windows, the app creates an NSIS installer that:
- Installs the app to Program Files
- Creates desktop and start menu shortcuts
- Handles uninstallation properly

## 🎨 UI Enhancements

The Electron version includes:
- **App Version Display**: Shows version number in the header
- **Enhanced Downloads**: Native save dialogs for Excel files
- **Desktop Integration**: Proper window controls and taskbar integration
- **Offline Operation**: Full functionality without internet connection

## 📄 License

This application is for internal use with insurance data management.

---

**Ready to run!** Your insurance data app is now packaged as a complete desktop application with full Excel integration and cross-platform support.