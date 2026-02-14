import { EventData, Move, RpgEvent, type RpgMap, type RpgPlayer } from '@rpgjs/server';
import { addItem, removeItem } from '../../systems/inventory';
import { completeQuest, getQuestStatus, isQuestActive, startQuest } from '../../systems/quests';

@EventData({
  id: 'act1-scene3-lira-workshop',
  name: "Hana's Workshop Scene",
  hitbox: { width: 32, height: 32 },
  // This event is triggered by map-enter, so it doesn't need a graphic or specific position.
  // It will be dynamically created or managed by the map's onReady hook.
})
export class HanaWorkshopEvent extends RpgEvent {
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
    const mq01Status = getQuestStatus(player, 'MQ-01');
    const mq02Status = getQuestStatus(player, 'MQ-02');
    const eventCompleted = player.getVariable('LIRA_WORKSHOP_SCENE_COMPLETED');

    if (mq01Status === 'active' && mq02Status !== 'active' && !eventCompleted) {
      await this.triggerScene(player);
      player.setVariable('LIRA_WORKSHOP_SCENE_COMPLETED', true);
    }
  }

  async triggerScene(player: RpgPlayer) {
    // 1. Spawn Hana NPC
    const hanaNpc = await player.map.createDynamicEvent({
      x: 9,
      y: 19,
      id: 'npc_hana_scene3',
      graphic: 'npc_hana',
      name: 'Hana',
      speed: 100,
      // Hana will be static during the dialogue
      // After the scene, she might roam or be removed/repositioned
    });

    // Ensure Hana is facing the player or a default direction
    await hanaNpc.changeDirection(Move.up); // Assuming player enters from bottom

    // 2. Play dialogue sequences
    await player.showText(
      "You must be the one Artun keeps talking about. I'm Hana — Mnemonic Architect, freelance, currently between assignments.",
      { speaker: 'Hana' },
    );
    await player.showText(
      "He told me you can see the shimmer around Resonance Stones. Most people can't. That's the first sign of the talent.",
      { speaker: 'Hana' },
    );
    await player.showText("Show me what you've collected.", { speaker: 'Hana' });

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
      { speaker: 'Hana' },
    );
    await player.showText(
      "I want to travel with you for a while, if that's all right. Artun tells me you're curious about the world beyond the village, and there are things I can teach you better in the field than in a workshop.",
      { speaker: 'Hana' },
    );

    // 3. Fire effects
    // Companion join
    await player.addCompanion('lira', 'cleric');
    await player.showText(
      'SYSTEM: Hana joins the party! (Cleric — simplified moveset: Joyful Mending, Sorrowful Cleanse, Awestruck Ward)',
      { speaker: 'SYSTEM' },
    );

    // Item give
    addItem(player, 'K-01', 1); // Assuming K-01 is the Architect's Signet
    await player.showText("SYSTEM: You received the Architect's Signet (K-01)!", {
      speaker: 'SYSTEM',
    });
    await player.showText(
      "Almost forgot. This marks you as one of us. You'll need it to interact with Resonance Stones properly.",
      { speaker: 'Hana' },
    );

    // 4. Update quest state
    completeQuest(player, 'MQ-01');
    startQuest(player, 'MQ-02');
    await player.showText(
      'SYSTEM: Quest "MQ-01" completed. Quest "MQ-02: Learn to fight" activated.',
      { speaker: 'SYSTEM' },
    );

    await player.showText(
      "Before we head out, let's get you properly introduced. Come to the Training Ground — north of the square. Best to learn the basics of defending yourself before we go anywhere interesting.",
      { speaker: 'Hana' },
    );

    // After the scene, Hana can be set to follow the player or move to a new position.
    // For now, let's make her follow the player.
    hanaNpc.setPlayerFollow(player);
    // Or if she should stay in the workshop but allow interaction:
    // hanaNpc.setGraphic('npc_hana'); // Ensure graphic is visible
    // hanaNpc.onAction = async (p) => { await p.showText('Hana: Ready when you are!'); };
  }
}

export default async function hanaWorkshopSetup(map: RpgMap) {
  // This function can be used to add the event to the map if it's not placed directly in Tiled.
  // For a map-enter trigger, it's often handled by the map's onReady hook or a global event manager.
  // If this event is placed in Tiled, this setup function might not be strictly necessary,
  // but it's good practice to have it for dynamic event creation or initial setup.
  // If the event is meant to be a single, map-wide trigger, it might not need a specific position
  // and can be instantiated once per map load.
  // However, the @EventData decorator already registers it.
  // The onChanges hook handles the actual trigger logic.
}
