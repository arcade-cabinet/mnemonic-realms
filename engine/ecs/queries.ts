import { createQuery, Not } from 'koota';
import {
  AiState,
  Chest,
  Collidable,
  Dialogue,
  Facing,
  Health,
  Interactable,
  Npc,
  PatrolPath,
  Player,
  Position,
  ResonanceStone,
  Sprite,
  Transition,
  Trigger,
  Velocity,
} from './traits.js';

// ── Player queries ───────────────────────────────────────────────────────────
/** The player entity (Position + Player tag) */
export const playerQuery = createQuery(Position, Player);

// ── Movement queries ─────────────────────────────────────────────────────────
/** Entities that can move (have Position + Velocity) */
export const movableQuery = createQuery(Position, Velocity);

// ── Rendering queries ────────────────────────────────────────────────────────
/** Entities that should be rendered (have Position + Sprite) */
export const renderableQuery = createQuery(Position, Sprite);

/** Renderable entities with facing direction */
export const renderableFacingQuery = createQuery(Position, Sprite, Facing);

// ── Collision queries ────────────────────────────────────────────────────────
/** Entities that block movement */
export const collidableQuery = createQuery(Position, Collidable);

// ── Interaction queries ──────────────────────────────────────────────────────
/** Entities the player can interact with */
export const interactableQuery = createQuery(Position, Interactable);

/** NPCs with dialogue */
export const npcDialogueQuery = createQuery(Position, Npc, Dialogue);

// ── NPC AI queries ───────────────────────────────────────────────────────────
/** NPCs with AI behavior */
export const npcAiQuery = createQuery(Position, Npc, AiState);

/** NPCs on patrol routes */
export const patrollingQuery = createQuery(Position, Npc, AiState, PatrolPath);

// ── Interactive object queries ───────────────────────────────────────────────
/** Treasure chests */
export const chestQuery = createQuery(Position, Chest);

/** Resonance stones */
export const resonanceStoneQuery = createQuery(Position, ResonanceStone);

// ── World transition queries ─────────────────────────────────────────────────
/** Map transition zones */
export const transitionQuery = createQuery(Position, Transition);

/** Event triggers */
export const triggerQuery = createQuery(Position, Trigger);

// ── Combat queries ───────────────────────────────────────────────────────────
/** Entities with health (for combat) */
export const healthQuery = createQuery(Health);

/** NPCs without AI (static NPCs) */
export const staticNpcQuery = createQuery(Position, Npc, Not(AiState));
