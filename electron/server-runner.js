// This file runs the server in the main process for production builds
const path = require('path');
const { app } = require('electron');

function startEmbeddedServer() {
  // Set up environment
  process.env.NODE_ENV = 'production';
  process.env.PORT = '5001';
  process.env.ELECTRON_MODE = 'true';
  
  // Use the unpacked server path (outside the ASAR archive)
  const serverPath = path.join(app.getAppPath(), '..', 'app.asar.unpacked', 'server');
  
  // Set the server path in environment for the server to use
  process.env.SERVER_PATH = serverPath;
  
  // Change to server directory since it's unpacked
  process.chdir(serverPath);
  
  // Require and start the server
  require(path.join(serverPath, 'server.js'));
}

module.exports = { startEmbeddedServer };