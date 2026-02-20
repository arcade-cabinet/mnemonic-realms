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

function getMillbrookVibrancy(player: RpgPlayer): number {
  const zoneInfo = resolveMapZone('millbrook');
  if (!zoneInfo) return 50;
  return getVibrancy(player, zoneInfo.zone);
}

export function spawnMapEvents(_player: RpgPlayer, map: RpgMap) {
  // --- Named NPCs ---
  // Millbrook is a working riverside town: millers, fishers, bridge tenders.
  // The Brightwater River powers the mill and feeds the falls. The town
  // is practical, warm, and proud of its bridge.
  map.createDynamicEvent([
    // Aldric — the mill keeper. Runs the watermill his family built three
    // generations ago. Stocky, flour-dusted, speaks in rhythm like the
    // grinding stones. Deeply attuned to the mill's moods.
    {
      x: 240,
      y: 240,
      event: makeNpc('aldric', 'npc_villager_m1', async (p) => {
        const v = getMillbrookVibrancy(p);
        if (v >= 67) {
          await p.showText(
            "You hear that? The stones are singing today. Not grinding — singing. Three generations my family's run this mill, and I've never heard the grain come out so fine. It's like the river remembers what flour is supposed to taste like.",
          );
        } else if (v <= 33) {
          await p.showText(
            "Mill's sluggish again. The stones turn, but the grain comes out coarse — tasteless, like the river forgot what it was carrying. My father could set the millstones by ear. These days I can barely hear them over the silence.",
          );
        } else {
          await p.showText(
            "Steady day. The current's reliable, stones are turning clean. Not their best, not their worst. My grandmother used to say the mill has moods — happy water makes happy flour. I thought she was being poetic. Now I'm not so sure.",
          );
        }
      }),
    },

    // Maren — the bridge keeper. An older woman who has tended the
    // Brightwater Bridge for decades. Knows every crack in the stonework,
    // every story carved into the railings. Speaks slowly, deliberately,
    // like someone used to being listened to.
    {
      x: 320,
      y: 304,
      event: makeNpc('maren', 'npc_villager_f2', async (p) => {
        const v = getMillbrookVibrancy(p);
        if (v >= 67) {
          await p.showText(
            "The keystone is blazing today. See the way the light catches the water beneath? Rainbow spray — haven't seen that since I was a girl. The old stories say the bridge was dreamed into being by someone who'd never seen a river and wanted to cross one anyway.",
          );
          await p.showText(
            'They say the Dissolved who built it felt such wonder at the idea of two banks connected that the stone still carries the feeling. On days like this, I believe it.',
          );
        } else if (v <= 33) {
          await p.showText(
            "The keystone's gone quiet. Used to hum when you pressed your palm to it — a deep note, like the river was clearing its throat. Now it just sits there. Cold stone over cold water. I still walk the bridge every morning. Someone has to remember what it felt like.",
          );
        } else {
          await p.showText(
            "Forty years I've kept this bridge. Swept every stone, patched every crack. The keystone still hums when the weather's right — not as strong as the old days, but enough to know something's still in there. Something proud.",
          );
          await p.showText(
            'My mother kept the bridge before me. She said the stone chose her. I thought that was nonsense until the day I touched it and felt the whole river run through my fingers.',
          );
        }
      }),
    },

    // Lane — a fisher who works the dock at the southeast bend.
    // Weather-beaten, pragmatic, notices things in the water others miss.
    // Offers the fishing minigame.
    {
      x: 480,
      y: 480,
      event: makeNpc('fisher-lane', 'npc_fisher_m1', async (p) => {
        const v = getMillbrookVibrancy(p);
        if (v >= 67) {
          await p.showText(
            "River's alive today. The fish are jumping — and not just the regular kind. Caught one this morning that was glowing. Faint, like a candle underwater. Let it go. Felt wrong to keep something that beautiful.",
          );
          await p.showText(
            "Try your luck? Cast, wait, feel the tug. There's a rhythm to it. The river gives up what it wants to give up. Sometimes that's supper. Sometimes it's something stranger.",
          );
        } else if (v <= 33) {
          await p.showText(
            "Water's flat today. Not calm — flat. There's a difference. Calm water has life underneath. Flat water is just... waiting for something to care about. The fish come up grey and tasteless. Even the crabs won't bite.",
          );
        } else {
          await p.showText(
            "Not bad, not bad. The current's steady, and anything steady is good for fishing. I've been working this bend since before the bridge had a keeper. The river tells you things if you sit still long enough.",
          );
          await p.showText(
            "Cast a line if you want. Sometimes the fish carry tiny fragments — memory-touched, the old folks say. Mostly they're just fish. But sometimes.",
          );
        }
      }),
    },

    // Colm — a traveling herbalist passing through Millbrook. Lean,
    // sun-darkened skin, carries a bundle of drying plants. Observant
    // about water quality and the land's health.
    {
      x: 368,
      y: 192,
      event: makeNpc('herbalist-colm', 'npc_merchant_m1', async (p) => {
        const v = getMillbrookVibrancy(p);
        if (v >= 67) {
          await p.showText(
            "The watercress downstream is the thickest I've seen anywhere in the Settled Lands. And the color — deep green, almost blue at the edges. Water this vital grows medicine you can't cultivate. The river is remembering how to heal.",
          );
        } else if (v <= 33) {
          await p.showText(
            "I gather herbs where the brook bends west. The mint there used to be sharp enough to wake you from a dead sleep. Now it tastes like wet paper. The water's carrying less — less memory, less life. Plants feel it first.",
          );
        } else {
          await p.showText(
            'Colm. I walk the waterways — Millbrook, the marsh to the south, anywhere the rivers go. Herbs grow best near running water, and running water grows best near memory. Symbiotic, you might say.',
          );
          await p.showText(
            "If you're heading upstream, watch for silverweed near the falls. It only grows in the mist where the water breaks. Good for clarity tonics. Better for trade.",
          );
        }
      }),
    },

    // Pip — a child playing near the watermill. Fascinated by the sounds
    // the mill makes, the fish in the brook, the world in general.
    // Innocent perspective on the town's relationship with the river.
    {
      x: 208,
      y: 288,
      event: makeNpc('pip', 'npc_villager_f1', async (p) => {
        const v = getMillbrookVibrancy(p);
        if (v >= 67) {
          await p.showText(
            "The mill is HUMMING today! Not the grinding sound — a humming sound, like it's happy! Aldric says mills can't be happy but I put my ear against the wall and it was definitely humming a SONG. Do you want to hear? Put your ear right HERE.",
          );
        } else if (v <= 33) {
          await p.showText(
            "The mill sounds tired today. It goes clunk... clunk... clunk, real slow. Aldric says the water's lazy but I think the mill is sad. Can mills be sad? My mama says I ask too many questions.",
          );
        } else {
          await p.showText(
            'I counted seven fish this morning! The big silver one with the spot on its nose came back — I named her Duchess. She swims right up to the wheel and then WHOOSH the current takes her back and she has to start over. She never gives up.',
          );
        }
      }),
    },
  ]);

  // --- Arrival trigger ---
  // First-time event near the east entrance. The player arrives from
  // Everwick and hears the town before they see it.
  map.createDynamicEvent([
    {
      x: 1200,
      y: 512,
      event: makeEvent('millbrook-arrival', async (p) => {
        if (p.getVariable('MILLBROOK_ARRIVAL_PLAYED')) return;
        p.setVariable('MILLBROOK_ARRIVAL_PLAYED', true);

        await p.showText(
          'You hear Millbrook before you see it. The rhythmic thump of the watermill carries across the fields — a deep, steady heartbeat that the wind picks up and delivers like a welcome. Beneath it, the rush of water over stone, constant and unhurried.',
        );
        await p.showText(
          'The path curves downhill toward a river gorge. Mist rises from the north where waterfalls catch the light. Stone buildings line both banks, connected by an arched bridge whose keystone catches the sun and throws back something brighter than simple reflection.',
        );
        await p.showText(
          'The air smells of wet stone, ground flour, and the green tang of river moss. Someone downstream is whistling. The mill thumps on.',
        );
      }),
    },
  ]);

  // --- Zone transitions ---
  map.createDynamicEvent([
    // East -> Everwick
    {
      x: 1264,
      y: 512,
      event: makeEvent('east-gate', (p) => {
        p.changeMap('everwick', { x: 48, y: 432 });
      }),
    },
    // South -> Heartfield
    {
      x: 640,
      y: 1264,
      event: makeEvent('south-gate', (p) => {
        p.changeMap('heartfield', { x: 80, y: 0 });
      }),
    },
    // West -> Hollow Ridge (conditional on MQ-04)
    {
      x: 0,
      y: 512,
      event: makeEvent('west-gate', async (p) => {
        if (p.getVariable('MQ_04_STARTED') || p.getVariable('MQ_04_COMPLETED')) {
          p.changeMap('hollow-ridge', { x: 784, y: 560 });
        } else {
          await p.showText(
            "The western road narrows into a rocky defile where the Brightwater cuts through the ridge. An iron chain spans the gap, strung between two ancient posts. A weathered sign reads: 'Ridge Road — closed by order of the Waystation.' The chain is old, but the lock is new.",
          );
        }
      }),
    },
    // Hidden waterfall cave (conditional on SQ-04)
    {
      x: 96,
      y: 64,
      event: makeEvent('falls-cave-entrance', async (p) => {
        if (p.getVariable('SQ_04_STARTED')) {
          await p.showText(
            'Behind the curtain of falling water, the rock face is not solid — there is a gap, just wide enough to slip through. The air from inside is warm and carries a faint amber glow. Something old lives in this cave. Something that has been waiting.',
          );
          p.changeMap('millbrook-falls-cave', { x: 80, y: 80 });
        } else {
          await p.showText(
            'The waterfall crashes against the rocks in a white roar. Mist coats your skin. Through the spray, you think you see a shadow in the cliff face — a hollow, maybe, or a trick of the light. The water is too heavy to approach without reason.',
          );
        }
      }),
    },
  ]);

  // --- Resonance Stones ---
  // Each stone carries a unique memory from Millbrook's past.
  // The Brightwater is a river of memory — water carries and deposits
  // echoes of the Dissolved era throughout the town.
  map.createDynamicEvent([
    // Bridge keystone — the oldest stone in town, set into the arch
    // before the bridge was built around it. Memory of the first crossing.
    {
      x: 336,
      y: 320,
      event: makeEvent('bridge-keystone', async (p) => {
        const v = getMillbrookVibrancy(p);
        if (v >= 67) {
          await p.showText(
            'The keystone blazes under your hand. The bridge trembles — not with weakness, but with recognition. A memory erupts: the river, wild and uncrossable, and a figure standing on the far bank with arms outstretched. They are imagining a bridge. Not building — imagining. And the stone answers.',
          );
          await p.showText(
            'You see the arch form from nothing — remembered into being, one perfect curve of stone rising from the water like a held breath. The figure crosses for the first time, and the joy they feel is so sharp it crystallizes in the keystone forever. The water beneath you erupts in rainbow spray.',
          );
        } else if (v <= 33) {
          await p.showText(
            'The keystone is cold and rough. You press your palm against it and wait. Nothing. Then — the faintest flicker: two riverbanks, impossibly far apart. Someone standing alone, wanting to cross. The memory is there, but it is exhausted. Like a song heard through a wall.',
          );
        } else {
          await p.showText(
            'The keystone hums against your palm. A memory surfaces: hands pressing stone into place — no, not hands. Will. Someone willed this bridge into existence. You feel the effort, the concentration, and then the rush of completion as the arch held for the first time.',
          );
          await p.showText(
            'Beneath the memory, a deeper note: awe. Whoever built this bridge could not believe what they had done. That disbelief lives in the stone like a second heartbeat.',
          );
        }
      }),
    },

    // Millstone — set into the watermill's foundation. Memory of the
    // first grain ground here, the day the wheel first turned.
    {
      x: 224,
      y: 224,
      event: makeEvent('millstone-resonance', async (p) => {
        const v = getMillbrookVibrancy(p);
        if (v >= 67) {
          await p.showText(
            "The stone embedded in the mill's foundation rings like a tuning fork. A memory floods in: the first miller, knee-deep in the stream, wrestling the wheel into position. It catches the current and turns — turns — and the grinding stones engage with a sound like thunder learning to purr.",
          );
          await p.showText(
            'Flour drifts down like snow. The miller catches some on her tongue and laughs. The mill has its own song now, and it will never stop singing it. Even three generations later, the stone remembers every rotation.',
          );
        } else if (v <= 33) {
          await p.showText(
            "The stone in the mill's foundation is barely warm. A memory stirs — a wheel turning, grain falling — but the details are smudged. You can hear the rhythm but not the song. The mill's voice is fading.",
          );
        } else {
          await p.showText(
            'The stone pulses with a slow, heavy rhythm — the heartbeat of the watermill. A memory unspools: grain pouring between the stones, the creak of the great wheel, a miller adjusting the mechanism by sound alone. She knew when the flour was right by the pitch of the grinding. Her hands were always dusted white.',
          );
        }
      }),
    },

    // Waterfall stone — at the base of the falls. Memory of the spring
    // melt when the river ran at full force and carved the gorge deeper.
    {
      x: 112,
      y: 80,
      event: makeEvent('falls-stone', async (p) => {
        await p.showText(
          'A dark stone at the base of the falls, perpetually wet, perpetually humming. When you touch it, the memory is overwhelming: the spring melt, long ago, when the snowpack broke and the river swelled to ten times its size. Water roaring through the gorge like something alive — not angry, not destructive, but joyful. The sheer, thundering joy of water remembering how to move.',
        );
        await p.showText(
          'The falls carved three feet deeper that day. The stone at the bottom felt every drop. It still shakes with the memory of that force — a tremor so deep it feels like the earth is laughing.',
        );
      }),
    },

    // Brook bend stone — downstream where the river slows and pools.
    // Memory of children swimming in summer, generations ago.
    {
      x: 528,
      y: 448,
      event: makeEvent('brook-bend-stone', async (p) => {
        await p.showText(
          "A smooth, sun-warmed stone at the brook's bend, half-submerged in the shallows. The memory is gentle and warm: children, a dozen of them, splashing in the summer pool. Their laughter echoes off the banks. A woman on the shore is braiding wildflowers into a crown, calling out names you almost recognize.",
        );
        await p.showText(
          "One child dives deep and comes up holding something — a pebble that catches the light. 'Look!' she shouts. 'The river gave me a star!' The woman on the bank smiles. The afternoon stretches on, golden and endless, the way only childhood summers can.",
        );
      }),
    },
  ]);

  // --- Treasure Chests ---
  map.createDynamicEvent([
    // Behind the watermill — tucked into the sluice channel where the
    // overflow drains. Someone stashed supplies here for safekeeping.
    {
      x: 192,
      y: 256,
      event: makeEvent('sluice-chest', async (p) => {
        if (p.getVariable('CH_MB_01_OPENED')) {
          await p.showText(
            'The waterproof satchel sits open in the sluice channel. Water streams around it, filling the empty space where the supplies were.',
          );
          return;
        }
        await p.showText(
          "Wedged into the dry side of the sluice channel behind the mill, a waxed leather satchel sits above the waterline. Someone who knew the mill's rhythms left this here — placed precisely where the overflow never reaches.",
        );
        await p.showText(
          'Inside: a Memory Fragment wrapped in oilcloth that smells faintly of ground wheat, and a handful of river-smoothed coins older than the mill itself.',
        );
        p.setVariable('CH_MB_01_OPENED', true);
      }),
    },

    // On the east bank — half-buried in the reeds near the fishing
    // dock. A fisher's emergency cache, forgotten or abandoned.
    {
      x: 400,
      y: 160,
      event: makeEvent('reed-chest', async (p) => {
        if (p.getVariable('CH_MB_02_OPENED')) {
          await p.showText(
            'The tin box lies open in the reeds. A dragonfly perches on the lid, wings catching the light off the water.',
          );
          return;
        }
        await p.showText(
          "A battered tin box buried in the riverbank reeds, its lid stamped with a leaping fish — a fisher's mark. The lock gave way to rust years ago. Inside, wrapped in a scrap of sailcloth: two Haste Seeds in a stoppered vial, still potent, and a note in faded ink that reads 'For the long walk home.'",
        );
        p.setVariable('CH_MB_02_OPENED', true);
      }),
    },

    // Near the downstream bend — a traveler's cache left at the
    // crossroads where the south road meets the river path.
    {
      x: 512,
      y: 512,
      event: makeEvent('crossroads-chest', async (p) => {
        if (p.getVariable('CH_MB_03_OPENED')) {
          await p.showText(
            'The stone hollow is empty. Moss has already begun to reclaim the space where the potions were.',
          );
          return;
        }
        await p.showText(
          "A natural hollow beneath a flat river stone, hidden by the bend in the path. Inside, three small bottles of clear tonic are lined up neatly, each corked and sealed with blue wax. A healer's cache — someone who walked this road regularly and believed in being prepared. The tonics are still good. The wax is barely cracked.",
        );
        p.setVariable('CH_MB_03_OPENED', true);
      }),
    },
  ]);

  // --- Interactive Landmarks ---
  map.createDynamicEvent([
    // The Brightwater Bridge — the town's centerpiece. Vibrancy-reactive:
    // at high vibrancy, the water shimmers with rainbow light from the
    // keystone. At low vibrancy, the bridge feels heavy and grey.
    {
      x: 352,
      y: 336,
      event: makeEvent('brightwater-bridge', async (p) => {
        const v = getMillbrookVibrancy(p);
        if (v >= 67) {
          await p.showText(
            'The Brightwater Bridge. The stone arch spans the gorge in a single, impossible curve — no mortar, no supports, just stone remembering how to hold itself together. Today the keystone is alive with light, and the spray rising from below catches it and scatters rainbows across both banks.',
          );
          await p.showText(
            'Children have gathered on the western railing to watch the colors. An old man on the eastern side is sketching the patterns. The bridge hums faintly beneath your feet, and for a moment you understand why someone dreamed it into being: not to cross a river, but to prove that two things separated could be joined.',
          );
        } else if (v <= 33) {
          await p.showText(
            'The Brightwater Bridge. The arch is sound — it has stood for longer than anyone can remember — but today the stone is dull and the water below moves without catching any light. The keystone sits in the arch like a closed eye. Maren is on her morning sweep, moving slowly, as though the bridge needs the company more than the cleaning.',
          );
        } else {
          await p.showText(
            'The Brightwater Bridge. A single stone arch over the gorge, elegant and ancient. The keystone at the crown glows faintly — not enough for rainbows, but enough to catch your eye when the light is right. The water below is clear and fast. You can see fish darting between the pilings, silver flashes against dark stone.',
          );
        }
      }),
    },

    // The watermill — viewed from outside. The great wheel turns in the
    // current, grinding grain for the town.
    {
      x: 256,
      y: 208,
      event: makeEvent('watermill-exterior', async (p) => {
        const v = getMillbrookVibrancy(p);
        if (v >= 67) {
          await p.showText(
            'The watermill. The great wheel turns steadily in the current, its paddles cutting the water with a sound like rhythmic applause. Through the open door you can see flour dust drifting in shafts of light, and Aldric moving between the millstones with the easy confidence of a man doing exactly what he was born to do.',
          );
          await p.showText(
            'The whole building thrums with energy — not just mechanical, but something deeper. The mill is working the way it was meant to work, and it knows it. The flour that comes out of here today will taste like the bread your grandmother made when she was happiest.',
          );
        } else if (v <= 33) {
          await p.showText(
            'The watermill. The wheel turns, but slowly — the paddles dragging through flat water as though the river can barely be bothered to push them. The grinding sound from inside is coarse and irregular. Aldric stands in the doorway, listening to the stones with a frown. Something is off, and the mill cannot tell him what.',
          );
        } else {
          await p.showText(
            'The watermill. Three generations of the same family have kept this wheel turning. The paddles cut the current with a steady rhythm — thump, splash, thump, splash — and the grinding stones inside produce a low, continuous hum. Flour dust coats the doorframe like snow that never melts.',
          );
        }
      }),
    },

    // The waterfall overlook — a natural ledge above the falls at the
    // north end of town. The view encompasses the gorge, the mill, and
    // the bridge.
    {
      x: 128,
      y: 48,
      event: makeEvent('falls-overlook', async (p) => {
        const v = getMillbrookVibrancy(p);
        if (v >= 67) {
          await p.showText(
            'From the overlook, the falls are magnificent. The water pours over the lip of the gorge in a white curtain that catches the light and throws it in every direction. Mist rises in slow columns, and where it meets the sun, faint rainbows form and dissolve and form again.',
          );
          await p.showText(
            'Below, you can see the whole town laid out: the mill turning, the bridge glowing, the market stalls along the quay. The sound is enormous — not just the falls, but the river, the wheel, the wind through the gorge — all of it woven into a single, sustained chord. Millbrook is singing.',
          );
        } else if (v <= 33) {
          await p.showText(
            'The falls. The water slides over the ledge without force — a trickle where there should be a torrent. The gorge below is quiet. The mist that usually fills the air has thinned to nothing, and you can see the rocks at the base of the falls, dry and exposed. The town below looks small and still.',
          );
        } else {
          await p.showText(
            'The falls overlook. A natural stone ledge worn smooth by centuries of mist. The Brightwater pours over the gorge edge in a white rush, and the sound fills the air like a held breath finally released. Below, the town follows the river — mill on the left, bridge in the center, the fishing bend to the right.',
          );
          await p.showText(
            'Someone carved a bench into the rock here, long ago. The seat is worn into a perfect curve by generations of people who came up here to watch the water and think about nothing in particular.',
          );
        }
      }),
    },
  ]);

  // --- Enemy Zones ---
  // Encounter zones defined in systems/encounters.ts (MILLBROOK_ZONES).
  // Random encounters triggered via player.ts onInput hook -> checkEncounter().
  //
  // West Riverbank: bounds=(32,160) to (256,480), rate=5%
  //   Enemies: River Nymphs (water magic), Stone Crabs (armored)
  // East Riverbank: bounds=(352,128) to (608,480), rate=5%
  //   Enemies: Stone Crabs
  // Falls Approach: bounds=(32,32) to (192,128), rate=3%
  //   Enemies: River Nymphs (low encounter rate — the mist obscures)
}
