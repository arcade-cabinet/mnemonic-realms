/**
 * Platform Detection Types
 * 
 * Defines interfaces for detecting and identifying the runtime platform
 * (iOS, Android, or web) and querying platform capabilities.
 * 
 * @module platform/types
 */

/**
 * Information about the current platform and device.
 * 
 * Validates: Requirements 2.1, 2.3
 */
export interface PlatformInfo {
  /** The platform type: iOS, Android, or web */
  platform: 'ios' | 'android' | 'web';
  
  /** Device model identifier (e.g., "iPhone 14 Pro", "Pixel 7", "Desktop") */
  model: string;
  
  /** Operating system version (e.g., "16.0", "13", "Windows 10") */
  osVersion: string;
  
  /** Whether the app is running in a native container (Capacitor) */
  isNative: boolean;
}

/**
 * Interface for detecting platform information and capabilities.
 * 
 * Validates: Requirements 2.1, 2.3
 */
export interface PlatformDetector {
  /**
   * Retrieves comprehensive platform and device information.
   * 
   * @returns Promise resolving to PlatformInfo object
   */
  getPlatformInfo(): Promise<PlatformInfo>;
  
  /**
   * Checks if the app is running in a native container.
   * 
   * @returns true if running in Capacitor native app, false if web
   */
  isNative(): boolean;
  
  /**
   * Checks if the current platform supports haptic feedback.
   * 
   * @returns true if haptics are available, false otherwise
   */
  supportsHaptics(): boolean;
  
  /**
   * Checks if the current platform supports native storage (SQLite).
   * 
   * @returns true if native SQLite is available, false if web storage only
   */
  supportsNativeStorage(): boolean;
}
