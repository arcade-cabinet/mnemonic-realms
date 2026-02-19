/**
 * Haptics Controller Implementation
 * 
 * Provides haptic feedback abstraction with graceful degradation.
 * Uses Capacitor Haptics plugin on native platforms, no-ops on web.
 * 
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4
 * 
 * @module platform/haptics
 */

import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { platformDetector } from './detector';

/**
 * Haptic feedback patterns available in the game.
 */
export type HapticPattern = 
  | 'light'      // Light impact (UI interactions)
  | 'medium'     // Medium impact (button presses)
  | 'heavy'      // Heavy impact (combat hits)
  | 'success'    // Success notification
  | 'warning'    // Warning notification
  | 'error';     // Error notification

/**
 * Haptics controller interface.
 */
export interface HapticsController {
  /**
   * Triggers a haptic feedback pattern.
   * No-op on platforms without haptics support.
   * 
   * @param pattern - The haptic pattern to trigger
   */
  trigger(pattern: HapticPattern): Promise<void>;
  
  /**
   * Checks if haptics are available on the current platform.
   * 
   * @returns true if haptics are supported, false otherwise
   */
  isAvailable(): boolean;
}

/**
 * Haptics controller implementation with graceful degradation.
 */
class HapticsControllerImpl implements HapticsController {
  private available: boolean;
  
  constructor() {
    this.available = platformDetector.supportsHaptics();
  }
  
  /**
   * Triggers a haptic feedback pattern.
   * Gracefully degrades to no-op on platforms without haptics.
   * 
   * @param pattern - The haptic pattern to trigger
   */
  async trigger(pattern: HapticPattern): Promise<void> {
    if (!this.available) {
      return; // Graceful degradation: no-op on unsupported platforms
    }
    
    try {
      switch (pattern) {
        case 'light':
          await Haptics.impact({ style: ImpactStyle.Light });
          break;
        case 'medium':
          await Haptics.impact({ style: ImpactStyle.Medium });
          break;
        case 'heavy':
          await Haptics.impact({ style: ImpactStyle.Heavy });
          break;
        case 'success':
          await Haptics.notification({ type: NotificationType.Success });
          break;
        case 'warning':
          await Haptics.notification({ type: NotificationType.Warning });
          break;
        case 'error':
          await Haptics.notification({ type: NotificationType.Error });
          break;
      }
    } catch (error) {
      // Graceful degradation: log error but don't throw
      console.warn('Haptics trigger failed:', error);
    }
  }
  
  /**
   * Checks if haptics are available on the current platform.
   * 
   * @returns true if haptics are supported, false otherwise
   */
  isAvailable(): boolean {
    return this.available;
  }
}

/**
 * Singleton instance of the haptics controller.
 * Export this instance to use throughout the application.
 */
export const hapticsController = new HapticsControllerImpl();

/**
 * Export the class for testing purposes.
 * @internal
 */
export { HapticsControllerImpl };
