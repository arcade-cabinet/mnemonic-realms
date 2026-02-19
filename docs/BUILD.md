# Build and Deployment Guide

## Overview

Mnemonic Realms supports three deployment targets:
1. **Web (GitHub Pages)** — Browser-based PWA with offline support
2. **iOS** — Native iOS app via Capacitor
3. **Android** — Native Android app via Capacitor

## Prerequisites

### All Platforms
- Node.js 18+ and pnpm
- Git

### iOS (macOS only)
- Xcode 14+ with Command Line Tools
- iOS Simulator or physical device
- Apple Developer account (for App Store distribution)

### Android
- Android Studio with SDK 33+
- Java JDK 17+
- Android device or emulator

## Build Commands

### Web Build
```bash
pnpm build:web
```

Outputs to `dist/standalone/` with:
- Bundled game assets
- PWA manifest and service worker
- Icons and screenshots

### iOS Build
```bash
pnpm build:ios
```

1. Builds web assets
2. Syncs to iOS project
3. Opens Xcode

Complete build in Xcode:
- **Development**: Product > Build (⌘B)
- **Testing**: Product > Build For > Testing
- **Release**: Product > Archive

### Android Build
```bash
pnpm build:android
```

1. Builds web assets
2. Syncs to Android project
3. Opens Android Studio

Complete build in Android Studio:
- **Development**: Build > Make Project
- **APK**: Build > Build Bundle(s) / APK(s) > Build APK(s)
- **Release**: Build > Generate Signed Bundle / APK

## Capacitor Sync

To sync web assets to native projects without opening IDEs:
```bash
pnpm cap:sync
```

## Build Artifacts

### Web
- `dist/standalone/index.html` — Entry point
- `dist/standalone/assets/` — Game assets
- `dist/standalone/manifest.json` — PWA manifest
- `dist/standalone/service-worker.js` — Offline support

### iOS
- `ios/App/App.xcodeproj` — Xcode project
- Build output: `ios/App/build/`

### Android
- `android/app/build.gradle` — Gradle config
- Build output: `android/app/build/outputs/`

## Deployment

### GitHub Pages
1. Build: `pnpm build:web`
2. Commit `dist/` to `gh-pages` branch
3. Enable GitHub Pages in repository settings

### App Store (iOS)
1. Build: `pnpm build:ios`
2. Archive in Xcode
3. Upload to App Store Connect
4. Submit for review

### Play Store (Android)
1. Build: `pnpm build:android`
2. Generate signed AAB in Android Studio
3. Upload to Play Console
4. Submit for review

## Troubleshooting

### Build Fails with "Module not found"
- Run `pnpm install` to ensure dependencies are installed
- Check that `node_modules/` is not corrupted

### iOS Build Fails
- Verify Xcode Command Line Tools: `xcode-select --install`
- Clean build folder: Product > Clean Build Folder (⇧⌘K)
- Check iOS deployment target matches Info.plist

### Android Build Fails
- Verify Android SDK is installed
- Check `ANDROID_HOME` environment variable
- Sync Gradle files in Android Studio

### PWA Not Installing
- Verify HTTPS (required for service workers)
- Check manifest.json is accessible
- Ensure service worker registers successfully

## Performance Optimization

### Web
- Assets are automatically minified and gzipped
- Service worker caches critical assets
- Lazy loading for non-critical resources

### iOS
- Enable bitcode for App Store optimization
- Use release build configuration
- Profile with Instruments

### Android
- Enable ProGuard/R8 for code shrinking
- Use release build variant
- Profile with Android Profiler

## Version Management

Update version in three places:
1. `package.json` — `"version": "X.Y.Z"`
2. `ios/App/App/Info.plist` — `CFBundleShortVersionString`
3. `android/app/build.gradle` — `versionName`

## CI/CD Integration

See `.github/workflows/` for automated build pipelines:
- `build-web.yml` — Web deployment to GitHub Pages
- `build-ios.yml` — iOS build and TestFlight upload
- `build-android.yml` — Android build and Play Store upload
