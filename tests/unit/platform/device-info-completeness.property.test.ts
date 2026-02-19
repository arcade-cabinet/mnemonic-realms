/**
 * Property Test: Device Information Completeness
 * 
 * **Validates: Requirements 2.2**
 * 
 * Property 2: Device Information Completeness
 * For any platform (iOS, Android, or web), the Device API shall return a 
 * PlatformInfo object containing non-empty values for platform, model, 
 * osVersion, and isNative fields.
 * 
 * @module property/platform/device-info-completeness
 */

import fc from 'fast-check';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Capacitor modules
vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: vi.fn(),
    getPlatform: vi.fn(),
  },
}));

vi.mock('@capacitor/device', () => ({
  Device: {
    getInfo: vi.fn(),
  },
}));

describe('Property Test: Device Information Completeness', () => {
  beforeEach(async () => {
    // Clear module cache to reset cached platform info
    vi.resetModules();
    // Reset the cache in the detector module
    const { resetCache } = await import('../../../src/platform/detector');
    resetCache();
  });

  /**
   * Arbitrary generator for iOS device information
   */
  const iosDeviceArbitrary = () => fc.record({
    platform: fc.constant('ios' as const),
    model: fc.oneof(
      fc.constant('iPhone 14 Pro'),
      fc.constant('iPhone 15'),
      fc.constant('iPhone 13 Mini'),
      fc.constant('iPad Pro'),
      fc.constant('iPad Air'),
    ),
    osVersion: fc.oneof(
      fc.constant('16.0'),
      fc.constant('17.0'),
      fc.constant('15.5'),
      fc.constant('16.4.1'),
    ),
    operatingSystem: fc.constant('ios' as const),
    manufacturer: fc.constant('Apple'),
    isVirtual: fc.boolean(),
    webViewVersion: fc.constant(''),
    name: fc.constant('iPhone'),
  });

  /**
   * Arbitrary generator for Android device information
   */
  const androidDeviceArbitrary = () => fc.record({
    platform: fc.constant('android' as const),
    model: fc.oneof(
      fc.constant('Pixel 7'),
      fc.constant('Pixel 8 Pro'),
      fc.constant('Samsung Galaxy S23'),
      fc.constant('OnePlus 11'),
    ),
    osVersion: fc.oneof(
      fc.constant('13'),
      fc.constant('14'),
      fc.constant('12'),
      fc.constant('11'),
    ),
    operatingSystem: fc.constant('android' as const),
    manufacturer: fc.oneof(
      fc.constant('Google'),
      fc.constant('Samsung'),
      fc.constant('OnePlus'),
    ),
    isVirtual: fc.boolean(),
    webViewVersion: fc.constant(''),
    name: fc.constant('Android Device'),
  });

  /**
   * Arbitrary generator for web user agents
   */
  const webUserAgentArbitrary = () => fc.oneof(
    // iOS web
    fc.constant('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)'),
    fc.constant('Mozilla/5.0 (iPad; CPU OS 15_5 like Mac OS X)'),
    // Android web
    fc.constant('Mozilla/5.0 (Linux; Android 13; Pixel 7)'),
    fc.constant('Mozilla/5.0 (Linux; Android 12; SM-G991B)'),
    // Desktop web
    fc.constant('Mozilla/5.0 (Windows NT 10.0; Win64; x64)'),
    fc.constant('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'),
    fc.constant('Mozilla/5.0 (X11; Linux x86_64)'),
  );

  it('Property 2: Device information completeness for iOS native platform', async () => {
    await fc.assert(
      fc.asyncProperty(
        iosDeviceArbitrary(),
        async (deviceInfo) => {
          const { Capacitor } = await import('@capacitor/core');
          const { Device } = await import('@capacitor/device');
          
          // Setup mocks for iOS native platform
          vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
          vi.mocked(Capacitor.getPlatform).mockReturnValue('ios');
          vi.mocked(Device.getInfo).mockResolvedValue(deviceInfo as any);

          // Reset cache for each test iteration
          const { resetCache, getPlatformInfo } = await import('../../../src/platform/detector');
          resetCache();

          // Get platform info
          const info = await getPlatformInfo();

          // Verify all fields are present and non-empty
          expect(info.platform).toBeDefined();
          expect(info.platform).toBe('ios');
          expect(info.platform).not.toBe('');
          
          expect(info.model).toBeDefined();
          expect(info.model).not.toBe('');
          expect(typeof info.model).toBe('string');
          
          expect(info.osVersion).toBeDefined();
          expect(info.osVersion).not.toBe('');
          expect(typeof info.osVersion).toBe('string');
          
          expect(info.isNative).toBeDefined();
          expect(typeof info.isNative).toBe('boolean');
          expect(info.isNative).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: Device information completeness for Android native platform', async () => {
    await fc.assert(
      fc.asyncProperty(
        androidDeviceArbitrary(),
        async (deviceInfo) => {
          const { Capacitor } = await import('@capacitor/core');
          const { Device } = await import('@capacitor/device');
          
          // Setup mocks for Android native platform
          vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
          vi.mocked(Capacitor.getPlatform).mockReturnValue('android');
          vi.mocked(Device.getInfo).mockResolvedValue(deviceInfo as any);

          // Reset cache for each test iteration
          const { resetCache, getPlatformInfo } = await import('../../../src/platform/detector');
          resetCache();

          // Get platform info
          const info = await getPlatformInfo();

          // Verify all fields are present and non-empty
          expect(info.platform).toBeDefined();
          expect(info.platform).toBe('android');
          expect(info.platform).not.toBe('');
          
          expect(info.model).toBeDefined();
          expect(info.model).not.toBe('');
          expect(typeof info.model).toBe('string');
          
          expect(info.osVersion).toBeDefined();
          expect(info.osVersion).not.toBe('');
          expect(typeof info.osVersion).toBe('string');
          
          expect(info.isNative).toBeDefined();
          expect(typeof info.isNative).toBe('boolean');
          expect(info.isNative).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: Device information completeness for web platform', async () => {
    await fc.assert(
      fc.asyncProperty(
        webUserAgentArbitrary(),
        async (userAgent) => {
          const { Capacitor } = await import('@capacitor/core');
          
          // Setup mocks for web platform
          vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);
          vi.mocked(Capacitor.getPlatform).mockReturnValue('web');
          
          // Mock user agent
          Object.defineProperty(navigator, 'userAgent', {
            value: userAgent,
            configurable: true,
          });

          // Reset cache for each test iteration
          const { resetCache, getPlatformInfo } = await import('../../../src/platform/detector');
          resetCache();

          // Get platform info
          const info = await getPlatformInfo();

          // Verify all fields are present and non-empty
          expect(info.platform).toBeDefined();
          expect(info.platform).toBe('web');
          expect(info.platform).not.toBe('');
          
          expect(info.model).toBeDefined();
          expect(info.model).not.toBe('');
          expect(typeof info.model).toBe('string');
          
          expect(info.osVersion).toBeDefined();
          expect(info.osVersion).not.toBe('');
          expect(typeof info.osVersion).toBe('string');
          
          expect(info.isNative).toBeDefined();
          expect(typeof info.isNative).toBe('boolean');
          expect(info.isNative).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: Device information completeness across all platforms', async () => {
    // Combined test that randomly selects between iOS, Android, and web
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(
          fc.tuple(fc.constant('ios'), iosDeviceArbitrary()),
          fc.tuple(fc.constant('android'), androidDeviceArbitrary()),
          fc.tuple(fc.constant('web'), webUserAgentArbitrary()),
        ),
        async ([platformType, platformData]) => {
          const { Capacitor } = await import('@capacitor/core');
          const { Device } = await import('@capacitor/device');
          
          if (platformType === 'ios' || platformType === 'android') {
            // Native platform setup
            vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
            vi.mocked(Capacitor.getPlatform).mockReturnValue(platformType);
            vi.mocked(Device.getInfo).mockResolvedValue(platformData as any);
          } else {
            // Web platform setup
            vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);
            vi.mocked(Capacitor.getPlatform).mockReturnValue('web');
            Object.defineProperty(navigator, 'userAgent', {
              value: platformData,
              configurable: true,
            });
          }

          // Reset cache for each test iteration
          const { resetCache, getPlatformInfo } = await import('../../../src/platform/detector');
          resetCache();

          // Get platform info
          const info = await getPlatformInfo();

          // Universal property: All fields must be present and non-empty
          expect(info.platform).toBeDefined();
          expect(info.platform).not.toBe('');
          expect(['ios', 'android', 'web']).toContain(info.platform);
          
          expect(info.model).toBeDefined();
          expect(info.model).not.toBe('');
          expect(typeof info.model).toBe('string');
          
          expect(info.osVersion).toBeDefined();
          expect(info.osVersion).not.toBe('');
          expect(typeof info.osVersion).toBe('string');
          
          expect(info.isNative).toBeDefined();
          expect(typeof info.isNative).toBe('boolean');
          
          // Verify isNative matches platform type
          if (platformType === 'ios' || platformType === 'android') {
            expect(info.isNative).toBe(true);
          } else {
            expect(info.isNative).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
