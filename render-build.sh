#!/usr/bin/env bash
# exit on error
set -o errexit

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install

# Go back to root and install client dependencies
echo "Installing client dependencies..."
cd ../client
npm install

# Build the React app
echo "Building React application..."
npm run build

echo "Build completed successfully!"
