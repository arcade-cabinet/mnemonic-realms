/**
 * Mnemonic Realms — Zone Placard Timing Constants
 *
 * Animation timing for the zone placard lifecycle.
 * No React/Reanimated imports — safe for unit testing.
 */

/** Duration for the slide-in from left (ms). */
export const DRIFT_IN_MS = 400;
/** Duration the placard stays visible (ms). */
export const HOLD_MS = 3000;
/** Duration for the dissolve-out fade (ms). */
export const DISSOLVE_OUT_MS = 500;
/** Total placard lifecycle duration (ms). */
export const TOTAL_PLACARD_MS = DRIFT_IN_MS + HOLD_MS + DISSOLVE_OUT_MS;
