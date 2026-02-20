/**
 * Mnemonic Realms — Title Screen Logic
 *
 * Pure functions driving the title screen state machine.
 * No React/Reanimated imports — safe for unit testing.
 */

import type { ClassInfo, MenuOption, TitleState } from './types';

// ── Class Data ───────────────────────────────────────────────────────────────

/** All playable classes with personality quotes tied to the memory/vibrancy theme. */
export const CLASS_DATA: ClassInfo[] = [
  {
    id: 'knight',
    name: 'Knight',
    color: '#6B7B8B',
    accent: 'Broad shoulders, heavy armor, cape, sword at side',
    quote: 'The world forgets. I remember for it.',
  },
  {
    id: 'mage',
    name: 'Mage',
    color: '#2F4F4F',
    accent: 'Slim, angular, wide-brimmed hat, glowing hands',
    quote: 'Memory is the fabric of reality. I merely... rearrange the threads.',
  },
  {
    id: 'rogue',
    name: 'Rogue',
    color: '#3C3C3C',
    accent: 'Lean, agile, scarf, dual daggers, slightly crouched stance',
    quote: 'Forgotten places hold the best treasures.',
  },
  {
    id: 'cleric',
    name: 'Cleric',
    color: '#F5F0E6',
    accent: 'Medium build, flowing robes, hood or circlet, staff in one hand',
    quote: 'Every memory lost is a soul dimmed. I bring them back to light.',
  },
];

// ── State Factory ────────────────────────────────────────────────────────────

/** Create the initial title screen state. */
export function createTitleState(hasSaveData: boolean): TitleState {
  return {
    phase: 'logo',
    selectedMenu: 0,
    selectedClass: 0,
    hasSaveData,
  };
}

// ── Menu Helpers ─────────────────────────────────────────────────────────────

/** Menu options available based on save state. Continue only appears when save exists. */
export function getMenuOptions(hasSaveData: boolean): MenuOption[] {
  const options: MenuOption[] = ['new-journey'];
  if (hasSaveData) {
    options.push('continue');
  }
  options.push('settings');
  return options;
}

// ── State Transitions ────────────────────────────────────────────────────────

/** Handle a menu option selection — transitions to the appropriate phase. */
export function selectMenuOption(state: TitleState, option: MenuOption): TitleState {
  switch (option) {
    case 'new-journey':
      return { ...state, phase: 'class-select', selectedClass: 0 };
    case 'continue':
      return { ...state, phase: 'starting' };
    case 'settings':
      // Settings is a no-op for now — stays on menu
      return state;
    default:
      return state;
  }
}

/** Update the selected class index (clamped to valid range). */
export function selectClass(state: TitleState, index: number): TitleState {
  const clamped = Math.max(0, Math.min(CLASS_DATA.length - 1, index));
  return { ...state, selectedClass: clamped };
}

/** Confirm the current class selection. Returns class name or null if not in class-select phase. */
export function confirmClassSelection(state: TitleState): { className: string } | null {
  if (state.phase !== 'class-select') return null;
  const selected = CLASS_DATA[state.selectedClass];
  if (!selected) return null;
  return { className: selected.name };
}
