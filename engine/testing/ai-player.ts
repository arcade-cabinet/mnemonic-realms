/**
 * AI Player — Goal-driven autonomous game traversal agent.
 *
 * Operates on pure engine functions directly (NOT through Playwright DOM).
 * Uses a custom goal-driven decision tree and state machine inspired by
 * Yuka's Think arbiter pattern, implemented in pure TypeScript.
 *
 * The AI player:
 * 1. Reads ECS world state (player position, quest flags, vibrancy areas)
 * 2. Evaluates goal desirability scores
 * 3. Activates the highest-priority goal
 * 4. Translates the goal into engine actions (set Velocity, triggerInteraction, etc.)
 * 5. Returns telemetry for diagnostics
 */

import type { World } from 'koota';
import { playerQuery } from '../ecs/queries.js';
import { findInteractable, triggerInteraction } from '../ecs/systems/interaction.js';
import { movementSystem } from '../ecs/systems/movement.js';
import { Facing, Health, Position, QuestFlags, Velocity } from '../ecs/traits.js';
import type { CombatState } from '../encounters/types.js';
import { TILE_SIZE } from '../renderer/types.js';
import type { QuestState } from '../save/types.js';
import type { LoadedMap } from '../world/loader.js';
import { selectCombatAction } from './behaviors/combat.js';
import { getUnexploredTiles, markVisited, pickExplorationTarget } from './behaviors/exploration.js';
import type { Tile } from './behaviors/navigation.js';
import { findPath, moveAlongPath } from './behaviors/navigation.js';
import type { NextObjective, QuestChain } from './behaviors/quest-following.js';
import { getNextQuestObjective } from './behaviors/quest-following.js';
import type { PlaythroughStrategy } from './strategies/types.js';

// ── Types ───────────────────────────────────────────────────────────────────

export interface AIPlayerConfig {
  strategy: PlaythroughStrategy;
  world: World;
  collisionGrid: Uint8Array;
  mapWidth: number;
  mapData: LoadedMap;
  questChains?: QuestChain[];
}

export interface AIPlayerTelemetry {
  tick: number;
  position: { x: number; y: number };
  currentGoal: string;
  action: string;
  questState: Record<string, string>;
  errors: string[];
}

/** Game screen states tracked by the state machine. */
export type GameScreen = 'overworld' | 'combat' | 'dialogue' | 'menu' | 'transition' | 'title';

/** Goal types the AI can pursue. */
export type GoalType = 'idle' | 'navigate' | 'explore' | 'interact' | 'combat' | 'quest' | 'heal';

// ── Goal Evaluator ──────────────────────────────────────────────────────────

interface GoalScore {
  goal: GoalType;
  score: number;
}

// ── AI Player Class ─────────────────────────────────────────────────────────

export class AIPlayer {
  private world: World;
  private collisionGrid: Uint8Array;
  private mapWidth: number;
  private mapHeight: number;
  private mapData: LoadedMap;
  private strategy: PlaythroughStrategy;
  private questChains: QuestChain[];

  // State machine
  private currentScreen: GameScreen = 'overworld';
  private currentGoal: GoalType = 'idle';
  private combatState: CombatState | null = null;
  private questTracker: Record<string, QuestState> = {};

  // Navigation state
  private currentPath: Tile[] = [];
  private pathIndex = 0;
  private navigationTarget: Tile | null = null;

  // Exploration state
  private visitedTiles: Set<number> = new Set();

  // Telemetry
  private tickCount = 0;
  private telemetryLog: AIPlayerTelemetry[] = [];
  private lastPosition: { x: number; y: number } = { x: 0, y: 0 };
  private stuckTicks = 0;
  private readonly STUCK_THRESHOLD = 50;

  constructor(config: AIPlayerConfig) {
    this.world = config.world;
    this.collisionGrid = config.collisionGrid;
    this.mapWidth = config.mapWidth;
    this.mapHeight = config.collisionGrid.length / config.mapWidth;
    this.mapData = config.mapData;
    this.strategy = config.strategy;
    this.questChains = config.questChains ?? [];
  }

  // ── Public API ──────────────────────────────────────────────────────────

  /** Run one AI tick. Returns telemetry for this tick. */
  tick(deltaTime: number): AIPlayerTelemetry {
    this.tickCount++;
    const errors: string[] = [];
    let action = 'none';

    try {
      // 1. Read world state
      const playerPos = this.getPlayerPosition();
      if (!playerPos) {
        errors.push('No player entity found');
        return this.buildTelemetry(action, errors);
      }

      // Track visited tiles
      const tileX = Math.round(playerPos.x / TILE_SIZE);
      const tileY = Math.round(playerPos.y / TILE_SIZE);
      markVisited(this.visitedTiles, tileX, tileY, this.mapWidth);

      // 2. Detect stuck state
      this.updateStuckDetection(playerPos);

      // 3. Evaluate goals and select highest priority
      this.currentGoal = this.evaluateGoals(playerPos);

      // 4. Execute the selected goal
      action = this.executeGoal(playerPos, tileX, tileY);

      // 5. Run movement system to apply velocity
      movementSystem(this.world, this.collisionGrid, this.mapWidth);
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
    }

    const telemetry = this.buildTelemetry(action, errors);
    this.telemetryLog.push(telemetry);
    return telemetry;
  }

  /** Update the active strategy. */
  setStrategy(strategy: PlaythroughStrategy): void {
    this.strategy = strategy;
  }

  /** Get the current active goal name. */
  getCurrentGoal(): string {
    return this.currentGoal;
  }

  /** Get the full telemetry log. */
  getTelemetryLog(): AIPlayerTelemetry[] {
    return [...this.telemetryLog];
  }

  /** Check if the AI is stuck (no progress for N ticks). */
  isStuck(): boolean {
    return this.stuckTicks >= this.STUCK_THRESHOLD;
  }

  /** Set the current game screen state. */
  setScreen(screen: GameScreen): void {
    this.currentScreen = screen;
  }

  /** Set the current combat state (when entering combat). */
  setCombatState(state: CombatState | null): void {
    this.combatState = state;
  }

  /** Update the quest tracker state. */
  setQuestTracker(tracker: Record<string, QuestState>): void {
    this.questTracker = tracker;
  }

  // ── Goal Evaluation (Think arbiter) ─────────────────────────────────────

  private evaluateGoals(playerPos: { x: number; y: number }): GoalType {
    const scores: GoalScore[] = [];

    // Combat goal — highest priority when in combat
    if (this.currentScreen === 'combat' && this.combatState) {
      scores.push({ goal: 'combat', score: 0.85 });
    }

    // Heal goal — high priority when HP is low
    const hpScore = this.evaluateHealGoal();
    if (hpScore > 0) {
      scores.push({ goal: 'heal', score: hpScore });
    }

    // Quest goal — main driver
    const questScore = this.evaluateQuestGoal();
    if (questScore > 0) {
      scores.push({ goal: 'quest', score: questScore });
    }

    // Explore goal — when strategy wants exploration
    if (this.strategy.exploreAllAreas) {
      scores.push({ goal: 'explore', score: 0.4 });
    }

    // Navigate goal — when we have a path to follow
    if (this.currentPath.length > 0 && this.pathIndex < this.currentPath.length) {
      scores.push({ goal: 'navigate', score: 0.5 });
    }

    // Interact goal — when facing an interactable
    const interactScore = this.evaluateInteractGoal(playerPos);
    if (interactScore > 0) {
      scores.push({ goal: 'interact', score: interactScore });
    }

    // Select highest scoring goal
    if (scores.length === 0) return 'idle';
    scores.sort((a, b) => b.score - a.score);
    return scores[0].goal;
  }

  private evaluateHealGoal(): number {
    const players = this.world.query(playerQuery);
    if (players.length === 0) return 0;
    const player = players[0];
    if (!player.has(Health)) return 0;
    const health = player.get(Health);
    if (health.max === 0) return 0;
    const ratio = health.current / health.max;
    if (ratio < 0.3) return 0.9;
    if (ratio < 0.5) return 0.6;
    return 0;
  }

  private evaluateQuestGoal(): number {
    const next = getNextQuestObjective(
      this.questTracker,
      this.questChains,
      this.strategy.prioritizeMainQuest,
    );
    if (!next) return 0;
    return next.isMainQuest ? 0.7 : 0.3;
  }

  private evaluateInteractGoal(playerPos: { x: number; y: number }): number {
    const players = this.world.query(playerQuery);
    if (players.length === 0) return 0;
    const player = players[0];
    const facing = player.has(Facing) ? player.get(Facing).direction : 'down';
    const interactable = findInteractable(this.world, playerPos.x, playerPos.y, facing);
    return interactable ? 0.65 : 0;
  }

  // ── Goal Execution ──────────────────────────────────────────────────────

  private executeGoal(playerPos: { x: number; y: number }, tileX: number, tileY: number): string {
    switch (this.currentGoal) {
      case 'combat':
        return this.executeCombatGoal();
      case 'heal':
        return 'defend'; // In overworld, heal is a no-op; in combat, defend
      case 'quest':
        return this.executeQuestGoal(tileX, tileY);
      case 'navigate':
        return this.executeNavigateGoal();
      case 'explore':
        return this.executeExploreGoal(tileX, tileY);
      case 'interact':
        return this.executeInteractGoal(playerPos);
      default:
        return 'idle';
    }
  }

  private executeCombatGoal(): string {
    if (!this.combatState) return 'no-combat-state';
    const currentId = this.combatState.turnOrder[this.combatState.currentTurnIndex];
    const action = selectCombatAction(this.combatState, currentId, this.strategy.combatStyle);
    return `combat:${action.type}`;
  }

  private executeQuestGoal(tileX: number, tileY: number): string {
    const next = getNextQuestObjective(
      this.questTracker,
      this.questChains,
      this.strategy.prioritizeMainQuest,
    );
    if (!next) return 'no-quest-objective';

    // Navigate to objective location
    const target: Tile = {
      x: next.objective.targetX,
      y: next.objective.targetY,
    };
    this.currentPath = findPath(this.collisionGrid, this.mapWidth, { x: tileX, y: tileY }, target);
    this.pathIndex = 0;
    this.navigationTarget = target;

    if (this.currentPath.length > 1) {
      moveAlongPath(this.world, this.currentPath, this.pathIndex);
      this.pathIndex++;
      return `quest:navigate:${next.questId}`;
    }

    return `quest:at-objective:${next.questId}`;
  }

  private executeNavigateGoal(): string {
    if (this.pathIndex >= this.currentPath.length - 1) {
      this.currentPath = [];
      this.pathIndex = 0;
      return 'navigate:complete';
    }

    const nextIdx = moveAlongPath(this.world, this.currentPath, this.pathIndex);
    if (nextIdx === -1) {
      this.currentPath = [];
      return 'navigate:failed';
    }
    this.pathIndex = nextIdx;
    return 'navigate:moving';
  }

  private executeExploreGoal(tileX: number, tileY: number): string {
    const unexplored = getUnexploredTiles(
      this.visitedTiles,
      this.collisionGrid,
      this.mapWidth,
      this.mapHeight,
    );

    if (unexplored.length === 0) return 'explore:complete';

    const target = pickExplorationTarget(unexplored, { x: tileX, y: tileY });
    if (!target) return 'explore:no-target';

    this.currentPath = findPath(this.collisionGrid, this.mapWidth, { x: tileX, y: tileY }, target);
    this.pathIndex = 0;

    if (this.currentPath.length > 1) {
      moveAlongPath(this.world, this.currentPath, this.pathIndex);
      this.pathIndex++;
      return 'explore:navigating';
    }

    return 'explore:at-target';
  }

  private executeInteractGoal(playerPos: { x: number; y: number }): string {
    const players = this.world.query(playerQuery);
    if (players.length === 0) return 'interact:no-player';
    const player = players[0];
    const facing = player.has(Facing) ? player.get(Facing).direction : 'down';
    const entity = findInteractable(this.world, playerPos.x, playerPos.y, facing);
    if (!entity) return 'interact:nothing';

    const result = triggerInteraction(entity);
    if (!result) return 'interact:no-result';
    return `interact:${result.type}`;
  }

  // ── Helpers ─────────────────────────────────────────────────────────────

  private getPlayerPosition(): { x: number; y: number } | null {
    const players = this.world.query(playerQuery);
    if (players.length === 0) return null;
    const pos = players[0].get(Position);
    return { x: pos.x, y: pos.y };
  }

  private updateStuckDetection(pos: { x: number; y: number }): void {
    if (pos.x === this.lastPosition.x && pos.y === this.lastPosition.y) {
      this.stuckTicks++;
    } else {
      this.stuckTicks = 0;
      this.lastPosition = { x: pos.x, y: pos.y };
    }
  }

  private buildTelemetry(action: string, errors: string[]): AIPlayerTelemetry {
    const pos = this.getPlayerPosition() ?? { x: 0, y: 0 };
    const questState: Record<string, string> = {};
    for (const [id, qs] of Object.entries(this.questTracker)) {
      questState[id] = qs.status;
    }

    return {
      tick: this.tickCount,
      position: pos,
      currentGoal: this.currentGoal,
      action,
      questState,
      errors,
    };
  }
}
