import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TouchController, type TouchEvent } from '../../../src/platform/touch';

describe('TouchController', () => {
  let controller: TouchController;

  beforeEach(() => {
    controller = new TouchController();
    vi.useFakeTimers();
  });

  afterEach(() => {
    controller.cleanup();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('initialization', () => {
    it('should initialize with default config', () => {
      const config = controller.getConfig();
      expect(config.debounceThreshold).toBe(100);
      expect(config.minTouchTargetSize).toBe(44);
      expect(config.visualFeedbackDuration).toBe(200);
    });

    it('should initialize with custom config', () => {
      const customController = new TouchController({
        debounceThreshold: 150,
        minTouchTargetSize: 48,
        visualFeedbackDuration: 300,
      });
      const config = customController.getConfig();
      expect(config.debounceThreshold).toBe(150);
      expect(config.minTouchTargetSize).toBe(48);
      expect(config.visualFeedbackDuration).toBe(300);
      customController.cleanup();
    });
  });

  describe('processTouchEvent', () => {
    it('should process first touch event', () => {
      const event: TouchEvent = { x: 100, y: 100, timestamp: 1000 };
      expect(controller.processTouchEvent(event)).toBe(true);
    });

    it('should debounce rapid touch events', () => {
      const event1: TouchEvent = { x: 100, y: 100, timestamp: 1000 };
      const event2: TouchEvent = { x: 110, y: 110, timestamp: 1050 }; // 50ms later

      expect(controller.processTouchEvent(event1)).toBe(true);
      expect(controller.processTouchEvent(event2)).toBe(false); // Debounced
    });

    it('should process touch events after debounce threshold', () => {
      const event1: TouchEvent = { x: 100, y: 100, timestamp: 1000 };
      const event2: TouchEvent = { x: 110, y: 110, timestamp: 1150 }; // 150ms later

      expect(controller.processTouchEvent(event1)).toBe(true);
      expect(controller.processTouchEvent(event2)).toBe(true); // Not debounced
    });

    it('should respect custom debounce threshold', () => {
      const customController = new TouchController({ debounceThreshold: 200 });
      const event1: TouchEvent = { x: 100, y: 100, timestamp: 1000 };
      const event2: TouchEvent = { x: 110, y: 110, timestamp: 1150 }; // 150ms later

      expect(customController.processTouchEvent(event1)).toBe(true);
      expect(customController.processTouchEvent(event2)).toBe(false); // Debounced with 200ms threshold
      customController.cleanup();
    });
  });

  describe('validateTouchTarget', () => {
    it('should validate touch target that meets minimum size', () => {
      const element = document.createElement('button');
      element.style.width = '50px';
      element.style.height = '50px';
      document.body.appendChild(element);

      expect(controller.validateTouchTarget(element)).toBe(true);

      document.body.removeChild(element);
    });

    it('should reject touch target that is too small', () => {
      const element = document.createElement('button');
      element.style.width = '30px';
      element.style.height = '30px';
      document.body.appendChild(element);

      expect(controller.validateTouchTarget(element)).toBe(false);

      document.body.removeChild(element);
    });

    it('should reject touch target with insufficient width', () => {
      const element = document.createElement('button');
      element.style.width = '30px';
      element.style.height = '50px';
      document.body.appendChild(element);

      expect(controller.validateTouchTarget(element)).toBe(false);

      document.body.removeChild(element);
    });

    it('should reject touch target with insufficient height', () => {
      const element = document.createElement('button');
      element.style.width = '50px';
      element.style.height = '30px';
      document.body.appendChild(element);

      expect(controller.validateTouchTarget(element)).toBe(false);

      document.body.removeChild(element);
    });

    it('should respect custom minimum touch target size', () => {
      const customController = new TouchController({ minTouchTargetSize: 48 });
      const element = document.createElement('button');
      element.style.width = '46px';
      element.style.height = '46px';
      document.body.appendChild(element);

      expect(customController.validateTouchTarget(element)).toBe(false);

      document.body.removeChild(element);
      customController.cleanup();
    });
  });

  describe('applyVisualFeedback', () => {
    it('should add visual feedback class to element', () => {
      const element = document.createElement('button');
      document.body.appendChild(element);

      controller.applyVisualFeedback(element);

      expect(element.classList.contains('touch-feedback')).toBe(true);

      document.body.removeChild(element);
    });

    it('should remove visual feedback class after duration', () => {
      const element = document.createElement('button');
      document.body.appendChild(element);

      controller.applyVisualFeedback(element);
      expect(element.classList.contains('touch-feedback')).toBe(true);

      vi.advanceTimersByTime(200);
      expect(element.classList.contains('touch-feedback')).toBe(false);

      document.body.removeChild(element);
    });

    it('should clear existing feedback timeout when applying new feedback', () => {
      const element = document.createElement('button');
      document.body.appendChild(element);

      controller.applyVisualFeedback(element);
      vi.advanceTimersByTime(100);
      controller.applyVisualFeedback(element); // Apply again before first timeout completes

      vi.advanceTimersByTime(150); // Total 250ms, but second feedback should still be active
      expect(element.classList.contains('touch-feedback')).toBe(true);

      vi.advanceTimersByTime(50); // Total 300ms, second feedback should now be removed
      expect(element.classList.contains('touch-feedback')).toBe(false);

      document.body.removeChild(element);
    });

    it('should respect custom visual feedback duration', () => {
      const customController = new TouchController({ visualFeedbackDuration: 300 });
      const element = document.createElement('button');
      document.body.appendChild(element);

      customController.applyVisualFeedback(element);
      expect(element.classList.contains('touch-feedback')).toBe(true);

      vi.advanceTimersByTime(200);
      expect(element.classList.contains('touch-feedback')).toBe(true); // Still active

      vi.advanceTimersByTime(100);
      expect(element.classList.contains('touch-feedback')).toBe(false); // Now removed

      document.body.removeChild(element);
      customController.cleanup();
    });
  });

  describe('updateConfig', () => {
    it('should update debounce threshold', () => {
      controller.updateConfig({ debounceThreshold: 150 });
      expect(controller.getConfig().debounceThreshold).toBe(150);
    });

    it('should update minimum touch target size', () => {
      controller.updateConfig({ minTouchTargetSize: 48 });
      expect(controller.getConfig().minTouchTargetSize).toBe(48);
    });

    it('should update visual feedback duration', () => {
      controller.updateConfig({ visualFeedbackDuration: 300 });
      expect(controller.getConfig().visualFeedbackDuration).toBe(300);
    });

    it('should update multiple config values', () => {
      controller.updateConfig({
        debounceThreshold: 150,
        minTouchTargetSize: 48,
      });
      const config = controller.getConfig();
      expect(config.debounceThreshold).toBe(150);
      expect(config.minTouchTargetSize).toBe(48);
      expect(config.visualFeedbackDuration).toBe(200); // Unchanged
    });
  });

  describe('cleanup', () => {
    it('should clear all pending feedback timeouts', () => {
      const element1 = document.createElement('button');
      const element2 = document.createElement('button');
      document.body.appendChild(element1);
      document.body.appendChild(element2);

      controller.applyVisualFeedback(element1);
      controller.applyVisualFeedback(element2);

      controller.cleanup();

      vi.advanceTimersByTime(200);
      expect(element1.classList.contains('touch-feedback')).toBe(true); // Not removed because timeout was cleared
      expect(element2.classList.contains('touch-feedback')).toBe(true);

      document.body.removeChild(element1);
      document.body.removeChild(element2);
    });
  });
});
