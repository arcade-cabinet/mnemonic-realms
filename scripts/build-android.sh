#!/bin/bash
# Build script for Android deployment

set -e

echo "Building Mnemonic Realms for Android..."

# Build web assets first
./scripts/build-web.sh

# Sync Capacitor assets to Android
echo "Syncing assets to Android..."
npx cap sync android

# Open Android Studio project
echo "Android build prepared! Opening Android Studio..."
npx cap open android

echo "Complete Android build in Android Studio:"
echo "1. Build > Generate Signed Bundle / APK"
echo "2. Select 'Android App Bundle' for Play Store"
echo "3. Select 'APK' for direct installation"
echo "4. Choose release build variant"
