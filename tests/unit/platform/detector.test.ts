/**
 * Platform Detection Unit Tests
 * 
 * Tests platform detection logic for iOS, Android, and web environments.
 * 
 * @module platform/detector.test
 */

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

describe('Platform Detector', () => {
  beforeEach(async () => {
    // Clear module cache to reset cached platform info
    vi.resetModules();
    // Also reset the cache in the detector module
    const { resetCache } = await import('../../../src/platform/detector');
    resetCache();
  });

  describe('Native Platform Detection', () => {
    it('should detect iOS platform correctly', async () => {
      const { Capacitor } = await import('@capacitor/core');
      const { Device } = await import('@capacitor/device');
      
      vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
      vi.mocked(Capacitor.getPlatform).mockReturnValue('ios');
      vi.mocked(Device.getInfo).mockResolvedValue({
        platform: 'ios',
        model: 'iPhone 14 Pro',
        osVersion: '16.0',
        operatingSystem: 'ios',
        manufacturer: 'Apple',
        isVirtual: false,
        webViewVersion: '',
        name: 'iPhone',
      } as any);

      const { getPlatformInfo } = await import('../../../src/platform/detector');
      const info = await getPlatformInfo();

      expect(info.platform).toBe('ios');
      expect(info.model).toBe('iPhone 14 Pro');
      expect(info.osVersion).toBe('16.0');
      expect(info.isNative).toBe(true);
    });

    it('should detect Android platform correctly', async () => {
      const { Capacitor } = await import('@capacitor/core');
      const { Device } = await import('@capacitor/device');
      
      vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
      vi.mocked(Capacitor.getPlatform).mockReturnValue('android');
      vi.mocked(Device.getInfo).mockResolvedValue({
        platform: 'android',
        model: 'Pixel 7',
        osVersion: '13',
        operatingSystem: 'android',
        manufacturer: 'Google',
        isVirtual: false,
        webViewVersion: '',
        name: 'Pixel',
      } as any);

      const { getPlatformInfo } = await import('../../../src/platform/detector');
      const info = await getPlatformInfo();

      expect(info.platform).toBe('android');
      expect(info.model).toBe('Pixel 7');
      expect(info.osVersion).toBe('13');
      expect(info.isNative).toBe(true);
    });
  });

  describe('Web Platform Detection', () => {
    it('should detect web platform correctly', async () => {
      const { Capacitor } = await import('@capacitor/core');
      
      vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);
      vi.mocked(Capacitor.getPlatform).mockReturnValue('web');

      const { getPlatformInfo } = await import('../../../src/platform/detector');
      const info = await getPlatformInfo();

      expect(info.platform).toBe('web');
      expect(info.isNative).toBe(false);
      expect(info.model).toBeDefined();
      expect(info.osVersion).toBeDefined();
    });

    it('should parse iOS user agent correctly', async () => {
      const { Capacitor } = await import('@capacitor/core');
      
      vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);
      
      // Mock iOS user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
        configurable: true,
      });

      const { getPlatformInfo } = await import('../../../src/platform/detector');
      const info = await getPlatformInfo();

      expect(info.platform).toBe('web');
      expect(info.model).toBe('iOS Device');
      expect(info.osVersion).toBe('16.0');
    });

    it('should parse Android user agent correctly', async () => {
      const { Capacitor } = await import('@capacitor/core');
      
      vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);
      
      // Mock Android user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Linux; Android 13; Pixel 7)',
        configurable: true,
      });

      const { getPlatformInfo } = await import('../../../src/platform/detector');
      const info = await getPlatformInfo();

      expect(info.platform).toBe('web');
      expect(info.model).toBe('Android Device');
      expect(info.osVersion).toBe('13');
    });
  });

  describe('Capability Detection', () => {
    it('should report haptics support on iOS native', async () => {
      const { Capacitor } = await import('@capacitor/core');
      
      vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
      vi.mocked(Capacitor.getPlatform).mockReturnValue('ios');

      const { platformDetector } = await import('../../../src/platform/detector');
      
      expect(platformDetector.supportsHaptics()).toBe(true);
    });

    it('should report haptics support on Android native', async () => {
      const { Capacitor } = await import('@capacitor/core');
      
      vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
      vi.mocked(Capacitor.getPlatform).mockReturnValue('android');

      const { platformDetector } = await import('../../../src/platform/detector');
      
      expect(platformDetector.supportsHaptics()).toBe(true);
    });

    it('should not report haptics support on web', async () => {
      const { Capacitor } = await import('@capacitor/core');
      
      vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);
      vi.mocked(Capacitor.getPlatform).mockReturnValue('web');

      const { platformDetector } = await import('../../../src/platform/detector');
      
      expect(platformDetector.supportsHaptics()).toBe(false);
    });

    it('should report native storage support on iOS', async () => {
      const { Capacitor } = await import('@capacitor/core');
      
      vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
      vi.mocked(Capacitor.getPlatform).mockReturnValue('ios');

      const { platformDetector } = await import('../../../src/platform/detector');
      
      expect(platformDetector.supportsNativeStorage()).toBe(true);
    });

    it('should report native storage support on Android', async () => {
      const { Capacitor } = await import('@capacitor/core');
      
      vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
      vi.mocked(Capacitor.getPlatform).mockReturnValue('android');

      const { platformDetector } = await import('../../../src/platform/detector');
      
      expect(platformDetector.supportsNativeStorage()).toBe(true);
    });

    it('should not report native storage support on web', async () => {
      const { Capacitor } = await import('@capacitor/core');
      
      vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);
      vi.mocked(Capacitor.getPlatform).mockReturnValue('web');

      const { platformDetector } = await import('../../../src/platform/detector');
      
      expect(platformDetector.supportsNativeStorage()).toBe(false);
    });
  });

  describe('Caching', () => {
    it('should cache platform info after first call', async () => {
      const { Capacitor } = await import('@capacitor/core');
      const { Device } = await import('@capacitor/device');
      
      vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
      vi.mocked(Device.getInfo).mockResolvedValue({
        platform: 'ios',
        model: 'iPhone 14 Pro',
        osVersion: '16.0',
        operatingSystem: 'ios',
        manufacturer: 'Apple',
        isVirtual: false,
        webViewVersion: '',
        name: 'iPhone',
      } as any);

      // Clear previous call counts
      vi.mocked(Device.getInfo).mockClear();

      const { getPlatformInfo } = await import('../../../src/platform/detector');
      
      // First call
      await getPlatformInfo();
      
      // Second call should use cache
      await getPlatformInfo();

      // Device.getInfo should only be called once
      expect(Device.getInfo).toHaveBeenCalledTimes(1);
    });
  });

  describe('isNative method', () => {
    it('should return true for native platforms', async () => {
      const { Capacitor } = await import('@capacitor/core');
      
      vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);

      const { platformDetector } = await import('../../../src/platform/detector');
      
      expect(platformDetector.isNative()).toBe(true);
    });

    it('should return false for web platform', async () => {
      const { Capacitor } = await import('@capacitor/core');
      
      vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);

      const { platformDetector } = await import('../../../src/platform/detector');
      
      expect(platformDetector.isNative()).toBe(false);
    });
  });
});
