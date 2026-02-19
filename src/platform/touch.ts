/**
 * Touch Controls Module
 * Provides touch input optimization for mobile platforms
 */

export interface TouchConfig {
  debounceThreshold: number; // milliseconds
  minTouchTargetSize: number; // pixels
  visualFeedbackDuration: number; // milliseconds
}

export interface TouchEvent {
  x: number;
  y: number;
  timestamp: number;
  target?: HTMLElement;
}

export class TouchController {
  private config: TouchConfig;
  private lastTouchTime: number | null = null;
  private feedbackElements: Map<HTMLElement, NodeJS.Timeout> = new Map();

  constructor(config?: Partial<TouchConfig>) {
    this.config = {
      debounceThreshold: config?.debounceThreshold ?? 100,
      minTouchTargetSize: config?.minTouchTargetSize ?? 44,
      visualFeedbackDuration: config?.visualFeedbackDuration ?? 200,
    };
  }

  /**
   * Process a touch event with debouncing
   * Returns true if the touch should be processed, false if debounced
   */
  processTouchEvent(event: TouchEvent): boolean {
    const now = event.timestamp;

    // First touch is always processed
    if (this.lastTouchTime === null) {
      this.lastTouchTime = now;
      return true;
    }

    const timeSinceLastTouch = now - this.lastTouchTime;

    if (timeSinceLastTouch < this.config.debounceThreshold) {
      return false; // Debounced
    }

    this.lastTouchTime = now;
    return true; // Process this touch
  }

  /**
   * Validate touch target size
   * Returns true if the target meets minimum size requirements
   */
  validateTouchTarget(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    let width = rect.width;
    let height = rect.height;

    // Fallback to computed style if getBoundingClientRect returns 0 (e.g., in test environments)
    if (width === 0 || height === 0) {
      const computedStyle = window.getComputedStyle(element);
      width = Number.parseFloat(computedStyle.width) || 0;
      height = Number.parseFloat(computedStyle.height) || 0;
    }

    return (
      width >= this.config.minTouchTargetSize &&
      height >= this.config.minTouchTargetSize
    );
  }

  /**
   * Apply visual feedback to a touch target
   */
  applyVisualFeedback(element: HTMLElement): void {
    // Clear any existing feedback timeout
    const existingTimeout = this.feedbackElements.get(element);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Add visual feedback class
    element.classList.add('touch-feedback');

    // Remove feedback after duration
    const timeout = setTimeout(() => {
      element.classList.remove('touch-feedback');
      this.feedbackElements.delete(element);
    }, this.config.visualFeedbackDuration);

    this.feedbackElements.set(element, timeout);
  }

  /**
   * Get current configuration
   */
  getConfig(): TouchConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<TouchConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  /**
   * Clean up all pending feedback timeouts
   */
  cleanup(): void {
    for (const timeout of this.feedbackElements.values()) {
      clearTimeout(timeout);
    }
    this.feedbackElements.clear();
  }
}

// Singleton instance
export const touchController = new TouchController();
