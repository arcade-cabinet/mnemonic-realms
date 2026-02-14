import { EventData, RpgEvent, type RpgMap, type RpgPlayer } from '@rpgjs/server';

@EventData({
  name: 'EV-UP-SCENE3-ENTRY',
  hitbox: { width: 1, height: 1 }, // This event is typically placed at (0,0) or a logical entry point and triggered on map load.
})
export default class UndrawnPeaksScene3Event extends RpgEvent {
  async onInit(player: RpgPlayer, map: RpgMap) {
    // Ensure this scene introduction only plays once per save file
    if (player.getVariable('undrawn_peaks_scene_intro_completed')) {
      return;
    }

    player.setVariable('undrawn_peaks_scene_intro_completed', true);

    // --- Spawn persistent NPCs for the scene intro ---
    // Lira and Callum will be removed after the dialogue, but need to exist for their lines.
    // Aric will remain on the map as per the story.

    const liraEvent = map.createDynamicEvent({
      x: player.x + 1, // Place Lira near the player's entry point
      y: player.y,
      event: {
        name: 'npc_lira_undrawn_peaks_scene',
        graphic: 'npc_lira',
        onInit(eventPlayer: RpgPlayer) {
          eventPlayer.setGraphic('npc_lira');
        },
      },
    });

    const callumEvent = map.createDynamicEvent({
      x: player.x - 1, // Place Callum near the player's entry point
      y: player.y,
      event: {
        name: 'npc_callum_undrawn_peaks_scene',
        graphic: 'npc_callum',
        onInit(eventPlayer: RpgPlayer) {
          eventPlayer.setGraphic('npc_callum');
        },
      },
    });

    const aricEvent = map.createDynamicEvent({
      x: 20, // Aric's fixed position at the Crystalline Fortress Gate
      y: 35,
      event: {
        name: 'npc_aric_fortress_gate',
        graphic: 'npc_aric',
        onInit(eventPlayer: RpgPlayer) {
          eventPlayer.setGraphic('npc_aric');
        },
      },
    });

    // --- Dialogue Sequence ---

    // Initial dialogue with Lira and Callum upon entering the peaks
    await player.showText('The Fortress. There.', { speaker: 'Lira', talkWith: liraEvent.id });
    await player.showText(
      'The Preserver Fortress. Three floors of crystallized perfection — everything the Curator considers worth preserving, frozen forever in a museum no one asked for.',
      { speaker: 'Callum', talkWith: callumEvent.id },
    );
    await player.showText(
      'The First Memory is on the lowest floor. We need to go through the Fortress to reach it.',
      { speaker: 'Callum', talkWith: callumEvent.id },
    );

    // Effect: System message about the Fortress becoming visible
    await player.showText(
      'The Preserver Fortress is visible — crystalline structure in the highest peak.',
      { type: 'system' },
    );

    // Aric's encounter at the Fortress Gate (simulated as part of the intro sequence)
    await player.showText('Architect. I expected you.', {
      speaker: 'Aric',
      talkWith: aricEvent.id,
    });
    await player.showText('Step aside, Aric.', { speaker: 'Lira', talkWith: liraEvent.id });
    await player.showText("I'm not here to fight. Not this time.", {
      speaker: 'Aric',
      talkWith: aricEvent.id,
    });
    await player.showText(
      "I've been thinking about what I asked you in the Frontier. \"Does being stronger make you right?\" I still don't know the answer. But I know this: the Curator is wrong about the First Memory. Crystallizing it won't preserve the world — it will kill it.",
      { speaker: 'Aric', talkWith: aricEvent.id },
    );
    await player.showText(
      "I can't fight the Curator directly — the crystal armor binds me to their will. But I can tell you what's inside.",
      { speaker: 'Aric', talkWith: aricEvent.id },
    );

    // Aric describes Fortress layout (narrative, implies map data update)
    await player.showText(
      "Three floors. The Gallery of Moments — frozen scenes the Curator considers perfect. The Archive of Perfection — the Curator's personal collection, the most beautiful things they've ever frozen. And the First Memory Chamber.",
      { speaker: 'Aric', talkWith: aricEvent.id },
    );
    await player.showText(
      "The Gallery is guarded by the Curator's Right Hand — their most loyal lieutenant. The Archive is guarded by the Archive Keeper — a construct of pure crystal intelligence. The Curator waits on the third floor.",
      { speaker: 'Aric', talkWith: aricEvent.id },
    );
    await player.showText(
      "One more thing. The Fortress is crystallized at vibrancy 0. Your broadcasts won't work inside — the crystal absorbs memory energy. But the crystal has fractures. Everywhere a god's influence has touched the world, the Fortress walls crack. Your four recalled gods are weakening the crystal from outside.",
      { speaker: 'Aric', talkWith: aricEvent.id },
    );

    // Aric steps aside (narrative, implies the path to the Fortress is now open)
    await player.showText('Aric steps aside. The path to the Fortress is open.', {
      type: 'system',
    });

    // --- Quest State Changes ---
    player.setQuest('MQ-08', 'completed');
    player.setQuest('MQ-09', 'active');

    // Set a player variable to indicate the Fortress map layout has been revealed
    // This can be used by a GUI or map system to update the player's map.
    player.setVariable('fortress_map_revealed', true);

    // Effect: System message about the Fortress being open and environmental advantages
    await player.showText(
      'The Preserver Fortress is open. Three floors await. God recall effects create fractures in the Fortress walls — visual cracks that may provide tactical advantages.',
      { type: 'system' },
    );

    // --- Cleanup ---
    // Remove Lira and Callum events as they are not persistent for this scene after the intro.
    map.removeEvent(liraEvent.id);
    map.removeEvent(callumEvent.id);

    // Aric's event remains on the map as per the story: "He remains at the gate."
    // So aricEvent is NOT removed.
  }
}
