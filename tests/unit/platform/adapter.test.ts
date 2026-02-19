/**
 * Platform Adapter Integration Tests
 * 
 * Tests the integration of all platform features with the game engine.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PlatformAdapter } from '../../../src/platform/adapter';

describe('PlatformAdapter Integration', () => {
  let adapter: PlatformAdapter;

  beforeEach(() => {
    adapter = new PlatformAdapter();
  });

  afterEach(async () => {
    await adapter.cleanup();
  });

  it('should initialize successfully', async () => {
    await adapter.initialize();
    
    const platformInfo = adapter.getPlatformInfo();
    expect(platformInfo).toBeDefined();
    expect(platformInfo.platform).toMatch(/ios|android|web/);
  });

  it('should initialize storage driver', async () => {
    await adapter.initialize();
    
    const storage = adapter.getStorage();
    expect(storage).toBeDefined();
    expect(storage.save).toBeDefined();
    expect(storage.load).toBeDefined();
  });

  it('should detect platform capabilities', async () => {
    await adapter.initialize();
    
    const isNative = adapter.isNative();
    const supportsHaptics = adapter.supportsHaptics();
    const supportsNativeStorage = adapter.supportsNativeStorage();
    
    expect(typeof isNative).toBe('boolean');
    expect(typeof supportsHaptics).toBe('boolean');
    expect(typeof supportsNativeStorage).toBe('boolean');
  });

  it('should handle haptic feedback gracefully', async () => {
    await adapter.initialize();
    
    // Should not throw even if haptics not supported
    await expect(adapter.triggerHaptic('light')).resolves.not.toThrow();
    await expect(adapter.triggerHaptic('medium')).resolves.not.toThrow();
    await expect(adapter.triggerHaptic('heavy')).resolves.not.toThrow();
  });

  it('should provide network status', async () => {
    await adapter.initialize();
    
    const networkStatus = adapter.getNetworkStatus();
    expect(networkStatus).toBeDefined();
    expect(networkStatus.connected).toBeDefined();
  });

  it('should provide performance metrics on mobile', async () => {
    await adapter.initialize();
    
    const metrics = adapter.getPerformanceMetrics();
    expect(metrics).toBeDefined();
  });

  it('should record frames for performance monitoring', async () => {
    await adapter.initialize();
    
    // Should not throw
    expect(() => adapter.recordFrame()).not.toThrow();
  });

  it('should process touch events', async () => {
    await adapter.initialize();
    
    const mockTouchEvent = new TouchEvent('touchstart', {
      touches: [{ clientX: 100, clientY: 100 } as Touch],
    });
    
    const result = adapter.processTouchEvent(mockTouchEvent);
    expect(typeof result).toBe('boolean');
  });

  it('should validate touch targets', async () => {
    await adapter.initialize();
    
    const mockElement = document.createElement('div');
    mockElement.style.width = '50px';
    mockElement.style.height = '50px';
    
    const result = adapter.validateTouchTarget(mockElement);
    expect(typeof result).toBe('boolean');
  });

  it('should apply visual feedback', async () => {
    await adapter.initialize();
    
    const mockElement = document.createElement('div');
    
    // Should not throw
    expect(() => adapter.applyVisualFeedback(mockElement)).not.toThrow();
  });

  it('should cleanup resources', async () => {
    await adapter.initialize();
    
    await expect(adapter.cleanup()).resolves.not.toThrow();
  });

  it('should throw error when accessing storage before initialization', () => {
    expect(() => adapter.getStorage()).toThrow('PlatformAdapter not initialized');
  });

  it('should throw error when accessing platform info before initialization', () => {
    expect(() => adapter.getPlatformInfo()).toThrow('PlatformAdapter not initialized');
  });

  it('should warn when initializing twice', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    await adapter.initialize();
    await adapter.initialize();
    
    expect(consoleSpy).toHaveBeenCalledWith('PlatformAdapter already initialized');
    consoleSpy.mockRestore();
  });

  it('should initialize with custom configuration', async () => {
    await adapter.initialize({
      enableHaptics: false,
      enableNetworkMonitoring: false,
      enablePerformanceMonitoring: false,
      enableTouchOptimization: false,
      targetFrameRate: 30,
      memoryLimitMB: 256,
    });
    
    const platformInfo = adapter.getPlatformInfo();
    expect(platformInfo).toBeDefined();
  });
});
