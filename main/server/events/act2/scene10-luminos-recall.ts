import { Direction, EventData, RpgEvent, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { completeQuest, isQuestActive, isQuestComplete } from '../../systems/quests';

@EventData({
  id: 'act2-scene10-luminos-recall',
  name: 'Luminos — The Dormant God of Light',
  hitbox: { width: 32, height: 32 },
})
export class LuminosRecallEvent extends RpgEvent {
  onInit() {
    this.set({
      graphic: '',
      width: 32,
      height: 32,
      // The event is initially invisible/inactive until conditions are met
      // The actual trigger is onPlayerTouch, but the visual effect of the light column
      // and the ability to interact with the prism are conditional.
      // We'll manage visibility and interaction in onPlayerTouch and onChanges.
      visible: false,
      // The prism might rotate or have a subtle animation
      // animation: 'rotate_slowly'
    });
  }

  async onPlayerTouch(player: RpgPlayer) {
    // 1. Check trigger conditions: quest-state, map, pos, condition: light-lens-equipped
    const currentMap = player.map;
    const playerPosition = player.position;
    const hasLightLens = player.hasItem('K-04'); // K-04 is the Light Lens ID from docs

    // Ensure the player is on the correct map and position
    if (currentMap?.id !== 'flickerveil' || playerPosition.x !== 20 || playerPosition.y !== 20) {
      return; // Not the correct location
    }

    // Check if the quest GQ-03 is active (Luminos recall quest)
    const isGQ03Active = isQuestActive(player, 'GQ-03');

    if (!isGQ03Active) {
      // If the quest isn't active, maybe a different message or no interaction
      await player.showText(
        'The light column is overwhelming. It seems to be waiting for something...',
      );
      return;
    }

    if (!hasLightLens) {
      // Player is at the spot, quest active, but no Light Lens
      await player.showText(
        'The light column is overwhelming. Use the Light Lens to focus the scattered beams.',
      );
      // Push player back if they don't have the lens
      const playerDir = player.direction;
      let pushX = 0;
      let pushY = 0;
      switch (playerDir) {
        case Direction.Up:
          pushY = 5;
          break;
        case Direction.Down:
          pushY = -5;
          break;
        case Direction.Left:
          pushX = 5;
          break;
        case Direction.Right:
          pushX = -5;
          break;
      }
      await player.moveBy({ x: pushX, y: pushY, speed: 100 });
      return;
    }

    // If all conditions met: Player has Light Lens, quest is active, at correct spot.
    // This means the player has successfully navigated the initial blinding light.

    // Prevent re-triggering if already completed
    if (isQuestComplete(player, 'GQ-03')) {
      await player.showText('Luminos has already been recalled. The grove hums with a new light.');
      return;
    }

    // Part A: Discovery (dialogue with Artun)
    // Spawn Artun dynamically for this scene
    const callumEvent = await player.map.createDynamicEvent({
      x: playerPosition.x - 3, // Position Artun near the player
      y: playerPosition.y + 2,
      event: 'npc_artun', // Assuming 'npc_artun' is a registered RpgEvent class
      properties: {
        graphic: 'npc_artun',
        direction: Direction.Up,
        speed: 100,
        // moveType: MoveType.Static, // MoveType does not exist in @rpgjs/server
      },
    });

    await player.showText(
      'The lens focuses the scattered light into a coherent path — a corridor of tolerable brightness leading to the prism. Shadows multiply around them, one per nearby tree, pointing in impossible directions.',
      {
        name: 'SYSTEM',
        type: 'dialogue',
      },
    );

    await player.showText(
      "The Radiant Lens built their entire civilization around capturing light. They mapped every star, charted every beam. And then they realized they'd left no room for mystery.",
      {
        name: 'Artun',
        speakerGraphic: 'npc_artun',
      },
    );

    await player.showText(
      "They dissolved into the light itself — sunbeams, starlight, the ambient glow of the unfinished world. That warm amber quality everything has? That's them.",
      {
        name: 'Artun',
        speakerGraphic: 'npc_artun',
      },
    );

    // Part B: The Recall Vision
    await player.showText(
      'The player reaches the prism. Four pedestals surround it, each carved with an emotion glyph.',
      {
        name: 'SYSTEM',
        type: 'dialogue',
      },
    );

    // Play cutscene
    await player.callScene('cutscene-play', { cutsceneId: 'luminos-recall-vision' });

    // Part C: Emotion Choice and Transformation
    await player.showText(
      'Place a memory fragment (potency 3+, matching emotion) on a pedestal to recall Luminos.',
      {
        name: 'SYSTEM',
        type: 'dialogue',
      },
    );

    // Show GUI for emotion choice
    // The GUI will handle the fragment selection and the actual recall logic
    // It should emit an event back to the server once a choice is made
    await player.gui('god-recall-pedestal').open({ god: 'luminos' });

    // The GUI is modal, so the event will pause here until the GUI is closed
    // or an action is taken. The GUI itself should trigger the next steps
    // (e.g., via player.triggerEvent('luminosRecallComplete', { emotion: 'Joy' }))
    // For this server-side event, we assume the GUI will handle the choice
    // and then the quest state change will be handled by the GUI's server-side logic
    // or a separate event listener.

    // For now, we'll simulate the completion directly after the GUI opens,
    // assuming the GUI handles the actual fragment consumption and choice.
    // In a real game, the GUI would send a server event, and that event would
    // then trigger the following effects.

    // --- Assuming the GUI interaction is complete and a choice was made ---
    // (This part would typically be in a separate event handler triggered by the GUI)

    // Effects:
    // - vibrancy-change: {"zone":"flickerveil","delta":15}
    await player.changeMapProperty('flickerveil', 'vibrancy', 15, true); // true for delta

    // Quest Changes: GQ-03 → complete
    completeQuest(player, 'GQ-03');

    // Clean up dynamic NPC
    if (callumEvent) {
      player.map.removeEvent(callumEvent.id);
    }

    await player.showText('The grove shimmers with renewed light. Luminos has been recalled!', {
      name: 'SYSTEM',
      type: 'dialogue',
    });
  }

  // onChanges can be used to manage the visibility of the prism or light column effect
  // based on quest state or player inventory (Light Lens).
  async onChanges(player: RpgPlayer) {
    const hasLightLens = player.hasItem('K-04');
    const isGQ03Active = isQuestActive(player, 'GQ-03');
    const isGQ03Completed = isQuestComplete(player, 'GQ-03');

    // Make the prism visible and interactive only when the quest is active
    // and the player has the Light Lens, or if the quest is completed (for flavor text)
    if ((isGQ03Active && hasLightLens) || isGQ03Completed) {
      this.setVisible(true);
      this.setCollidable(true);
    } else {
      this.setVisible(false);
      this.setCollidable(false);
    }

    // Handle the initial blinding light effect if player is in the grove without the lens
    if (
      player.map?.id === 'flickerveil' &&
      player.position.x === 20 &&
      player.position.y === 20 &&
      isGQ03Active &&
      !hasLightLens
    ) {
      // This is where you'd trigger a screen white-out effect or similar
      // For now, we'll just rely on the onPlayerTouch message and pushback.
      // A parallel event could manage a continuous screen effect if needed.
    }
  }
}

// Export the event setup function as default
export default async function setup() {
  // No global setup needed beyond the class definition for this specific event.
  // The RpgEvent decorator handles registration.
}
