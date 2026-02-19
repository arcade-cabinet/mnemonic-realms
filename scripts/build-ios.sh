#!/bin/bash
# Build script for iOS deployment

set -e

echo "Building Mnemonic Realms for iOS..."

# Build web assets first
./scripts/build-web.sh

# Sync Capacitor assets to iOS
echo "Syncing assets to iOS..."
npx cap sync ios

# Open Xcode project
echo "iOS build prepared! Opening Xcode..."
npx cap open ios

echo "Complete iOS build in Xcode:"
echo "1. Select target device or simulator"
echo "2. Product > Archive for App Store distribution"
echo "3. Product > Build for testing on device"
