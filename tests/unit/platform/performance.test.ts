/**
 * Unit tests for mobile performance optimizations.
 * 
 * Validates: Requirements 12.2, 12.3, 12.5
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PerformanceController } from '../../../src/platform/performance';

// Mock Capacitor
vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: vi.fn(() => true),
  },
}));

// Mock App plugin
const mockAppStateListener = vi.fn();
vi.mock('@capacitor/app', () => ({
  App: {
    addListener: vi.fn((event, callback) => {
      mockAppStateListener.mockImplementation(callback);
      return Promise.resolve(() => {});
    }),
  },
}));

describe('PerformanceController', () => {
  let controller: PerformanceController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new PerformanceController();
  });

  describe('initialization', () => {
    it('should initialize with default config', () => {
      const metrics = controller.getMetrics();
      expect(metrics.currentFPS).toBe(0);
      expect(metrics.isBackgrounded).toBe(false);
    });

    it('should initialize with custom config', () => {
      const customController = new PerformanceController({
        targetFrameRate: 30,
        memoryLimitMB: 256,
        enableBackgroundReduction: false,
      });
      expect(customController).toBeDefined();
    });

    it('should set up app state listener on initialize', async () => {
      await controller.initialize();
      const { App } = await import('@capacitor/app');
      expect(App.addListener).toHaveBeenCalledWith('appStateChange', expect.any(Function));
    });
  });

  describe('frame rate monitoring', () => {
    it('should record frames', () => {
      controller.recordFrame();
      controller.recordFrame();
      controller.recordFrame();
      const metrics = controller.getMetrics();
      expect(metrics.currentFPS).toBeGreaterThanOrEqual(0);
    });

    it('should calculate FPS over time', async () => {
      await controller.initialize();
      
      // Simulate 60 frames over 1 second
      for (let i = 0; i < 60; i++) {
        controller.recordFrame();
      }
      
      // Wait for FPS calculation interval
      await new Promise((resolve) => setTimeout(resolve, 1100));
      
      const metrics = controller.getMetrics();
      expect(metrics.currentFPS).toBeGreaterThan(0);
      
      await controller.cleanup();
    });

    it('should check if frame rate is within target', () => {
      const customController = new PerformanceController({ targetFrameRate: 60 });
      expect(customController.isFrameRateWithinTarget()).toBe(true);
    });
  });

  describe('memory monitoring', () => {
    it('should get memory usage', () => {
      const metrics = controller.getMetrics();
      expect(metrics.memoryUsageMB).toBeGreaterThanOrEqual(0);
    });

    it('should check if memory is within limit', () => {
      expect(controller.isMemoryWithinLimit()).toBe(true);
    });
  });

  describe('background state handling', () => {
    it('should detect background state change', async () => {
      await controller.initialize();
      
      // Simulate app going to background
      mockAppStateListener({ isActive: false });
      
      const metrics = controller.getMetrics();
      expect(metrics.isBackgrounded).toBe(true);
      
      await controller.cleanup();
    });

    it('should detect foreground state change', async () => {
      await controller.initialize();
      
      // Simulate app going to background then foreground
      mockAppStateListener({ isActive: false });
      mockAppStateListener({ isActive: true });
      
      const metrics = controller.getMetrics();
      expect(metrics.isBackgrounded).toBe(false);
      
      await controller.cleanup();
    });
  });

  describe('cleanup', () => {
    it('should clean up monitoring intervals', async () => {
      await controller.initialize();
      await controller.cleanup();
      
      // Verify cleanup doesn't throw
      expect(true).toBe(true);
    });
  });

  describe('graceful degradation', () => {
    it('should handle non-native platforms gracefully', async () => {
      const { Capacitor } = await import('@capacitor/core');
      vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);
      
      const webController = new PerformanceController();
      await webController.initialize();
      
      // Should not throw, just log warning
      expect(true).toBe(true);
    });
  });
});
