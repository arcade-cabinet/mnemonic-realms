/**
 * Playthrough Strategy Types
 *
 * Defines how the AI player prioritizes goals during automated traversal.
 * Pure data types — no side effects.
 */

/** Combat approach for the AI player. */
export type CombatStyle = 'aggressive' | 'defensive' | 'balanced';

/**
 * A playthrough strategy configures the AI player's priorities.
 *
 * - `prioritizeMainQuest`: Main quest goals score higher than side content.
 * - `completeSideQuests`: Whether to attempt side quests when available.
 * - `exploreAllAreas`: Whether to visit every reachable tile.
 * - `combatStyle`: How to select combat actions.
 * - `maxTicksPerArea`: Stuck detection threshold per area.
 */
export interface PlaythroughStrategy {
  /** Unique identifier for this strategy. */
  id: string;
  /** Human-readable name. */
  name: string;
  /** Prioritize main quest objectives over side content. */
  prioritizeMainQuest: boolean;
  /** Attempt side quests when conditions are met. */
  completeSideQuests: boolean;
  /** Visit every reachable tile on each map. */
  exploreAllAreas: boolean;
  /** Combat action selection approach. */
  combatStyle: CombatStyle;
  /** Maximum ticks to spend in one area before flagging as stuck. */
  maxTicksPerArea: number;
}

/**
 * Validate that a strategy has all required fields with valid values.
 * Returns an array of error messages (empty = valid).
 */
export function validateStrategy(strategy: PlaythroughStrategy): string[] {
  const errors: string[] = [];

  if (!strategy.id || strategy.id.trim().length === 0) {
    errors.push('Strategy id must be a non-empty string');
  }
  if (!strategy.name || strategy.name.trim().length === 0) {
    errors.push('Strategy name must be a non-empty string');
  }
  const validStyles: CombatStyle[] = ['aggressive', 'defensive', 'balanced'];
  if (!validStyles.includes(strategy.combatStyle)) {
    errors.push(`combatStyle must be one of: ${validStyles.join(', ')}`);
  }
  if (typeof strategy.maxTicksPerArea !== 'number' || strategy.maxTicksPerArea <= 0) {
    errors.push('maxTicksPerArea must be a positive number');
  }

  return errors;
}
