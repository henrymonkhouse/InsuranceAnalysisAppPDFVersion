#!/bin/bash

echo "Starting Insurance Data App..."

# Kill any existing processes
pkill -f electron || true
pkill -f react-scripts || true
pkill -f "node.*server" || true

# Start backend server
echo "Starting backend server..."
cd "$PWD/server" && npm start &
SERVER_PID=$!

# Wait for server to start
sleep 2

# Start React dev server without opening browser
echo "Starting React app..."
cd "$PWD/client" && BROWSER=none npm start &
REACT_PID=$!

# Wait for React to be ready
echo "Waiting for React to start..."
while ! curl -s http://localhost:3000 > /dev/null; do
    sleep 1
done

echo "React is ready, starting Electron..."

# Start Electron
cd /Users/henrymonkhouse/Downloads/insurance-data-app-fixes-excel-mapping-alltabs\ 2 && npx electron .

# Cleanup on exit
kill $SERVER_PID $REACT_PID 2>/dev/null