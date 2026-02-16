import { Direction, type RpgPlayer } from '@rpgjs/server';
import { getQuestStatus, isQuestActive, isQuestComplete } from './quests';
import { getVibrancy, resolveMapZone } from './vibrancy';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DialogueRoute {
  /** Human-readable label for debugging */
  label: string;
  /** Condition check — first matching route wins */
  condition: (player: RpgPlayer) => boolean;
  /** Async dialogue runner */
  run: (player: RpgPlayer) => Promise<void>;
}

// ---------------------------------------------------------------------------
// NPC Facing Helper
// ---------------------------------------------------------------------------

/**
 * Turn the NPC event to face the player before conversation starts.
 * The player is already facing the NPC (that's how onAction triggers),
 * so the NPC should face the opposite of the player's direction.
 *
 * RPG-JS Direction enum: Up=1, Right=2, Down=3, Left=4
 */
function faceNpcTowardPlayer(player: RpgPlayer, npcName: string): void {
  const map = player.map;
  if (!map) return;

  // RPG-JS stores dynamic events by ID in map.events
  const events = (map as Record<string, unknown>).events as
    | Record<string, { name?: string; changeDirection?: (dir: number) => void }>
    | undefined;
  if (!events) return;

  for (const event of Object.values(events)) {
    if (event?.name === npcName && event.changeDirection) {
      // Player direction is a numeric Direction enum value
      const playerDir = (player as Record<string, unknown>).direction as number | undefined;
      const opposites: Record<number, number> = {
        [Direction.Up]: Direction.Down,
        [Direction.Down]: Direction.Up,
        [Direction.Left]: Direction.Right,
        [Direction.Right]: Direction.Left,
      };
      const npcDir = playerDir != null ? (opposites[playerDir] ?? Direction.Down) : Direction.Down;
      event.changeDirection(npcDir);
      break;
    }
  }
}

// ---------------------------------------------------------------------------
// Vibrancy-Aware Helpers
// ---------------------------------------------------------------------------

function getCurrentVibrancy(player: RpgPlayer): number {
  const mapId = (player.map as { id?: string } | undefined)?.id;
  if (!mapId) return 50;
  const zoneInfo = resolveMapZone(mapId);
  if (!zoneInfo) return 50;
  return getVibrancy(player, zoneInfo.zone);
}

// ---------------------------------------------------------------------------
// Dialogue Routing Tables
// ---------------------------------------------------------------------------

const NPC_ROUTES: Record<string, DialogueRoute[]> = {
  // ----- Hana (Mentor) -----
  hana: [
    {
      label: 'Workshop intro — after MQ-01 complete',
      condition: (p) => isQuestComplete(p, 'MQ-01') && !p.getVariable('DIALOGUE_HANA_FIRST_VISIT'),
      run: async (p) => {
        const mod = await import('../dialogue/lira-workshop');
        await mod.default(p);
      },
    },
    {
      label: 'MQ-01 active — guide to signet',
      condition: (p) => isQuestActive(p, 'MQ-01'),
      run: async (p) => {
        await p.showText(
          "The Architect's Signet responds to fragments of living memory. Seek out the resonance stones — they'll guide you.",
          { speaker: 'Hana' },
        );
      },
    },
    {
      label: 'MQ-02 active — memorial garden guidance',
      condition: (p) => isQuestActive(p, 'MQ-02'),
      run: async (p) => {
        await p.showText(
          'The Memorial Garden has a resonance stone that needs your attention. Try using the Signet there.',
          { speaker: 'Hana' },
        );
      },
    },
    {
      label: 'MQ-03 active — settled lands encouragement',
      condition: (p) => isQuestActive(p, 'MQ-03'),
      run: async (p) => {
        await p.showText(
          'The Settled Lands are more complete than the rest of the world. Explore them — every fragment you find adds detail.',
          { speaker: 'Hana' },
        );
      },
    },
    {
      label: 'MQ-04+ stagnation awareness',
      condition: (p) => isQuestActive(p, 'MQ-04') || isQuestComplete(p, 'MQ-04'),
      run: async (p) => {
        await p.showText(
          'The Preservers are freezing more of the world. We need to keep broadcasting fragments to push back the stagnation.',
          { speaker: 'Hana' },
        );
      },
    },
    {
      label: 'Fallback — vibrancy-aware ambient',
      condition: () => true,
      run: async (p) => {
        const v = getCurrentVibrancy(p);
        if (v >= 67) {
          await p.showText('Can you feel it? The memories here are vivid — almost singing.', {
            speaker: 'Hana',
          });
        } else if (v <= 33) {
          await p.showText(
            'This place feels muted. We should find more fragments to brighten it.',
            { speaker: 'Hana' },
          );
        } else {
          await p.showText('My workshop is always busy. Memories are a delicate craft.', {
            speaker: 'Hana',
          });
        }
      },
    },
  ],

  // ----- Artun (Village Elder) -----
  artun: [
    {
      label: 'MQ-01 not started — first meeting',
      condition: (p) => getQuestStatus(p, 'MQ-01') === 'inactive',
      run: async (p) => {
        await p.showText('A new face in the village. I am Artun, elder of this settlement.', {
          speaker: 'Artun',
        });
        await p.showText(
          'Something about you feels... different. The world responds to your presence.',
          { speaker: 'Artun' },
        );
      },
    },
    {
      label: 'MQ-01 active — guide to Hana',
      condition: (p) => isQuestActive(p, 'MQ-01'),
      run: async (p) => {
        await p.showText(
          "Welcome, traveler. The Architect's Signet will guide you. Hana can tell you more.",
          { speaker: 'Artun' },
        );
      },
    },
    {
      label: 'MQ-01 complete — acknowledgment',
      condition: (p) => isQuestComplete(p, 'MQ-01') && getQuestStatus(p, 'MQ-03') === 'inactive',
      run: async (p) => {
        await p.showText(
          "The village thrives, thanks to the Architect's legacy. Keep an eye on the horizon.",
          { speaker: 'Artun' },
        );
      },
    },
    {
      label: 'MQ-03+ — world-aware advice',
      condition: (p) => isQuestActive(p, 'MQ-03') || isQuestComplete(p, 'MQ-03'),
      run: async (p) => {
        await p.showText(
          'The Settled Lands hold many secrets. Travel carefully — not all paths are safe.',
          { speaker: 'Artun' },
        );
      },
    },
    {
      label: 'Fallback — vibrancy-aware',
      condition: () => true,
      run: async (p) => {
        const v = getCurrentVibrancy(p);
        if (v >= 67) {
          await p.showText(
            'The world grows more vivid by the day. Your work makes a difference, Architect.',
            { speaker: 'Artun' },
          );
        } else {
          await p.showText('There is much yet to be remembered. The world waits for you.', {
            speaker: 'Artun',
          });
        }
      },
    },
  ],

  // ----- Grym / The Curator (Antagonist) -----
  grym: [
    {
      label: 'MQ-07 active — endgame confrontation',
      condition: (p) => isQuestActive(p, 'MQ-07'),
      run: async (p) => {
        await p.showText(
          "You think you're creating something new? You're just making noise. Noise fades. Perfection endures.",
          { speaker: 'The Curator' },
        );
      },
    },
    {
      label: 'MQ-09 active — fortress encounter',
      condition: (p) => isQuestActive(p, 'MQ-09'),
      run: async (p) => {
        await p.showText(
          'Welcome to my gallery. Every frozen moment here was saved from the chaos of change.',
          { speaker: 'The Curator' },
        );
      },
    },
    {
      label: 'MQ-10 active — final act',
      condition: (p) => isQuestActive(p, 'MQ-10'),
      run: async (p) => {
        await p.showText("You didn't destroy it. You... grew it.", { speaker: 'The Curator' });
      },
    },
    {
      label: 'Fallback — mysterious presence',
      condition: () => true,
      run: async (p) => {
        await p.showText('...', { speaker: 'The Curator' });
      },
    },
  ],

  // ----- Khali (Shopkeeper, village-general) -----
  khali: [
    {
      label: 'First visit — intro + shop',
      condition: (p) => !p.getVariable('DIALOGUE_KHALI_FIRST_VISIT'),
      run: async (p) => {
        const mod = await import('../dialogue/maren-first-visit');
        await mod.default(p);
      },
    },
    {
      label: 'SQ-01 available — herb quest hint',
      condition: (p) => getQuestStatus(p, 'SQ-01') === 'inactive',
      run: async (p) => {
        await p.showText(
          "Oh, and if you have a moment, I'm looking for some rare herbs for a special order. Interested?",
          { speaker: 'Khali' },
        );
        const mod = await import('../dialogue/maren-shop');
        await mod.default(p);
      },
    },
    {
      label: 'Default — shop',
      condition: () => true,
      run: async (p) => {
        const mod = await import('../dialogue/maren-shop');
        await mod.default(p);
      },
    },
  ],

  // ----- Hark (Blacksmith, village-weapons) -----
  hark: [
    {
      label: 'First visit — intro',
      condition: (p) => !p.getVariable('DIALOGUE_HARK_FIRST_VISIT'),
      run: async (p) => {
        const mod = await import('../dialogue/torvan-first-visit');
        await mod.default(p);
      },
    },
    {
      label: 'SQ-11 available — ore quest hint',
      condition: (p) => getQuestStatus(p, 'SQ-11') === 'inactive',
      run: async (p) => {
        await p.showText(
          "I've been meaning to try a new forging technique, but I need a rare ore. Perhaps you could help?",
          { speaker: 'Hark' },
        );
        const mod = await import('../dialogue/torvan-shop');
        await mod.default(p);
      },
    },
    {
      label: 'Default — shop',
      condition: () => true,
      run: async (p) => {
        const mod = await import('../dialogue/torvan-shop');
        await mod.default(p);
      },
    },
  ],

  // ----- Nyro (Innkeeper) -----
  nyro: [
    {
      label: 'First visit — inn intro',
      condition: (p) => !p.getVariable('DIALOGUE_NYRO_FIRST_VISIT'),
      run: async (p) => {
        const mod = await import('../dialogue/ren-first-visit');
        await mod.default(p);
      },
    },
    {
      label: 'SQ-12 dream hint',
      condition: (p) => getQuestStatus(p, 'SQ-12') === 'inactive' || isQuestActive(p, 'SQ-12'),
      run: async (p) => {
        await p.showText(
          'Sometimes, a good rest brings more than just energy. Pay attention to your dreams...',
          { speaker: 'Nyro' },
        );
        const mod = await import('../dialogue/ren-inn');
        await mod.default(p);
      },
    },
    {
      label: 'Default — inn',
      condition: () => true,
      run: async (p) => {
        const mod = await import('../dialogue/ren-inn');
        await mod.default(p);
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Show context-aware dialogue for an NPC.
 * Routes to the first matching dialogue based on quest state,
 * story progress, and zone vibrancy.
 *
 * The NPC will turn to face the player before dialogue starts.
 */
export async function showDialogue(player: RpgPlayer, npcId: string): Promise<void> {
  // Turn NPC to face the player
  faceNpcTowardPlayer(player, npcId);

  const routes = NPC_ROUTES[npcId];
  if (!routes || routes.length === 0) {
    // Unknown NPC — generic ambient line
    await player.showText('...');
    return;
  }

  for (const route of routes) {
    if (route.condition(player)) {
      await route.run(player);
      return;
    }
  }

  // Should never reach here if last route has condition: () => true
  await player.showText('...');
}

/**
 * Check if an NPC has dialogue routes registered.
 */
export function hasDialogue(npcId: string): boolean {
  return npcId in NPC_ROUTES;
}

/**
 * Get all registered NPC IDs.
 */
export function getRegisteredNpcs(): string[] {
  return Object.keys(NPC_ROUTES);
}
