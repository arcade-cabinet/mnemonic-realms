import {
  createDynamicEvent,
  EventData,
  RpgEvent,
  RpgMap,
  type RpgPlayer,
} from '@rpgjs/server';
import { addItem, removeItem } from '../../systems/inventory';

@EventData({
  id: 'act1-scene4-training-ground',
  name: 'The Training Ground',
  hitbox: { width: 32, height: 32 },
  // This event is triggered by area-enter, so it doesn't need a graphic or specific position on the map itself.
  // It's a conceptual event that fires when the player enters the designated area.
  // We'll use onChanges to check the player's position and conditions.
  // For a scene event, it's often better to manage its lifecycle explicitly rather than relying on a static map event.
  // However, if we were to place it, it would be at (8,10) on village-hub.
})
export class TrainingGroundEvent extends RpgEvent {
  private hasTriggered = false; // Ensure the scene only plays once

  onInit() {
    this.set({
      name: 'TrainingGroundTrigger',
      // This event is invisible and only serves as a trigger point
      graphic: '',
      width: 1,
      height: 1,
      // We don't need a specific position here as it's handled by onChanges for area-enter
      // If it were a static event, it would be at (8,10)
      visible: false,
    });
  }

  async onChanges(player: RpgPlayer) {
    if (this.hasTriggered) {
      return;
    }

    // Trigger condition: map: village-hub, pos: 8,10, condition: lira-in-party
    const playerMap = player.map;
    const playerX = player.position.x;
    const playerY = player.position.y;

    const isAtTrainingGround = playerMap?.id === 'village-hub' && playerX === 8 && playerY === 10;
    const liraInParty = player.getVariable('LIRA_IN_PARTY') === true; // Assuming a global variable for party status

    if (isAtTrainingGround && liraInParty) {
      this.hasTriggered = true;
      await this.startScene(player);
    }
  }

  async startScene(player: RpgPlayer) {
    // Prevent re-triggering if player moves off and back on the tile during the scene
    this.setVariable('ACT1_SCENE4_TRAINING_GROUND_COMPLETED', true);

    // 1. Spawn Hana (npc_hana) at a suitable position near the player for dialogue
    // Assuming Hana is already in the party, this is more about her "presence" for the scene.
    // If Hana is a party member, she might already be following.
    // For dialogue, we might want a dedicated NPC instance for the scene.
    const hanaEvent = await createDynamicEvent({
      map: player.map,
      x: player.position.x + 1, // Place Hana next to the player
      y: player.position.y,
      event: {
        name: 'Hana_Scene4_NPC',
        graphic: 'npc_hana',
        speed: 1,
        direction: 0, // Facing player
        width: 1,
        height: 1,
        sync: true,
        properties: {
          isSceneNPC: true, // Custom property to identify scene-specific NPCs
        },
      },
    });

    // Ensure Hana is facing the player
    if (hanaEvent) {
      hanaEvent.event.setDirection(player.direction); // Hana faces player
      player.setDirection(hanaEvent.event.direction); // Player faces Hana
    }

    // 2. Dialogue sequences via player.showText()
    await player.showText(
      "See those practice dummies? They're enchanted with a bit of memory energy — enough to fight back. Don't worry, they can't actually hurt you much.",
      { speaker: 'Hana' },
    );

    // 3. Combat Tutorial 1: 2x Training Dummy
    await player.showText(
      'SYSTEM — COMBAT TUTORIAL: Attack: Strike with your weapon. Damage depends on your ATK stat. Skill: Use a class ability. Your skills cost SP (Skill Points). Item: Use a consumable from your inventory. Defend: Reduce incoming damage and recover a little SP.',
      { speaker: 'SYSTEM', type: 'dialog' },
    );

    // Hana's in-combat dialogue is handled by the combat system itself, not here.
    // The combat system would check if Hana is in the party and trigger her specific lines.
    await player.showText(
      "I'll keep you standing. Focus on the dummies — try your class skill when you have SP for it.",
      { speaker: 'Hana' },
    );

    await player.call('combat-start', {
      encounter: 'tutorial-dummies',
      enemies: '2x Training Dummy',
    });

    await player.showText("Not bad at all. You're a natural.", { speaker: 'Hana' });

    // 4. Combat Tutorial 2: 1x Meadow Sprite
    await player.showText(
      "Now a real one. This little sprite wandered in from the fields south of here. It won't go easy on you — but it won't go hard, either.",
      { speaker: 'Hana' },
    );
    await player.call('combat-start', {
      encounter: 'tutorial-sprite',
      enemies: '1x Meadow Sprite',
    });

    // After victory, if fragment drop triggers (scripted to succeed for tutorial):
    // This would typically be handled by the combat system's loot drop logic.
    // For a scripted tutorial, we can ensure it here.
    addItem(player, 'FRAG-JOY-EARTH-1', 1); // Assuming this is the item ID for Joy/Earth/1★ fragment
    await player.showText(
      'Well done! You earned that. Sprites drop a little gold and sometimes... yes, there it is.',
      { speaker: 'Hana' },
    );
    await player.showText(
      'SYSTEM: Some enemies carry trace memories. Defeating them can release these as fragments. (Boss enemies always drop fragments.)',
      { speaker: 'SYSTEM', type: 'dialog' },
    );

    // Part B: Remix and Broadcast Tutorial (Scene transitions back to Hana's Workshop)
    await player.showText(
      'Now for the real work. Come back to the Workshop — I want to show you the Remix Table.',
      { speaker: 'Hana' },
    );

    // Teleport player and Hana to the workshop (assuming workshop is at 9,19 in Village Hub)
    await player.changeMap('village-hub', { x: 9, y: 19 });
    if (hanaEvent) {
      await hanaEvent.event.changeMap('village-hub', { x: 10, y: 19 }); // Hana next to player in workshop
    }

    await player.showText(
      "You've got a handful of small fragments. Individually, they're minor — barely a whisper of memory. But combined?",
      { speaker: 'Hana' },
    );
    await player.showText(
      'Place two fragments on the table. Same emotion works best for your first try.',
      { speaker: 'Hana' },
    );
    await player.showText(
      'SYSTEM: Select 2 fragments of the same emotion to Remix. (The two Joy/Earth/1★ fragments are highlighted as a suggested combination.)',
      { speaker: 'SYSTEM', type: 'dialog' },
    );

    // GUI for Remix Tutorial
    await player.gui('remix-tutorial').open();
    // The GUI itself would handle the remix logic and close itself.
    // For now, we'll simulate its completion.
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate player interacting with GUI
    await player.gui('remix-tutorial').close();

    // After Remix (simulated)
    addItem(player, 'K-03', 1); // Give Remix Table Access
    await player.showText(
      'SYSTEM: Remix complete! Two fragments combined into a stronger one. Remixing consumes the input fragments — choose carefully.',
      { speaker: 'SYSTEM', type: 'dialog' },
    );
    await player.showText(
      'SYSTEM: Unlock: Remix Table Access (K-03). You can now use any Remix Table in the game.',
      { speaker: 'SYSTEM', type: 'dialog' },
    );
    await player.showText('Beautiful. Feel the difference? That fragment has weight to it now.', {
      speaker: 'Hana',
    });
    await player.showText('One more thing. The most important thing.', { speaker: 'Hana' });

    // Broadcasting Tutorial
    await player.showText(
      'Broadcasting. This is how Architects change the world. Hold a fragment and push it outward — into the plant, into the room, into anything that can receive it.',
      { speaker: 'Hana' },
    );
    await player.showText(
      'Try it. Use the fragment I gave you earlier — the memory of my first broadcast. It seems fitting.',
      { speaker: 'Hana' },
    );

    // Player broadcasts MF-02: Hana's Warmth
    // This would involve a player action, likely via a GUI or specific interaction.
    // For the tutorial, we can script it.
    removeItem(player, 'MF-02', 1); // Consume Hana's Warmth fragment
    await player.call('vibrancy-change', { zone: 'village-hub', delta: 12 }); // Apply vibrancy change
    await player.showText(
      'SYSTEM: You broadcast "Hana\'s Warmth" into the workshop. Vibrancy in Village Hub increased by +12! (potency 3 × 3 = 9, +3 emotion match [Joy resonates with Village Hub]) The world remembers what you shared.',
      { speaker: 'SYSTEM', type: 'dialog' },
    );
    await player.showText(
      "That was my memory — the first time I ever did this, years ago. And now you've given it back to the world. Better than it was.",
      { speaker: 'Hana' },
    );
    await player.showText(
      "That's what we do. Collect. Remix. Broadcast. The world gets brighter. Ready to see what's beyond the village?",
      { speaker: 'Hana' },
    );

    // 5. Update quest state
    player.setVariable('quest_MQ-02_objective_3_completed', true); // Advance MQ-02 objective 3
    player.setVariable('quest_MQ-02_completed', true); // Complete MQ-02

    // Clean up dynamic NPC
    if (hanaEvent) {
      hanaEvent.event.remove();
    }
  }
}

export default TrainingGroundEvent;
