/**
 * Mnemonic Realms — HUD Sub-components
 *
 * Barrel exports for HUD pieces used by the main Hud container.
 */

export type { HpBarProps } from './hp-bar';
// Component exports
export { HpBar } from './hp-bar';
// Pure utility exports (safe for unit testing — no React/Reanimated)
export { computeHpPercent, isLowHp, LOW_HP_THRESHOLD } from './hp-utils';
export { DISSOLVE_OUT_MS, DRIFT_IN_MS, HOLD_MS, TOTAL_PLACARD_MS } from './placard-timing';
export type { VibrancyMeterProps } from './vibrancy-meter';
export { VibrancyMeter } from './vibrancy-meter';
export type { VibrancyState, VibrancyVisual } from './vibrancy-utils';
export { vibrancyStateVisual } from './vibrancy-utils';
export type { ZonePlacardProps } from './zone-placard';
export { ZonePlacard } from './zone-placard';
