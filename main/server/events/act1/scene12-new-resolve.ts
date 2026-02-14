import {
  EventData,
  MapData,
  Presets,
  RpgCommonPlayer,
  RpgEvent,
  RpgMap,
  type RpgPlayer,
  RpgScene,
} from '@rpgjs/server';
import { addItem } from '../../systems/inventory';

@EventData({
  id: 'act1-scene12-new-resolve',
  name: 'A New Resolve',
  hitbox: { width: 32, height: 32 },
})
export class Act1Scene12NewResolve extends RpgEvent {
  onInit() {
    this.set({
      name: 'A New Resolve',
      graphic: '', // Invisible event
      hitbox: { width: 32, height: 32 },
      priority: 0, // Lower priority, as it's auto-triggered and then moves the player
      sync: false, // No need to sync this event's state to other players
    });
  }

  async onChanges(player: RpgPlayer) {
    // Trigger condition: auto, map: village-hub, condition: lira-frozen
    const isHanaFrozen = (await player.getQuest('MQ-04')?.state) === 'frozen'; // Assuming 'frozen' is a state for MQ-04
    const isOnVillageHub = player.map.id === 'village-hub';
    const hasNotTriggered = !(await player.getVariable('ACT1_SCENE12_TRIGGERED'));

    if (isOnVillageHub && isHanaFrozen && hasNotTriggered) {
      await player.setVariable('ACT1_SCENE12_TRIGGERED', true);
      await this.triggerScene(player);
    }
  }

  async triggerScene(player: RpgPlayer) {
    // Ensure player is in Artun's house for the initial dialogue
    // This event is auto-triggered on map load, so we might need to move the player
    // if they are not already in Artun's house.
    // For simplicity, let's assume the player is automatically placed in Artun's house (19, 11)
    // or the event is triggered when they enter it.
    // The script says "The player enters Artun's house."
    // Let's move the player to Artun's house if they are not there.
    if (player.map.id !== 'village-hub' || player.position.x !== 19 || player.position.y !== 11) {
      await player.changeMap('village-hub', { x: 19, y: 11, direction: 0 }); // Move to Artun's house
    }

    // 1. Spawn Artun
    const artun = await player.map.createDynamicEvent({
      x: 19,
      y: 11,
      event: Presets.Event, // Use a basic event preset
      properties: {
        name: 'Artun',
        graphic: 'npc_artun',
        direction: 0,
        hitbox: { width: 32, height: 32 },
        priority: 1, // Above player
      },
    });

    // 2. Dialogue sequence (Part A: Artun's House)
    await player.showText('I heard. Hana...', { speaker: 'Artun' });
    await player.showText(
      "She's alive. The crystal doesn't kill — I know that much from the Dissolved records. But breaking her free will take more than anything we have in the Settled Lands.",
      { speaker: 'Artun' },
    );
    await player.showText(
      "You'll need to go north. Into the Frontier — where the world is less formed, where the memory is thicker, where the Preservers are stronger. And where the dormant gods sleep.",
      { speaker: 'Artun' },
    );
    await player.showText(
      "Those gods, the ones the Dissolved left behind — they're the key. If you can recall even one of them, the surge of memory energy would be enough to shatter any stagnation zone on this side of the Sketch.",
      { speaker: 'Artun' },
    );

    // Artun walks to his desk (assume desk is at 18, 11)
    await artun.moveRoutes([{ x: 18, y: 11, time: 500 }]);

    await player.showText(
      "I've been writing these for years. Letters about the Frontier — what I've learned from travelers, from the Dissolved records, from my own theories. Each one covers a different zone. Read them when you get there.",
      { speaker: 'Artun' },
    );

    // 3. Effects: item-give: {"itemId":"K-02","name":"Artun's Letters"}
    addItem(player, 'K-02', 1);
    await player.showText("You received Artun's Letters (K-02).", { style: { color: 'gold' } });

    await player.showText(
      "The mountain pass north of here — it's been closed for as long as I can remember. But after tonight, after what the Preservers did... I don't think anything's stopping you anymore. The world itself wants to grow. It'll open for someone with the will to walk through.",
      { speaker: 'Artun' },
    );
    await player.showText('One more thing.', { speaker: 'Artun' });

    // Artun reaches into his coat
    // (No specific animation, just continue dialogue)

    await player.showText(
      "This was mine. My teacher gave it to me. And Hana gave hers to you — the Architect's Signet. But I think you need this more than I do now.",
      { speaker: 'Artun' },
    );

    // 3. Effects: item-give: {"itemId":"frag-awe-neutral-3","name":"Artun's Favorite Memory"}
    addItem(player, 'frag-awe-neutral-3', 1);
    await player.showText("You received Artun's Favorite Memory (Awe/Neutral/3★).", {
      style: { color: 'gold' },
    });

    await player.showText(
      "That's my favorite memory. The night I understood how much there was left to discover. Use it well.",
      { speaker: 'Artun' },
    );
    await player.showText(
      "Now go up to the Lookout Hill. Clear your head. And when you're ready — go north.",
      { speaker: 'Artun' },
    );

    // Artun moves back to original position or disappears
    await artun.moveRoutes([{ x: 19, y: 11, time: 500 }]);
    await artun.remove(); // Remove dynamic event

    // 4. Quest Changes: MQ-04 → complete
    await player.updateQuest('MQ-04', 'complete');

    // Part B: The Lookout
    // Move player to Lookout Hill (12, 2)
    await player.changeMap('village-hub', { x: 12, y: 2, direction: 0 });

    // Effects: music-change: {"track":"village-night"}
    await player.call('changeMusic', { track: 'village-night', volume: 0.7, loop: true });

    // Effects: screen-effect: {"effect":"night-transition"}
    // This would typically involve a screen fade or filter.
    // For RPG-JS, we might apply a tint or a custom GUI overlay.
    await player.gui('NightOverlay', 'open'); // Assuming a GUI component for night effect

    // Wait for player to experience the vista
    await player.wait(5000); // 5 seconds of stillness

    // Create a dynamic event for the telescope
    const telescope = await player.map.createDynamicEvent({
      x: 12,
      y: 3, // Telescope is at (12, 3)
      event: Presets.Event,
      properties: {
        name: 'Telescope',
        graphic: '',
        direction: 0,
        hitbox: { width: 32, height: 32 },
        priority: 1,
      },
    });

    // Make the telescope interactable
    telescope.onAction = async (p: RpgPlayer) => {
      await p.showText(
        'To the north: the mountain pass, snow-dusted peaks, and beyond them — a vast, shimmering expanse where the world is still being written.',
        { style: { color: 'lightblue' } },
      );
      await p.showText(
        "To the south: Heartfield's golden fields, now scarred by a blue-white crystal mass that pulses slowly in the dark. Hana is in there. Somewhere.",
        { style: { color: 'lightblue' } },
      );
    };

    // Player can leave the hill at any time.
    // We'll use a map change event to trigger the final message.
    // The mountain pass transition (EV-VH-012) is now open.
    // This event will be handled by the map transition itself.

    // Set a variable to indicate the scene is complete and Act II is unlocked.
    await player.setVariable('ACT2_UNLOCKED', true);

    // The final system message will be triggered by the map transition to Sunridge (EV-VH-012)
    // or when the player leaves the hill and returns to the main village area.
    // For now, let's add it here as a direct effect.
    await player.showText('The mountain pass to the Frontier is now open. Act II begins.', {
      style: { color: 'lightgreen' },
    });
    await player.showText(
      "Artun will remain in the village. He'll send companion volunteers to the Ridgetop Waystation when you're ready.",
      { style: { color: 'lightgreen' } },
    );

    // Clean up dynamic telescope event
    await telescope.remove();
    await player.gui('NightOverlay', 'close'); // Close night overlay
  }
}

export default Act1Scene12NewResolve;
