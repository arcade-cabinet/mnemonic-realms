/**
 * Mnemonic Realms — Title Screen
 *
 * Barrel exports for the title screen module.
 */

// Pure logic (safe for unit testing — no React/Reanimated)
export {
  CLASS_DATA,
  confirmClassSelection,
  createTitleState,
  getMenuOptions,
  selectClass,
  selectMenuOption,
} from './title-logic';
// Component
export type { TitleScreenProps } from './title-screen';
export { TitleScreen } from './title-screen';
// Types
export type { ClassInfo, MenuOption, TitlePhase, TitleState } from './types';
