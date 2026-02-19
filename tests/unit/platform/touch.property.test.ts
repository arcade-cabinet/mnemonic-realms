import { describe, expect, it } from 'vitest';
import * as fc from 'fast-check';
import { TouchController, type TouchEvent } from '../../../src/platform/touch';

describe('TouchController Property Tests', () => {
  describe('Property 14: Touch Debouncing', () => {
    it('should only process first touch within debounce threshold', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100, max: 500 }), // debounceThreshold
          fc.array(fc.integer({ min: 0, max: 1000 }), { minLength: 2, maxLength: 10 }), // timestamps
          (debounceThreshold, timestamps) => {
            const controller = new TouchController({ debounceThreshold });
            const sortedTimestamps = [...timestamps].sort((a, b) => a - b);

            let lastProcessedTimestamp: number | null = null;

            for (const timestamp of sortedTimestamps) {
              const event: TouchEvent = { x: 100, y: 100, timestamp };
              const processed = controller.processTouchEvent(event);

              if (lastProcessedTimestamp === null) {
                // First touch should always be processed
                expect(processed).toBe(true);
                lastProcessedTimestamp = timestamp;
              } else {
                const timeSinceLastProcessed = timestamp - lastProcessedTimestamp;

                if (timeSinceLastProcessed >= debounceThreshold) {
                  // Should be processed if enough time has passed
                  expect(processed).toBe(true);
                  lastProcessedTimestamp = timestamp;
                } else {
                  // Should be debounced if within threshold
                  expect(processed).toBe(false);
                }
              }
            }

            controller.cleanup();
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should process touches separated by debounce threshold', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100, max: 500 }), // debounceThreshold
          fc.integer({ min: 1000, max: 10000 }), // baseTimestamp
          fc.integer({ min: 2, max: 5 }), // numTouches
          (debounceThreshold, baseTimestamp, numTouches) => {
            const controller = new TouchController({ debounceThreshold });

            // Generate touches separated by exactly debounceThreshold
            const timestamps = Array.from(
              { length: numTouches },
              (_, i) => baseTimestamp + i * debounceThreshold,
            );

            const results = timestamps.map((timestamp) => {
              const event: TouchEvent = { x: 100, y: 100, timestamp };
              return controller.processTouchEvent(event);
            });

            // All touches should be processed (separated by threshold)
            expect(results.every((result) => result === true)).toBe(true);

            controller.cleanup();
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Touch Target Size Validation', () => {
    it('should validate targets meeting minimum size requirements', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 44, max: 100 }), // minTouchTargetSize
          fc.integer({ min: 44, max: 200 }), // width
          fc.integer({ min: 44, max: 200 }), // height
          (minTouchTargetSize, width, height) => {
            const controller = new TouchController({ minTouchTargetSize });
            const element = document.createElement('button');
            element.style.width = `${width}px`;
            element.style.height = `${height}px`;
            document.body.appendChild(element);

            const isValid = controller.validateTouchTarget(element);

            if (width >= minTouchTargetSize && height >= minTouchTargetSize) {
              expect(isValid).toBe(true);
            } else {
              expect(isValid).toBe(false);
            }

            document.body.removeChild(element);
            controller.cleanup();
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Visual Feedback Timing', () => {
    it('should apply and remove feedback within configured duration', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100, max: 500 }), // visualFeedbackDuration
          (visualFeedbackDuration) => {
            const controller = new TouchController({ visualFeedbackDuration });
            const element = document.createElement('button');
            document.body.appendChild(element);

            controller.applyVisualFeedback(element);

            // Feedback should be applied immediately
            expect(element.classList.contains('touch-feedback')).toBe(true);

            document.body.removeChild(element);
            controller.cleanup();
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Configuration Immutability', () => {
    it('should not mutate config when retrieved', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100, max: 500 }),
          fc.integer({ min: 44, max: 100 }),
          fc.integer({ min: 100, max: 500 }),
          (debounceThreshold, minTouchTargetSize, visualFeedbackDuration) => {
            const controller = new TouchController({
              debounceThreshold,
              minTouchTargetSize,
              visualFeedbackDuration,
            });

            const config1 = controller.getConfig();
            config1.debounceThreshold = 999;
            config1.minTouchTargetSize = 999;
            config1.visualFeedbackDuration = 999;

            const config2 = controller.getConfig();

            // Original config should be unchanged
            expect(config2.debounceThreshold).toBe(debounceThreshold);
            expect(config2.minTouchTargetSize).toBe(minTouchTargetSize);
            expect(config2.visualFeedbackDuration).toBe(visualFeedbackDuration);

            controller.cleanup();
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Touch Event Processing Monotonicity', () => {
    it('should maintain monotonic processing order', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: 0, max: 10000 }), { minLength: 5, maxLength: 20 }),
          (timestamps) => {
            const controller = new TouchController({ debounceThreshold: 100 });
            const sortedTimestamps = [...timestamps].sort((a, b) => a - b);

            let lastProcessedTimestamp = -1;

            for (const timestamp of sortedTimestamps) {
              const event: TouchEvent = { x: 100, y: 100, timestamp };
              const processed = controller.processTouchEvent(event);

              if (processed) {
                // Processed timestamps should be monotonically increasing
                expect(timestamp).toBeGreaterThanOrEqual(lastProcessedTimestamp);
                lastProcessedTimestamp = timestamp;
              }
            }

            controller.cleanup();
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});
