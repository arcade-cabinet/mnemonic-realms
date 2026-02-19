/**
 * Unit tests for Haptics Controller
 * 
 * Tests haptic feedback patterns and graceful degradation.
 * 
 * @module tests/unit/platform/haptics
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { HapticPattern } from '../../../src/platform/haptics';

// Mock Capacitor Haptics plugin BEFORE importing
const mockImpact = vi.fn();
const mockNotification = vi.fn();

vi.mock('@capacitor/haptics', () => ({
  Haptics: {
    impact: mockImpact,
    notification: mockNotification,
  },
  ImpactStyle: {
    Light: 'LIGHT',
    Medium: 'MEDIUM',
    Heavy: 'HEAVY',
  },
  NotificationType: {
    Success: 'SUCCESS',
    Warning: 'WARNING',
    Error: 'ERROR',
  },
}));

// Mock platform detector BEFORE importing
const mockSupportsHaptics = vi.fn();

vi.mock('../../../src/platform/detector', () => ({
  platformDetector: {
    supportsHaptics: mockSupportsHaptics,
  },
}));

describe('HapticsController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupportsHaptics.mockReturnValue(true); // Default to supported
  });
  
  afterEach(() => {
    vi.resetModules(); // Reset module cache between tests
  });
  
  describe('isAvailable', () => {
    it('should return true when platform supports haptics', async () => {
      mockSupportsHaptics.mockReturnValue(true);
      
      // Import after mock is set up
      const { HapticsControllerImpl } = await import('../../../src/platform/haptics');
      const controller = new HapticsControllerImpl();
      
      expect(controller.isAvailable()).toBe(true);
    });
    
    it('should return false when platform does not support haptics', async () => {
      mockSupportsHaptics.mockReturnValue(false);
      
      // Import after mock is set up
      const { HapticsControllerImpl } = await import('../../../src/platform/haptics');
      const controller = new HapticsControllerImpl();
      
      expect(controller.isAvailable()).toBe(false);
    });
  });
  
  describe('trigger - impact patterns', () => {
    it('should trigger light impact', async () => {
      mockSupportsHaptics.mockReturnValue(true);
      
      const { HapticsControllerImpl } = await import('../../../src/platform/haptics');
      const controller = new HapticsControllerImpl();
      
      await controller.trigger('light');
      
      expect(mockImpact).toHaveBeenCalledWith({ style: 'LIGHT' });
    });
    
    it('should trigger medium impact', async () => {
      mockSupportsHaptics.mockReturnValue(true);
      
      const { HapticsControllerImpl } = await import('../../../src/platform/haptics');
      const controller = new HapticsControllerImpl();
      
      await controller.trigger('medium');
      
      expect(mockImpact).toHaveBeenCalledWith({ style: 'MEDIUM' });
    });
    
    it('should trigger heavy impact', async () => {
      mockSupportsHaptics.mockReturnValue(true);
      
      const { HapticsControllerImpl } = await import('../../../src/platform/haptics');
      const controller = new HapticsControllerImpl();
      
      await controller.trigger('heavy');
      
      expect(mockImpact).toHaveBeenCalledWith({ style: 'HEAVY' });
    });
  });
  
  describe('trigger - notification patterns', () => {
    it('should trigger success notification', async () => {
      mockSupportsHaptics.mockReturnValue(true);
      
      const { HapticsControllerImpl } = await import('../../../src/platform/haptics');
      const controller = new HapticsControllerImpl();
      
      await controller.trigger('success');
      
      expect(mockNotification).toHaveBeenCalledWith({ type: 'SUCCESS' });
    });
    
    it('should trigger warning notification', async () => {
      mockSupportsHaptics.mockReturnValue(true);
      
      const { HapticsControllerImpl } = await import('../../../src/platform/haptics');
      const controller = new HapticsControllerImpl();
      
      await controller.trigger('warning');
      
      expect(mockNotification).toHaveBeenCalledWith({ type: 'WARNING' });
    });
    
    it('should trigger error notification', async () => {
      mockSupportsHaptics.mockReturnValue(true);
      
      const { HapticsControllerImpl } = await import('../../../src/platform/haptics');
      const controller = new HapticsControllerImpl();
      
      await controller.trigger('error');
      
      expect(mockNotification).toHaveBeenCalledWith({ type: 'ERROR' });
    });
  });
  
  describe('graceful degradation', () => {
    it('should no-op when haptics are not available', async () => {
      mockSupportsHaptics.mockReturnValue(false);
      
      const { HapticsControllerImpl } = await import('../../../src/platform/haptics');
      const controller = new HapticsControllerImpl();
      
      await controller.trigger('light');
      
      expect(mockImpact).not.toHaveBeenCalled();
      expect(mockNotification).not.toHaveBeenCalled();
    });
    
    it('should not throw when Haptics.impact fails', async () => {
      mockSupportsHaptics.mockReturnValue(true);
      mockImpact.mockRejectedValue(new Error('Haptics unavailable'));
      
      const { HapticsControllerImpl } = await import('../../../src/platform/haptics');
      const controller = new HapticsControllerImpl();
      
      await expect(controller.trigger('light')).resolves.toBeUndefined();
    });
    
    it('should not throw when Haptics.notification fails', async () => {
      mockSupportsHaptics.mockReturnValue(true);
      mockNotification.mockRejectedValue(new Error('Haptics unavailable'));
      
      const { HapticsControllerImpl } = await import('../../../src/platform/haptics');
      const controller = new HapticsControllerImpl();
      
      await expect(controller.trigger('success')).resolves.toBeUndefined();
    });
  });
  
  describe('all patterns', () => {
    it('should handle all 6 haptic patterns', async () => {
      mockSupportsHaptics.mockReturnValue(true);
      
      const { HapticsControllerImpl } = await import('../../../src/platform/haptics');
      const controller = new HapticsControllerImpl();
      
      const patterns: HapticPattern[] = ['light', 'medium', 'heavy', 'success', 'warning', 'error'];
      
      for (const pattern of patterns) {
        await controller.trigger(pattern);
      }
      
      expect(mockImpact).toHaveBeenCalledTimes(3); // light, medium, heavy
      expect(mockNotification).toHaveBeenCalledTimes(3); // success, warning, error
    });
  });
});
