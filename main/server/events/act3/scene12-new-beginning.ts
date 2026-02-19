import { EventData, RpgEvent, type RpgMap, type RpgPlayer } from '@rpgjs/server';

@EventData({
  id: 'act3-scene12-new-beginning',
  name: 'A New Beginning',
  hitbox: { width: 32, height: 32 },
  // This event is triggered by area-enter, so it doesn't need a graphic or explicit position on map
  // Its position (5,20) is for the trigger condition, not a visual event.
  // We'll make it invisible and auto-trigger based on map/pos.
  graphic: '',
  // The event will be dynamically created and removed, so no need for a static graphic.
  // If we needed a placeholder, we could use 'invisible_event_graphic'
})
export class Act3Scene12NewBeginning extends RpgEvent {
  onInit() {
    this.set({
      name: 'A New Beginning Trigger',
      // This event is a trigger, not a visible entity.
      // It will be created dynamically when the player enters the specific area.
      // We set its graphic to an empty string to ensure it's invisible.
      graphic: '',
      // The event is not meant to be interacted with directly, but to trigger a scene.
      // We can set it to be non-collidable.
      collidable: false,
    });
  }

  async onPlayerTouch(_player: RpgPlayer) {
    // This event is designed to be triggered by an area-enter condition,
    // which is handled by the server's event system, not a direct touch.
    // However, if it were placed on the map and triggered by touch, this would fire.
    // For this specific scenario, the trigger is external (map/pos/condition).
    // We'll implement the logic in the setup function, assuming it's called
    // when the external trigger conditions are met.
  }
}

export default async function setupAct3Scene12NewBeginning(player: RpgPlayer, map: RpgMap) {
  // Trigger condition: map: luminous-wastes, pos: 5,20, condition: bloom-complete
  // This function is called by the server when these conditions are met.

  const bloomComplete = player.getVariable('bloom-complete'); // Assuming 'bloom-complete' is a player variable
  const currentMapId = map.id;
  const playerPosition = player.position;

  if (
    currentMapId === 'luminous-wastes' &&
    playerPosition.x === 5 &&
    playerPosition.y === 20 &&
    bloomComplete
  ) {
    console.log(`[Act3Scene12] Player ${player.name} reached The Edge. Initiating final scene.`);

    // 1. Play cutscene and change music
    await player.showText('The world was young. It is still young. It will always be young.', {
      time: 3000,
    });
    await player.showText('— What will you create next?', { time: 3000 });

    // Play credits sequence (assuming player.gui() can trigger this or a dedicated cutscene system)
    await player.gui('credits-sequence', true); // Show credits GUI overlay
    // TODO: changeMusic not available in RPG-JS 4.3.0

    // 2. Spawn NPCs at appropriate positions using createDynamicEvent()
    // Hana at (6, 20)
    const liraEvent = await player.createDynamicEvent({
      x: 6,
      y: 20,
      graphic: 'npc_hana',
      name: 'Hana (Ending)',
      width: 1,
      height: 1,
      speed: 0,
      direction: 2, // Facing down
      async onAction(player: RpgPlayer) {
        await player.showText("It's not stopping. It's still growing.");
      },
    });

    // Artun at (4, 20)
    const callumEvent = await player.createDynamicEvent({
      x: 4,
      y: 20,
      graphic: 'npc_artun',
      name: 'Artun (Ending)',
      width: 1,
      height: 1,
      speed: 0,
      direction: 2, // Facing down
      async onAction(player: RpgPlayer) {
        await player.showText(
          "Of course it is. The old question was 'Why do things change?' The new question is 'What will we create next?' That's a question with infinite answers.",
        );
      },
    });

    // Ensure player is also facing the new horizon
    player.setDirection(2); // Player faces down, towards the new world

    // 3. Play dialogue sequences via player.showText()
    // Dialogue from Hana and Artun
    await player.showText("It's not stopping. It's still growing.", { speaker: 'Hana' });
    await player.showText(
      "Of course it is. The old question was 'Why do things change?' The new question is 'What will we create next?' That's a question with infinite answers.",
      { speaker: 'Artun' },
    );
    await player.showText('What will YOU create next?', { speaker: 'Hana' });

    // 4. Fire effects (system message)
    await player.showText('Not an ending. A beginning.', { type: 'system' });

    // The credits sequence is expected to run for a duration.
    // We can use a delay here to simulate the credits rolling before post-credits actions.
    // In a real game, the 'credits-sequence' GUI might handle its own duration and then emit an event.
    // For this example, we'll simulate a 4-minute credit sequence.
    await player.moveRoutes([
      {
        time: 240000, // 4 minutes for credits
        // During this time, the credits GUI is active and music plays.
        // The player and NPCs remain at The Edge.
      },
    ]);

    // Post-credits actions:
    // Remove NPCs
    if (liraEvent) await liraEvent.remove();
    if (callumEvent) await callumEvent.remove();

    // Stop credits GUI
    await player.gui('credits-sequence', false);

    // Change music back or to a post-game theme
    // TODO: changeMusic not available in RPG-JS 4.3.0

    // Return player to Everwick (example: 19, 11)
    await player.changeMap('everwick', { x: 19, y: 11 });

    // Unlock New Game+ (assuming a player variable or global state)
    player.setVariable('new-game-plus-unlocked', true);
    await player.showText('New Game+ unlocked! Check the title screen.', { type: 'system' });

    // Save game automatically
    await player.save();
    await player.showText('Game saved automatically. The world awaits your next creation.', {
      type: 'system',
    });

    // 5. Update quest state (none specified for this final scene, but if there was a 'game-complete' quest, it would go here)
    // player.setQuest('main-story', 'completed');
  }
}
