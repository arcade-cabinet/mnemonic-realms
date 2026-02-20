/**
 * Mnemonic Realms — Testing Module
 *
 * Public API for all testing infrastructure.
 */

export type {
  AIPlayerConfig,
  AIPlayerTelemetry,
  GameScreen,
  GoalType,
} from './ai-player.js';
// ── AI Player ───────────────────────────────────────────────────────────────
export { AIPlayer } from './ai-player.js';
export { selectCombatAction } from './behaviors/combat.js';
export {
  getExplorationCoverage,
  getUnexploredTiles,
  markVisited,
  pickExplorationTarget,
} from './behaviors/exploration.js';
export type { Tile } from './behaviors/navigation.js';
// ── Behaviors ───────────────────────────────────────────────────────────────
export { findPath, moveAlongPath } from './behaviors/navigation.js';
export type {
  NextObjective,
  QuestChain,
  QuestObjective,
} from './behaviors/quest-following.js';

export {
  getAvailableQuests,
  getNextQuestObjective,
} from './behaviors/quest-following.js';
export type {
  DiagnosticCategory,
  DiagnosticEvent,
  DiagnosticReport,
  DiagnosticSeverity,
  PacingMetrics,
  PlaytestTelemetry,
} from './diagnostics/index.js';
export {
  DiagnosticCollector,
  DiagnosticReporter,
} from './diagnostics/index.js';
export { completionistStrategy } from './strategies/completionist.js';
export { sideQuestFocusStrategy } from './strategies/side-quest-focus.js';
export { speedrunStrategy } from './strategies/speedrun.js';
export type {
  CombatStyle,
  PlaythroughStrategy,
} from './strategies/types.js';
// ── Strategies ──────────────────────────────────────────────────────────────
export { validateStrategy } from './strategies/types.js';
