import { EventData, MapData, RpgEvent, RpgMap, type RpgPlayer } from '@rpgjs/server';

@EventData({
  id: 'act1-scene6-stagnation-clearing',
  name: 'The Stagnation Clearing',
  hitbox: { width: 32, height: 32 },
  // This event is triggered by area-enter, so it doesn't need a graphic or explicit position
  // The actual trigger will be handled by a map event at (35,30)
  // This file defines the logic for that trigger.
})
export class StagnationClearingEvent extends RpgEvent {
  private hasTriggered = false; // Ensure the scene plays only once

  async onInit(_player: RpgPlayer) {
    // This event is meant to be triggered by an area-enter on the map,
    // not directly by onInit of an event placed on the map.
    // The logic below will be called by the map's onPlayerTouch event.
  }

  // This method will be called by the map's onPlayerTouch event when the player enters (35,30)
  async onSceneTrigger(player: RpgPlayer, _map: RpgMap) {
    if (this.hasTriggered) {
      return;
    }
    this.hasTriggered = true;

    console.log(`[Scene 6] Player ${player.name} entered Stagnation Clearing.`);

    // 1. Ambient audio fades, crystalline tinkling replaces it
    // TODO: changeMusic not available in RPG-JS 4.3.0

    // 2. Spawn Hana dynamically
    const hana = await player.createDynamicEvent({
      name: 'npc_hana',
      x: 34, // Hana's position near the clearing
      y: 29,
      graphic: 'npc_hana',
      speed: 1,
      direction: 2, // Facing south
      // Hana will be static for this scene
      // We don't need to define onAction for Hana here as her dialogue is part of the scene flow
    });

    // Ensure Hana is spawned before dialogue
    await new Promise((resolve) => setTimeout(resolve, 16));

    // 3. Dialogue sequences
    await player.showText('Wait. Do you feel that?', { speaker: 'Hana' });

    // 4. Screen effect: subtle desaturation
    // TODO: screenEffect not available in RPG-JS 4.3.0

    await player.showText(
      'This is a Stagnation Zone. Something — someone — froze this patch of the world. Time stopped here. Change stopped.',
      { speaker: 'Hana' },
    );

    // Player enters the clearing (implied by the trigger, no actual movement needed here)
    await player.showText(
      "Look at the butterflies. Perfect. Every wing-scale, every spot of color. Beautiful, isn't it?",
      { speaker: 'Hana' },
    );
    await player.showText('...', { speaker: 'Hana' });
    await player.showText(
      "But they'll never land. They'll never fly anywhere new. They're just... frozen. Forever.",
      { speaker: 'Hana' },
    );
    await player.showText(
      "I've seen these before, in the Frontier. The Preservers do this — people who think the world is too fragile to change. They freeze things to 'protect' them.",
      { speaker: 'Hana' },
    );
    await player.showText(
      "This is small. Just a clearing. But they're getting bolder. I've heard reports of larger zones in the hills north of here.",
      { speaker: 'Hana' },
    );

    // Hana kneels by the crystallized Resonance Stone (visual cue, no actual event interaction yet)
    await player.showText(
      'We could break it. A single fragment broadcast into this stone would shatter the stasis. But...',
      { speaker: 'Hana' },
    );
    await player.showText(
      "Not yet. I want to show you more of the Settled Lands first. When we come back, you'll understand what you're doing — and why it matters.",
      { speaker: 'Hana' },
    );

    // 5. System message
    await player.showText(
      "You've discovered a Stagnation Zone. The Preservers freeze the world to prevent change. Architects can break these zones by broadcasting memory fragments. You'll return here when you're ready.",
    );

    // Clean up Hana after the scene
    if (hana) {
      await hana.remove();
    }

    // Reset music and screen effect after the scene, or let the player leave the area to trigger map's default
    // For now, we'll assume the player will leave the area and the map's default music/effects will resume.
    // If the player stays, the ambient music and desaturation will persist until they leave.
    // This is an observation scene, so no quest changes or rewards.
  }
}

// Define a map event to trigger the scene when the player enters the specific tile
@MapData({
  id: 'heartfield',
})
export class HeartfieldMap extends RpgMap {
  onPlayerTouch(player: RpgPlayer, _event: RpgEvent) {
    // Check if the player touches the specific tile (35,30)
    if (player.x === 35 && player.y === 30) {
      const stagnationClearingEvent = player.getVariable('stagnationClearingEvent');
      if (stagnationClearingEvent) {
        stagnationClearingEvent.onSceneTrigger(player, this);
      }
    }
  }
}

// Export the setup function for RPG-JS
export default function setup() {
  return {
    events: [StagnationClearingEvent],
    maps: [
      HeartfieldMap, // Ensure HeartfieldMap is registered to handle the touch event
    ],
  };
}
