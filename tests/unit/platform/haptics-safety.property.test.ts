/**
 * Property tests for Haptics Controller
 * 
 * Tests haptic feedback safety properties using property-based testing.
 * 
 * @module tests/unit/platform/haptics-safety.property
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
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

describe('HapticsController - Property Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.resetModules();
  });
  
  describe('Property 3: Haptic feedback never throws errors', () => {
    it('should never throw when triggering any pattern', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom<HapticPattern>('light', 'medium', 'heavy', 'success', 'warning', 'error'),
          async (pattern) => {
            mockSupportsHaptics.mockReturnValue(true);
            
            const { HapticsControllerImpl } = await import('../../../src/platform/haptics');
            const controller = new HapticsControllerImpl();
            
            await expect(controller.trigger(pattern)).resolves.toBeUndefined();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  describe('Property 4: Graceful degradation on unsupported platforms', () => {
    it('should no-op without errors when haptics are unavailable', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom<HapticPattern>('light', 'medium', 'heavy', 'success', 'warning', 'error'),
          async (pattern) => {
            mockSupportsHaptics.mockReturnValue(false);
            
            const { HapticsControllerImpl } = await import('../../../src/platform/haptics');
            const controller = new HapticsControllerImpl();
            
            await controller.trigger(pattern);
            
            expect(mockImpact).not.toHaveBeenCalled();
            expect(mockNotification).not.toHaveBeenCalled();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  describe('Property 5: Haptic errors are caught and logged', () => {
    it('should not throw when Haptics API fails', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom<HapticPattern>('light', 'medium', 'heavy', 'success', 'warning', 'error'),
          async (pattern) => {
            mockSupportsHaptics.mockReturnValue(true);
            mockImpact.mockRejectedValue(new Error('Haptics unavailable'));
            mockNotification.mockRejectedValue(new Error('Haptics unavailable'));
            
            const { HapticsControllerImpl } = await import('../../../src/platform/haptics');
            const controller = new HapticsControllerImpl();
            
            await expect(controller.trigger(pattern)).resolves.toBeUndefined();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
