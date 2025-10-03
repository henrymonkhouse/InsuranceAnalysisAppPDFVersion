#!/bin/bash

# Start both frontend and backend for web development
echo "Starting Insurance Data App in Web Development Mode..."

# Start the backend server
echo "Starting backend server on port 3001..."
cd server && npm start &
BACKEND_PID=$!

# Wait a moment for backend to initialize
sleep 2

# Start the frontend React app
echo "Starting frontend on port 3000..."
cd ../client && npm start &
FRONTEND_PID=$!

echo ""
echo "🚀 Development servers running:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap 'kill $BACKEND_PID $FRONTEND_PID' INT
wait