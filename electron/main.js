const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development' || process.env.ELECTRON_IS_DEV === '1' || !app.isPackaged;

// Import embedded server runner for production
const { startEmbeddedServer } = isDev ? { startEmbeddedServer: () => {} } : require('./server-runner');

// Keep a global reference of the window object
let mainWindow;
let serverProcess;

// Server configuration
const SERVER_PORT = 5001;
const SERVER_HOST = 'localhost';

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../client/public/images/Cornerstone-Logo.png'),
    titleBarStyle: 'default',
    show: false
  });

  // Load the app
  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../client/build/index.html')}`;

  console.log('Loading URL:', startUrl);
  console.log('isDev:', isDev);
  
  mainWindow.loadURL(startUrl).catch(err => {
    console.error('Failed to load URL:', err);
  });

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Debug loading issues
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Page failed to load:', errorCode, errorDescription);
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page finished loading');
    // Force window to show and focus
    mainWindow.show();
    mainWindow.focus();
  });

  // Open the DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle window controls
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window-maximized');
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window-unmaximized');
  });
}

function startServer() {
  return new Promise((resolve, reject) => {
    const serverPath = isDev 
      ? path.join(__dirname, '../server')
      : path.join(app.getAppPath(), 'server');

    console.log('Starting server from:', serverPath);

    // Set up environment variables for the server
    const env = {
      ...process.env,
      NODE_ENV: isDev ? 'development' : 'production',
      PORT: SERVER_PORT,
      ELECTRON_MODE: 'true'
    };

    // In production, we need to ensure Excel files are available
    if (!isDev) {
      const dataDir = path.join(process.resourcesPath, 'data');
      const serverDataDir = path.join(serverPath, 'data');
      
      // Create server data directory if it doesn't exist
      if (!fs.existsSync(serverDataDir)) {
        fs.mkdirSync(serverDataDir, { recursive: true });
      }

      // Copy Excel files to server data directory if they don't exist
      const excelFiles = [
        'Cornerstone Benefit Analysis.xlsx',
        'SP 24 all lines SB V1.xlsx'
      ];

      excelFiles.forEach(filename => {
        const srcPath = path.join(dataDir, filename);
        const destPath = path.join(serverDataDir, filename);
        
        if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
          fs.copyFileSync(srcPath, destPath);
          console.log(`Copied ${filename} to server data directory`);
        }
      });
    }

    // Use electron's node executable
    const nodePath = isDev ? 'node' : process.execPath;
    const args = isDev ? ['server.js'] : [path.join(serverPath, 'server.js')];

    serverProcess = spawn(nodePath, args, {
      cwd: isDev ? serverPath : undefined,
      env: env,
      stdio: 'pipe'
    });

    serverProcess.stdout.on('data', (data) => {
      console.log(`Server: ${data}`);
      if (data.toString().includes(`Server running on port ${SERVER_PORT}`) || 
          data.toString().includes('Server started')) {
        resolve();
      }
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(`Server Error: ${data}`);
    });

    serverProcess.on('error', (error) => {
      console.error('Failed to start server:', error);
      reject(error);
    });

    serverProcess.on('close', (code) => {
      console.log(`Server process exited with code ${code}`);
      if (code !== 0) {
        reject(new Error(`Server exited with code ${code}`));
      }
    });

    // Timeout fallback
    setTimeout(() => {
      resolve(); // Assume server started if no explicit confirmation
    }, 5000);
  });
}

function stopServer() {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
}

// App event handlers
app.whenReady().then(async () => {
  try {
    if (isDev) {
      // Start server as separate process in development
      await startServer();
    } else {
      // Start embedded server in production
      startEmbeddedServer();
    }
    // Wait a bit for server to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    createWindow();
  } catch (error) {
    console.error('Failed to start application:', error);
    dialog.showErrorBox('Startup Error', `Failed to start the application: ${error.message}`);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  stopServer();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', () => {
  stopServer();
});

// IPC handlers
ipcMain.handle('app-version', () => {
  return app.getVersion();
});

ipcMain.handle('show-message-box', async (event, options) => {
  const result = await dialog.showMessageBox(mainWindow, options);
  return result;
});

ipcMain.handle('show-save-dialog', async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, options);
  return result;
});

ipcMain.handle('show-open-dialog', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result;
});

// Window control handlers
ipcMain.handle('window-minimize', () => {
  mainWindow.minimize();
});

ipcMain.handle('window-maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.handle('window-close', () => {
  mainWindow.close();
});

ipcMain.handle('get-app-data-path', () => {
  return app.getPath('userData');
});

// File writing handler
ipcMain.handle('write-file', async (event, filePath, buffer) => {
  try {
    // Convert the buffer array back to a Buffer
    const fileBuffer = Buffer.from(buffer);
    await fs.promises.writeFile(filePath, fileBuffer);
    return { success: true };
  } catch (error) {
    console.error('Error writing file:', error);
    return { success: false, error: error.message };
  }
});