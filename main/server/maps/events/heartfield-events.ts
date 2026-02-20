import { EventData, RpgEvent, type RpgMap, type RpgPlayer } from '@rpgjs/server';
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

function getHeartfieldVibrancy(player: RpgPlayer): number {
  const zoneInfo = resolveMapZone('heartfield');
  if (!zoneInfo) return 50;
  return getVibrancy(player, zoneInfo.zone);
}

export function spawnMapEvents(_player: RpgPlayer, map: RpgMap) {
  // --- Hamlet NPCs ---
  // Heartfield is a small farming hamlet south of Everwick. Four households
  // tend the surrounding wheat fields. The people here are warm, practical,
  // and increasingly worried about the crystalline patches near the clearing.
  map.createDynamicEvent([
    {
      x: 496,
      y: 496,
      event: makeNpc('farmer-gale', 'npc_villager_m1', async (p) => {
        const v = getHeartfieldVibrancy(p);
        if (v >= 67) {
          await p.showText(
            "The wheat's taller than I am this season! Haven't seen growth like this since my father's time. Whatever you Architects are doing, keep at it.",
          );
        } else if (v <= 33) {
          await p.showText(
            "The wheat comes up thin and pale, no matter how deep I plow. My grandfather's fields were golden — I've seen the memory in the stones. Now look at them.",
          );
        } else {
          await p.showText(
            "The windmill's been still for years, but I still check on it every morning. Habit, I suppose. Something about the place feels like it's waiting.",
          );
        }
      }),
    },
    {
      x: 672,
      y: 464,
      event: makeNpc('farmer-suri', 'npc_villager_f1', async (p) => {
        if (p.getVariable('STAGNATION_CLEARING_DISCOVERED')) {
          await p.showText(
            "You've seen the clearing? The crystal? My youngest was playing near there last week and came home crying — said the butterflies wouldn't move. Just hanging in the air. Beautiful and horrible.",
          );
        } else {
          await p.showText(
            "There's something wrong to the southeast. The birds won't fly over the old clearing anymore. They just... circle around it. My husband says I'm imagining things, but birds don't lie.",
          );
        }
      }),
    },
    {
      x: 448,
      y: 672,
      event: makeNpc('farmer-edric', 'npc_villager_m2', async (p) => {
        await p.showText(
          "Been farming this soil for forty years. Used to be you could put your hand in the earth and feel it humming — all those old memories the Dissolved left behind, warming the roots.",
        );
        await p.showText(
          "Now some patches are cold. Dead cold. Like the ground forgot what it was supposed to do. Artun says it's connected to those crystal patches spreading in the south.",
        );
      }),
    },
    {
      x: 640,
      y: 672,
      event: makeNpc('hamlet-elder', 'npc_villager_f2', async (p) => {
        const v = getHeartfieldVibrancy(p);
        if (v >= 67) {
          await p.showText(
            "I've lived in this hamlet since before Everwick had a name. Never seen the land this alive. The children are running through fields that glow at dusk. Whatever you're doing, Architect — the land thanks you.",
          );
        } else {
          await p.showText(
            "Welcome to our little corner of the world. We're small, but we were here before Everwick's fountain was carved. The soil remembers. Ask it nicely and it might share.",
          );
        }
      }),
    },
    {
      x: 512,
      y: 480,
      event: makeNpc('hamlet-child', 'npc_villager_f1', async (p) => {
        if (p.getVariable('STAGNATION_CLEARING_BROKEN')) {
          await p.showText(
            "The butterflies are flying again! I saw them! They flew all the way to the windmill and back. Mama says you did that. Are you magic?",
          );
        } else {
          await p.showText(
            "I found a stone that hums when I hold it! Mama says not to touch the shiny ones near the clearing, but this one's warm. Want to see?",
          );
        }
      }),
    },
    {
      x: 544,
      y: 448,
      event: makeNpc('traveling-merchant', 'npc_villager_m1', async (p) => {
        await p.showText(
          "Sera. Traveling merchant. I walk the border between the Settled Lands and the Frontier — pick up interesting things along the way.",
          { speaker: 'Sera' },
        );
        await p.showText(
          "I've got supplies, curiosities, and the occasional rumor. The rumor's free: something is spreading near the clearing to the southeast. The Preservers, they say. Crystal folk who freeze the world to keep it safe.",
          { speaker: 'Sera' },
        );
      }),
    },
  ]);

  // --- Zone transitions ---
  map.createDynamicEvent([
    {
      x: 448,
      y: 0,
      event: makeEvent('north-gate', (p) => {
        p.changeMap('everwick', { x: 480, y: 896 });
      }),
    },
    {
      x: 1248,
      y: 608,
      event: makeEvent('east-gate', (p) => {
        p.changeMap('ambergrove', { x: 0, y: 640 });
      }),
    },
    {
      x: 608,
      y: 1248,
      event: makeEvent('south-gate', (p) => {
        p.changeMap('shimmer-marsh', { x: 640, y: 0 });
      }),
    },
  ]);

  // --- Hana's introduction to the Settled Lands ---
  // Triggers when the player first enters Heartfield from Everwick.
  // From the dialogue bank, Scene 5: "The Settled Lands. Everything south,
  // east, and west of the village for a day's walk."
  map.createDynamicEvent([
    {
      x: 448,
      y: 96,
      event: makeEvent('heartfield-arrival', async (p) => {
        if (p.getVariable('HEARTFIELD_ARRIVAL_PLAYED')) return;
        p.setVariable('HEARTFIELD_ARRIVAL_PLAYED', true);

        await p.showText(
          "The road from Everwick opens into wide, rolling fields. Wheat sways in a breeze that smells of warm earth and cut grass. The sky is enormous here — bigger than it has any right to be.",
        );
        await p.showText(
          "To the east, a cluster of farmhouses surrounds a quiet crossroads. Smoke rises from a chimney. Someone is singing — faintly, tunelessly, happily.",
        );
        await p.showText(
          'Far to the southeast, past the last fence post, the land takes on a strange stillness. The wheat there stands perfectly upright. No wind touches it.',
        );
      }),
    },
  ]);

  // --- Resonance Stones ---
  map.createDynamicEvent([
    {
      x: 576,
      y: 448,
      event: makeEvent('hamlet-stone', async (p) => {
        await p.showText(
          'A sun-warmed stone at the hamlet crossroads, half-buried in wildflowers. When you reach for it, a memory rises: a harvest festival, tables set between the houses, every family bringing their best dish. The laughter is so vivid you can almost taste the cider.',
        );
      }),
    },
    {
      x: 992,
      y: 320,
      event: makeEvent('windmill-stone', async (p) => {
        await p.showText(
          "A grey stone set into the windmill's foundation, cool despite the afternoon sun. The memory is industrial, rhythmic: grain pouring through the millstones, the creak of the vanes turning, a miller's flour-dusted hands adjusting the mechanism. The mill hasn't turned in years, but the stone remembers every rotation.",
        );
      }),
    },
    {
      x: 1104,
      y: 944,
      event: makeEvent('clearing-stone', async (p) => {
        if (p.getVariable('STAGNATION_CLEARING_BROKEN')) {
          await p.showText(
            'The stone pulses freely now, its crystal prison shattered. The memory that rises is sharp with grief and then — release. A butterfly, frozen mid-flight, suddenly remembering how to fly. The joy of motion after perfect stillness.',
          );
        } else {
          await p.showText(
            "The stone is encased in crystal — smooth, cold, beautiful. You can see a memory trapped inside, suspended like an insect in amber. A butterfly, wings spread, every scale perfect. It will never land. It will never fly anywhere new. It is frozen. Forever.",
          );
          p.setVariable('STAGNATION_CLEARING_DISCOVERED', true);
        }
      }),
    },
    {
      x: 256,
      y: 960,
      event: makeEvent('field-stone', async (p) => {
        await p.showText(
          "A mossy stone at the edge of the southern fields, where the wheat gives way to wild grass. The memory is ancient: the very first planting, generations ago, when someone pressed seeds into untouched soil and whispered, 'Grow.' The soil heard. It remembers.",
        );
      }),
    },
  ]);

  // --- Treasure Chests ---
  map.createDynamicEvent([
    {
      x: 1024,
      y: 256,
      event: makeEvent('windmill-chest', async (p) => {
        if (p.getVariable('CH_HF_01_OPENED')) {
          await p.showText("The miller's old strongbox sits open, empty but for a layer of flour dust.");
          return;
        }
        await p.showText(
          "Behind the millstones, wedged into a gap in the wall, you find a small iron strongbox. The lock is rusted through. Inside: a Memory Fragment wrapped in oilcloth, still carrying the warmth of the mill's working years, and a pouch of gold coins stamped with a wheat sheaf.",
        );
        p.setVariable('CH_HF_01_OPENED', true);
      }),
    },
    {
      x: 160,
      y: 320,
      event: makeEvent('field-chest', async (p) => {
        if (p.getVariable('CH_HF_02_OPENED')) {
          await p.showText('The stone hollow is empty now. Dandelion seeds drift in where the offering was.');
          return;
        }
        await p.showText(
          "A hollow beneath a leaning field stone, hidden by tall grass. Someone left supplies here — a traveler's cache, perhaps, or a farmer's emergency kit. A stoppered bottle of clear tonic and a Fragment that smells faintly of rain.",
        );
        p.setVariable('CH_HF_02_OPENED', true);
      }),
    },
    {
      x: 1152,
      y: 800,
      event: makeEvent('clearing-edge-chest', async (p) => {
        if (p.getVariable('CH_HF_03_OPENED')) {
          await p.showText('The pack lies open where you found it. The crystal dust around it has begun to fade.');
          return;
        }
        await p.showText(
          "A leather satchel lies at the stagnation zone's edge, half-dusted with crystal. Whoever dropped it was running — the strap is torn. Inside, you find supplies they couldn't afford to lose: a potent Fragment and enough gold for a week's provisions.",
        );
        p.setVariable('CH_HF_03_OPENED', true);
      }),
    },
  ]);

  // --- Landmark interactions ---
  map.createDynamicEvent([
    {
      x: 480,
      y: 448,
      event: makeEvent('hamlet-well', async (p) => {
        const v = getHeartfieldVibrancy(p);
        if (v >= 67) {
          await p.showText(
            'The hamlet well. The water is clear as glass today, and when you lean over the edge you can see your reflection surrounded by tiny points of light — memory energy, rising from deep underground like bubbles in champagne.',
          );
        } else {
          await p.showText(
            "The hamlet well. The water is cool and clean, drawn from a spring that's been here longer than the settlement itself. Old Edric says the spring remembers the taste of rain from a hundred years ago. You take a drink. It tastes like home.",
          );
        }
      }),
    },
    {
      x: 960,
      y: 256,
      event: makeEvent('windmill-door', async (p) => {
        await p.showText(
          "The Old Windmill. Its vanes haven't turned in a decade, but the structure is sound — good timber, well-joined. Through the open doorway you can see the millstones, covered in dust, and the grain chute still angled toward a hopper that hasn't been filled since Gale's father closed the business.",
        );
        await p.showText(
          'Something hums inside. Faintly. Like the mill remembers turning and would very much like to try again.',
        );
      }),
    },
    {
      x: 1024,
      y: 864,
      event: makeEvent('stagnation-edge', async (p) => {
        if (p.getVariable('STAGNATION_CLEARING_BROKEN')) {
          await p.showText(
            'The clearing breathes again. Where crystal once sealed the ground, grass pushes through in vivid green. A butterfly drifts past — real, alive, imperfect in the way only living things can be.',
          );
        } else {
          await p.showText(
            'The air changes at the clearing edge. It becomes still — not calm, but stopped. Every blade of grass stands rigid. A butterfly hangs in the air, wings spread, every scale rendered in impossible detail. Beautiful. And terrible.',
          );
          await p.showText(
            'This is a Stagnation Zone. Someone — or something — froze this patch of the world. Time stopped here. Change stopped. Nothing enters and nothing leaves.',
          );
          p.setVariable('STAGNATION_CLEARING_DISCOVERED', true);
        }
      }),
    },
    {
      x: 1088,
      y: 928,
      event: makeEvent('stagnation-anchor', async (p) => {
        if (p.getVariable('STAGNATION_CLEARING_BROKEN')) {
          await p.showText(
            'The anchor stone lies cracked in two, its crystal coating reduced to glittering dust. A sorrow fragment — faint but real — drifts up from the fracture. The butterfly was afraid, at the end. It remembered flying.',
          );
        } else {
          await p.showText(
            'Deep in the frozen clearing, you can see it: a Resonance Stone encased in thick crystal, pulsing faintly. This is the anchor — the focal point the Preservers used to freeze the zone. If a memory fragment were broadcast into it, the crystal might shatter.',
          );
          await p.showText(
            'But it pulses with cold energy. Breaking this would take a fragment with real warmth behind it.',
          );
        }
      }),
    },
  ]);
}
