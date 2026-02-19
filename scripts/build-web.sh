#!/bin/bash
# Build script for web deployment (GitHub Pages)

set -e

echo "Building Mnemonic Realms for web deployment..."

# Clean previous build
rm -rf dist/

# Run RPG-JS build
pnpm build

# Copy PWA assets to dist
echo "Copying PWA assets..."
cp assets/manifest.json dist/standalone/
cp assets/icon-192.png dist/standalone/
cp assets/icon-512.png dist/standalone/
cp assets/screenshot-wide.png dist/standalone/
cp assets/service-worker.js dist/standalone/

echo "Web build complete! Output in dist/standalone/"
