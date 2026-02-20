/**
 * Camera system — pure math for camera positioning.
 *
 * No React, no Skia, no side effects.
 * Centers camera on player, clamps to map bounds, smooth interpolation.
 */

// ── Camera position computation ──────────────────────────────────────────────

/**
 * Compute the camera position (top-left corner of viewport) centered on the player.
 * Clamps to map bounds so the camera never shows black space outside the map.
 *
 * @param playerX - Player X position in pixels
 * @param playerY - Player Y position in pixels
 * @param viewportWidth - Viewport width in pixels
 * @param viewportHeight - Viewport height in pixels
 * @param mapWidthPx - Total map width in pixels
 * @param mapHeightPx - Total map height in pixels
 * @returns Camera position (top-left corner) in pixels
 */
export function computeCameraPosition(
  playerX: number,
  playerY: number,
  viewportWidth: number,
  viewportHeight: number,
  mapWidthPx: number,
  mapHeightPx: number,
): { x: number; y: number } {
  // Center camera on player
  const idealX = playerX - viewportWidth / 2;
  const idealY = playerY - viewportHeight / 2;

  // Clamp to map bounds (never show outside map)
  const maxX = Math.max(0, mapWidthPx - viewportWidth);
  const maxY = Math.max(0, mapHeightPx - viewportHeight);

  const x = Math.max(0, Math.min(idealX, maxX));
  const y = Math.max(0, Math.min(idealY, maxY));

  return { x, y };
}

// ── Smooth interpolation ─────────────────────────────────────────────────────

/**
 * Linearly interpolate between current and target camera positions.
 * Used for smooth camera following (call each frame).
 *
 * @param current - Current camera position
 * @param target - Target camera position (from computeCameraPosition)
 * @param factor - Interpolation factor (0 = no movement, 1 = instant snap).
 *                 Typical values: 0.1–0.3 for smooth follow.
 * @returns Interpolated camera position
 */
export function lerpCamera(
  current: { x: number; y: number },
  target: { x: number; y: number },
  factor: number,
): { x: number; y: number } {
  // Clamp factor to [0, 1]
  const f = Math.max(0, Math.min(1, factor));

  return {
    x: current.x + (target.x - current.x) * f,
    y: current.y + (target.y - current.y) * f,
  };
}
