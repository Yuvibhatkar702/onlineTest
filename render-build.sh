#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Starting build process..."

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm ci --only=production

# Go back to root and install client dependencies
echo "Installing client dependencies..."
cd ../client
npm ci

# Build the React app
echo "Building React application..."
npm run build

echo "Build completed successfully!"
