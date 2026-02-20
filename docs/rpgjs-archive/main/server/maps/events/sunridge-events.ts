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

function getSunridgeVibrancy(player: RpgPlayer): number {
  const zoneInfo = resolveMapZone('sunridge');
  if (!zoneInfo) return 50;
  return getVibrancy(player, zoneInfo.zone);
}

export function spawnMapEvents(_player: RpgPlayer, map: RpgMap) {
  // --- Named NPCs ---
  // Ridgetop Waystation staff and highland residents. Sunridge is the highest
  // point in the Settled Lands — wind-scoured, treeless, panoramic. The people
  // here are tough, practical, and used to thin air and long silences.
  map.createDynamicEvent([
    {
      x: 304,
      y: 304,
      event: makeNpc('waystation-keeper-holt', 'npc_keeper_f1', async (p) => {
        const v = getSunridgeVibrancy(p);
        if (v >= 67) {
          await p.showText(
            "The wind's been singing today. Real singing — not the usual moan through the stones. Hadn't heard that since I was a girl, watching my mother bank the hearthfire.",
          );
          await p.showText(
            "Stay as long as you need. The waystation's yours. I'll put the kettle on — the good leaves, not the trail-dust I give the merchants.",
          );
        } else if (v <= 33) {
          await p.showText(
            "Wind's been steady all week. No change, no shift. Used to be you could read the weather by listening — each gust had a voice. Now it's just... noise.",
          );
          await p.showText(
            "The hearth's warm enough. Rest if you need to. But don't linger too long — the ridge has a way of making people forget they had somewhere to be.",
          );
        } else {
          await p.showText(
            "Forty years running this waystation. I've watched every kind of traveler come through — merchants, soldiers, pilgrims, fools. You're the first Architect.",
          );
          await p.showText(
            "There's dried meat and hard bread by the fire. The tea's bitter but it'll warm you through. The pass north is treacherous after dark, so if you're heading that way, go soon or wait till morning.",
          );
        }
      }),
    },
    {
      x: 336,
      y: 288,
      event: makeNpc('shepherd-olin', 'npc_villager_m2', async (p) => {
        const v = getSunridgeVibrancy(p);
        if (v >= 67) {
          await p.showText(
            'The goats have been climbing higher than usual. They can feel it — something in the rock, in the wind. A humming. Like the ridge itself is waking up.',
          );
          await p.showText(
            "I don't pretend to understand what you Architects do. But the goats trust it, and goats don't lie.",
          );
        } else if (v <= 33) {
          await p.showText(
            "Used to sit up here and think the silence was peaceful. Now it just feels... empty. The goats huddle closer than they should. Animals know when something's missing.",
          );
        } else {
          await p.showText(
            "People talk too much in the lowlands. Up here it's just the wind and the goats and the sky. You learn to listen differently.",
          );
          await p.showText(
            "The Dissolved built that shrine on the promontory. My grandmother said they'd stand there for hours, arms out, letting the wind carry their words to places they'd never see. Imagine trusting the air that much.",
          );
        }
      }),
    },
    {
      x: 352,
      y: 320,
      event: makeNpc('scholar-varis', 'npc_villager_m1', async (p) => {
        await p.showText(
          "Varis. Field researcher. I've been documenting the resonance patterns at the Wind Shrine for three months. The readings are... unprecedented.",
        );
        await p.showText(
          "Every other Resonance Stone I've studied holds a memory — a moment, a feeling, a person. The stone at the shrine holds something larger. A presence. As if the memory itself is aware of being remembered.",
        );
        await p.showText(
          "Artun's journals mention 'dormant gods' — prototypes left behind by the Dissolved. I think the Wind Shrine is one of their cradles. But that's not something I'd say out loud to just anyone.",
        );
      }),
    },
  ]);

  // --- Janik (conditional on MQ-04 completion) ---
  // Former Preserver captain. Scholarly, conflicted, precise. His speech starts
  // military and evolves toward philosophy. He is not a quest dispenser — he is
  // a man who has spent his life following orders he increasingly doubts.
  if (_player.getVariable('MQ_04_COMPLETED')) {
    map.createDynamicEvent([
      {
        x: 496,
        y: 224,
        event: makeNpc('janik', 'npc_janik', async (p) => {
          if (!p.getVariable('SQ_05_STARTED')) {
            await p.showText("You're the Architect. I've read the dispatches.");
            await p.showText(
              "I'm Janik. Preserver Captain — or I was. I left my post three days ago. Walked out of the outpost, left my crystal gauntlet on the table, and came up here to think.",
            );
            await p.showText(
              'Grym says the world is fragile. That memory is dangerous — that every new thing remembered threatens what already exists. And Grym is not entirely wrong.',
            );
            await p.showText(
              "But I've watched the Preservers freeze a watchtower, a clearing, a child's butterfly. I've watched them call it 'protection.' And I've started to wonder whether a world that never changes is worth protecting at all.",
            );
            await p.showText(
              "There's an artifact — a crystallized memory core — that Grym's lieutenants removed from the outpost below. I don't know what's inside it, but Grym wanted it badly enough to send three scouts for retrieval. That makes me nervous.",
            );
            await p.showText("I can't go back. But you could find out what they took. Would you?");
            p.setVariable('SQ_05_STARTED', true);
          } else if (p.getVariable('SQ_05_STARTED') && !p.getVariable('SQ_05_COMPLETED')) {
            await p.showText(
              "Still searching? Take your time. Whatever Grym's lieutenants took from the outpost, they've hidden it well.",
            );
            await p.showText(
              "I've been thinking about something my commanding officer said when I was first recruited. 'The perfect world doesn't grow. It endures.' I believed that for years. Now I hear it and all I can think is — enduring isn't the same as living.",
            );
          } else {
            await p.showText(
              'You found it. I suspected as much when the wind changed this morning — warmer, like it was carrying something new.',
            );
            await p.showText(
              "I still don't know if you're right, Architect. But I know Grym is afraid. And people who are afraid make the world smaller to feel safe. I'd rather live in a world that's too big than one that's perfectly still.",
            );
          }
        }),
      },
    ]);
  }

  // --- Preserver Scout (non-combat, always present at the outpost) ---
  map.createDynamicEvent([
    {
      x: 512,
      y: 240,
      event: makeNpc('preserver-scout', 'npc_guard_m2', async (p) => {
        await p.showText(
          'The scout raises a hand — palm outward, a flat, practiced gesture of authority.',
        );
        await p.showText(
          'Halt. This area is under preservation protocol. You may observe, but do not approach the watchtower.',
        );
        if (p.getVariable('PRESERVER_SCOUT_SPOKEN')) {
          await p.showText('I have nothing more to say. We maintain. We endure. That is enough.');
        } else {
          await p.showText(
            'I am a watcher for Grym. We maintain the borders — ensuring that the settled regions remain stable. Unchanged. Safe.',
          );
          await p.showText(
            'This tower was built by a civilization that chose to dissolve. In a generation, their work would have crumbled. Now it will endure forever. Every stone, every chisel mark. Exactly as it was.',
          );
          p.setVariable('PRESERVER_SCOUT_SPOKEN', true);
        }
      }),
    },
  ]);

  // --- Arrival trigger ---
  // First-time event near the south entrance. The player has climbed from
  // Everwick into open highlands — the world suddenly feels vast.
  map.createDynamicEvent([
    {
      x: 640,
      y: 1152,
      event: makeEvent('sunridge-arrival', async (p) => {
        if (p.getVariable('SUNRIDGE_ARRIVAL_PLAYED')) return;
        p.setVariable('SUNRIDGE_ARRIVAL_PLAYED', true);

        await p.showText(
          'The path from Everwick crests a final rise and the world opens. The trees fall away behind you. There is nothing ahead but stone and wind and sky.',
        );
        await p.showText(
          'The wind hits immediately — sharp, clean, carrying the scent of dry grass and sun-warmed rock. It pulls at your clothes and presses against your chest like a hand urging you forward.',
        );
        await p.showText(
          "The highland stretches in every direction. To the west, the ridge drops away into hazy valleys. To the north, the land softens and blurs where the mountains should be — the Frontier's edge, shimmering like a half-finished painting. The stone beneath your feet is warm.",
        );
        await p.showText(
          'You have never been this high. You have never seen this far. The Settled Lands look small from here — Everwick a cluster of rooftops, Heartfield a golden smear, Ambergrove a dark stain of canopy. The world is enormous and fragile and unfinished, and you are standing at the top of it.',
        );
      }),
    },
  ]);

  // --- Resonance Stones ---
  // Each stone holds a unique memory tied to this highland landscape.
  map.createDynamicEvent([
    {
      x: 144,
      y: 112,
      event: makeEvent('wind-shrine-stone', async (p) => {
        const v = getSunridgeVibrancy(p);
        if (v >= 67) {
          await p.showText(
            "The stone at the shrine's center blazes with energy. When you touch it, the wind stops — not silence, but listening. A voice rises from the stone, vast and joyful:",
          );
          await p.showText(
            '"Carry my words. Carry them to the valleys, the rivers, the places I will never walk. Tell them I was here. Tell them I chose to become the wind, and I have never once regretted it."',
          );
          await p.showText(
            'The voice fades. The wind returns — but softer now, almost tender. You feel as though something enormous just held you and let go.',
          );
        } else if (v <= 33) {
          await p.showText(
            'The stone trembles faintly. You press your hand against it and catch a fragment of something — a rush of speed, the ground falling away, a shout that might have been joy. Then nothing. The memory is too vast to hold. It slips through you like wind through open fingers.',
          );
        } else {
          await p.showText(
            "The stone vibrates with overwhelming energy. When you touch it, the world lurches — for an instant you are not standing on stone but flying, the ridge a ribbon below you, the sky close enough to taste. A voice speaks a single word in a language you don't know, and the word means freedom.",
          );
          await p.showText(
            'The sensation breaks. You are standing on the shrine floor, hand pressed to warm stone, heart hammering. Something immense sleeps here — something that chose to become the wind itself.',
          );
        }
      }),
    },
    {
      x: 560,
      y: 208,
      event: makeEvent('ridge-overlook-stone', async (p) => {
        await p.showText(
          'A flat stone set into the overlook ledge, polished smooth by centuries of wind. When you touch it, a memory unfolds like a landscape:',
        );
        await p.showText(
          'You see the world being made. Not all at once — piece by piece, like a painter filling in a canvas. First the rivers, drawn in silver. Then the forests, dabbed in dark green. The fields come next, gold and ochre, and finally the villages, tiny and warm, like embers scattered across the cloth.',
        );
        await p.showText(
          'The Dissolved are working. Hundreds of them, spread across the land, each one pouring memory into the soil. They are building the world from recollection — every stone placed because someone remembered what a stone should feel like, every tree grown because someone recalled the sound of wind in leaves.',
        );
        await p.showText(
          'The vision fades. You are left staring at the real horizon, where the world still thins and blurs at its edges. Unfinished. Waiting for someone to remember what comes next.',
        );
      }),
    },
    {
      x: 320,
      y: 304,
      event: makeEvent('waystation-hearthstone', async (p) => {
        const v = getSunridgeVibrancy(p);
        if (v >= 67) {
          await p.showText(
            'The hearthstone glows like a lantern. The memories inside tumble over one another — a century of travelers crowding around the fire, sharing warmth and stories:',
          );
          await p.showText(
            "A merchant describing cities that may or may not exist. A shepherd singing a lullaby to no one. Two strangers playing cards until dawn because neither wanted to sleep alone. A child asking Holt's mother, 'How far does the world go?' and the old woman answering, 'As far as anyone remembers.'",
          );
        } else if (v <= 33) {
          await p.showText(
            "The hearthstone beside the fire is barely warm. You catch the ghost of a memory — the murmur of voices, the clink of a cup being set down — but the details won't surface. Like trying to remember a dream an hour after waking.",
          );
        } else {
          await p.showText(
            'The hearthstone by the waystation fire pulses gently. A memory surfaces: a crowded room, wind howling outside, the fire crackling. A traveler is speaking — a woman with road dust on her boots and a voice like gravel over honey.',
          );
          await p.showText(
            '"I walked to the edge last week. The very edge, where the ground goes soft and the colors run. And you know what I saw? Nothing. Beautiful, terrible nothing. The world just... stops. But it stops gently, like it\'s waiting for someone to keep painting."',
          );
        }
      }),
    },
    {
      x: 480,
      y: 640,
      event: makeEvent('trail-marker-stone', async (p) => {
        await p.showText(
          'A weathered marker stone at a bend in the highland trail, half-sunk into the earth. The carving on its face has been worn smooth by decades of wind, but the memory inside is sharp:',
        );
        await p.showText(
          "A woman stands here with a chisel, cutting the first trail marker into raw stone. Below her, the highland is pathless — just grass and rock and sky stretching in every direction. She carves an arrow pointing north and whispers, 'Someone will follow this. Someone will want to see what's up there.'",
        );
        await p.showText(
          'She sets the chisel down, wipes dust from her eyes, and walks north without looking back. The stone remembers her footsteps — the first human feet to cross this ridge. It has been counting footsteps ever since.',
        );
      }),
    },
  ]);

  // --- Treasure Chests ---
  map.createDynamicEvent([
    {
      x: 144,
      y: 128,
      event: makeEvent('shrine-offering-chest', async (p) => {
        if (p.getVariable('CH_SR_01_OPENED')) {
          await p.showText(
            'The stone alcove stands open, its offering taken. Wind whistles through the empty hollow, carrying a faint hum — as if the shrine approves.',
          );
          return;
        }
        await p.showText(
          "Tucked into an alcove at the shrine's base, hidden behind a loose pillar stone, you find a small cache. Not hidden — placed. An offering left by someone who understood what sleeps here.",
        );
        await p.showText(
          'Inside: two Strength Seeds wrapped in dried highland grass, and a fragment of crystal that pulses with warmth when you hold it. The wind stirs as you take them, gentle as a nod.',
        );
        p.setVariable('CH_SR_01_OPENED', true);
      }),
    },
    {
      x: 400,
      y: 480,
      event: makeEvent('rockfall-cache', async (p) => {
        if (p.getVariable('CH_SR_02_OPENED')) {
          await p.showText(
            'The gap in the rockfall is empty now. A small lizard has claimed the hollow, basking on the sun-warmed stone where the cache once sat.',
          );
          return;
        }
        await p.showText(
          "A tumble of boulders along the eastern trail, one of them split by frost. In the gap between the halves, someone stashed a traveler's emergency kit — the kind of preparation that suggests hard-won experience with highland weather.",
        );
        await p.showText(
          "Three smoke bombs wrapped in oilcloth, still dry despite the seasons. A handful of gold coins in a leather pouch, stamped with a mountain sigil you don't recognize. Whoever left this expected to come back for it. They never did.",
        );
        p.setVariable('CH_SR_02_OPENED', true);
      }),
    },
  ]);

  // --- Landmarks ---
  map.createDynamicEvent([
    {
      x: 128,
      y: 96,
      event: makeEvent('wind-shrine-altar', async (p) => {
        await p.showText(
          'The Wind Shrine. Stone pillars frame a flat altar on the highest point of the ridge, worn smooth by ages of weather. The wind howls through gaps in the stonework, creating a sound that is almost musical — a low chord that shifts and breathes with each gust.',
        );
        await p.showText(
          'The altar is carved with spirals that trace the movement of air currents. Whoever built this was not worshipping the wind. They were speaking to it. The spirals are a language — a way of shaping breath into meaning.',
        );
        await p.showText(
          'Something vast and patient sleeps beneath this stone. You can feel it in the vibration under your feet, in the way the wind wraps around you without pushing — not force, but presence. Like standing in the palm of a hand that chose to hold still.',
        );
      }),
    },
    {
      x: 576,
      y: 192,
      event: makeEvent('ridge-overlook', async (p) => {
        const v = getSunridgeVibrancy(p);
        if (v >= 67) {
          await p.showText(
            "The view from the overlook takes your breath. The world stretches below in vivid color — Heartfield's wheat blazing gold, Ambergrove's canopy deep and rich as emerald, Millbrook's river catching the sun like a ribbon of white fire.",
          );
          await p.showText(
            'And beyond the Settled Lands, north and east, the Frontier shimmers with possibility. The land there is half-drawn — mountains suggested rather than defined, rivers that begin confidently and trail off into mist. But today, even the unfinished edges glow.',
          );
        } else if (v <= 33) {
          await p.showText(
            'The overlook provides a long view in every direction, but the colors are muted. Heartfield is a grey-gold smudge. Ambergrove is dark and indistinct. The Frontier, to the north, is barely visible — a pale shimmer where land and sky blur into the same washed-out haze.',
          );
          await p.showText(
            'The world looks tired from up here. Faded. Like a painting left too long in the sun.',
          );
        } else {
          await p.showText(
            "You stand at the edge of the overlook and the world opens below. You can see Everwick's rooftops to the south, smoke rising from Hark's forge. Heartfield's fields stretch beyond, golden and wide. Ambergrove is a dark wall of green to the east, and if you squint, you can catch the glint of Millbrook's river far to the west.",
          );
          await p.showText(
            'To the north, the land softens. The mountains should be sharper, the valleys deeper, but everything past the ridge fades into a luminous haze — the Frontier, where the world is still being remembered into existence. From here you can see how thin the boundary is between what exists and what might.',
          );
        }
      }),
    },
    {
      x: 288,
      y: 320,
      event: makeEvent('waystation-hearth', async (p) => {
        const v = getSunridgeVibrancy(p);
        if (v >= 67) {
          await p.showText(
            'The waystation hearth crackles with a fire that seems brighter than it should be — the flames throw dancing shadows that look almost like shapes, almost like people. Holt keeps it fed day and night, and the warmth reaches further than the walls should allow.',
          );
          await p.showText(
            'You sit by the fire. The wind outside howls against the stone, but in here the air is still and warm and smells of pine resin and old tea. Your body unknots. Your thoughts slow. For a moment, you are just a traveler resting by a fire, and that is enough.',
          );
        } else {
          await p.showText(
            "The waystation hearth. A simple stone ring with a banked fire, sheltered by a low wall from the worst of the wind. Holt keeps a blackened kettle hung over the coals and a stack of dried peat within arm's reach.",
          );
          await p.showText(
            'You rest by the fire. The warmth seeps into your hands, your feet, the tight muscles in your shoulders. The kettle hisses softly. Outside, the wind scrapes across the ridge like a bow across strings. In here, for a few minutes, the world is small and warm and safe.',
          );
        }
      }),
    },
    {
      x: 512,
      y: 208,
      event: makeEvent('preserver-outpost', async (p) => {
        if (p.getVariable('MQ_04_COMPLETED')) {
          await p.showText(
            'The Preserver Outpost. A watchtower encased in blue-white crystal, three stories tall, perfectly preserved — every stone, every mortar line, every iron bracket frozen in absolute stasis. Cracks have begun to web through the crystal surface, thin lines of warmth where the world is trying to breathe again.',
          );
        } else {
          await p.showText(
            "A watchtower stands at the ridge's eastern edge, its stone coated in blue-white crystal identical to the Stagnation Clearing in Heartfield — but immeasurably larger. The crystal covers everything: walls, windows, the iron brackets that once held shutters. A full tower, frozen in time.",
          );
          await p.showText(
            'The crystal zone extends three paces in every direction around the base. The grass within it stands perfectly upright. Nothing moves. Nothing grows. Nothing decays. The tower will look exactly like this in a thousand years.',
          );
          await p.showText(
            'Beautiful. And terrible. And the scout standing at the perimeter does not seem to notice the difference.',
          );
        }
      }),
    },
    {
      x: 288,
      y: 32,
      event: makeEvent('the-threshold', async (p) => {
        if (p.getVariable('MQ_04_COMPLETED')) {
          await p.showText(
            'The Threshold. The grass becomes shorter here, the colors softer, the shapes less certain. The mountain pass stretches north into shimmering air — the border between the Settled Lands and the Frontier.',
          );
          await p.showText(
            "The path is open now. Beyond it, the world thins and blurs, half-remembered and half-imagined. The wind carries a different scent from the north — something raw and electric, like the smell before a storm that hasn't decided what kind of storm it wants to be.",
          );
        } else {
          await p.showText(
            "The grass becomes shorter here. The colors soften. Shapes blur at their edges, as if the world itself is losing confidence in what it's trying to be.",
          );
          await p.showText(
            'The mountain pass leads north, but something prevents you from continuing — not a wall, not a gate, but a thinning. The ground becomes uncertain under your feet, soft as clay, as if no one has remembered it firmly enough to walk on. The Frontier begins where conviction ends.',
          );
          await p.showText(
            'Not yet. The path will hold when the world is ready for you to walk it.',
          );
        }
      }),
    },
  ]);

  // --- Zone transitions ---
  // Coordinates in pixels (tile position * 16). Sunridge is 80x80 tiles = 1280x1280px.
  map.createDynamicEvent([
    {
      x: 640,
      y: 1248,
      event: makeEvent('south-to-everwick', (p) => {
        p.changeMap('everwick', { x: 448, y: 48 });
      }),
    },
    {
      x: 624,
      y: 1248,
      event: makeEvent('south-to-everwick-b', (p) => {
        p.changeMap('everwick', { x: 448, y: 48 });
      }),
    },
    {
      x: 624,
      y: 320,
      event: makeEvent('east-to-ambergrove', (p) => {
        p.changeMap('ambergrove', { x: 0, y: 320 });
      }),
    },
  ]);

  // North -> Hollow Ridge (conditional on MQ-04 completion)
  if (_player.getVariable('MQ_04_COMPLETED')) {
    map.createDynamicEvent([
      {
        x: 288,
        y: 0,
        event: makeEvent('north-to-hollow-ridge', (p) => {
          p.changeMap('hollow-ridge', { x: 400, y: 784 });
        }),
      },
    ]);
  } else {
    // The pass exists but cannot be traversed — handled by the-threshold landmark
  }

  // --- Enemy Zones ---
  // Encounter zones defined in systems/encounters.ts (SUNRIDGE_ZONES).
  // Random encounters triggered via player.ts onInput hook -> checkEncounter().
  //
  // Highland Grass: bounds=(80,160) to (400,560), rate=5%  — Highland Hawks
  // Rocky Outcrops: bounds=(400,80) to (608,400), rate=6%  — Crag Golems
  // Outpost Perimeter: bounds=(432,160) to (560,288), rate=4% — Preserver Scouts (MQ-04+)
}
