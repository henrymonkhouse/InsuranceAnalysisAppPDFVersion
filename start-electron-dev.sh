#!/bin/bash

# Start Electron in development mode
echo "Starting Insurance Data App in Electron Development Mode..."

# Build the client first
echo "Building React client..."
cd client && npm run build

# Start the server in background
echo "Starting Node.js server..."
cd ../server && npm start &
SERVER_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
sleep 3

# Start Electron (if installed)
echo "Starting Electron..."
cd .. && npx electron .

# Cleanup: stop the server when Electron closes
echo "Cleaning up..."
kill $SERVER_PID