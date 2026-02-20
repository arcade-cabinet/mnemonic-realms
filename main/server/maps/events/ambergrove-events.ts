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

function getAmbergroveVibrancy(player: RpgPlayer): number {
  const zoneInfo = resolveMapZone('ambergrove');
  if (!zoneInfo) return 50;
  return getVibrancy(player, zoneInfo.zone);
}

export function spawnMapEvents(_player: RpgPlayer, map: RpgMap) {
  // ---------------------------------------------------------------------------
  // Woodcutter's Camp NPCs
  // ---------------------------------------------------------------------------
  // A small camp of three woodcutters on Ambergrove's western edge. These are
  // practical, forest-hardened people who've spent their lives among the amber
  // trees. They are friendly but wary of the rapid growth spreading east.
  map.createDynamicEvent([
    {
      x: 144,
      y: 464,
      event: makeNpc('woodcutter-bren', 'npc_villager_m1', async (p) => {
        const v = getAmbergroveVibrancy(p);
        if (p.getVariable('SQ_03_COMPLETED')) {
          await p.showText(
            "The growth's settled since you dealt with those surges. Still fast, mind you — had to reroute the south trail twice this week — but it feels natural now. Like the forest is breathing, not choking.",
          );
        } else if (p.getVariable('SQ_03_STARTED')) {
          await p.showText(
            "Any luck with those growth sites? There's a new one past the Hearthstone Circle — roots thick as my arm, growing right through the canopy walkway. Halla nearly fell through yesterday.",
          );
        } else if (p.getVariable('MQ_03_STARTED')) {
          await p.showText(
            "You're the Architect from Everwick? Good. We've got a problem that axes can't solve.",
          );
          await p.showText(
            "The forest is growing too fast. Not just fast — wrong. Saplings shoulder through mature trees overnight. Root systems tangling so thick the deer can't pass. I've been working these woods for thirty years and I've never seen anything like it.",
          );
          await p.showText(
            "Three growth sites have appeared since last moon. Something's feeding them — memory energy gone feral, maybe. Could you take a look? I'll mark them on your map.",
          );
          p.setVariable('SQ_03_STARTED', true);
        } else if (v >= 67) {
          await p.showText(
            "The amber bark is luminous today — practically glowing from the inside. My grandmother told me stories about the trees shining like lanterns on midsummer nights. Thought she was embellishing. I owe the old woman an apology.",
          );
        } else if (v <= 33) {
          await p.showText(
            "The bark's gone dull. Used to be you could navigate by the shimmer off the trunks at twilight. Now I need a lantern just to find the trail markers. Something's draining the grove.",
          );
        } else {
          await p.showText(
            "Thirty years in these woods. My father worked them before me, and his mother before him. The amber bark — that's sap, hardened over centuries, catching light from inside the heartwood. No other forest in the Settled Lands grows like this.",
          );
        }
      }),
    },
    {
      x: 160,
      y: 496,
      event: makeNpc('woodcutter-halla', 'npc_villager_f1', async (p) => {
        if (p.getVariable('CANOPY_PATH_EXPLORED')) {
          await p.showText(
            "You went past the Canopy Path? The trees out there flicker, right? Like they can't decide whether to be oak or elm or something that hasn't been invented yet. The world's thin at the edges — Bren says I imagine things, but I've measured those trunks. They change width between morning and afternoon.",
          );
        } else {
          await p.showText(
            "I scout the eastern trails — keep them clear for anyone foolish enough to wander that deep. Past the Hearthstone Circle, the canopy gets thick enough to walk on. We built rope bridges between the strongest branches years ago.",
          );
          await p.showText(
            "But farther east, past the walkways? The trees start to flicker. Bark shifts color mid-blink. Branches grow and retract like breathing. I don't go past the last bridge anymore.",
          );
        }
      }),
    },
    {
      x: 176,
      y: 480,
      event: makeNpc('woodcutter-mirren', 'npc_villager_m2', async (p) => {
        if (p.getVariable('SQ_AXE_RETURNED')) {
          await p.showText(
            "Still can't believe you found it. Three generations of Mirrens have carved their mark into that handle. My daughter will get it next — once she's strong enough to swing it without toppling over.",
          );
        } else if (p.getVariable('SQ_AXE_STARTED')) {
          await p.showText(
            "The marking axe — any sign of it? I lost it near the eastern canopy walkway, by the third bridge support. The Thornback Beetles were thick as leaves that day. Dropped it and ran, I'm not proud to say.",
          );
        } else {
          await p.showText(
            "I carve symbols into the trees we mark for harvest. Not just any symbols — my grandmother taught me the old Dissolved runes. They calm the sapwood, make it release clean. Every tree I've marked goes down without a splinter.",
          );
          await p.showText(
            "Lost my marking axe, though. Family piece — three generations of initials on the handle. Somewhere near the eastern walkways. The beetles chased me off before I could retrieve it. Don't suppose you're heading that direction?",
          );
          p.setVariable('SQ_AXE_STARTED', true);
        }
      }),
    },
  ]);

  // ---------------------------------------------------------------------------
  // Meza — the Audiomancer
  // ---------------------------------------------------------------------------
  // Meza is a named NPC stationed near the Hearthstone Circle. She maintains
  // the sound-wells that amplify the Circle's resonance. Practical and grounded
  // despite practicing what looks like magic.
  map.createDynamicEvent([
    {
      x: 304,
      y: 176,
      event: makeNpc('meza', 'npc_meza', async (p) => {
        const v = getAmbergroveVibrancy(p);
        if (v >= 67) {
          await p.showText(
            "Can you hear that? The Circle is singing in full harmony — all six stones, every note aligned. I haven't heard this since I was an apprentice, and even then my teacher said it was rare.",
          );
          await p.showText(
            "The sound-wells are overflowing. Memory resonance is so thick here I can taste it — like copper and honey on the back of the tongue. Whatever you've been doing, Architect, keep at it.",
          );
        } else if (v <= 33) {
          await p.showText(
            "The Circle has gone quiet. Not silent — stones don't stop entirely — but muffled. Like hearing music through a closed door. I've been adjusting the sound-wells all week and nothing helps.",
          );
          await p.showText(
            "An audiomancer without resonance is just a woman standing in a forest talking to rocks. I'd laugh if it weren't so unnerving.",
          );
        } else {
          await p.showText(
            "I'm Meza. Audiomancer — which is a fancy way of saying I listen to things most people can't hear. The Hearthstone Circle hums six notes, one for each pillar. When they're in tune, the grove thrives. When they drift, the trees get confused.",
          );
          await p.showText(
            "Right now three of the six are active. The others went dormant long ago — their resonance faded when the Dissolved let go. But I think they could sing again, with the right kind of memory behind them.",
          );
        }
      }),
    },
  ]);

  // ---------------------------------------------------------------------------
  // Arrival event — first time entering from the west
  // ---------------------------------------------------------------------------
  map.createDynamicEvent([
    {
      x: 32,
      y: 432,
      event: makeEvent('ambergrove-arrival', async (p) => {
        if (p.getVariable('AMBERGROVE_ARRIVAL_PLAYED')) return;
        p.setVariable('AMBERGROVE_ARRIVAL_PLAYED', true);

        await p.showText(
          "The road from Everwick narrows between two enormous trees whose canopies interlock overhead like clasped hands. Beyond them, the light changes — filtering through a thousand amber leaves into a warm, honeyed glow that makes the air itself look golden.",
        );
        await p.showText(
          "The forest floor is soft with centuries of fallen leaves, each one hardened to a translucent amber shell that crunches faintly underfoot. The trees here are ancient — their bark runs with veins of hardened sap that catch the light like stained glass.",
        );
        await p.showText(
          "Somewhere deep in the canopy, a sound rises: a low, sustained hum, like a tuning fork struck against the heartwood of the world. The Hearthstone Circle is ahead. The forest knows you're here.",
        );
      }),
    },
  ]);

  // ---------------------------------------------------------------------------
  // Resonance Stones
  // ---------------------------------------------------------------------------
  // Ambergrove's stones are among the oldest in the Settled Lands. The
  // Hearthstone Circle alone holds six, though only three are active in Act I.
  // Each memory is tied to the Dissolved who built this grove.
  map.createDynamicEvent([
    {
      x: 320,
      y: 160,
      event: makeEvent('rs-ag-01', async (p) => {
        const v = getAmbergroveVibrancy(p);
        if (v >= 67) {
          await p.showText(
            "The central stone blazes with amber warmth. The memory is overwhelming in its clarity: a Dissolved elder stands at the circle's heart, arms raised, and every tree in the grove bows inward — not from wind, but from reverence. The forest remembers its maker. You feel the hum in your bones.",
          );
        } else if (v <= 33) {
          await p.showText(
            "The central stone flickers weakly. A memory stirs but can't fully surface — a silhouette raising its arms, trees bending toward a center that no longer holds. The ceremony is there, somewhere, but it plays like a dream you can't quite recall upon waking.",
          );
        } else {
          await p.showText(
            "The tallest stone in the Hearthstone Circle, rough-hewn and warm to the touch. When you press your palm against it, a memory unfolds: a ring of figures standing where the six stones now stand, singing a single note that makes the ground vibrate. Roots spiral outward from their feet. Trees erupt from bare soil, growing decades in seconds. This is the planting — the moment the Dissolved sang Ambergrove into existence.",
          );
        }
      }),
    },
    {
      x: 480,
      y: 432,
      event: makeEvent('rs-ag-02', async (p) => {
        await p.showText(
          "A flat stone half-submerged in the lake's shallows, its surface polished smooth by centuries of gentle current. The water around it glows faintly where the amber light catches it.",
        );
        await p.showText(
          "You kneel and touch the stone's edge. A memory rises through the water: the lake when it was new — no amber tint, just crystal so clear you could count the pebbles on the bottom. A child dives in, laughing, and surfaces with a stone in each hand, shouting that she's found treasure. The water remembers her joy. It has been trying to return to that clarity ever since.",
        );
      }),
    },
    {
      x: 512,
      y: 192,
      event: makeEvent('rs-ag-03', async (p) => {
        await p.showText(
          "Deep in the eastern canopy, where the trees grow so close their trunks have merged, you find a stone wrapped in living roots — not consumed, but cradled, as though the forest is protecting it.",
        );
        await p.showText(
          "The memory is ancient and strange: tall figures walking between the trees, their feet leaving no prints. They are translucent, almost — more light than flesh. One pauses, touches a sapling, and the tree grows ten years in a heartbeat. Another kneels by a fallen trunk and whispers. The dead wood sprouts green. These are the Dissolved, before they dissolved — when they were still people, still walking, still choosing to tend a world they knew they would someday become.",
        );
      }),
    },
    {
      x: 128,
      y: 496,
      event: makeEvent('rs-ag-04', async (p) => {
        await p.showText(
          "A rough, unpolished stone at the camp's edge, wedged between the roots of the oldest tree in the clearing. Unlike the Circle's stones, this one is small enough to hold in your hands.",
        );
        await p.showText(
          "The memory is recent — no more than a few generations old. A young woman kneels where Bren's cabin now stands, driving a stake into virgin soil. Behind her, two others fell a tree with a crosscut saw. The first woodcutter's camp. She wipes sweat from her forehead, looks up at the canopy, and says aloud: 'We'll take what we need and give back what we can.' The forest hums in answer. An agreement, sealed in labor and respect.",
        );
      }),
    },
  ]);

  // ---------------------------------------------------------------------------
  // Treasure Chests
  // ---------------------------------------------------------------------------
  map.createDynamicEvent([
    {
      x: 352,
      y: 128,
      event: makeEvent('circle-chest', async (p) => {
        if (p.getVariable('CH_AG_01_OPENED')) {
          await p.showText(
            'The hollow between the standing stones is empty now. Moss has already begun to close over the gap, as if the forest is healing the space where the offering sat.',
          );
          return;
        }
        await p.showText(
          "In the gap between two Hearthstone pillars, half-buried under centuries of amber leaf litter, something catches the light. You brush away the debris and find a leather pouch sealed with wax — old wax, cracked but holding. Inside: a Memory Fragment that pulses with the warmth of a campfire, and a ring of woven amber bark that hums faintly against your skin.",
        );
        p.setVariable('CH_AG_01_OPENED', true);
      }),
    },
    {
      x: 560,
      y: 320,
      event: makeEvent('canopy-chest', async (p) => {
        if (p.getVariable('CH_AG_02_OPENED')) {
          await p.showText(
            "The rope cradle sways empty in the breeze, its contents claimed. Someone — or something — has filled it with fresh leaves since you last visited, as if offering a trade.",
          );
          return;
        }
        await p.showText(
          "High on the canopy walkway, lashed to a branch where two rope bridges meet, you find a bundle wrapped in oilskin. The knots are woodcutter's knots — Mirren's, by the pattern. He must have cached supplies here before the beetles drove him back.",
        );
        await p.showText(
          "Inside: a stoppered bottle of sap tonic — the amber kind the woodcutters brew for long shifts — a handful of gold coins stamped with Everwick's fountain seal, and a Fragment that smells of rain on warm bark.",
        );
        p.setVariable('CH_AG_02_OPENED', true);
      }),
    },
    {
      x: 448,
      y: 480,
      event: makeEvent('lakeshore-chest', async (p) => {
        if (p.getVariable('CH_AG_03_OPENED')) {
          await p.showText(
            "The woven-root box sits open at the water's edge. Tiny fish dart through it, treating it as shelter. Something about that feels right.",
          );
          return;
        }
        await p.showText(
          "At the lake's southern shore, where the amber trees lean out over the water as if admiring their reflections, a small box of woven roots sits half-submerged. The craft is unmistakably Dissolved — no nails, no seams, just living material shaped with patience.",
        );
        await p.showText(
          "The lid lifts easily. Water has seeped in, but the contents are untouched — sealed in a membrane of hardened sap. A potent Fragment, heavy with the weight of deep water, and a bone needle etched with runes too fine to read without a lens.",
        );
        p.setVariable('CH_AG_03_OPENED', true);
      }),
    },
  ]);

  // ---------------------------------------------------------------------------
  // Landmarks
  // ---------------------------------------------------------------------------
  map.createDynamicEvent([
    {
      x: 320,
      y: 144,
      event: makeEvent('hearthstone-circle', async (p) => {
        const v = getAmbergroveVibrancy(p);
        if (v >= 67) {
          await p.showText(
            "The Hearthstone Circle. Six amber pillars arranged in a perfect ring, each one humming a different note. At this vibrancy, the notes align into a chord that vibrates in your chest. The air between the pillars shimmers — not with heat, but with memory so dense it distorts the light. You can almost see figures standing where the Dissolved once gathered.",
          );
        } else if (v <= 33) {
          await p.showText(
            "The Hearthstone Circle. Six amber pillars in a ring, though only the tallest still hums audibly. The others stand in silence, their surfaces dull, their resonance reduced to a faint vibration you can only feel if you press your ear directly against the stone. The circle remembers, but barely.",
          );
        } else {
          await p.showText(
            "The Hearthstone Circle. Six standing stones of amber-veined rock, arranged in a ring the width of a village square. Each pillar is twice your height, tapered at the top, warm to the touch regardless of the weather. Three hum audibly — low, sustained notes that harmonize when the wind is right. The other three are dormant, waiting.",
          );
          await p.showText(
            "The ground within the circle is bare and smooth, as if nothing has dared grow here since the stones were placed. A thin amber glow rises from the soil at dusk. Meza says the Dissolved held their most important ceremonies in circles like this — the act of standing together in a ring was itself a kind of memory-making.",
          );
        }
      }),
    },
    {
      x: 464,
      y: 400,
      event: makeEvent('amber-lake', async (p) => {
        const v = getAmbergroveVibrancy(p);
        if (v >= 67) {
          await p.showText(
            "Amber Lake. The water is impossibly clear today — you can see straight to the bottom, where amber leaves have settled into patterns that look almost deliberate. Spirals, circles, lines that converge on the submerged stone at the lake's center. The stone pulses with a deep, steady rhythm, like a heartbeat.",
          );
        } else {
          await p.showText(
            "Amber Lake. The water is still and golden, reflecting the canopy overhead in such perfect detail that for a moment you can't tell which way is up. A large Resonance Stone sits at the lake's center, half-submerged, humming a note so low you feel it in your knees more than hear it.",
          );
          await p.showText(
            "The hum is powerful — far stronger than any stone you've encountered. Whatever memory this stone carries, it's dense, old, and vast. You'd need far more skill to draw it out safely.",
          );
        }
      }),
    },
    {
      x: 240,
      y: 320,
      event: makeEvent('hollow-tree', async (p) => {
        await p.showText(
          "The Hollow Grandmother — that's what the woodcutters call her. The oldest tree in Ambergrove, so ancient her trunk has split into a natural cathedral wide enough to stand inside. The amber veins in her bark are thicker than your wrist, pulsing with a faint warmth that makes the interior comfortable even on cold nights.",
        );
        await p.showText(
          "Bren told you the woodcutters used to shelter here during storms. Someone carved a bench into the living wood decades ago, and the tree grew around it — accepting the modification, incorporating it. Moss covers the seat now, soft as a cushion. The air inside smells of resin and old rain.",
        );
        await p.showText(
          "High above, where the split trunk opens to the sky, you can see stars even at midday — or what look like stars. Meza says they're memory sparks, drawn upward by the tree's resonance. The Hollow Grandmother is dreaming.",
        );
      }),
    },
  ]);

  // ---------------------------------------------------------------------------
  // Amber Lake submerged stone — dormant until Act II
  // ---------------------------------------------------------------------------
  map.createDynamicEvent([
    {
      x: 480,
      y: 432,
      event: makeEvent('lake-stone-dormant', async (p) => {
        if (p.getVariable('MQ_05_STARTED') || p.getVariable('MQ_05_COMPLETED')) {
          await p.showText(
            "The submerged stone responds to your presence now — the water around it warms, and the deep hum rises to a tone you can almost understand. Images flicker beneath the surface: roots, rivers, a vast network of living things connected by threads of golden light. The dormant god Resonance stirs in its sleep.",
          );
        } else {
          await p.showText(
            "You wade to your knees, reaching toward the submerged stone. The hum intensifies — your fingertips tingle, your vision blurs. For a fraction of a second, you see the entire forest from above, every tree connected by threads of golden light, every root a nerve in a vast sleeping body.",
          );
          await p.showText(
            "Then the vision collapses. The stone goes quiet. Too much. Too dense. Whatever sleeps in this lake is not yet ready to be woken — or you are not yet ready to wake it.",
          );
        }
      }),
    },
  ]);

  // ---------------------------------------------------------------------------
  // Zone transitions
  // ---------------------------------------------------------------------------
  map.createDynamicEvent([
    {
      x: 0,
      y: 432,
      event: makeEvent('west-to-everwick', (p) => {
        p.changeMap('everwick', { x: 896, y: 432 });
      }),
    },
    {
      x: 400,
      y: 608,
      event: makeEvent('south-to-heartfield', (p) => {
        p.changeMap('heartfield', { x: 1248, y: 0 });
      }),
    },
    {
      x: 608,
      y: 320,
      event: makeEvent('east-to-flickerveil', async (p) => {
        if (p.getVariable('MQ_04_STARTED') || p.getVariable('MQ_04_COMPLETED')) {
          p.changeMap('flickerveil', { x: 0, y: 480 });
        } else {
          await p.showText(
            "The Canopy Path narrows ahead, and the air takes on a strange, opalescent shimmer. The trees beyond this point don't hold still — their outlines waver, bark rippling between textures like a painting being endlessly revised.",
          );
          await p.showText(
            "A wall of dense, luminous mist blocks the path. It's not natural fog — it hums, faintly, and when you reach toward it your hand passes through warmth that tastes of unfinished things. The Flickerveil. Whatever lies beyond is not yet ready to be walked.",
          );
        }
      }),
    },
  ]);

  // ---------------------------------------------------------------------------
  // Enemy zone reference
  // ---------------------------------------------------------------------------
  // Encounter zones defined in systems/encounters.ts (AMBERGROVE_ZONES).
  // Random encounters triggered via player.ts onInput hook -> checkEncounter().
  //
  // Dense Forest:  bounds=(80,32) to (560,240), rate=8%   — Forest Wisps, Thornback Beetles
  // Lake Shore:    bounds=(384,320) to (560,480), rate=3%  — Forest Wisps (passive)
  // Canopy Path:   bounds=(576,240) to (624,448), rate=6%  — Thornback Beetles (armored)
}
