/**
 * Asset Dimension Presets
 *
 * Standard dimensions for each asset type.
 * genWidth/genHeight = what Gemini produces (always square for best results).
 * width/height = final pixel-perfect output after downscale + composite.
 */

export const DIMENSIONS = {
  /** Single tile: generate at 256x256, downscale to 32x32 for compositing */
  tileIndividual: { width: 32, height: 32, genWidth: 256, genHeight: 256 },
  /** Standard walk sprite: 96x256 (3 cols x 8 rows), generate at 384x1024 */
  spriteWalk: { width: 96, height: 256, genWidth: 384, genHeight: 1024 },
  /** Large boss sprite: 192x256, generate at 768x1024 */
  spriteBoss: { width: 192, height: 256, genWidth: 768, genHeight: 1024 },
  /** Character portrait: 256x256 final, gen at 512x512 */
  portrait: { width: 256, height: 256, genWidth: 512, genHeight: 512 },
  /** Item icon: 64x64 final, gen at 256x256 */
  itemIcon: { width: 64, height: 64, genWidth: 256, genHeight: 256 },
  /** Dialogue frame: 800x200, generate at 1600x400 */
  dialogueFrame: { width: 800, height: 200, genWidth: 1600, genHeight: 400 },
  /** Battle background: 800x480, generate at 1600x960 */
  battleFrame: { width: 800, height: 480, genWidth: 1600, genHeight: 960 },
  /** Menu background: 800x600, generate at 1600x1200 */
  menuBackground: { width: 800, height: 600, genWidth: 1600, genHeight: 1200 },
  /** Title screen: 800x600, generate at 1600x1200 */
  titleBackground: { width: 800, height: 600, genWidth: 1600, genHeight: 1200 },
  /** 9-slice window border: 96x96 (3x3 grid), generate at 384x384 */
  windowBorder: { width: 96, height: 96, genWidth: 384, genHeight: 384 },
  /** Button: 160x48, generate at 640x192 */
  button: { width: 160, height: 48, genWidth: 640, genHeight: 192 },
  /** HUD element: 128x32, generate at 512x128 */
  hudElement: { width: 128, height: 32, genWidth: 512, genHeight: 128 },
} as const;
