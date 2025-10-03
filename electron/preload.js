const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getVersion: () => ipcRenderer.invoke('app-version'),
  
  // Dialog methods
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  
  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window-maximize'),
  closeWindow: () => ipcRenderer.invoke('window-close'),
  
  // App data path
  getAppDataPath: () => ipcRenderer.invoke('get-app-data-path'),
  
  // File operations
  writeFile: (filePath, buffer) => ipcRenderer.invoke('write-file', filePath, buffer),
  
  // Window state listeners
  onWindowMaximized: (callback) => {
    ipcRenderer.on('window-maximized', callback);
  },
  onWindowUnmaximized: (callback) => {
    ipcRenderer.on('window-unmaximized', callback);
  },
  
  // Remove listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

// Platform info
contextBridge.exposeInMainWorld('platform', {
  isElectron: true,
  platform: process.platform,
  arch: process.arch,
  versions: process.versions
});