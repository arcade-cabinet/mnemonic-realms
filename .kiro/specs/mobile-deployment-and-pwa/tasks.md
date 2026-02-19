# Implementation Plan: Mobile Deployment and PWA

## Overview

This implementation plan converts the mobile deployment and PWA design into actionable coding tasks. The approach follows a layered architecture: first establishing the platform abstraction layer, then implementing platform-specific providers, followed by Capacitor integration, PWA configuration, and finally build pipeline setup. Each task builds incrementally, ensuring the codebase remains functional throughout development.

## Tasks

- [x] 1. Set up project structure and dependencies
  - Install Capacitor core and CLI packages (@capacitor/core, @capacitor/cli)
  - Install platform-specific packages (@capacitor/ios, @capacitor/android)
  - Install Capacitor plugins (@capacitor-community/sqlite, @capacitor/haptics, @capacitor/device, @capacitor/network)
  - Install sql.js for web storage provider
  - Install fast-check for property-based testing
  - Create directory structure: src/platform/, src/storage/, src/pwa/
  - _Requirements: 1.1, 4.1_

- [ ] 2. Implement platform detection module
  - [x] 2.1 Create PlatformInfo and PlatformDetector interfaces
    - Define TypeScript interfaces in src/platform/types.ts
    - Include platform, model, osVersion, isNative fields
    - _Requirements: 2.1, 2.3_
  
  - [x] 2.2 Implement platform detection logic
    - Create src/platform/detector.ts with getPlatformInfo() implementation
    - Use Capacitor Device API when available
    - Fall back to user agent parsing for web
    - Cache detection results for performance
    - Expose capability flags (supportsHaptics, supportsNativeStorage)
    - _Requirements: 2.1, 2.2, 2.4_
  
  - [x] 2.3 Write property test for device information completeness
    - **Property 2: Device Information Completeness**
    - **Validates: Requirements 2.2**
  
  - [x] 2.4 Write unit tests for platform detection
    - Test iOS, Android, and web detection scenarios
    - Test user agent parsing fallback
    - Test capability flag accuracy
    - _Requirements: 2.1, 2.2, 2.4_

- [ ] 3. Implement storage abstraction layer
  - [ ] 3.1 Create storage interfaces and types
    - Define GameData interface in src/storage/types.ts
    - Define StorageDriver interface with save, load, update, delete, list, close methods
    - Define storage error types (StorageInitializationError, StorageWriteError, etc.)
    - _Requirements: 4.1, 4.4_
  
  - [ ] 3.2 Create storage driver factory
    - Implement createStorageDriver() in src/storage/factory.ts
    - Route to SQLite provider on mobile platforms
    - Route to sql.js provider on web platform
    - Handle initialization and error propagation
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [ ] 3.3 Write property test for storage write-read round trip
    - **Property 5: Storage Write-Read Round Trip**
    - **Validates: Requirements 4.5**
  
  - [ ] 3.4 Write property test for storage interface parity
    - **Property 9: Storage Provider Interface Parity**
    - **Validates: Requirements 6.5**

- [ ] 4. Implement SQLite storage provider for mobile
  - [ ] 4.1 Create SQLite database schema
    - Define SQL schema in src/storage/sqlite/schema.ts
    - Create game_saves table with id, player_id, save_slot, data, timestamps
    - Create settings table with key, value, updated_at
    - Create indexes for performance
    - _Requirements: 5.1, 5.2_
  
  - [ ] 4.2 Implement SQLite provider class
    - Create src/storage/sqlite/provider.ts implementing StorageDriver interface
    - Use @capacitor-community/sqlite plugin
    - Implement initialize(), save(), load(), update(), delete(), list(), close()
    - Handle JSON serialization/deserialization
    - Implement connection pooling and cleanup
    - _Requirements: 5.1, 5.2, 5.5_
  
  - [ ] 4.3 Implement SQLite schema migrations
    - Create migration system in src/storage/sqlite/migrations.ts
    - Support versioned schema updates
    - Ensure data preservation during migrations
    - _Requirements: 5.4_
  
  - [ ] 4.4 Write property test for storage persistence across restarts
    - **Property 6: Storage Persistence Across Restarts**
    - **Validates: Requirements 5.3**
  
  - [ ] 4.5 Write property test for schema migration safety
    - **Property 7: Storage Schema Migration Safety**
    - **Validates: Requirements 5.4**
  
  - [ ] 4.6 Write property test for storage error safety
    - **Property 8: Storage Error Safety**
    - **Validates: Requirements 5.5**
  
  - [ ] 4.7 Write unit tests for SQLite provider
    - Test all CRUD operations
    - Test error handling and recovery
    - Test connection management
    - _Requirements: 5.1, 5.2, 5.5_

- [ ] 5. Checkpoint - Ensure storage tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement sql.js storage provider for web
  - [ ] 6.1 Create sql.js provider class
    - Create src/storage/sqljs/provider.ts implementing StorageDriver interface
    - Use sql.js library for SQLite in WebAssembly
    - Implement same interface as SQLite provider
    - Persist database to IndexedDB
    - Handle browser storage quota limits
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [ ] 6.2 Implement IndexedDB persistence layer
    - Create src/storage/sqljs/persistence.ts
    - Save sql.js database to IndexedDB on changes
    - Load database from IndexedDB on initialization
    - Handle storage quota exceeded errors
    - _Requirements: 6.3_
  
  - [ ] 6.3 Write property test for web storage persistence
    - **Property 6: Storage Persistence Across Restarts**
    - **Validates: Requirements 6.4**
  
  - [ ] 6.4 Write unit tests for sql.js provider
    - Test all CRUD operations
    - Test IndexedDB persistence
    - Test storage quota handling
    - _Requirements: 6.1, 6.2, 6.3_

- [ ] 7. Implement haptics controller
  - [ ] 7.1 Create haptics interfaces and types
    - Define HapticImpact type and HapticsController interface in src/platform/haptics.ts
    - Define impact, notification, vibrate methods
    - _Requirements: 3.1, 3.4_
  
  - [ ] 7.2 Implement haptics controller with graceful degradation
    - Create haptics controller implementation
    - Use Capacitor Haptics API on mobile
    - Implement no-op fallback for web
    - Check availability before triggering
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [ ] 7.3 Write property test for haptics graceful degradation
    - **Property 3: Haptics Graceful Degradation**
    - **Validates: Requirements 3.3**
  
  - [ ] 7.4 Write property test for haptics impact types support
    - **Property 4: Haptics Impact Types Support**
    - **Validates: Requirements 3.4**
  
  - [ ] 7.5 Write unit tests for haptics controller
    - Test mobile haptics triggering
    - Test web no-op behavior
    - Test availability checking
    - _Requirements: 3.1, 3.3, 3.4_

- [ ] 8. Initialize Capacitor configuration
  - [ ] 8.1 Create Capacitor configuration file
    - Create capacitor.config.ts in project root
    - Configure appId, appName, webDir (dist/standalone)
    - Configure server schemes for iOS and Android
    - Configure plugins (SplashScreen, Keyboard)
    - _Requirements: 1.1, 1.2_
  
  - [ ] 8.2 Initialize iOS and Android projects
    - Run npx cap add ios to generate iOS project
    - Run npx cap add android to generate Android project
    - Verify project structures are created
    - _Requirements: 1.2, 9.1, 10.1_
  
  - [ ] 8.3 Write unit tests for Capacitor configuration
    - Validate capacitor.config.ts structure
    - Test configuration loading
    - _Requirements: 1.1_

- [ ] 9. Configure iOS build settings
  - [ ] 9.1 Update iOS Info.plist
    - Configure CFBundleDisplayName, CFBundleIdentifier
    - Set CFBundleVersion and CFBundleShortVersionString
    - Configure UIRequiresFullScreen and UISupportedInterfaceOrientations (landscape)
    - Add required permissions and capabilities
    - _Requirements: 9.2, 9.3_
  
  - [ ] 9.2 Configure iOS app signing
    - Update ios/App/App.xcodeproj for signing configuration
    - Document development and release signing setup
    - _Requirements: 9.4_
  
  - [ ] 9.3 Write unit tests for iOS configuration
    - Validate Info.plist structure
    - Test bundle ID and version configuration
    - _Requirements: 9.2, 9.3_

- [ ] 10. Configure Android build settings
  - [ ] 10.1 Update AndroidManifest.xml
    - Configure package name, versionCode, versionName
    - Set screenOrientation to landscape
    - Add required permissions (INTERNET, etc.)
    - _Requirements: 10.2, 10.3_
  
  - [ ] 10.2 Update Android Gradle configuration
    - Configure android/app/build.gradle
    - Set minSdkVersion, targetSdkVersion, compileSdkVersion
    - Configure signing for development and release
    - _Requirements: 10.2, 10.4_
  
  - [ ] 10.3 Write unit tests for Android configuration
    - Validate AndroidManifest.xml structure
    - Test package name and version configuration
    - _Requirements: 10.2, 10.3_

- [ ] 11. Checkpoint - Ensure platform configurations are valid
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Create PWA manifest
  - [ ] 12.1 Create manifest.json
    - Create public/manifest.json with app metadata
    - Configure name, short_name, description
    - Set start_url, display (standalone), orientation (landscape)
    - Configure background_color and theme_color
    - _Requirements: 7.1, 7.5_
  
  - [ ] 12.2 Create PWA icons
    - Create app icons in multiple sizes (192x192, 512x512)
    - Save icons to public/icons/ directory
    - Reference icons in manifest.json
    - _Requirements: 7.2_
  
  - [ ] 12.3 Configure splash screens
    - Add splash screen configuration to manifest.json
    - Create splash screen assets if needed
    - _Requirements: 7.3_
  
  - [ ] 12.4 Write unit tests for PWA manifest
    - Validate manifest.json structure
    - Test icon paths and sizes
    - Test display mode and orientation
    - _Requirements: 7.1, 7.2, 7.5_

- [ ] 13. Implement service worker
  - [ ] 13.1 Create service worker file
    - Create public/service-worker.js
    - Implement install, activate, and fetch event handlers
    - Define CACHE_VERSION and CACHE_NAME constants
    - Define CRITICAL_ASSETS array
    - _Requirements: 8.1, 8.3_
  
  - [ ] 13.2 Implement cache-first strategy
    - Implement fetch handler with cache-first logic
    - Check cache before making network requests
    - Serve cached assets when available
    - Fall back to network for uncached assets
    - _Requirements: 8.2, 8.3_
  
  - [ ] 13.3 Implement cache versioning and updates
    - Implement activate handler to clean old caches
    - Implement cache invalidation on version change
    - Update cached assets when new version deployed
    - _Requirements: 8.4, 14.2_
  
  - [ ] 13.4 Implement progressive caching
    - Cache critical assets during install event
    - Cache non-critical assets progressively after initial load
    - Avoid blocking initial page load
    - _Requirements: 14.3, 14.4_
  
  - [ ] 13.5 Implement offline fallback
    - Provide meaningful offline message when assets unavailable
    - Handle network unavailable scenarios gracefully
    - _Requirements: 8.5_
  
  - [ ] 13.6 Write property test for essential assets caching
    - **Property 10: Essential Assets Caching**
    - **Validates: Requirements 8.1**
  
  - [ ] 13.7 Write property test for offline asset serving
    - **Property 11: Offline Asset Serving**
    - **Validates: Requirements 8.2**
  
  - [ ] 13.8 Write property test for cache-first strategy
    - **Property 12: Cache-First Strategy**
    - **Validates: Requirements 8.3**
  
  - [ ] 13.9 Write property test for cache version invalidation
    - **Property 13: Cache Version Invalidation**
    - **Validates: Requirements 8.4, 14.2**
  
  - [ ] 13.10 Write property test for progressive caching non-blocking
    - **Property 19: Progressive Caching Non-Blocking**
    - **Validates: Requirements 14.4**
  
  - [ ] 13.11 Write property test for cache content equivalence
    - **Property 20: Cache Content Equivalence**
    - **Validates: Requirements 14.5**
  
  - [ ] 13.12 Write unit tests for service worker
    - Test install and activate events
    - Test fetch handler logic
    - Test cache management
    - Use Workbox testing utilities
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 14. Register service worker in application
  - [ ] 14.1 Create service worker registration module
    - Create src/pwa/register.ts
    - Implement service worker registration logic
    - Handle registration success and errors
    - Implement update detection and notification
    - _Requirements: 7.4, 8.4_
  
  - [ ] 14.2 Integrate service worker registration in main entry point
    - Import and call registration in src/main.ts or equivalent
    - Register service worker on application startup
    - _Requirements: 7.4_
  
  - [ ] 14.3 Write unit tests for service worker registration
    - Test registration success
    - Test update detection
    - Test error handling
    - _Requirements: 7.4_

- [ ] 15. Checkpoint - Ensure PWA functionality works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Implement network handling for mobile
  - [ ] 16.1 Create network status monitor
    - Create src/platform/network.ts
    - Use Capacitor Network API to detect connectivity changes
    - Expose network status to game engine
    - _Requirements: 15.3, 15.4_
  
  - [ ] 16.2 Implement network retry with exponential backoff
    - Create src/platform/retry.ts
    - Implement retry logic with exponential backoff
    - Configure max retries, initial delay, max delay, backoff multiplier
    - _Requirements: 15.2_
  
  - [ ] 16.3 Implement offline operation continuity
    - Integrate network status with game engine
    - Continue game operation with cached assets when offline
    - Queue data operations when offline
    - _Requirements: 15.1_
  
  - [ ] 16.4 Implement pending operations synchronization
    - Create operation queue for offline operations
    - Synchronize pending operations when network restored
    - _Requirements: 15.5_
  
  - [ ] 16.5 Write property test for offline operation continuity
    - **Property 21: Offline Operation Continuity**
    - **Validates: Requirements 15.1**
  
  - [ ] 16.6 Write property test for network retry exponential backoff
    - **Property 22: Network Retry Exponential Backoff**
    - **Validates: Requirements 15.2**
  
  - [ ] 16.7 Write property test for network status adaptation
    - **Property 23: Network Status Adaptation**
    - **Validates: Requirements 15.3**
  
  - [ ] 16.8 Write property test for pending operations synchronization
    - **Property 24: Pending Operations Synchronization**
    - **Validates: Requirements 15.5**
  
  - [ ] 16.9 Write unit tests for network handling
    - Test network status detection
    - Test retry logic
    - Test operation queuing and synchronization
    - _Requirements: 15.1, 15.2, 15.3, 15.5_

- [ ] 17. Implement mobile performance optimizations
  - [ ] 17.1 Implement frame rate throttling
    - Create src/platform/performance.ts
    - Implement frame rate limiting for mobile devices
    - Configure mobile-specific frame rate cap (e.g., 60 FPS)
    - _Requirements: 12.2_
  
  - [ ] 17.2 Implement background resource reduction
    - Listen for app lifecycle events (pause, resume)
    - Reduce resource usage when app backgrounded
    - Restore resources when app foregrounded
    - _Requirements: 12.3_
  
  - [ ] 17.3 Implement memory usage monitoring
    - Monitor memory usage on mobile platforms
    - Implement memory limits for mobile devices
    - Trigger cleanup when approaching limits
    - _Requirements: 12.5_
  
  - [ ] 17.4 Write property test for frame rate throttling
    - **Property 15: Frame Rate Throttling**
    - **Validates: Requirements 12.2**
  
  - [ ] 17.5 Write property test for background resource reduction
    - **Property 16: Background Resource Reduction**
    - **Validates: Requirements 12.3**
  
  - [ ] 17.6 Write property test for memory usage bounds
    - **Property 17: Memory Usage Bounds**
    - **Validates: Requirements 12.5**
  
  - [ ] 17.7 Write unit tests for performance optimizations
    - Test frame rate limiting
    - Test lifecycle event handling
    - Test memory monitoring
    - _Requirements: 12.2, 12.3, 12.5_

- [ ] 18. Implement touch controls optimization
  - [ ] 18.1 Implement touch input debouncing
    - Create src/platform/touch.ts
    - Implement touch event debouncing
    - Configure debounce threshold (e.g., 100ms)
    - _Requirements: 11.3_
  
  - [ ] 18.2 Optimize touch target sizes for mobile
    - Ensure touch targets meet minimum size requirements
    - Adjust UI elements for mobile interaction
    - _Requirements: 11.2_
  
  - [ ] 18.3 Implement touch visual feedback
    - Add visual feedback for touch interactions
    - Provide feedback during touch gestures
    - _Requirements: 11.4_
  
  - [ ] 18.4 Write property test for touch debouncing
    - **Property 14: Touch Debouncing**
    - **Validates: Requirements 11.3**
  
  - [ ] 18.5 Write unit tests for touch controls
    - Test touch debouncing logic
    - Test touch target sizing
    - Test visual feedback
    - _Requirements: 11.2, 11.3, 11.4_

- [ ] 19. Integrate platform abstraction with game engine
  - [ ] 19.1 Create platform adapter module
    - Create src/platform/adapter.ts
    - Integrate platform detection, storage, haptics, network modules
    - Provide unified interface to game engine
    - _Requirements: 1.3, 4.1_
  
  - [ ] 19.2 Wire platform adapter into game initialization
    - Import platform adapter in game entry point
    - Initialize platform services on game startup
    - Pass platform services to game engine
    - _Requirements: 1.3, 1.4_
  
  - [ ] 19.3 Write property test for cross-platform functional equivalence
    - **Property 1: Cross-Platform Functional Equivalence**
    - **Validates: Requirements 1.5**
  
  - [ ] 19.4 Write integration tests for platform adapter
    - Test platform adapter on each platform
    - Test service initialization
    - Test graceful degradation
    - _Requirements: 1.3, 1.4_

- [ ] 20. Checkpoint - Ensure all platform integrations work
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 21. Set up build pipeline
  - [ ] 21.1 Create build scripts for each platform
    - Add build:pwa script to package.json (builds web with PWA config)
    - Add build:ios script to package.json (builds web, syncs to iOS, opens Xcode)
    - Add build:android script to package.json (builds web, syncs to Android, opens Android Studio)
    - _Requirements: 13.1, 13.2, 13.3_
  
  - [ ] 21.2 Configure Capacitor sync commands
    - Ensure npx cap sync ios copies web build to iOS project
    - Ensure npx cap sync android copies web build to Android project
    - _Requirements: 1.1, 1.4_
  
  - [ ] 21.3 Document build and deployment process
    - Create documentation for building each platform
    - Document signing configuration for iOS and Android
    - Document app store submission process
    - _Requirements: 9.4, 9.5, 10.4, 10.5_
  
  - [ ] 21.4 Write property test for build platform isolation
    - **Property 18: Build Platform Isolation**
    - **Validates: Requirements 13.4**
  
  - [ ] 21.5 Write unit tests for build scripts
    - Test build script execution
    - Validate build outputs
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [ ] 22. Configure CI/CD pipeline
  - [ ] 22.1 Set up CI for automated testing
    - Configure CI to run unit tests on all platforms
    - Configure CI to run property-based tests (100 iterations each)
    - Configure CI to build web, iOS, and Android artifacts
    - _Requirements: 13.5_
  
  - [ ] 22.2 Set up E2E testing in CI
    - Configure Playwright E2E tests for web build
    - Configure integration tests for iOS simulator
    - Configure integration tests for Android emulator
    - _Requirements: 13.5_
  
  - [ ] 22.3 Configure build validation checks
    - Verify all three platforms build successfully
    - Validate manifest.json structure
    - Check service worker registration
    - Verify Capacitor configuration
    - _Requirements: 13.5_

- [ ] 23. Final checkpoint - Ensure all builds succeed and tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples, edge cases, and platform-specific behavior
- The implementation maintains the existing web build while adding mobile and PWA capabilities
- Platform-specific code is isolated in adapters to keep the game engine unchanged
