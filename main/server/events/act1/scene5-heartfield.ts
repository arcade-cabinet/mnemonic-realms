import {
  EventData,
  MapData,
  RpgCommonPlayer,
  RpgEvent,
  type RpgMap,
  type RpgPlayer,
  RpgScene,
} from '@rpgjs/server';
import { addItem } from '../../systems/inventory';

@EventData({
  id: 'act1-scene5-heartfield',
  name: 'Heartfield - The Open World',
  map: 'heartfield',
  // This event is primarily triggered on map enter, but also manages dynamic elements.
  // The 'onInit' hook is suitable for initial setup and conditions.
})
export class HeartfieldSceneEvent extends RpgEvent {
  onInit() {
    this.set({
      name: 'HeartfieldSceneEvent',
      // No graphic for a scene manager event
      width: 1,
      height: 1,
      // This event is invisible and acts as a scene manager
      graphic: '',
    });
  }

  async onChanges(player: RpgPlayer) {
    // Trigger condition: map-enter, map: heartfield, condition: first-visit
    // We use a quest state (MQ-03) to track the "first-visit" to Heartfield.
    // This event will run on every map change, so we need to ensure the dialogue
    // and initial effects only trigger once.

    const hasVisitedHeartfield = player.getVariable('MQ-03_activated');

    if (player.map.id === 'heartfield' && !hasVisitedHeartfield) {
      // Mark Heartfield as visited for MQ-03
      player.setVariable('MQ-03_activated', true);

      // 1. Play dialogue sequences
      await player.showText(
        "Hana: The Settled Lands. Everything south, east, and west of the village for a day's walk. It's well-remembered territory — people have been living here for generations.",
      );
      await player.showText(
        'Hana: But look at the edges. See how the fence line over there just... stops? Like someone forgot to finish it?',
      );

      // Brief camera pan to eastern edge (simulated, as direct camera control isn't in RpgPlayer yet)
      // In a real game, this would involve player.camera.panTo(x, y, duration) or similar.
      // For now, we'll just add a small delay to imply a visual shift.
      await player.sleep(1000); // Simulate camera pan duration

      await player.showText(
        "Hana: The world's young. It's still being built. Most people don't think about it — they're used to things appearing when they need them. But we see the seams.",
      );

      // 2. Fire effects
      player.sendActorToPlayer(player.id, {
        systemMessage: {
          text: "You've entered the Settled Lands.",
          type: 'info',
        },
      });

      // 3. Update quest state
      player.updateQuest('MQ-03', 'activate');
    }
  }

  // This method will be called by the map to set up dynamic events
  // It's not directly an RpgEvent hook, but a helper function called by the map's onInit
  static async setupDynamicEvents(map: RpgMap) {
    // Spawns Hana at an appropriate position
    // Hana is already with the player, so we don't need to spawn her as a separate NPC here.
    // Her dialogue is handled in onChanges.

    // Heartfield Hamlet NPCs (procedural farmers) - these would be defined as separate RpgEvents
    // For this scene event, we'll just define the Hana interaction and the Windmill.

    // Old Windmill Dissolved Memory Deposit (30, 8)
    map.createDynamicEvent({
      x: 30,
      y: 8,
      name: 'EV-HF-WindmillMemory',
      graphic: '',
      hitbox: { width: 16, height: 16 },
      async onAction(player: RpgPlayer) {
        if (!player.get<boolean>('EV-HF-WindmillMemory_collected')) {
          await player.showText(
            "Hana: This windmill's been abandoned for years. But look — there's memory here. Dense memory, from something old.",
          );
          await player.showText(
            'You found a Dissolved memory deposit. These contain memories from civilizations that chose to dissolve into the land.',
          );

          // Simulate a brief vision
          await player.sleep(2000); // Vision plays

          addItem(player, 'fragment_calm_earth_2star', 1); // Add fragment
          player.sendActorToPlayer(player.id, {
            systemMessage: {
              text: 'Received: Calm/Earth/2★ Fragment',
              type: 'success',
            },
          });
          player.setVariable('EV-HF-WindmillMemory_collected', true);
          // Optionally change graphic to a 'depleted' state
          (this as RpgEvent).setGraphic('memory_deposit_depleted');
        } else {
          await player.showText('This stone has no more memories to share.');
        }
      },
    });

    // Old Windmill Chest (32, 9) - CH-HF-01 from reference, but content is Windmill Blade
    // The reference has CH-HF-01 at (32,9) with Antidote x3, and Windmill Blade is mentioned as loot.
    // We'll create a separate chest for the Windmill Blade as per the narrative.
    map.createDynamicEvent({
      x: 32,
      y: 9,
      name: 'EV-HF-WindmillBladeChest',
      graphic: '',
      hitbox: { width: 16, height: 16 },
      async onAction(player: RpgPlayer) {
        if (!player.get<boolean>('EV-HF-WindmillBladeChest_opened')) {
          if (player.getVariable('PLAYER_CLASS_ID') === 'rogue') {
            // Check if player is Rogue
            addItem(player, 'W-DG-03', 1); // Windmill Blade
            player.sendActorToPlayer(player.id, {
              systemMessage: {
                text: 'Received: Windmill Blade (Rogue-only)',
                type: 'success',
              },
            });
          } else {
            player.sendActorToPlayer(player.id, {
              systemMessage: {
                text: "You found a chest, but the item inside seems to be attuned to a Rogue's touch...",
                type: 'info',
              },
            });
          }
          player.setVariable('EV-HF-WindmillBladeChest_opened', true);
          (this as RpgEvent).setGraphic('chest_open');
        } else {
          await player.showText('This chest is empty.');
        }
      },
    });

    // Example of a generic Heartfield Farmer NPC (15, 15)
    map.createDynamicEvent({
      x: 15,
      y: 15,
      name: 'EV-HF-Farmer1',
      graphic: 'npc_farmer_m1', // Assuming a graphic for farmers
      hitbox: { width: 16, height: 16 },
      async onAction(player: RpgPlayer) {
        await player.showText(
          "Farmer: The wheat's coming in well this season. Sometimes I swear it grows faster when we're happy about the harvest. Silly, right?",
        );
      },
    });

    // Example of a Farmer's Child NPC (17, 17)
    map.createDynamicEvent({
      x: 17,
      y: 17,
      name: 'EV-HF-Child1',
      graphic: 'npc_child_f1', // Assuming a graphic for children
      hitbox: { width: 16, height: 16 },
      async onAction(player: RpgPlayer) {
        await player.showText(
          'Child: I found a pretty stone by the water yesterday! It was humming. Do all stones hum?',
        );
      },
    });

    // Example of a Traveling Merchant NPC (20, 10)
    map.createDynamicEvent({
      x: 20,
      y: 10,
      name: 'EV-HF-Merchant1',
      graphic: 'npc_merchant_m1', // Assuming a graphic for merchants
      hitbox: { width: 16, height: 16 },
      async onAction(player: RpgPlayer) {
        await player.showText(
          "Merchant: Seeds, tools, and the odd potion. I walk the Settled Lands — Heartfield, Ambergrove, Millbrook. You'll see me around.",
        );
        // TODO: shop system wiring pending
      },
    });

    // Random Encounters: These are typically handled by the map's `onPlayerTouch` or a parallel event
    // checking player position, rather than explicit dynamic events for each encounter.
    // For example, a parallel event could check if player is in tall grass and roll for encounter.
  }
}

// Export the setup function as default for the map to use
export default async function setup(map: RpgMap) {
  // Create the scene event instance
  const sceneEvent = map.createEvent(HeartfieldSceneEvent);

  // Call the static method to set up dynamic events
  await HeartfieldSceneEvent.setupDynamicEvents(map);

  return sceneEvent;
}
