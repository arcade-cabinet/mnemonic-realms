import { EventData, RpgEvent, type RpgPlayer } from '@rpgjs/server';
import { completeQuest, isQuestComplete } from '../../systems/quests';

@EventData({
  id: 'act2-scene7-verdance-recall',
  name: 'Verdance — The Dormant God of Growth',
  hitbox: { width: 32, height: 32 },
  // This event is triggered by player touch, but its actual logic is conditional
  // We'll use onChanges for the quest state check and then onAction for the pedestals
  // The initial trigger is a touch event at (25,35)
})
export default class VerdanceRecallEvent extends RpgEvent {
  private hasTriggeredVision = false;
  private hasSpawnedNpcs = false;

  onInit() {
    this.set({
      name: 'Verdance Recall Trigger',
      graphic: 'invisible', // Invisible trigger event
      width: 1,
      height: 1,
      // This event will be visible only when the quest condition is met
      // and will be removed after the recall is complete.
      // We'll manage visibility dynamically.
      visible: false,
    });
  }

  async onChanges(player: RpgPlayer) {
    // Check if the player is on the correct map and position
    const isOnLocation =
      player.map.id === 'shimmer-marsh' && player.position.x === 25 && player.position.y === 35;
    const isHermitPathDone = isQuestComplete(player, 'hermit-path-complete');
    const isVerdanceRecalled = isQuestComplete(player, 'GQ-02');

    if (isOnLocation && isHermitPathDone && !isVerdanceRecalled && !this.hasSpawnedNpcs) {
      this.hasSpawnedNpcs = true; // Prevent re-spawning
      this.setVisible(true); // Make the trigger visible/active

      // Spawn Artun and Vash
      const _artun = await player.map.createDynamicEvent({
        x: 23,
        y: 33,
        event: 'npc_artun', // Assuming 'npc_artun' is a registered RpgEvent class
        properties: {
          name: 'Artun',
          graphic: 'npc_artun',
          direction: 2, // Facing down
        },
      });

      const _vash = await player.map.createDynamicEvent({
        x: 27,
        y: 33,
        event: 'npc_vash', // Assuming 'npc_vash' is a registered RpgEvent class
        properties: {
          name: 'Vash',
          graphic: 'npc_vash',
          direction: 2, // Facing down
        },
      });

      // Part A: Discovery (Vash's dialogue)
      await player.showText(
        "Vash: Verdance's Hollow. The Rootwalkers' final gift. This tree was meant to be their god — a living embodiment of growth itself. But they dissolved before they could finish it.",
      );
      await player.showText(
        "Vash: The roots extend in every direction — I've traced them for twenty years. Wherever they surface, things grow. Even through the muted marsh soil. Even through the Stagnation Bog's crystal edge.",
      );
      await player.showText(
        'Vash: But the path to the shrine is blocked. The root cluster at the base — see it? — has grown so dense that nothing can pass through. The tree is protecting itself.',
      );

      // Part B: Puzzle — Clearing the Roots
      // This part is handled by a separate event (EV-SM-002) at (18, 28)
      // The player needs to interact with that event to clear the path.
      // For this event, we'll assume the path is cleared and the player has moved to (25,35)
      // and is now ready for the vision and pedestals.

      // After the player has cleared the roots (EV-SM-002) and moved to (25,35)
      // This event will then proceed to the vision.
      if (!this.hasTriggeredVision) {
        this.hasTriggeredVision = true;
        await this.triggerRecallVision(player);
      }
    } else if (isVerdanceRecalled && this.isVisible()) {
      // If Verdance is recalled, hide this trigger event
      this.setVisible(false);
      // Optionally remove NPCs if they are dynamic and no longer needed
      // (This depends on whether they have post-recall dialogue)
      // TODO: getEventByName not available in RPG-JS 4.3.0
      // const callumEvent = player.map.getEventByName('Artun');
      // if (callumEvent) player.map.removeEvent(callumEvent.id);
      // const wynnEvent = player.map.getEventByName('Vash');
      // if (wynnEvent) player.map.removeEvent(wynnEvent.id);
    }
  }

  async onAction(player: RpgPlayer) {
    const isHermitPathDone = isQuestComplete(player, 'hermit-path-complete');
    const isVerdanceRecalled = isQuestComplete(player, 'GQ-02');

    if (isHermitPathDone && !isVerdanceRecalled && this.hasTriggeredVision) {
      // Part D: Emotion Choice and Transformation
      await player.showText(
        'SYSTEM: Place a memory fragment (potency 3+, matching emotion) on a pedestal to recall Verdance.',
      );

      // Show GUI for emotion choice
      await player.gui('god-recall-pedestal').open({ god: 'verdance' });

      // The GUI is expected to handle the fragment placement and then call a server event
      // to complete the recall. For now, we'll simulate the completion.
      // In a real scenario, the GUI would send a command to the server,
      // which would then trigger the rest of this logic.

      // For demonstration, let's assume the GUI interaction completes the quest
      // and we proceed with the effects.
      // This part would typically be triggered by a server-side command from the GUI.
      // Example: player.callEvent('onRecallComplete', { emotion: 'Joy' });
    } else if (isVerdanceRecalled) {
      await player.showText('The dormant god Verdance has already been recalled.');
    } else {
      await player.showText(
        "The path to Verdance's shrine is still blocked by dense roots. We need to find a way to clear them.",
      );
    }
  }

  // This method would be called by the GUI's server-side logic after a fragment is placed
  async onRecallComplete(player: RpgPlayer, { emotion }: { emotion: string }) {
    // Play transformation effect (if any, not specified beyond vibrancy change)
    // The transformation description is in dormant-gods.md, which might imply a visual effect.
    // For now, we'll just apply the vibrancy and quest changes.

    await player.showText(`You placed a fragment of ${emotion}. Verdance stirs...`);

    // Apply effects
    await player.triggerEffect('cutscene-play', { cutsceneId: 'verdance-recall-transformation' }); // Assuming a transformation cutscene
    await player.triggerEffect('vibrancy-change', { zone: 'shimmer-marsh', delta: 15 });
    await player.showText('Shimmer Marsh feels more alive! Vibrancy +15.');

    // Update quest state
    completeQuest(player, 'GQ-02');
    await player.showText("Quest 'Verdance — The Dormant God of Growth' completed!");

    // Close GUI if still open
    player.gui('god-recall-pedestal').close();

    // Vash's reaction varies by recall emotion (as per narrative context)
    let wynnReaction = 'Vash: Incredible! The marsh is vibrant again!';
    switch (emotion) {
      case 'Joy':
        wynnReaction =
          "Vash: Floriana... the Endless Bloom. Such abundance, such generosity. It's truly beautiful.";
        break;
      case 'Fury':
        wynnReaction =
          'Vash: Thornweald... the Wild Overgrowth. Untamed, reclaiming. A powerful, almost alarming, surge of life.';
        break;
      case 'Sorrow':
        wynnReaction =
          "Vash: Autumnus... the Falling Leaf. Natural cycles, composting old into new. There's a profound wisdom in this transformation.";
        break;
      case 'Awe':
        wynnReaction =
          'Vash: Sylvanos... the Deep Root. Hidden networks, interconnection, patience. A fascinating, intricate awakening.';
        break;
    }
    await player.showText(wynnReaction);

    // TODO: getEventByName not available in RPG-JS 4.3.0
    // const callumEvent = player.map.getEventByName('Artun');
    // if (callumEvent) player.map.removeEvent(callumEvent.id);
    // const wynnEvent = player.map.getEventByName('Vash');
    // if (wynnEvent) player.map.removeEvent(wynnEvent.id);

    this.setVisible(false); // Hide the trigger event
  }

  private async triggerRecallVision(player: RpgPlayer) {
    await player.showText('SYSTEM: The recall vision triggers...');
    await player.triggerEffect('cutscene-play', { cutsceneId: 'verdance-recall-vision' });
    // The cutscene is 30 seconds, so we might want to wait for it to finish
    // In a real game, the cutscene system would handle blocking player input.
    // For now, we'll just proceed after triggering.
  }
}
