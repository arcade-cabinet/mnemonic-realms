/**
 * Platform Detection Implementation
 * 
 * Detects the runtime platform (iOS, Android, or web) and provides
 * platform capability information. Uses Capacitor Device API when available,
 * falls back to user agent parsing for web environments.
 * 
 * Validates: Requirements 2.1, 2.2, 2.4
 * 
 * @module platform/detector
 */

import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import type { PlatformDetector, PlatformInfo } from './types';

/**
 * Cached platform information to avoid repeated detection calls.
 * Detection is performed once and cached for performance.
 */
let cachedPlatformInfo: PlatformInfo | null = null;

/**
 * Reset the cached platform info (primarily for testing).
 * @internal
 */
export function resetCache(): void {
  cachedPlatformInfo = null;
}

/**
 * Detects platform information using Capacitor Device API.
 * Only called when running in a native Capacitor environment.
 * 
 * @returns Promise resolving to PlatformInfo
 */
async function detectNativePlatform(): Promise<PlatformInfo> {
  const info = await Device.getInfo();
  
  return {
    platform: info.platform as 'ios' | 'android',
    model: info.model,
    osVersion: info.osVersion,
    isNative: true,
  };
}

/**
 * Detects platform information using user agent parsing.
 * Used as fallback when Capacitor is not available (web environment).
 * 
 * @returns PlatformInfo for web platform
 */
function detectWebPlatform(): PlatformInfo {
  const userAgent = navigator.userAgent;
  
  // Parse user agent to extract OS information
  let model = 'Desktop';
  let osVersion = 'Unknown';
  
  // Detect mobile devices
  if (/iPhone|iPad|iPod/.test(userAgent)) {
    model = 'iOS Device';
    const match = userAgent.match(/OS (\d+)_(\d+)/);
    if (match) {
      osVersion = `${match[1]}.${match[2]}`;
    }
  } else if (/Android/.test(userAgent)) {
    model = 'Android Device';
    const match = userAgent.match(/Android (\d+\.?\d*)/);
    if (match) {
      osVersion = match[1];
    }
  } else if (/Windows/.test(userAgent)) {
    model = 'Windows PC';
    if (/Windows NT 10/.test(userAgent)) {
      osVersion = '10';
    } else if (/Windows NT 11/.test(userAgent)) {
      osVersion = '11';
    }
  } else if (/Macintosh/.test(userAgent)) {
    model = 'Mac';
    const match = userAgent.match(/Mac OS X (\d+)[._](\d+)/);
    if (match) {
      osVersion = `${match[1]}.${match[2]}`;
    }
  } else if (/Linux/.test(userAgent)) {
    model = 'Linux PC';
    osVersion = 'Linux';
  }
  
  return {
    platform: 'web',
    model,
    osVersion,
    isNative: false,
  };
}

/**
 * Platform detector implementation.
 * Provides methods to detect platform information and query capabilities.
 */
class PlatformDetectorImpl implements PlatformDetector {
  /**
   * Retrieves comprehensive platform and device information.
   * Results are cached after first call for performance.
   * 
   * @returns Promise resolving to PlatformInfo object
   */
  async getPlatformInfo(): Promise<PlatformInfo> {
    // Return cached result if available
    if (cachedPlatformInfo) {
      return cachedPlatformInfo;
    }
    
    // Detect platform based on environment
    if (Capacitor.isNativePlatform()) {
      cachedPlatformInfo = await detectNativePlatform();
    } else {
      cachedPlatformInfo = detectWebPlatform();
    }
    
    return cachedPlatformInfo;
  }
  
  /**
   * Checks if the app is running in a native container.
   * 
   * @returns true if running in Capacitor native app, false if web
   */
  isNative(): boolean {
    return Capacitor.isNativePlatform();
  }
  
  /**
   * Checks if the current platform supports haptic feedback.
   * Haptics are available on iOS and Android native platforms.
   * 
   * @returns true if haptics are available, false otherwise
   */
  supportsHaptics(): boolean {
    // Haptics are only available on native mobile platforms
    return Capacitor.isNativePlatform() && 
           (Capacitor.getPlatform() === 'ios' || Capacitor.getPlatform() === 'android');
  }
  
  /**
   * Checks if the current platform supports native storage (SQLite).
   * Native SQLite is available on iOS and Android platforms.
   * 
   * @returns true if native SQLite is available, false if web storage only
   */
  supportsNativeStorage(): boolean {
    // Native SQLite is only available on native mobile platforms
    return Capacitor.isNativePlatform() && 
           (Capacitor.getPlatform() === 'ios' || Capacitor.getPlatform() === 'android');
  }
}

/**
 * Singleton instance of the platform detector.
 * Export this instance to use throughout the application.
 */
export const platformDetector = new PlatformDetectorImpl();

/**
 * Convenience function to get platform information.
 * Alias for platformDetector.getPlatformInfo().
 * 
 * @returns Promise resolving to PlatformInfo object
 */
export function getPlatformInfo(): Promise<PlatformInfo> {
  return platformDetector.getPlatformInfo();
}
