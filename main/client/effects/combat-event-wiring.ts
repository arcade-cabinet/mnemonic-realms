/**
 * Combat Event Wiring — connects server-side combat state changes to
 * client-side visual effects (particles, screen shake, damage numbers).
 *
 * Watches the COMBAT_STATE player variable and triggers the appropriate
 * effects from combat-effects.ts when lastResult changes.
 */

import { inject, RpgClientEngine, type RpgSceneMap } from '@rpgjs/client';
import type { Container } from 'pixi.js';
import {
  criticalHitFlash,
  elementalHit,
  healingSparkle,
  screenFlash,
  showDamageNumber,
  showStatusEffect,
} from './combat-effects';
import { spawnParticles } from './particle-engine';

// ---------------------------------------------------------------------------
// Element mapping: lore elements → visual effect element names
// ---------------------------------------------------------------------------

const LORE_TO_VISUAL_ELEMENT: Record<string, string> = {
  resonance: 'wind',
  verdance: 'earth',
  luminos: 'light',
  kinesis: 'fire',
  dark: 'dark',
  neutral: 'neutral',
};

// Status effect ID → visual status name for combat-effects.ts
const STATUS_TO_VISUAL: Record<string, string> = {
  'ST-POISON': 'poison',
  'ST-STUN': 'stun',
  'ST-SLOW': 'slow',
  'ST-WEAKNESS': 'weakness',
  'ST-INSPIRED': 'inspired',
  'ST-STASIS': 'stasis',
};

// ---------------------------------------------------------------------------
// State tracking
// ---------------------------------------------------------------------------

let wiringSub: { unsubscribe(): void } | null = null;
let prevLastResult: unknown = null;
let prevPhase = '';
let prevCombatActive = false;

// ---------------------------------------------------------------------------
// readVar helper (same pattern as memory-event-wiring.ts)
// ---------------------------------------------------------------------------

function readVar(obj: Record<string, unknown>, key: string): unknown {
  const vars = obj.variables;
  if (vars instanceof Map) return vars.get(key);
  if (Array.isArray(vars)) {
    const entry = (vars as [string, unknown][]).find((e) => e[0] === key);
    return entry ? entry[1] : undefined;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Effect triggers
// ---------------------------------------------------------------------------

function getPlayerPosition(): { x: number; y: number } | null {
  const client = inject(RpgClientEngine);
  const player = client.player;
  if (!player?.position) return null;
  return { x: player.position.x ?? 0, y: player.position.y ?? 0 };
}

function getPlayerSprite(): Container | null {
  const client = inject(RpgClientEngine);
  const scene = client.getScene<RpgSceneMap>();
  if (!scene) return null;
  // RPG-JS scene exposes getSprite but it's not in the public type definitions
  const sceneWithSprites = scene as unknown as {
    getSprite?: (id: string) => Container | undefined;
  };
  return sceneWithSprites.getSprite?.(client.playerId) ?? null;
}

function mapElement(loreElement: string): string {
  return LORE_TO_VISUAL_ELEMENT[loreElement.toLowerCase()] ?? 'neutral';
}

function onDamageDealt(result: Record<string, unknown>) {
  const pos = getPlayerPosition();
  if (!pos) return;

  const damage = result.damage as number;
  const isCritical = result.critical === true;
  const targetIsPlayer = result.targetName === 'Player';
  const element = mapElement((result.element as string) ?? 'neutral');

  // Position effects: attacks on enemies show near player, attacks on player offset slightly
  const effectX = targetIsPlayer ? pos.x + 16 : pos.x - 16;
  const effectY = targetIsPlayer ? pos.y - 8 : pos.y - 24;

  if (isCritical) {
    // criticalHitFlash includes screen shake + damage number
    criticalHitFlash(effectX, effectY, damage);
  } else {
    showDamageNumber(effectX, effectY, damage);
  }

  // Elemental particles on hit
  elementalHit(effectX, effectY, element);
}

function onHealingDone(result: Record<string, unknown>) {
  const pos = getPlayerPosition();
  if (!pos) return;

  healingSparkle(pos.x, pos.y);

  const healing = result.healing as number;
  if (healing > 0) {
    showDamageNumber(pos.x, pos.y - 8, healing);
  }
}

function onStatusApplied(statusIds: string[]) {
  const sprite = getPlayerSprite();
  if (!sprite) return;

  for (const statusId of statusIds) {
    const visualStatus = STATUS_TO_VISUAL[statusId];
    if (visualStatus) {
      showStatusEffect(sprite, visualStatus);
    }
  }
}

function onVictory() {
  const pos = getPlayerPosition();
  if (!pos) return;

  // Golden screen flash for victory
  screenFlash(300, 0xffd700, 0.25);

  // Celebratory particle burst
  spawnParticles(pos.x, pos.y - 16, {
    color: 0xffd700,
    count: 20,
    speed: 50,
    lifetime: 1.5,
    gravity: -20,
    size: 3,
    fadeOut: true,
  });
}

// ---------------------------------------------------------------------------
// Combat state change handler
// ---------------------------------------------------------------------------

function handleCombatResult(lastResult: Record<string, unknown>) {
  const damage = lastResult.damage as number | undefined;
  const healing = lastResult.healing as number | undefined;
  const statusApplied = lastResult.statusApplied as string[] | undefined;

  if (damage && damage > 0) {
    onDamageDealt(lastResult);
  }
  if (healing && healing > 0) {
    onHealingDone(lastResult);
  }
  if (statusApplied && statusApplied.length > 0) {
    onStatusApplied(statusApplied);
  }
}

function processCombatState(state: Record<string, unknown> | null) {
  if (!state) {
    prevCombatActive = false;
    prevPhase = '';
    prevLastResult = null;
    return;
  }

  const currentPhase = (state.phase as string) ?? '';

  // Detect new combat result
  const lastResult = state.lastResult as Record<string, unknown> | null;
  if (lastResult && lastResult !== prevLastResult) {
    handleCombatResult(lastResult);
    prevLastResult = lastResult;
  }

  // Victory fanfare on phase transition
  if (currentPhase === 'victory' && prevPhase !== 'victory' && prevCombatActive) {
    onVictory();
  }

  prevCombatActive = true;
  prevPhase = currentPhase;
}

// ---------------------------------------------------------------------------
// Subscription lifecycle
// ---------------------------------------------------------------------------

export function initCombatEventWiring() {
  wiringSub?.unsubscribe();
  prevLastResult = null;
  prevPhase = '';
  prevCombatActive = false;

  const client = inject(RpgClientEngine);

  wiringSub = client.objects.subscribe((objects) => {
    const e = objects[client.playerId];
    if (!e?.object) return;
    const obj = e.object as Record<string, unknown>;
    const state = readVar(obj, 'COMBAT_STATE') as Record<string, unknown> | null;
    processCombatState(state);
  });
}

export function resetCombatEventWiring() {
  wiringSub?.unsubscribe();
  wiringSub = null;
  prevLastResult = null;
  prevPhase = '';
  prevCombatActive = false;
}
