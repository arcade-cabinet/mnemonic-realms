import {
  EventData,
  MapData,
  RpgEvent,
  type RpgMap,
  type RpgPlayer,
  RpgSceneMap,
} from '@rpgjs/server';

@EventData({
  id: 'act2-scene5-weight-of-choice',
  name: 'The Weight of Choice',
  map: 'resonance-fields',
  // This event is triggered automatically when the map loads,
  // but only if the 'first-recall-complete' condition is met.
  // The actual trigger condition check will be inside onInit.
})
export class TheWeightOfChoiceEvent extends RpgEvent {
  onInit() {
    this.set({
      name: 'The Weight of Choice',
      // No graphic for the event itself, as it's a scene trigger
      // The NPCs will have their own graphics
      hitbox: {
        width: 32,
        height: 32,
      },
    });
  }

  async onChanges(player: RpgPlayer) {
    // Check if the scene has already been played for this player
    if (player.getVariable('ACT2_SCENE5_COMPLETE')) {
      this.removeEvent(); // Remove the event if already completed
      return;
    }

    // Check if the player is on the 'resonance-fields' map
    // and if the 'first-recall-complete' flag is set.
    // This flag would typically be set after the GQ-01 quest is completed.
    if (player.map.id === 'resonance-fields' && player.getVariable('GQ_01_COMPLETE')) {
      // Ensure the scene only plays once
      if (!player.getVariable('ACT2_SCENE5_TRIGGERED')) {
        player.setVariable('ACT2_SCENE5_TRIGGERED', true);
        await this.triggerScene(player);
      }
    }
  }

  private async triggerScene(player: RpgPlayer) {
    // 1. Spawn NPCs
    // Callum at the amphitheater's edge, looking out.
    // Based on the event placement table, a good spot near the amphitheater
    // could be (25, 20) or similar, relative to the recall vision (25,25).
    // Let's place him at (25, 20) looking south.
    const callum = await player.map.createDynamicEvent({
      x: 25,
      y: 20,
      event: 'npc_callum', // Assuming 'npc_callum' is a registered NPC event class
      direction: 2, // Facing down/south
      name: 'Callum',
    });

    // Ensure Callum is visible
    callum.setGraphic('npc_callum'); // Set the graphic for Callum

    // 2. Play dialogue sequences
    await player.showText(
      "I've spent my life reading about the Dissolved. Their civilizations, their choices, their gods. But reading about a god is nothing like watching one wake up.",
      {
        speaker: 'Callum',
        fullText: true,
      },
    );
    await player.showText(
      "You gave Resonance a form it can never change. That's not a small thing. The Choir dissolved because their song grew too complex to hold — and you just decided what the song becomes.",
      {
        speaker: 'Callum',
        fullText: true,
      },
    );
    await player.showText('Beat.', {
      fullText: true,
      delay: 1000, // A short pause for the "Beat"
    });
    await player.showText(
      'Three more gods sleep in the Frontier. Verdance in the marsh, Luminos in the forest, Kinesis on the spire. Each one is an unfinished prototype waiting for someone to complete it.',
      {
        speaker: 'Callum',
        fullText: true,
      },
    );
    await player.showText(
      "The Preservers know about them. They've been trying to keep people away from the shrines — not because they want the gods to stay dormant, but because they're afraid of what happens when someone like you starts making permanent choices.",
      {
        speaker: 'Callum',
        fullText: true,
      },
    );
    await player.showText(
      "I understand their fear. What you just did can't be undone. And the next three choices will be just as permanent.",
      {
        speaker: 'Callum',
        fullText: true,
      },
    );

    // Callum turns to the player
    await callum.changeDirection(4); // Assuming 4 is facing towards the player (e.g., left if player is right)
    await player.showText(
      "But I also know this: a world that can't change is a world that can't grow. And a god that stays dormant helps no one.",
      {
        speaker: 'Callum',
        fullText: true,
      },
    );
    await player.showText(
      "Let's keep moving. The other shrines are waiting. And Lira... Lira is still frozen.",
      {
        speaker: 'Callum',
        fullText: true,
      },
    );

    // 3. Fire effects (None specified beyond narrative)
    // No combat, GUI, screen effects, or music changes specified for this scene.

    // 4. Update quest state
    // Set a variable to indicate this scene has been completed,
    // preventing it from re-triggering.
    player.setVariable('ACT2_SCENE5_COMPLETE', true);

    // Remove Callum after the dialogue
    await callum.removeEvent();
    this.removeEvent(); // Remove the scene trigger event itself
  }
}

// You would also need to define the 'npc_callum' event if it's not already defined elsewhere.
// For this example, we'll assume it's a simple placeholder.
@EventData({
  id: 'npc_callum',
  name: 'Callum',
  graphic: 'npc_callum', // Ensure this graphic exists
})
export class NpcCallum extends RpgEvent {
  onInit() {
    this.setGraphic('npc_callum');
  }
  // Callum doesn't have interactive dialogue here, he's part of the cutscene.
  // If he were to have post-cutscene dialogue, it would go here.
}

// Export the setup function as default
export default async function onReady(map: RpgMap) {
  // This function is called when the map is ready.
  // We don't need to manually create the event here,
  // as it's defined with @EventData and will be automatically
  // instantiated by RPG-JS if its map matches.
  // The onChanges hook will handle the conditional triggering.
}
