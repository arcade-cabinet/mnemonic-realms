/**
 * Platform Adapter
 * 
 * Integrates all platform-specific features (storage, haptics, network, performance, touch)
 * with the RPG-JS game engine. Provides a unified interface for platform capabilities.
 * 
 * @module platform/adapter
 */

import { createStorageDriver } from '../storage/factory';
import type { StorageDriver } from '../storage/types';
import { platformDetector } from './detector';
import { hapticsController } from './haptics';
import { networkMonitor } from './network';
import { operationQueue } from './operation-queue';
import { performanceController } from './performance';
import { touchController } from './touch';
import type { PlatformInfo } from './types';

/**
 * Platform adapter configuration
 */
export interface PlatformAdapterConfig {
  /** Enable haptic feedback (default: true on mobile) */
  enableHaptics?: boolean;
  /** Enable network monitoring (default: true) */
  enableNetworkMonitoring?: boolean;
  /** Enable performance monitoring (default: true on mobile) */
  enablePerformanceMonitoring?: boolean;
  /** Enable touch optimization (default: true on mobile) */
  enableTouchOptimization?: boolean;
  /** Target frame rate for mobile (default: 60) */
  targetFrameRate?: number;
  /** Memory limit in MB for mobile (default: 512) */
  memoryLimitMB?: number;
}

/**
 * Platform adapter that integrates all platform features
 */
export class PlatformAdapter {
  private storage: StorageDriver | null = null;
  private platformInfo: PlatformInfo | null = null;
  private initialized = false;

  /**
   * Initialize the platform adapter
   */
  async initialize(config: PlatformAdapterConfig = {}): Promise<void> {
    if (this.initialized) {
      console.warn('PlatformAdapter already initialized');
      return;
    }

    // Get platform information
    this.platformInfo = await platformDetector.getPlatformInfo();
    const isNative = platformDetector.isNative();

    // Initialize storage
    this.storage = await createStorageDriver();

    // Initialize haptics if enabled and supported
    if (config.enableHaptics !== false && platformDetector.supportsHaptics()) {
      // Haptics controller is already initialized as a singleton
      console.log('Haptics enabled');
    }

    // Initialize network monitoring if enabled
    if (config.enableNetworkMonitoring !== false) {
      await networkMonitor.initialize();
      
      // Set up operation queue to sync when network is restored
      networkMonitor.addListener((status) => {
        if (status.connected) {
          operationQueue.processQueue().catch((error) => {
            console.error('Failed to process operation queue:', error);
          });
        }
      });
      
      console.log('Network monitoring enabled');
    }

    // Initialize performance monitoring if enabled and on mobile
    if (config.enablePerformanceMonitoring !== false && isNative) {
      performanceController.initialize({
        targetFPS: config.targetFrameRate || 60,
        memoryLimitMB: config.memoryLimitMB || 512,
      });
      console.log('Performance monitoring enabled');
    }

    // Initialize touch optimization if enabled and on mobile
    if (config.enableTouchOptimization !== false && isNative) {
      // Touch controller is already initialized as a singleton
      console.log('Touch optimization enabled');
    }

    this.initialized = true;
    console.log(`Platform adapter initialized for ${this.platformInfo.platform}`);
  }

  /**
   * Get platform information
   */
  getPlatformInfo(): PlatformInfo {
    if (!this.platformInfo) {
      throw new Error('PlatformAdapter not initialized');
    }
    return this.platformInfo;
  }

  /**
   * Get storage driver
   */
  getStorage(): StorageDriver {
    if (!this.storage) {
      throw new Error('PlatformAdapter not initialized');
    }
    return this.storage;
  }

  /**
   * Check if platform is native (iOS or Android)
   */
  isNative(): boolean {
    return platformDetector.isNative();
  }

  /**
   * Check if platform supports haptics
   */
  supportsHaptics(): boolean {
    return platformDetector.supportsHaptics();
  }

  /**
   * Check if platform supports native storage
   */
  supportsNativeStorage(): boolean {
    return platformDetector.supportsNativeStorage();
  }

  /**
   * Trigger haptic feedback
   */
  async triggerHaptic(pattern: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error'): Promise<void> {
    if (!this.supportsHaptics()) {
      return;
    }
    await hapticsController.trigger(pattern);
  }

  /**
   * Get current network status
   */
  getNetworkStatus() {
    return networkMonitor.getStatus();
  }

  /**
   * Get current performance metrics
   */
  getPerformanceMetrics() {
    return performanceController.getMetrics();
  }

  /**
   * Record a frame for performance monitoring
   */
  recordFrame(): void {
    if (this.isNative()) {
      performanceController.recordFrame();
    }
  }

  /**
   * Process a touch event
   */
  processTouchEvent(event: TouchEvent): boolean {
    if (this.isNative()) {
      return touchController.processTouchEvent(event);
    }
    return true; // Always process on web
  }

  /**
   * Validate touch target size
   */
  validateTouchTarget(element: HTMLElement): boolean {
    if (this.isNative()) {
      return touchController.validateTouchTarget(element);
    }
    return true; // Always valid on web
  }

  /**
   * Apply visual feedback to an element
   */
  applyVisualFeedback(element: HTMLElement): void {
    if (this.isNative()) {
      touchController.applyVisualFeedback(element);
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    // Close storage
    if (this.storage) {
      await this.storage.close();
      this.storage = null;
    }

    // Cleanup performance monitoring
    if (this.isNative()) {
      performanceController.cleanup();
      touchController.cleanup();
    }

    this.initialized = false;
    console.log('Platform adapter cleaned up');
  }
}

/**
 * Global platform adapter instance
 */
export const platformAdapter = new PlatformAdapter();
