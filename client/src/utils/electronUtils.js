// Utility functions for Electron integration

export const isElectron = () => {
  return window.platform && window.platform.isElectron;
};

export const getElectronAPI = () => {
  return window.electronAPI;
};

export const showSaveDialog = async (options = {}) => {
  if (!isElectron()) {
    console.warn('Save dialog not available outside Electron');
    return null;
  }
  
  const defaultOptions = {
    title: 'Save Excel File',
    defaultPath: 'insurance-data.xlsx',
    filters: [
      { name: 'Excel Files', extensions: ['xlsx'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  };
  
  return await getElectronAPI().showSaveDialog({ ...defaultOptions, ...options });
};

export const showMessageBox = async (options = {}) => {
  if (!isElectron()) {
    console.warn('Message box not available outside Electron');
    return null;
  }
  
  return await getElectronAPI().showMessageBox(options);
};

export const getAppVersion = async () => {
  if (!isElectron()) {
    return 'Web Version';
  }
  
  return await getElectronAPI().getVersion();
};

export const getAppDataPath = async () => {
  if (!isElectron()) {
    return null;
  }
  
  return await getElectronAPI().getAppDataPath();
};

// Enhanced file download for Electron
export const downloadFile = async (blob, filename = 'download.xlsx') => {
  if (isElectron()) {
    try {
      const result = await showSaveDialog({
        defaultPath: filename,
        title: 'Save Excel File'
      });
      
      if (!result.canceled && result.filePath) {
        // Convert blob to array buffer then to array for IPC
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Array.from(new Uint8Array(arrayBuffer));
        
        // Write the file using Electron's file system
        const writeResult = await getElectronAPI().writeFile(result.filePath, buffer);
        
        if (writeResult.success) {
          await showMessageBox({
            type: 'info',
            title: 'File Saved',
            message: `File saved successfully to: ${result.filePath}`,
            buttons: ['OK']
          });
        } else {
          throw new Error(writeResult.error || 'Failed to write file');
        }
      }
    } catch (error) {
      console.error('Error saving file in Electron:', error);
      await showMessageBox({
        type: 'error',
        title: 'Save Error',
        message: `Failed to save file: ${error.message}`,
        buttons: ['OK']
      });
    }
  } else {
    // Standard browser download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
};