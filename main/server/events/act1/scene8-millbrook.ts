import { EventData, RpgEvent, type RpgPlayer } from '@rpgjs/server';
import { advanceObjective, startQuest } from '../../systems/quests';

@EventData({
  id: 'act1-scene8-millbrook',
  name: 'Millbrook — River of Memory',
  hitbox: { width: 32, height: 32 },
  // This event is triggered on map entry, so no specific position is needed for the main event.
  // Dynamic events will be created for NPCs.
})
export class MillbrookSceneEvent extends RpgEvent {
  onInit() {
    this.set({
      name: 'Millbrook Scene Trigger',
      // This event is invisible and serves as a scene trigger
      graphic: '',
      visible: false,
    });
  }

  async onPlayerTouch(player: RpgPlayer) {
    // Check if the player is on the 'millbrook' map and it's their first visit for this scene.
    // The map-enter trigger is handled by checking player.getVariable('first_visit_millbrook_scene8')
    // and the current map ID.
    if (player.map.id === 'millbrook' && !player.getVariable('first_visit_millbrook_scene8')) {
      await this.triggerScene(player);
    }
  }

  async onPlayerChanges(player: RpgPlayer) {
    // This hook is called when player properties change, including map.
    // We use it to detect map entry for the first time.
    if (player.map.id === 'millbrook' && !player.getVariable('first_visit_millbrook_scene8')) {
      await this.triggerScene(player);
    }
  }

  private async triggerScene(player: RpgPlayer) {
    // Ensure the scene only triggers once per player
    if (player.getVariable('first_visit_millbrook_scene8')) {
      return;
    }
    player.setVariable('first_visit_millbrook_scene8', true);

    // 1. Effects: System message
    await player.showText('Millbrook: riverside town with specialty shops and hidden grotto.', {
      system: true,
      time: 3000,
    });

    // 2. Spawn Hana (npc_hana)
    // Hana's initial position for this scene is near the town center or where the player enters.
    // Based on "Millbrook Town (15, 15)" and "Hana: Millbrook. More people here..."
    // Let's place her near the player's entry point or a central location.
    // Assuming player enters from (39, 20) from Everwick, Hana could be at (35, 20) or (15, 15)
    const _hana = await player.map.createDynamicEvent({
      x: 15, // Central Millbrook location
      y: 15,
      event: HanaMillbrookEvent,
      properties: {
        graphic: 'npc_hana',
        direction: 0, // Facing down
      },
    });

    // 3. Dialogue calls
    await player.showText(
      'Millbrook. More people here — more memories layered into the stones. This town has been remembered well.',
      { speaker: 'Hana' },
    );

    await player.showText(
      "The specialty shop here carries supplies you won't find in the village. Worth a look before we head further.",
      { speaker: 'Hana' },
    );

    await player.showText(
      "See the Brightwater Bridge? There's a Resonance Stone near the falls upstream. I can feel it from here.",
      { speaker: 'Hana' },
    );

    // 4. Quest Changes: MQ-03 → advance (obj 2)
    startQuest(player, 'MQ-03'); // Ensure MQ-03 is active if not already
    advanceObjective(player, 'MQ-03'); // Advance to objective 1
    advanceObjective(player, 'MQ-03'); // Advance to objective 2

    // Additional scene elements (not directly handled by this trigger, but good to note for other events)
    // - Specialty Shopkeeper (EV-MB-003) at (15, 15)
    // - Brightwater Bridge Resonance Stone (RS-MB-01) at (21, 19)
    // - Upstream Falls secret area (CH-MB-01, RS-MB-02, RS-MB-04) at (7, 5) and (8, 5)
    // - Fisher Lane (EV-MB-001) at (29, 29)
    // - Remix strategy tutorial (triggered after collecting water fragments)
  }
}

@EventData({
  id: 'npc_hana_millbrook_scene8',
  name: 'Hana',
  hitbox: { width: 32, height: 32 },
})
export class HanaMillbrookEvent extends RpgEvent {
  onInit() {
    this.setGraphic('npc_hana');
    this.setDirection(0); // Facing down
  }

  async onAction(player: RpgPlayer) {
    // Hana's dialogue when interacted with after the initial scene trigger
    if (player.getVariable('first_visit_millbrook_scene8')) {
      // Check if player has collected water-affinity fragments
      const fragmentCount = player.getVariable('FRAGMENT_COUNT') ?? 0;
      const hasWaterFragments = fragmentCount > 0;

      if (
        player.getVariable('found_upstream_falls_grotto') &&
        !player.getVariable('lira_remix_tutorial_given')
      ) {
        await player.showText(
          'You found the grotto fragments! These are special — water-touched memories carry different resonances.',
          { speaker: 'Hana' },
        );
        await player.showText(
          'Let me show you something. When you combine fragments, their emotions blend. Two joy fragments create something brighter than either alone.',
          { speaker: 'Hana' },
        );
        await player.showText(
          'But mixing emotions — joy with fury, or sorrow with awe — creates compound memories. Richer, stranger, more powerful.',
          { speaker: 'Hana' },
        );
        await player.showText(
          "And if a fragment's emotion matches the zone's natural resonance, broadcasting it there creates a harmonic bonus. The world responds more strongly.",
          { speaker: 'Hana' },
        );
        player.setVariable('lira_remix_tutorial_given', true);
      } else if (!player.getVariable('lira_remix_tutorial_given') && hasWaterFragments) {
        await player.showText(
          "You've collected some fragments. Let me teach you about remixing — combining fragments to create new memories.",
          { speaker: 'Hana' },
        );
        await player.showText(
          'Mixing emotions — joy with fury, or sorrow with awe — creates compound memories. Richer and more powerful.',
          { speaker: 'Hana' },
        );
        await player.showText(
          "Match a fragment's emotion to the zone's resonance when broadcasting for a harmonic bonus.",
          { speaker: 'Hana' },
        );
        player.setVariable('lira_remix_tutorial_given', true);
      } else {
        await player.showText(
          'Millbrook is well-remembered. The people here have strong connections to this place.',
          { speaker: 'Hana' },
        );
      }
    }
  }
}

// Export the setup function as default
export default async function setup() {
  // No global setup needed here, as the main event handles its own trigger logic.
  // Dynamic events like Hana are created by the main scene event.
}
