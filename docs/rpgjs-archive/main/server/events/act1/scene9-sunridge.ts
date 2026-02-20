import { EventData, Move, RpgEvent, type RpgPlayer } from '@rpgjs/server';
import { completeQuest, startQuest } from '../../systems/quests';

@EventData({
  name: 'act1-scene9-sunridge',
  map: 'sunridge',
  trigger: 'map-enter',
  hitbox: { width: 32, height: 32 },
  // This event is an auto-trigger for the scene, so it doesn't need a specific position
  // It will be handled by the map-enter trigger on the 'sunridge' map.
  // We'll use a dummy position for internal consistency if needed, but the trigger handles it.
  x: 0,
  y: 0,
  z: 0,
})
export default class SunridgeSceneEvent extends RpgEvent {
  private hasTriggered: boolean = false;

  async onInit(player: RpgPlayer) {
    // This event should only trigger once per player's first visit to Sunridge
    const questState = player.getVariable('quests') ?? {};
    if (player.map.id === 'sunridge' && !questState['MQ-03']?.completed && !this.hasTriggered) {
      this.hasTriggered = true;
      await this.startScene(player);
    }
  }

  async onPlayerTouch(_player: RpgPlayer) {
    // This event is primarily for map-enter, but we can add a safeguard
    // or specific interactions if the player touches a specific spot later.
    // For now, it's handled by onInit with map-enter trigger.
  }

  async startScene(player: RpgPlayer) {
    // Spawn Hana for the scene
    // NOTE: getEventByName is not available in RPG-JS 4.3.0, so we always create and track
    const hanaResult = await player.map.createDynamicEvent({
      x: 20, // Hana's initial position for the scene
      y: 21,
      event: 'npc_hana', // Reference to the actual NPC event class
      properties: {
        graphic: 'npc_hana',
        direction: 0, // Facing south
        speed: 1,
      },
    });

    // Spawn Preserver Scout for the scene
    const scoutResult = await player.map.createDynamicEvent({
      x: 32, // Preserver Outpost position
      y: 15,
      event: 'npc_preserver_scout', // Reference to the actual NPC event class
      properties: {
        graphic: 'npc_preserver_scout',
        direction: 0, // Facing south
        speed: 0, // Static
      },
    });

    // Wait for dynamic events to be created and accessible
    await new Promise((resolve) => setTimeout(resolve, 100));

    // --- Wind Shrine (10, 8) ---
    await player.showText(
      'Hana: This shrine is old. Pre-Dissolved old. Whoever built this was trying to capture something — the wind itself, maybe.',
      { speaker: 'Hana' },
    );
    await player.showText(
      'SYSTEM: The Resonance Stone vibrates with overwhelming energy. Something immense sleeps here — a memory too large for you to hold. Not yet.',
    );
    await player.showText(
      "Hana: Did you feel that? Speed. Motion. Joy of movement. Whatever's in that stone isn't just a memory — it's something alive. Dormant, but alive.",
      { speaker: 'Hana' },
    );
    await player.showText(
      "Hana: I've read about things like this in Artun's journals. He calls them 'dormant gods.' Prototypes — incomplete deities left behind by the Dissolved. If the right memories were channeled into them...",
      { speaker: 'Hana' },
    );
    await player.showText(
      "Hana: But that's far beyond what we can do right now. Let's keep it in mind and move on.",
      { speaker: 'Hana' },
    );

    // --- Preserver Outpost (32, 15) ---
    // Move Hana and player towards the outpost for the confrontation
    // NOTE: Using hanaResult from createDynamicEvent (getEventByName not available in RPG-JS 4.3.0)
    if (hanaResult) {
      await hanaResult.moveRoutes([Move.tile(31, 16), Move.stop()]);
    }
    await player.moveRoutes([Move.tile(30, 16), Move.stop()]);

    await player.showText(
      'Preserver Scout: Halt. This area is under preservation protocol. You may observe, but do not approach the watchtower.',
      { speaker: 'Preserver Scout' },
    );
    await player.showText('Hana: Who are you?', { speaker: 'Hana' });
    await player.showText(
      'Preserver Scout: I am a watcher for the Curator. We maintain the borders — ensuring that the settled regions remain... stable. Unchanged. Safe.',
      { speaker: 'Preserver Scout' },
    );
    await player.showText("Hana: You call this safe? You've frozen an entire watchtower.", {
      speaker: 'Hana',
    });
    await player.showText(
      "Preserver Scout: We've preserved it. This tower was built by a civilization that chose to dissolve. In a generation, their work would have crumbled. Now it will endure forever. Every stone, every chisel mark. Exactly as it was.",
      { speaker: 'Preserver Scout' },
    );
    await player.showText('Hana: Exactly as it was. And never anything more.', { speaker: 'Hana' });
    await player.showText('Preserver Scout: That is the point.', { speaker: 'Preserver Scout' });

    // Scout turns away
    // NOTE: Using scoutResult from createDynamicEvent (getEventByName not available in RPG-JS 4.3.0)
    if (scoutResult) {
      await scoutResult.moveRoutes([
        Move.changeDirection(2), // Face away (north)
        Move.stop(),
      ]);
    }

    await player.showText(
      "Hana: The Preservers. That's who made the clearing in Heartfield. That's who's doing this.",
      { speaker: 'Hana' },
    );
    await player.showText(
      "Hana: They're not monsters. That scout was polite, even reasonable. But they want to freeze the whole world. Every stone, every river, every person — 'exactly as it was.'",
      { speaker: 'Hana' },
    );
    await player.showText(
      "Hana: We need to go back to Heartfield. I think it's time you learned to break a stagnation zone.",
      { speaker: 'Hana' },
    );

    // --- Quest Updates ---
    completeQuest(player, 'MQ-03');
    startQuest(player, 'MQ-04');
    await player.showText(
      "QUEST: 'Break the Stagnation Clearing' — Return to Heartfield's Stagnation Clearing and broadcast a memory fragment into the crystallized Resonance Stone.",
    );

    // Clean up dynamic Hana if she was spawned for the scene
    if (hanaResult) {
      // Hana might have a persistent event, so we just move her to her default position or despawn if she's temporary
      // For now, let's assume she'll roam or move to a specific spot after the scene.
      // If she's a dynamic event for this scene only, we can remove her.
      // For this example, let's assume she's a persistent NPC that just moved for the scene.
      // If she was dynamically created for this scene, we'd remove her.
      // For now, let's just make her visible and let her follow her normal AI.
      hanaResult.setGraphic('npc_hana'); // Ensure correct graphic
      hanaResult.setDirection(0); // Default direction
      hanaResult.setSpeed(1); // Default speed
    }
    if (scoutResult) {
      // The scout remains at the outpost, but can revert to a default state
      scoutResult.setGraphic('npc_preserver_scout');
      scoutResult.setDirection(0); // Default direction
      scoutResult.setSpeed(0); // Static
    }
  }
}
