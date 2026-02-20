import { EventData, RpgEvent, type RpgMap, type RpgPlayer } from '@rpgjs/server';
import { showDialogue } from '../../systems/npc-interaction';
import { getVibrancy, resolveMapZone } from '../../systems/vibrancy';

function makeNpc(id: string, graphic: string, action: (player: RpgPlayer) => void | Promise<void>) {
  @EventData({ name: id, hitbox: { width: 16, height: 16 } })
  class Npc extends RpgEvent {
    onInit() {
      this.setGraphic(graphic);
    }
    async onAction(player: RpgPlayer) {
      await action(player);
    }
  }
  return Npc;
}

function makeEvent(id: string, action: (player: RpgPlayer) => void | Promise<void>) {
  @EventData({ name: id, hitbox: { width: 16, height: 16 } })
  class Evt extends RpgEvent {
    onInit() {}
    async onAction(player: RpgPlayer) {
      await action(player);
    }
  }
  return Evt;
}

export function spawnMapEvents(_player: RpgPlayer, map: RpgMap) {
  // --- Named NPCs ---
  // Sprite IDs match assets/sprites/npcs/citizens/{gender}/{Name}/{Name}.png
  map.createDynamicEvent([
    {
      x: 672,
      y: 352,
      event: makeNpc('artun', 'npc_artun', (p) => showDialogue(p, 'artun')),
    },
    {
      x: 800,
      y: 512,
      event: makeNpc('nyro', 'npc_nyro', (p) => showDialogue(p, 'nyro')),
    },
    {
      x: 624,
      y: 656,
      event: makeNpc('khali', 'npc_khali', (p) => showDialogue(p, 'khali')),
    },
    {
      x: 816,
      y: 688,
      event: makeNpc('hark', 'npc_hark', (p) => showDialogue(p, 'hark')),
    },
    {
      x: 304,
      y: 720,
      event: makeNpc('hana', 'npc_hana', (p) => showDialogue(p, 'hana')),
    },
  ]);

  // --- Background villagers ---
  map.createDynamicEvent([
    {
      x: 448,
      y: 480,
      event: makeNpc('villager-a', 'npc_villager_m1', async (p) => {
        const v = getEverwickVibrancy(p);
        if (v >= 67) {
          await p.showText(
            'Have you seen the fountain lately? The light it throws at dusk is like nothing I remember. My grandmother would have loved this.',
          );
        } else if (v <= 33) {
          await p.showText(
            'Another quiet morning. Sometimes I stand by the fountain and try to remember what it looked like when the water used to shimmer. Maybe it never did.',
          );
        } else {
          await p.showText(
            "The Memorial Garden's looking better than it has in years. Khali swears the flowers are taller since you arrived. I think she might be right.",
          );
        }
      }),
    },
    {
      x: 512,
      y: 512,
      event: makeNpc('villager-b', 'npc_villager_f1', async (p) => {
        const v = getEverwickVibrancy(p);
        if (v >= 67) {
          await p.showText(
            'I planted marigolds last week and they bloomed overnight. Overnight! My mother would say the world is remembering how to grow.',
          );
        } else if (v <= 33) {
          await p.showText(
            "I keep meaning to tend the garden, but everything comes up so pale. Like the soil's forgotten what color means.",
          );
        } else {
          await p.showText(
            "Artun's been in good spirits lately. Nose deep in those old journals of his — says he's found something important. He always says that, but this time his eyes were different.",
          );
        }
      }),
    },
    {
      x: 320,
      y: 704,
      event: makeNpc('villager-c', 'npc_villager_m2', async (p) => {
        const v = getEverwickVibrancy(p);
        if (v >= 67) {
          await p.showText(
            "The steel Hark forged this morning was singing. Not a figure of speech — it rang like a bell when he pulled it from the quench. He just grinned and said, 'About time.'",
          );
        } else if (v <= 33) {
          await p.showText(
            "The road south to Heartfield's getting hazier every week. Used to be you could see the wheat fields from here. Now it's just... grey.",
          );
        } else {
          await p.showText(
            "Nyro says a traveler came through last week talking about frozen butterflies near Heartfield. Whole clearing, just... stopped. Gives me the shivers.",
          );
        }
      }),
    },
  ]);

  // --- Door transitions ---
  // Offset from NPC positions so doors don't overlap characters
  map.createDynamicEvent([
    {
      x: 672,
      y: 336,
      event: makeEvent('elders-house-door', (p) => {
        p.changeMap('everwick-artun', { x: 128, y: 176 });
      }),
    },
    {
      x: 800,
      y: 496,
      event: makeEvent('inn-door', (p) => {
        p.changeMap('everwick-inn', { x: 128, y: 176 });
      }),
    },
    {
      x: 624,
      y: 640,
      event: makeEvent('shop-door', (p) => {
        p.changeMap('everwick-khali', { x: 128, y: 176 });
      }),
    },
    {
      x: 816,
      y: 672,
      event: makeEvent('forge-door', (p) => {
        p.changeMap('everwick-hark', { x: 128, y: 176 });
      }),
    },
    {
      x: 304,
      y: 704,
      event: makeEvent('workshop-door', (p) => {
        p.changeMap('everwick-hana', { x: 128, y: 176 });
      }),
    },
  ]);

  // --- Zone transitions ---
  map.createDynamicEvent([
    {
      x: 448,
      y: 896,
      event: makeEvent('south-gate', (p) => {
        p.changeMap('heartfield', { x: 480, y: 0 });
      }),
    },
    {
      x: 896,
      y: 432,
      event: makeEvent('east-gate', (p) => {
        p.changeMap('ambergrove', { x: 0, y: 640 });
      }),
    },
    {
      x: 48,
      y: 432,
      event: makeEvent('west-gate', (p) => {
        p.changeMap('millbrook', { x: 1248, y: 640 });
      }),
    },
    {
      x: 448,
      y: 48,
      event: makeEvent('north-gate', (p) => {
        p.changeMap('sunridge', { x: 640, y: 1248 });
      }),
    },
    {
      x: 256,
      y: 544,
      event: makeEvent('depths-entrance', (p) => {
        p.changeMap('depths-l1', { x: 320, y: 0 });
      }),
    },
  ]);

  // --- Resonance Stones ---
  // Each stone carries a unique memory from Everwick's past.
  // The dialogue bank system text: "The Resonance Stone pulses with warmth."
  map.createDynamicEvent([
    {
      x: 448,
      y: 448,
      event: makeEvent('fountain-stone', async (p) => {
        const v = getEverwickVibrancy(p);
        if (v >= 67) {
          await p.showText(
            'The stone beside the fountain blazes with warmth. The water catches its light and scatters it across the square — amber, rose, gold. You can almost hear laughter in the spray.',
          );
        } else if (v <= 33) {
          await p.showText(
            'The stone beside the fountain flickers faintly. The water trickles past it without catching any light. Something should be here — something bright — but the memory is too dim to surface.',
          );
        } else {
          await p.showText(
            "The stone beside the fountain pulses with warmth. You catch a flash of memory: children splashing in the basin on a summer afternoon, their parents calling them home as the light fades. Artun's voice, younger then, telling them one more story before bed.",
          );
        }
      }),
    },
    {
      x: 288,
      y: 512,
      event: makeEvent('garden-stone-west', async (p) => {
        await p.showText(
          'This stone stands at the garden entrance, half-hidden by ivy. When you touch it, a memory surfaces: an old woman planting the first memorial flowers, pressing seeds into the earth with weathered hands. She is whispering names you do not recognize.',
        );
      }),
    },
    {
      x: 320,
      y: 544,
      event: makeEvent('garden-stone-center', async (p) => {
        await p.showText(
          'The tallest stone in the garden. A memory stirs: a circle of villagers standing here at dawn, hands linked, singing a hymn that makes the ground hum. The Dissolved who built Everwick held this ceremony every equinox. The stones remember even if the people are gone.',
        );
      }),
    },
    {
      x: 352,
      y: 512,
      event: makeEvent('garden-stone-east', async (p) => {
        await p.showText(
          "A small, smooth stone at the garden's edge. The memory is faint but sharp: a child placing wildflowers between the stones, humming a tune she heard from her grandmother. The flowers are long gone, but the song lingers in the rock like warmth from yesterday's sun.",
        );
      }),
    },
    {
      x: 672,
      y: 480,
      event: makeEvent('scholars-stone', async (p) => {
        await p.showText(
          "A dark stone near Artun's house, cool to the touch. A memory unfolds: a younger Artun, bent over his desk by candlelight, copying passages from a Dissolved journal. He pauses, looks out the window at this very stone, and whispers: 'They chose to become the world. What an extraordinary thing to choose.'",
        );
      }),
    },
  ]);

  // --- Treasure Chests ---
  map.createDynamicEvent([
    {
      x: 416,
      y: 96,
      event: makeEvent('lookout-chest', async (p) => {
        if (p.getVariable('CH_EW_01_OPENED')) {
          await p.showText('The chest sits open, its contents already claimed. Wind whistles through the empty hinges.');
          return;
        }
        await p.showText(
          'Tucked behind the old stone bench on Lookout Hill, a weathered chest sits half-buried in wildflowers. Someone left it here deliberately — the lock is more ornamental than functional.',
        );
        await p.showText('Inside: a Memory Fragment wrapped in cloth, and a handful of gold coins worn smooth by age.');
        p.setVariable('CH_EW_01_OPENED', true);
      }),
    },
    {
      x: 288,
      y: 352,
      event: makeEvent('garden-chest', async (p) => {
        if (p.getVariable('CH_EW_02_OPENED')) {
          await p.showText('The stone box is empty now, its offering already taken.');
          return;
        }
        await p.showText(
          'A small stone offering box sits at the base of the memorial wall. The inscription reads: "For those who remember." Inside, something gleams — a fragment left as a gift, not hidden but offered.',
        );
        p.setVariable('CH_EW_02_OPENED', true);
      }),
    },
  ]);

  // --- Interactive landmarks ---
  map.createDynamicEvent([
    {
      x: 256,
      y: 448,
      event: makeEvent('quest-board', async (p) => {
        await p.showText(
          "A wooden notice board stands at the edge of the square, its surface covered in overlapping notes and requests. Most are mundane — a lost cat, a fence in need of mending — but a few catch your eye. Khali's posted a request for rare herbs. Hark is looking for ore samples from the eastern ridge.",
        );
      }),
    },
    {
      x: 432,
      y: 96,
      event: makeEvent('telescope', async (p) => {
        await p.showText(
          "A brass telescope stands on the crest of Lookout Hill, its lens pointed toward the horizon. You peer through it and the world stretches out beneath you — Heartfield's golden wheat to the south, Ambergrove's dark canopy to the east, and far to the north, where the mountains should be, the land simply... fades. Like a painting someone started and walked away from.",
        );
        await p.showText(
          'The edges of the world shimmer faintly. Not empty — unfinished. Waiting.',
        );
      }),
    },
  ]);
}

function getEverwickVibrancy(player: RpgPlayer): number {
  const zoneInfo = resolveMapZone('everwick');
  if (!zoneInfo) return 50;
  return getVibrancy(player, zoneInfo.zone);
}
