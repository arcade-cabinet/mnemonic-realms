/**
 * Mnemonic Realms — Title Screen Types
 *
 * Pure type definitions for the title screen state machine.
 * No React imports — safe for logic modules and unit tests.
 */

// ── Phase Machine ────────────────────────────────────────────────────────────

/** Title screen phase progression: logo → menu → class-select → starting. */
export type TitlePhase = 'logo' | 'menu' | 'class-select' | 'starting';

/** Main menu options. */
export type MenuOption = 'new-journey' | 'continue' | 'settings';

// ── Class Info ───────────────────────────────────────────────────────────────

/** Player class display data for the selection screen. */
export interface ClassInfo {
  /** Unique class identifier (e.g. 'knight'). */
  id: string;
  /** Display name (e.g. 'Knight'). */
  name: string;
  /** Primary hex color for the class card. */
  color: string;
  /** Visual accent description. */
  accent: string;
  /** Personality quote reflecting the memory/vibrancy theme. */
  quote: string;
}

// ── Title State ──────────────────────────────────────────────────────────────

/** Complete title screen state — drives all rendering decisions. */
export interface TitleState {
  /** Current phase of the title screen. */
  phase: TitlePhase;
  /** Index of the currently highlighted menu option. */
  selectedMenu: number;
  /** Index of the currently highlighted class. */
  selectedClass: number;
  /** Whether a save file exists (enables "Continue" option). */
  hasSaveData: boolean;
}
