import { EventData, Move, RpgEvent, type RpgMap, type RpgPlayer } from '@rpgjs/server';

@EventData({
  id: 'act1-scene3-lira-workshop',
  name: "Lira's Workshop Scene",
  hitbox: { width: 32, height: 32 },
  // This event is triggered by map-enter, so it doesn't need a graphic or specific position.
  // It will be dynamically created or managed by the map's onReady hook.
})
export class LiraWorkshopEvent extends RpgEvent {
  onInit() {
    this.set({
      graphic: '', // Invisible event
      width: 0,
      height: 0,
    });
  }

  async onChanges(player: RpgPlayer) {
    // This event should only trigger once per game, specifically when MQ-01 is active and MQ-02 is not.
    // It's designed to be a map-enter trigger for the scene.
    const mq01Status = player.getQuest('MQ-01')?.state;
    const mq02Status = player.getQuest('MQ-02')?.state;
    const eventCompleted = player.getVariable('LIRA_WORKSHOP_SCENE_COMPLETED');

    if (mq01Status === 'active' && mq02Status !== 'active' && !eventCompleted) {
      await this.triggerScene(player);
      player.setVariable('LIRA_WORKSHOP_SCENE_COMPLETED', true);
    }
  }

  async triggerScene(player: RpgPlayer) {
    // 1. Spawn Lira NPC
    const liraNpc = await player.map.createDynamicEvent({
      x: 9,
      y: 19,
      id: 'npc_lira_scene3',
      graphic: 'npc_lira',
      name: 'Lira',
      speed: 100,
      // Lira will be static during the dialogue
      // After the scene, she might roam or be removed/repositioned
    });

    // Ensure Lira is facing the player or a default direction
    await liraNpc.changeDirection(Move.up); // Assuming player enters from bottom

    // 2. Play dialogue sequences
    await player.showText(
      "You must be the one Callum keeps talking about. I'm Lira — Mnemonic Architect, freelance, currently between assignments.",
      { speaker: 'Lira' },
    );
    await player.showText(
      "He told me you can see the shimmer around Resonance Stones. Most people can't. That's the first sign of the talent.",
      { speaker: 'Lira' },
    );
    await player.showText("Show me what you've collected.", { speaker: 'Lira' });

    // [The player's fragment inventory appears briefly on screen — a visual grid showing all 4 fragments.]
    // This would typically be a GUI call. For now, we'll simulate with a text message.
    await player.showText(
      'SYSTEM: Your fragment inventory (Joy, Calm, Joy, Sorrow) is displayed.',
      { speaker: 'SYSTEM' },
    );
    // Example of a GUI call if you had a 'fragmentInventory' GUI:
    // await player.gui('fragmentInventory').open();
    // await player.wait(2000); // Wait for player to view
    // await player.gui('fragmentInventory').close();

    await player.showText(
      "Four fragments already? From the garden stones? Good instincts. You didn't force them — you just... noticed. That's exactly right.",
      { speaker: 'Lira' },
    );
    await player.showText(
      "I want to travel with you for a while, if that's all right. Callum tells me you're curious about the world beyond the village, and there are things I can teach you better in the field than in a workshop.",
      { speaker: 'Lira' },
    );

    // 3. Fire effects
    // Companion join
    await player.addCompanion('lira', 'cleric');
    await player.showText(
      'SYSTEM: Lira joins the party! (Cleric — simplified moveset: Joyful Mending, Sorrowful Cleanse, Awestruck Ward)',
      { speaker: 'SYSTEM' },
    );

    // Item give
    await player.addItem('K-01', 1); // Assuming K-01 is the Architect's Signet
    await player.showText("SYSTEM: You received the Architect's Signet (K-01)!", {
      speaker: 'SYSTEM',
    });
    await player.showText(
      "Almost forgot. This marks you as one of us. You'll need it to interact with Resonance Stones properly.",
      { speaker: 'Lira' },
    );

    // 4. Update quest state
    player.updateQuest('MQ-01', 'complete');
    player.updateQuest('MQ-02', 'activate');
    await player.showText(
      'SYSTEM: Quest "MQ-01" completed. Quest "MQ-02: Learn to fight" activated.',
      { speaker: 'SYSTEM' },
    );

    await player.showText(
      "Before we head out, let's get you properly introduced. Come to the Training Ground — north of the square. Best to learn the basics of defending yourself before we go anywhere interesting.",
      { speaker: 'Lira' },
    );

    // After the scene, Lira can be set to follow the player or move to a new position.
    // For now, let's make her follow the player.
    liraNpc.setPlayerFollow(player);
    // Or if she should stay in the workshop but allow interaction:
    // liraNpc.setGraphic('npc_lira'); // Ensure graphic is visible
    // liraNpc.onAction = async (p) => { await p.showText('Lira: Ready when you are!'); };
  }
}

export default async function liraWorkshopSetup(map: RpgMap) {
  // This function can be used to add the event to the map if it's not placed directly in Tiled.
  // For a map-enter trigger, it's often handled by the map's onReady hook or a global event manager.
  // If this event is placed in Tiled, this setup function might not be strictly necessary,
  // but it's good practice to have it for dynamic event creation or initial setup.
  // If the event is meant to be a single, map-wide trigger, it might not need a specific position
  // and can be instantiated once per map load.
  // However, the @EventData decorator already registers it.
  // The onChanges hook handles the actual trigger logic.
}
