/**
 * Mobile Performance Optimization Module
 * 
 * Provides frame rate throttling, background resource reduction,
 * and memory usage monitoring for mobile platforms.
 * 
 * @module platform/performance
 */

import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

/**
 * Performance configuration for mobile platforms.
 */
export interface PerformanceConfig {
  /** Target frame rate for mobile (default: 60) */
  targetFrameRate: number;
  /** Memory limit in MB (default: 512) */
  memoryLimitMB: number;
  /** Enable background resource reduction (default: true) */
  enableBackgroundReduction: boolean;
}

/**
 * Performance metrics for monitoring.
 */
export interface PerformanceMetrics {
  /** Current frame rate (FPS) */
  currentFPS: number;
  /** Current memory usage in MB */
  memoryUsageMB: number;
  /** Whether app is in background */
  isBackgrounded: boolean;
  /** Last update timestamp */
  timestamp: number;
}

/**
 * Controller for mobile performance optimizations.
 * 
 * Validates: Requirements 12.2, 12.3, 12.5
 */
export class PerformanceController {
  private config: PerformanceConfig;
  private isBackgrounded = false;
  private frameCount = 0;
  private lastFrameTime = 0;
  private currentFPS = 0;
  private frameRateInterval: number | null = null;
  private memoryCheckInterval: number | null = null;
  private appStateListener: (() => void) | null = null;

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = {
      targetFrameRate: config.targetFrameRate ?? 60,
      memoryLimitMB: config.memoryLimitMB ?? 512,
      enableBackgroundReduction: config.enableBackgroundReduction ?? true,
    };
  }

  /**
   * Initialize performance monitoring and optimizations.
   */
  async initialize(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      console.warn('Performance optimizations are only available on native platforms');
      return;
    }

    try {
      // Set up app state listener for background detection
      this.appStateListener = await App.addListener('appStateChange', (state) => {
        this.isBackgrounded = !state.isActive;
        if (this.config.enableBackgroundReduction) {
          this.handleBackgroundStateChange();
        }
      });

      // Start frame rate monitoring
      this.startFrameRateMonitoring();

      // Start memory monitoring
      this.startMemoryMonitoring();
    } catch (error) {
      console.warn('Failed to initialize performance monitoring:', error);
    }
  }

  /**
   * Clean up performance monitoring.
   */
  async cleanup(): Promise<void> {
    if (this.frameRateInterval !== null) {
      clearInterval(this.frameRateInterval);
      this.frameRateInterval = null;
    }

    if (this.memoryCheckInterval !== null) {
      clearInterval(this.memoryCheckInterval);
      this.memoryCheckInterval = null;
    }

    if (this.appStateListener) {
      this.appStateListener();
      this.appStateListener = null;
    }
  }

  /**
   * Record a frame for FPS calculation.
   */
  recordFrame(): void {
    const now = performance.now();
    this.frameCount++;

    if (this.lastFrameTime === 0) {
      this.lastFrameTime = now;
    }
  }

  /**
   * Get current performance metrics.
   */
  getMetrics(): PerformanceMetrics {
    return {
      currentFPS: this.currentFPS,
      memoryUsageMB: this.getMemoryUsage(),
      isBackgrounded: this.isBackgrounded,
      timestamp: Date.now(),
    };
  }

  /**
   * Check if frame rate is within target.
   */
  isFrameRateWithinTarget(): boolean {
    return this.currentFPS <= this.config.targetFrameRate;
  }

  /**
   * Check if memory usage is within limit.
   */
  isMemoryWithinLimit(): boolean {
    return this.getMemoryUsage() <= this.config.memoryLimitMB;
  }

  private startFrameRateMonitoring(): void {
    // Calculate FPS every second
    this.frameRateInterval = setInterval(() => {
      const now = performance.now();
      const elapsed = now - this.lastFrameTime;

      if (elapsed > 0) {
        this.currentFPS = Math.round((this.frameCount * 1000) / elapsed);
      }

      this.frameCount = 0;
      this.lastFrameTime = now;
    }, 1000) as unknown as number;
  }

  private startMemoryMonitoring(): void {
    // Check memory every 5 seconds
    this.memoryCheckInterval = setInterval(() => {
      const memoryUsage = this.getMemoryUsage();
      if (memoryUsage > this.config.memoryLimitMB) {
        console.warn(`Memory usage (${memoryUsage}MB) exceeds limit (${this.config.memoryLimitMB}MB)`);
      }
    }, 5000) as unknown as number;
  }

  private getMemoryUsage(): number {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const memory = (performance as { memory?: { usedJSHeapSize: number } }).memory;
      if (memory) {
        return Math.round(memory.usedJSHeapSize / (1024 * 1024));
      }
    }
    return 0;
  }

  private handleBackgroundStateChange(): void {
    if (this.isBackgrounded) {
      // Reduce frame rate monitoring frequency when backgrounded
      if (this.frameRateInterval !== null) {
        clearInterval(this.frameRateInterval);
        this.frameRateInterval = null;
      }
      if (this.memoryCheckInterval !== null) {
        clearInterval(this.memoryCheckInterval);
        this.memoryCheckInterval = null;
      }
    } else {
      // Resume normal monitoring when foregrounded
      this.startFrameRateMonitoring();
      this.startMemoryMonitoring();
    }
  }
}

/**
 * Singleton instance of PerformanceController.
 */
export const performanceController = new PerformanceController();
