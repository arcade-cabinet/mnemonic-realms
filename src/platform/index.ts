/**
 * Platform Detection Module
 * 
 * Provides platform detection and capability checking for iOS, Android, and web.
 * 
 * @module platform
 */

export { getPlatformInfo, platformDetector } from './detector';
export type { PlatformDetector, PlatformInfo } from './types';
export { hapticsController } from './haptics';
export type { HapticsController, HapticPattern } from './haptics';
export { networkMonitor } from './network';
export type { NetworkStatus, NetworkStatusListener } from './network';
export { operationQueue } from './operation-queue';
export type { PendingOperation } from './operation-queue';
export { performanceController } from './performance';
export type { PerformanceConfig, PerformanceMetrics } from './performance';
export { retryWithExponentialBackoff, DEFAULT_RETRY_CONFIG } from './retry';
export type { RetryConfig } from './retry';
export { touchController } from './touch';
export type { TouchConfig, TouchController, TouchEvent } from './touch';


