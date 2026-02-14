/**
 * Memory Event Wiring — connects server-side memory/recall events to
 * client-side visual effects and audio.
 *
 * Watches player variables set by the memory system (FRAGMENT_COLLECT_SEQ,
 * RECALL_SEQ) and triggers the appropriate effects when they change.
 */

import { inject, RpgClientEngine } from '@rpgjs/client';
import { audioManager } from '../audio';
import { collectTowardPlayer, EMOTION_COLORS } from './memory-effects';
import { spawnParticles } from './particle-engine';
import { expandRadialEffect } from './zone-effects';

type GodId = 'resonance' | 'verdance' | 'luminos' | 'kinesis';
type Emotion = 'joy' | 'fury' | 'sorrow' | 'awe';

let wiringSub: { unsubscribe(): void } | null = null;
let lastFragSeq = -1;
let lastRecallSeq = -1;

/**
 * Read a player variable from the client-side observable object.
 * Variables may be stored as a Map or as serialized [key, value] tuples.
 */
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
// Fragment collection effects
// ---------------------------------------------------------------------------

function onFragmentCollected(emotion: string) {
  const client = inject(RpgClientEngine);
  const player = client.player;
  if (!player) return;

  const px = player.position?.x ?? 0;
  const py = player.position?.y ?? 0;

  // Spiral particle effect toward player, colored by emotion
  collectTowardPlayer(px, py - 24, emotion);

  // Radial bloom burst at player position
  const color = EMOTION_COLORS[emotion] ?? 0xdaa520;
  spawnParticles(px, py - 12, {
    color,
    count: 8,
    speed: 20,
    lifetime: 1.5,
    gravity: -10,
    size: 2.5,
    fadeOut: true,
    drift: 6,
  });

  // Audio chime on collection
  audioManager.playSfx('SFX-MEM-01');
}

// ---------------------------------------------------------------------------
// God recall effects
// ---------------------------------------------------------------------------

async function onGodRecalled(godId: GodId, emotion: Emotion) {
  const client = inject(RpgClientEngine);
  const player = client.player;
  if (!player) return;

  const cx = player.position?.x ?? 0;
  const cy = player.position?.y ?? 0;

  // Import and trigger the god-specific recall effect
  const recallFn = GOD_RECALL_MAP[godId];
  if (recallFn) {
    await recallFn(cx, cy, emotion);
  }

  // Zone-wide visual transformation after recall completes
  const godColor = GOD_ZONE_COLORS[godId] ?? 0xdaa520;
  expandRadialEffect(cx, cy, 300, 3000, godColor, 0.5);

  // Secondary zone-wide particle burst
  spawnParticles(cx, cy, {
    color: godColor,
    count: 30,
    speed: 40,
    lifetime: 3,
    gravity: -5,
    size: 3,
    fadeOut: true,
    drift: 10,
  });

  // Recall audio fanfare
  audioManager.playSfx('SFX-MEM-05');
}

// Lazy imports to avoid circular dependencies — these are resolved at call time
const GOD_RECALL_MAP: Record<GodId, (cx: number, cy: number, emotion: Emotion) => Promise<void>> = {
  resonance: async (cx, cy, emotion) => {
    const { resonanceRecall } = await import('./god-resonance');
    return resonanceRecall(cx, cy, emotion);
  },
  verdance: async (cx, cy, emotion) => {
    const { verdanceRecall } = await import('./god-verdance');
    return verdanceRecall(cx, cy, emotion);
  },
  luminos: async (cx, cy, emotion) => {
    const { luminosRecall } = await import('./god-luminos');
    return luminosRecall(cx, cy, emotion);
  },
  kinesis: async (cx, cy, emotion) => {
    const { kinesisRecall } = await import('./god-kinesis');
    return kinesisRecall(cx, cy, emotion);
  },
};

const GOD_ZONE_COLORS: Record<GodId, number> = {
  resonance: 0xdda0dd, // plum — sound/harmony
  verdance: 0x33cc33, // green — nature/growth
  luminos: 0xffd700, // gold — light/radiance
  kinesis: 0x888888, // grey — stone/motion
};

// ---------------------------------------------------------------------------
// Subscription lifecycle
// ---------------------------------------------------------------------------

export function initMemoryEventWiring() {
  wiringSub?.unsubscribe();
  lastFragSeq = -1;
  lastRecallSeq = -1;

  const client = inject(RpgClientEngine);

  wiringSub = client.objects.subscribe((objects) => {
    const e = objects[client.playerId];
    if (!e?.object) return;

    const obj = e.object as Record<string, unknown>;

    // --- Fragment collection detection ---
    const fragSeq = (readVar(obj, 'FRAGMENT_COLLECT_SEQ') as number) ?? 0;
    if (lastFragSeq >= 0 && fragSeq > lastFragSeq) {
      const emotion = (readVar(obj, 'LAST_FRAGMENT_EMOTION') as string) ?? 'joy';
      onFragmentCollected(emotion);
    }
    lastFragSeq = fragSeq;

    // --- God recall detection ---
    const recallSeq = (readVar(obj, 'RECALL_SEQ') as number) ?? 0;
    if (lastRecallSeq >= 0 && recallSeq > lastRecallSeq) {
      const godId = (readVar(obj, 'LAST_RECALL_GOD') as GodId) ?? 'resonance';
      const emotion = (readVar(obj, 'LAST_RECALL_EMOTION') as Emotion) ?? 'joy';
      onGodRecalled(godId, emotion);
    }
    lastRecallSeq = recallSeq;
  });
}

export function resetMemoryEventWiring() {
  wiringSub?.unsubscribe();
  wiringSub = null;
  lastFragSeq = -1;
  lastRecallSeq = -1;
}
