import { EventData, RpgEvent, type RpgPlayer } from '@rpgjs/server';
import { completeQuest, isQuestComplete, startQuest } from '../../systems/quests';

// Placeholder dialogue content for NPCs
const DLG_CALLUM_SKETCH_ENTRY = [
  "Artun: The air... it's different here. Like a breath held for too long.",
  "Artun: This is it, then. The edge of what is, and what isn't yet.",
  'Artun: Are you ready, [player_name]? The Sketch awaits.',
];

const DLG_LIRA_SKETCH_ENTRY = [
  "Hana: Incredible. The world... it's a canvas, waiting for its final strokes.",
  'Hana: Every line, every shade... it tells a story of what could be.',
  'Hana: We must be careful. This place is fragile, yet full of potential.',
];

@EventData({
  name: 'act2-scene18-into-sketch',
  // The hitbox should cover the transition tile on the 'frontier-edge' map
  hitbox: {
    width: 32,
    height: 32,
  },
})
export class Act2Scene18IntoSketch extends RpgEvent {
  onInit() {
    // This event should only be visible/interactive when MQ-07 is completed
    // and it hasn't been triggered before.
    this.onChanges(({ player }) => {
      if (isQuestComplete(player, 'MQ-07') && !player.getVariable('act2_scene18_triggered')) {
        this.show(); // Make the event visible/interactive
      } else {
        this.hide(); // Hide it otherwise
      }
    });
  }

  async onPlayerTouch(player: RpgPlayer) {
    // Ensure the quest condition is met and the event hasn't been triggered
    if (!isQuestComplete(player, 'MQ-07') || player.getVariable('act2_scene18_triggered')) {
      return;
    }

    // Mark the event as triggered to prevent re-execution
    player.setVariable('act2_scene18_triggered', true);

    // 1. Transition to the Sketch map
    // Assuming 'half-drawn-forest' is the entry map to the Sketch,
    // and player lands at (20, 20) on this new map.
    await player.changeMap('half-drawn-forest', { x: 20, y: 20 });

    // 2. Apply visual and audio effects
    // TODO: screenEffect not available in RPG-JS 4.3.0
    // TODO: changeMusic not available in RPG-JS 4.3.0
    await player.showText("You've entered the Sketch — the world's unfinished edge.");

    // 3. Spawn NPCs at appropriate positions on the new map
    // NPCs are created as dynamic events on the player's current map ('half-drawn-forest')
    const _artun = await player.createDynamicEvent(RpgEvent, {
      eventId: 'callum_sketch_entry_npc', // Unique ID for the dynamic NPC event
      x: 18, // Position relative to player's landing spot
      y: 20,
      graphic: 'npc_artun',
      name: 'Artun',
    });

    const _hana = await player.createDynamicEvent(RpgEvent, {
      eventId: 'lira_sketch_entry_npc', // Unique ID for the dynamic NPC event
      x: 22, // Position relative to player's landing spot
      y: 20,
      graphic: 'npc_hana',
      name: 'Hana',
    });

    // 4. Play dialogue sequences
    await player.showText(DLG_CALLUM_SKETCH_ENTRY);
    await player.showText(DLG_LIRA_SKETCH_ENTRY);

    // 5. Update quest state
    completeQuest(player, 'MQ-07'); // Explicitly mark as completed
    startQuest(player, 'MQ-08'); // Activate the next main quest

    // Optional: If NPCs are temporary for this scene, remove them after dialogue.
    // If they are meant to persist for further interaction, keep them.
    // For a major scene transition, they might persist.
    // If removal is desired:
    // callum.remove();
    // lira.remove();
  }
}

// Export the setup function to register the event with RPG-JS
export default function setup() {
  return Act2Scene18IntoSketch;
}
