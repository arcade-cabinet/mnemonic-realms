import { EventData, Move, RpgCommonEvent, RpgEvent, RpgMap, type RpgPlayer } from '@rpgjs/server';

@EventData({
  name: 'act2-scene6-moral-dilemma-garden',
  hitbox: { width: 32, height: 32 },
  // This event is triggered by area-enter, so it doesn't need a graphic initially.
  // It will dynamically spawn Artun and the Rootwalker echo.
  // The actual trigger condition is handled in onInit.
})
export default class MoralDilemmaGardenEvent extends RpgEvent {
  private hasTriggered = false;
  private callumEventId: string | null = null;

  onInit() {
    this.set({
      name: 'Crystallized Garden',
      graphic: '',
      // The actual trigger is an area-enter, so this event's graphic might be a static map object.
      // The interactive part (dialogue, choices) happens when the player enters the area.
    });
  }

  async onChanges(player: RpgPlayer) {
    // Trigger: area-enter, map: shimmer-marsh, pos: 28,32, condition: post-first-recall
    if (
      player.map.id === 'shimmer-marsh' &&
      player.position.x === 28 &&
      player.position.y === 32 &&
      player.getVariable('post-first-recall') === true &&
      !this.hasTriggered
    ) {
      this.hasTriggered = true;
      await this.triggerScene(player);
    }
  }

  async triggerScene(player: RpgPlayer) {
    // 1. Spawn Artun
    this.callumEventId = await player.map.createDynamicEvent({
      x: 27, // Position Artun near the garden
      y: 32,
      id: 'callum_garden_dilemma_npc',
      graphic: 'npc_artun',
      name: 'Artun',
      speed: 0,
      // Artun is static for this scene
    });

    const callumEvent = player.map.getEvent(this.callumEventId);
    if (callumEvent) {
      await callumEvent.moveRoutes([
        Move.tile(27, 32), // Ensure Artun is at the correct spot
      ]);
    }

    // 2. Initial dialogue with Artun
    await player.showText(
      'Another stagnation zone? But this one feels... different. The crystal is lighter. Almost gentle.',
      { speaker: 'Artun' },
    );

    // 3. Spawn Rootwalker Echo
    const rootwalkerEchoEventId = await player.map.createDynamicEvent({
      x: 28, // Position Rootwalker Echo at the garden's center
      y: 32,
      id: 'rootwalker_echo_npc',
      graphic: 'npc_rootwalker_echo', // Assuming a graphic for the echo
      name: 'Rootwalker Gardener (echo)',
      speed: 0,
      // Echo is static for this scene
    });

    const rootwalkerEchoEvent = player.map.getEvent(rootwalkerEchoEventId);
    if (rootwalkerEchoEvent) {
      await rootwalkerEchoEvent.moveRoutes([
        Move.tile(28, 32), // Ensure echo is at the correct spot
      ]);
      rootwalkerEchoEvent.setGraphic('npc_rootwalker_echo_translucent'); // Make it translucent
    }

    // 4. Rootwalker Echo dialogue
    await player.showText('You can see me? Good. Then you can hear my request.', {
      speaker: 'Rootwalker Gardener (echo)',
    });
    await player.showText(
      "I am — I was — a Rootwalker. The last one to dissolve in this marsh. I spent my final years tending this garden. Every plant, every flower, every arrangement of stone and root — this was my life's masterpiece.",
      { speaker: 'Rootwalker Gardener (echo)' },
    );
    await player.showText(
      'When the Preservers came, I asked them to freeze it. Not the marsh. Not the world. Just this garden. Just these flowers, at their peak, in the morning light.',
      { speaker: 'Rootwalker Gardener (echo)' },
    );
    await player.showText(
      'They agreed. One of the few times they did exactly what was asked and nothing more.',
      { speaker: 'Rootwalker Gardener (echo)' },
    );
    await player.showText(
      "I know what you are, Architect. You break stagnation. That's good work — important work. But this garden isn't a cage. It's a gift. My last gift to the world.",
      { speaker: 'Rootwalker Gardener (echo)' },
    );
    await player.showText('Please. Leave it as it is.', { speaker: 'Rootwalker Gardener (echo)' });

    // 5. Fade Rootwalker Echo
    if (rootwalkerEchoEvent) {
      await rootwalkerEchoEvent.remove(); // Remove the dynamic event
    }

    // 6. Artun's reaction
    await player.showText("She asked for this. The Preservers didn't force it — she chose it.", {
      speaker: 'Artun',
    });
    await player.showText(
      "I... I don't know what the right answer is here. Breaking the crystal would free the garden to grow, to change, to eventually decay. That's what we believe in, isn't it? Growth? Change?",
      { speaker: 'Artun' },
    );
    await player.showText(
      'But she chose this. This is how she wanted to be remembered. Does our belief in change mean we override her choice?',
      { speaker: 'Artun' },
    );

    // 7. Show GUI for moral choice
    const choice = await player.gui('moral-choice').open({
      choices: [
        {
          id: 'break-crystal',
          text: "[Break the crystal]: The garden will grow and change. Vibrancy +5. The preserved flowers will wilt within hours as time catches up. The gardener's masterpiece will evolve into something new — but the original is lost.",
        },
        {
          id: 'leave-preserved',
          text: "[Leave it preserved]: The garden remains frozen. No vibrancy gain. But the Rootwalker's final wish is honored. A unique calm-type fragment appears at the garden's base as the echo's gratitude crystallizes.",
        },
      ],
    });

    if (choice) {
      if (choice.id === 'break-crystal') {
        await player.showText(
          'You broadcast a fragment, shattering the delicate crystals. The garden shivers, and the preserved flowers begin to wilt, their vibrant colors fading as time catches up. The marsh air feels a little lighter.',
          { speaker: 'SYSTEM' },
        );
        // Apply vibrancy change
        player.addVibrancy('shimmer-marsh', 5);
        // Artun's reaction
        await player.showText(
          "It was the right thing. Growth is always the right thing. ...Isn't it?",
          { speaker: 'Artun' },
        );
        // Visual effect for wilting (e.g., change graphic of the garden event itself)
        this.setGraphic('wilted_garden_patch'); // Assuming a graphic for the wilted garden
      } else if (choice.id === 'leave-preserved') {
        await player.showText(
          "You choose to honor the Rootwalker's final wish, leaving the crystallized garden untouched. A soft blue light emanates from the Resonance Stone, and a unique fragment materializes at its base.",
          { speaker: 'SYSTEM' },
        );
        // Give fragment reward
        player.addItem("MF-05: The Gardener's Peace", 1); // Assuming this is an item ID
        // Artun's reaction
        await player.showText(
          'Thank you. Some things deserve to stay as they are. Not everything — but some things.',
          { speaker: 'Artun' },
        );
        // Visual effect for fragment (e.g., spawn a temporary item graphic)
        await player.map.createDynamicEvent({
          x: 28,
          y: 32,
          id: 'garden_peace_fragment',
          graphic: '',
          name: "The Gardener's Peace",
          speed: 0,
          // This event could be interactive to pick up the fragment
        });
      }
    }

    // 8. Clean up Artun
    if (callumEvent) {
      await callumEvent.remove();
    }

    // Ensure this event doesn't trigger again
    this.setVariable('act2-scene6-moral-dilemma-garden-completed', true);
  }
}
