import { EventData, RpgEvent, type RpgMap, type RpgPlayer } from '@rpgjs/server';
import { startQuest, advanceObjective } from '../../systems/quests';

@EventData({
  id: 'act2-scene2-ridgewalker-camp',
  name: 'Ridgewalker Camp Scene',
  hitbox: { width: 1, height: 1 },
})
export class RidgewalkerCampEvent extends RpgEvent {
  onInit() {
    this.set({
      name: 'Ridgewalker Camp Scene Trigger',
      // This event is invisible, it's just a trigger
      graphic: '',
      width: 1,
      height: 1,
      // Position is set by the map trigger, not the event itself
      // This event will be dynamically created at (15, 25)
    });
  }

  async onPlayerTouch(player: RpgPlayer) {
    // Check if the player is on the 'hollow-ridge' map at (15, 25)
    // and if this is their first visit to this specific trigger point.
    // The 'first-visit' condition is managed by a player flag.
    if (
      player.map.id === 'hollow-ridge' &&
      player.pos.x === 15 &&
      player.pos.y === 25 &&
      !player.getVariable('ACT2_SCENE2_RIDGEWALKER_CAMP_VISITED')
    ) {
      player.setVariable('ACT2_SCENE2_RIDGEWALKER_CAMP_VISITED', true);

      // 1. Artun's Letter - Hollow Ridge
      await player.showText(
        'Artun (reading): "Hollow Ridge. A chain of steep, wind-carved ridges rising above the mist. I\'m told the peaks here are jagged and unfinished — some mountains end abruptly in flat shimmer, as if the world\'s sculptor simply stopped mid-carve. The Peregrine Road — a civilization of eternal travelers — left their mark here. Their dormant god, a prototype of motion itself, sleeps at the highest spire. And the Preservers have crystallized part of the mountain pass, trying to lock down even the wind."',
      );
      await player.showText(
        "Artun: That last part worries me. If the Preservers are freezing terrain this far from the Settled Lands, they're more organized than I thought.",
      );

      // 2. Spawn NPCs
      // Artun will be near the player for the letter, then move to a camp spot.
      // Nel will approach.
      // Other Ridgewalker NPCs are ambient and can be placed as static events on the map.

      // Create Artun (if not already present as a static map event)
      // For this scene, Artun is assumed to be with the player, then moves to a camp spot.
      // If Artun is a persistent NPC, he might be a static event on the map, and we just move him.
      // For dynamic placement:
      const artun = await player.map.createDynamicEvent({
        x: 17,
        y: 24,
        graphic: 'npc_artun',
        name: 'Artun',
        speed: 1,
        direction: 0,
        event: {
          onAction(player: RpgPlayer) {
            player.showText('Artun: We need to find those gods, and fast.');
          },
        },
      });

      // Create Nel
      const nel = await player.map.createDynamicEvent({
        x: 14,
        y: 24, // Nel's initial position
        graphic: 'npc_nel',
        name: 'Nel',
        speed: 1,
        direction: 0,
        event: {
          onAction(player: RpgPlayer) {
            player.showText('Nel: Welcome to Ridgewalker Camp. Rest here whenever you need to.');
          },
        },
      });

      // Create Ridgewalker Merchant
      const merchant = await player.map.createDynamicEvent({
        x: 15,
        y: 26,
        graphic: 'npc_merchant_m2',
        name: 'Ridgewalker Merchant',
        speed: 0,
        direction: 0,
        event: {
          async onAction(player: RpgPlayer) {
            await player.showText('Merchant: Got some good gear for the Frontier. Take a look.');
            // Example: Open a shop GUI
            // player.gui('shop').open({ shopId: 'frontier_tier_shop' });
          },
        },
      });

      // Create Ridgewalker Scout Dain for side quest
      const dain = await player.map.createDynamicEvent({
        x: 12,
        y: 26,
        graphic: 'npc_ridgewalker_scout', // Assuming a generic scout graphic
        name: 'Ridgewalker Scout Dain',
        speed: 0,
        direction: 0,
        event: {
          async onAction(player: RpgPlayer) {
            if (!player.hasQuest('SQ-07')) {
              await player.showText(
                "Ridgewalker Scout Dain: I've been mapping the ridgeline trails, but the Preservers destroyed my survey markers. If you find any intact markers while you're exploring, I'd pay well for the data. Last I placed them: one near the Echo Caverns, one above the Shattered Pass, and one at the base of the Spire.",
              );
              // Trigger side quest
              startQuest(player, 'SQ-07');
              player.showText("Quest Accepted: Dain's Markers");
            } else {
              player.showText('Ridgewalker Scout Dain: Any luck with those markers?');
            }
          },
        },
      });

      // Nel approaches and dialogue
      await nel.moveRoutes([
        { x: player.pos.x, y: player.pos.y - 1, time: 500 }, // Move towards player
      ]);
      await player.showText(
        "Nel: You came through the new pass? We saw it form yesterday morning — first new land we've seen in months. Most of the growth has slowed since the Preservers started expanding.",
      );
      await player.showText(
        "Nel: I'm Nel. I lead the Ridgewalkers — or at least I try to. We're explorers, not soldiers. But the Preservers are making soldiers necessary.",
      );

      // Nel gestures towards Kinesis Spire
      // This would be a visual effect or camera pan in a full game, here it's dialogue.
      await player.showText(
        "Nel (gesturing northeast): See that spire? It's been vibrating for centuries. The Peregrine Road built it — or grew it, more like. Something sleeps inside. Something powerful. We've tried to approach it, but the ground shakes too violently. Knocked us back every time.",
      );

      await player.showText(
        "Artun: A dormant god. I've read about them — prototypes left by the Dissolved civilizations. There are four in the Frontier. Resonance, Verdance, Luminos, and Kinesis.",
      );
      await player.showText('Nel: Four? We only knew about the Spire. Where are the others?');

      // 3. Reveal dormant god locations
      await player.showText(
        'Artun: Shimmer Marsh to the south — a half-formed tree trunk pulsing with green light. Flickerveil to the east — a column of pure light in a forest clearing. And Resonance Fields to the west — an amphitheater of singing stones.',
      );

      // 4. Fire effects
      await player.showText(
        "Nel: The Preservers have agents near all of those. They've been trying to keep people away from the shrines. Now I know why.",
      );
      player.sendNotification('All four dormant god locations revealed.', { type: 'success' }); // System message effect

      await player.showText(
        'Artun (to player): If you can recall even one of those gods — channel the right memories into the shrine — the surge of energy would change everything. Stronger fragments, higher vibrancy, maybe enough power to break Hana free.',
      );
      await player.showText(
        "Nel: Then you should move fast. The Preservers are reinforcing their positions every day. There's a crystallized pass northeast of here — the Shattered Pass — that blocks the route to the Sketch beyond. And their cathedral in the western plains is a fortress.",
      );
      await player.showText(
        "Nel: We can't help you fight the Preservers directly. But we can keep this camp safe and supplied. Rest here whenever you need to. My people will share what they know.",
      );

      // 5. Update quest state
      // Advance Main Quest MQ-05 to objective 2 (Learn about dormant gods)
      advanceObjective(player, 'MQ-05');

      // Set a flag to indicate this scene has been completed, so it doesn't re-trigger
      player.setVariable('ACT2_SCENE2_RIDGEWALKER_CAMP_COMPLETED', true);
    }
  }
}

export default async function setup(map: RpgMap) {
  // Dynamically create the trigger event at the specified position
  map.createDynamicEvent({
    x: 15,
    y: 25,
    event: RidgewalkerCampEvent,
    name: 'Ridgewalker Camp Entry Trigger',
  });

  // Place other static NPCs that are always present in the camp
  // These are separate from the main scene trigger but part of the camp.
  // They would typically be defined as static events in the Tiled map.
  // For demonstration, adding one more dynamic NPC here.
  map.createDynamicEvent({
    x: 12,
    y: 22,
    graphic: 'npc_ridgewalker_elder', // Assuming an elder graphic
    name: 'Ridgewalker Elder',
    speed: 0,
    direction: 0,
    event: {
      onAction(player: RpgPlayer) {
        player.showText(
          'Elder: The Frontier is a harsh mistress, but she has her own kind of beauty.',
        );
      },
    },
  });

  // Add a rest point event
  map.createDynamicEvent({
    x: 13,
    y: 22, // Near the campfire
    graphic: '', // Invisible event
    name: 'Campfire Rest Point',
    event: {
      async onAction(player: RpgPlayer) {
        await player.showText(
          'You rest by the crackling campfire. Your wounds mend, and your spirit is renewed.',
        );
        player.hp = player.param.maxHp;
        player.sp = player.param.maxSp;
        player.sendNotification('You are fully rested!', { type: 'info' });
      },
    },
  });
}
