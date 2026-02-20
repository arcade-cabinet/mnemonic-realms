/**
 * Game Loop — 60fps tick via Reanimated useFrameCallback.
 *
 * Thin hook that drives the game loop. All logic lives in system functions
 * called from the callback — this file is just the scheduler.
 *
 * Usage:
 * ```tsx
 * useGameLoop((dt) => {
 *   movementSystem(world, collisionGrid, mapWidth);
 *   cameraSystem(world);
 * });
 * ```
 */

import { useFrameCallback } from 'react-native-reanimated';

/**
 * Hook that runs a callback every frame (~60fps) via Reanimated.
 *
 * @param callback - Called each frame with delta time in milliseconds.
 *                   Delta is clamped to [0, 100] to prevent physics explosions
 *                   after tab-away or debugger pauses.
 */
export function useGameLoop(callback: (dt: number) => void): void {
  useFrameCallback((frameInfo) => {
    const raw = frameInfo.timeSincePreviousFrame ?? 16;
    // Clamp delta to prevent physics explosions after tab-away
    const dt = Math.min(Math.max(raw, 0), 100);
    callback(dt);
  });
}
