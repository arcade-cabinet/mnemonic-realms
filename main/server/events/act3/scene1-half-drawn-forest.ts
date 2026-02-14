import {
  EventData,
  MapData,
  RpgCommonPlayer,
  RpgEvent,
  RpgMap,
  type RpgPlayer,
  RpgScene,
} from '@rpgjs/server';

@EventData({
  name: 'act3-scene1-half-drawn-forest',
  hitbox: { width: 32, height: 32 },
})
export default class HalfDrawnForestEvent extends RpgEvent {
  onInit() {
    this.set({
      name: 'Half-Drawn Forest Scene Event',
      // This event is primarily for scene setup, not a visible in-game object
      graphic: '',
      // The event is triggered by map-enter, so it doesn't need a physical presence
      // However, we can place it at (0,0) or any arbitrary point if needed for internal logic
      // For map-enter, the position doesn't strictly matter for the trigger itself.
      // We'll use a specific trigger condition in onChanges or onPlayerTouch.
    });
  }

  async onPlayerTouch(player: RpgPlayer) {
    // This event is primarily for map-enter, but a touch trigger can be a fallback
    // or for specific points within the map.
    // For 'map-enter', we typically use onChanges with a check for first entry.
  }

  async onChanges(player: RpgPlayer) {
    // Check if the player has just entered this map and the scene hasn't been triggered yet
    if (
      player.map.id === 'half-drawn-forest' &&
      !player.getVariable('HALF_DRAWN_FOREST_SCENE_TRIGGERED')
    ) {
      player.setVariable('HALF_DRAWN_FOREST_SCENE_TRIGGERED', true);

      // 1. Play ambient music (as per narrative context)
      // Assuming a music box theme for Half-Drawn Forest
      player.changeMusic('half-drawn-forest-theme', 0.8, 1000); // Adjust volume and fade duration

      // 2. Spawn NPCs
      // Lira at (15, 10)
      const lira = await player.map.createDynamicEvent({
        x: 15,
        y: 10,
        event: 'npc_lira', // Assuming 'npc_lira' is a defined RpgEvent class for Lira
        properties: {
          graphic: 'npc_lira', // Graphic for Lira
          direction: 2, // Facing down
          name: 'Lira',
        },
      });

      // Callum at (16, 10)
      const callum = await player.map.createDynamicEvent({
        x: 16,
        y: 10,
        event: 'npc_callum', // Assuming 'npc_callum' is a defined RpgEvent class for Callum
        properties: {
          graphic: 'npc_callum', // Graphic for Callum
          direction: 2, // Facing down
          name: 'Callum',
        },
      });

      // 3. Play dialogue sequences
      await player.showText(
        "It's... incomplete. Like someone started drawing a forest and walked away.",
        { speaker: 'Lira' },
      );
      await player.showText(
        'Not walked away. Chose not to finish. The Dissolved who planned this forest dissolved while the work was still in progress. They trusted that future generations would complete it in their own way.',
        { speaker: 'Callum' },
      );

      // Player takes another step (simulated by a brief pause or movement)
      await player.moveRoutes([
        { x: player.position.x + 1, y: player.position.y, time: 500 }, // Move one tile forward
      ]);
      // Visual effect for tree shimmering could be a temporary map change or particle effect
      // For now, we'll just continue dialogue.

      await player.showText(
        "The world wants to be finished. It's reaching toward detail and just... can't quite hold it.",
        { speaker: 'Lira' },
      );
      await player.showText(
        "That's where you come in. Broadcasting here is different than in the Frontier. When you push a memory into the Sketch, you're not just raising vibrancy — you're painting reality into existence. The fragment becomes the terrain.",
        { speaker: 'Callum' },
      );

      // 4. Fire effects (GUI, system message)
      await player.gui('sketch-solidification-tutorial').open();
      await player.showText('Sketch Solidification: broadcast fragments to create solid terrain.', {
        isSystem: true,
      });

      await player.showText(
        "The Curator's path. They're crystallizing a route through the Sketch — freezing it into solidity instead of remembering it. The crystal road leads toward the Fortress.",
        { speaker: 'Lira' },
      );
      await player.showText(
        "We can follow their path and fight through their patrols. Or we can make our own path — it costs fragments, but it's ours.",
        { speaker: 'Callum' },
      );

      // 5. Update quest state
      // Assuming MQ-08 is the Main Quest for Act 3, and obj 0 is the first objective
      player.addQuestProgress('MQ-08', 0); // Advance objective 0 of MQ-08

      // Remove NPCs after initial dialogue if they are not meant to stay
      // Or set them to patrol/static if they have further interactions
      // For this scene, let's assume they stay for further interactions
      // and their individual event scripts will handle subsequent dialogue.
    }
  }
}

// Define the NPC event classes if they don't exist elsewhere
// These are minimal examples, actual NPCs would have more complex logic
@EventData({
  name: 'npc_lira',
  graphic: 'npc_lira',
  hitbox: { width: 32, height: 32 },
})
export class NpcLira extends RpgEvent {
  async onAction(player: RpgPlayer) {
    await player.showText('Hello, I am Lira. We are in the Half-Drawn Forest.');
    // Further dialogue specific to Lira in this map
  }
}

@EventData({
  name: 'npc_callum',
  graphic: 'npc_callum',
  hitbox: { width: 32, height: 32 },
})
export class NpcCallum extends RpgEvent {
  async onAction(player: RpgPlayer) {
    await player.showText('Greetings. This place is a testament to unfinished intentions.');
    // Further dialogue specific to Callum in this map
  }
}
