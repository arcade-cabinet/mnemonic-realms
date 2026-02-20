/**
 * Mnemonic Realms — Testing Module
 *
 * Public API for all testing infrastructure.
 */

export {
  DiagnosticCollector,
  DiagnosticReporter,
} from './diagnostics/index.js';

export type {
  DiagnosticCategory,
  DiagnosticEvent,
  DiagnosticReport,
  DiagnosticSeverity,
  PacingMetrics,
  PlaytestTelemetry,
} from './diagnostics/index.js';

// ── AI Player ───────────────────────────────────────────────────────────────
export { AIPlayer } from './ai-player.js';
export type {
  AIPlayerConfig,
  AIPlayerTelemetry,
  GameScreen,
  GoalType,
} from './ai-player.js';

// ── Behaviors ───────────────────────────────────────────────────────────────
export { findPath, moveAlongPath } from './behaviors/navigation.js';
export type { Tile } from './behaviors/navigation.js';

export { selectCombatAction } from './behaviors/combat.js';

export {
  getNextQuestObjective,
  getAvailableQuests,
} from './behaviors/quest-following.js';
export type {
  QuestChain,
  QuestObjective,
  NextObjective,
} from './behaviors/quest-following.js';

export {
  getUnexploredTiles,
  pickExplorationTarget,
  markVisited,
  getExplorationCoverage,
} from './behaviors/exploration.js';

// ── Strategies ──────────────────────────────────────────────────────────────
export { validateStrategy } from './strategies/types.js';
export type {
  PlaythroughStrategy,
  CombatStyle,
} from './strategies/types.js';

export { completionistStrategy } from './strategies/completionist.js';
export { speedrunStrategy } from './strategies/speedrun.js';
export { sideQuestFocusStrategy } from './strategies/side-quest-focus.js';

