import {
  EventData,
  RpgCommonEvent,
  RpgCommonPlayer,
  RpgEvent,
  RpgMap,
  type RpgPlayer,
} from '@rpgjs/server';

@EventData({
  name: 'act1-scene10-breaking-stagnation',
  hitbox: { width: 32, height: 32 },
  // This event is triggered by player entering the specific map and position,
  // and having the MQ-04 quest active.
  // It's an 'auto' event in the sense that it triggers upon conditions being met,
  // not necessarily requiring an 'action' input.
  // We'll manage the trigger logic in onInit or onChanges.
  // For simplicity, we'll use onInit and ensure it only fires once.
})
export default class BreakingStagnationEvent extends RpgEvent {
  private hasTriggered: boolean = false;

  onInit() {
    this.set({
      name: 'Stagnation Clearing Trigger',
      graphic: '', // Use an invisible graphic
      // The event is initially invisible and non-interactive until conditions are met
      // We'll make it visible/interactive via onChanges if needed, or just use onInit for auto-trigger
    });
  }

  async onPlayerTouch(player: RpgPlayer) {
    if (this.hasTriggered) {
      return;
    }

    const questState = player.getQuest('MQ-04');
    const isMQ04Active = questState && questState.state === 'active';
    const isAtLocation =
      player.map.id === 'heartfield' && player.position.x === 35 && player.position.y === 30;

    if (isMQ04Active && isAtLocation) {
      this.hasTriggered = true; // Ensure it only fires once

      // 1. Spawn Hana
      const lira = await this.map.createDynamicEvent({
        x: 34,
        y: 29,
        event: 'npc_hana', // Assuming 'npc_hana' is a registered event class
        properties: {
          name: 'Hana',
          graphic: 'npc_hana',
          direction: 0, // Facing down
        },
      });

      // 2. Play dialogue sequences
      await player.showText('Here we are. The Stagnation Clearing. Same as when we left it.');
      await player.showText(
        "Here's what you need to do. The crystallized Resonance Stone at the center is the focal point — the Preservers anchor their stasis through it. Broadcasting a memory into that stone will overwhelm the stasis energy and shatter the crystal.",
      );
      await player.showText(
        "Any fragment will work here. This is a small zone — even a one-star fragment has enough warmth to break it. But use something you're willing to lose, because broadcasting consumes the fragment.",
      );

      await player.showText(
        'Approach the crystallized Resonance Stone and broadcast a memory fragment to break the Stagnation Zone. (Any fragment, potency 1+.)',
        {
          type: 'system',
        },
      );

      // 3. Fire GUI effect for broadcast target
      await player.gui('broadcast-target').open({ target: 'stagnation-stone' });

      // Wait for player to broadcast a fragment (this would be handled by a separate broadcast system)
      // For this event, we'll simulate the broadcast and proceed.
      // In a real game, this would involve player input, item selection, and a broadcast mechanic.
      // For the purpose of this event file, we'll assume the broadcast happens and then continue.
      await player.wait(5000); // Simulate player action time

      // Close the GUI overlay
      await player.gui('broadcast-target').close();

      // 4. Fire screen effects
      await player.screenEffect({ effect: 'stagnation-shatter' });
      await player.wait(2000); // Wait for effect to play

      // 5. Update vibrancy
      // This would typically be a server-side call to a vibrancy system
      // For now, we'll simulate the effect and message.
      // Assuming a global or map-specific vibrancy system.
      // RpgMap.get('heartfield').setVibrancy(RpgMap.get('heartfield').getVibrancy() + 10); // Example
      await player.changeMapProperty(
        'heartfield',
        'vibrancy',
        (currentVibrancy: number) => currentVibrancy + 10,
      );

      // 6. Give item
      await player.addItem('MF-03', 1); // "Echo of the Stagnation"

      // 7. System messages
      await player.showText('Stagnation Zone broken! Heartfield vibrancy +10!', {
        type: 'system',
      });
      await player.showText(
        'You received a Memory Fragment: "Echo of the Stagnation" (Sorrow, Dark, ★★) — a frozen butterfly\'s last moment before crystallization.',
        {
          type: 'system',
        },
      );

      // Hana's post-break dialogue
      await player.showText(
        "There. That's what it looks like when the world starts breathing again.",
      );
      await player.showText(
        "A sorrow fragment. The butterfly was afraid, at the end. It remembered flying, and then it couldn't.",
      );
      await player.showText(
        "Hold onto that one. Sorrow fragments are rare from the Settled Lands. And they're powerful against stagnation — nothing breaks a freeze like the memory of what the freeze took away.",
      );
      await player.showText(
        'We should head back to the village. Artun will want to hear about the Preservers.',
      );

      // 8. Update quest state
      player.advanceQuest('MQ-04', 5); // Advance MQ-04 to objective 5

      // Remove Hana NPC after dialogue
      if (lira) {
        this.map.removeEvent(lira.id);
      }

      // Mark the stagnation zone as broken in player state or map state
      player.setVariable('heartfield_stagnation_clearing_broken', true);
      // This event should now be permanently inactive
      this.setVariable('is_completed', true);
      this.setGraphic(''); // Ensure it's truly gone
    }
  }

  // Use onChanges to check conditions if the player might enter the area multiple times
  // before the quest is active, and we only want it to trigger once the quest is active.
  // However, onPlayerTouch is more appropriate for a specific location trigger.
  // The `hasTriggered` flag handles the 'once' aspect.
  async onChanges(player: RpgPlayer) {
    // If the event has already completed, do nothing
    if (this.getVariable('is_completed')) {
      return;
    }

    const questState = player.getQuest('MQ-04');
    const isMQ04Active = questState && questState.state === 'active';
    const isAtLocation =
      player.map.id === 'heartfield' && player.position.x === 35 && player.position.y === 30;

    // If conditions are met and it hasn't triggered yet, trigger it.
    // This ensures that if the player is already on the tile when the quest becomes active,
    // or if they move onto it, it will fire.
    if (isMQ04Active && isAtLocation && !this.hasTriggered) {
      // Trigger the onPlayerTouch logic
      this.onPlayerTouch(player);
    }
  }
}
