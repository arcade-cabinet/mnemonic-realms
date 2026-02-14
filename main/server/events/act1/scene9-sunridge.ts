import { EventData, Move, RpgCommonPlayer, RpgEvent, RpgMap, type RpgPlayer } from '@rpgjs/server';

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
    const questState = (player.get = 'quests');
    if (player.map.id === 'sunridge' && !questState['MQ-03']?.completed && !this.hasTriggered) {
      this.hasTriggered = true;
      await this.startScene(player);
    }
  }

  async onPlayerTouch(player: RpgPlayer) {
    // This event is primarily for map-enter, but we can add a safeguard
    // or specific interactions if the player touches a specific spot later.
    // For now, it's handled by onInit with map-enter trigger.
  }

  async startScene(player: RpgPlayer) {
    // Ensure Lira is present for the scene
    const lira = player.map.getEventByName('npc_lira');
    if (!lira) {
      player.map.createDynamicEvent({
        name: 'npc_lira',
        x: 20, // Lira's initial position for the scene
        y: 21,
        event: 'npc_lira', // Reference to the actual NPC event class
        properties: {
          graphic: 'npc_lira',
          direction: 0, // Facing south
          speed: 1,
        },
      });
    }

    // Ensure Preserver Scout is present
    const preserverScout = player.map.getEventByName('npc_preserver_scout');
    if (!preserverScout) {
      player.map.createDynamicEvent({
        name: 'npc_preserver_scout',
        x: 32, // Preserver Outpost position
        y: 15,
        event: 'npc_preserver_scout', // Reference to the actual NPC event class
        properties: {
          graphic: 'npc_preserver_scout',
          direction: 0, // Facing south
          speed: 0, // Static
        },
      });
    }

    // Wait for dynamic events to be created and accessible
    await player.map.delay(100);

    // --- Wind Shrine (10, 8) ---
    await player.showText(
      'Lira: This shrine is old. Pre-Dissolved old. Whoever built this was trying to capture something — the wind itself, maybe.',
      { speaker: 'Lira' },
    );
    await player.showText(
      'SYSTEM: The Resonance Stone vibrates with overwhelming energy. Something immense sleeps here — a memory too large for you to hold. Not yet.',
    );
    await player.showText(
      "Lira: Did you feel that? Speed. Motion. Joy of movement. Whatever's in that stone isn't just a memory — it's something alive. Dormant, but alive.",
      { speaker: 'Lira' },
    );
    await player.showText(
      "Lira: I've read about things like this in Callum's journals. He calls them 'dormant gods.' Prototypes — incomplete deities left behind by the Dissolved. If the right memories were channeled into them...",
      { speaker: 'Lira' },
    );
    await player.showText(
      "Lira: But that's far beyond what we can do right now. Let's keep it in mind and move on.",
      { speaker: 'Lira' },
    );

    // --- Preserver Outpost (32, 15) ---
    // Move Lira and player towards the outpost for the confrontation
    const liraEvent = player.map.getEventByName('npc_lira');
    if (liraEvent) {
      await liraEvent.moveRoutes([Move.tile(31, 16), Move.stop()]);
    }
    await player.moveRoutes([Move.tile(30, 16), Move.stop()]);

    await player.showText(
      'Preserver Scout: Halt. This area is under preservation protocol. You may observe, but do not approach the watchtower.',
      { speaker: 'Preserver Scout' },
    );
    await player.showText('Lira: Who are you?', { speaker: 'Lira' });
    await player.showText(
      'Preserver Scout: I am a watcher for the Curator. We maintain the borders — ensuring that the settled regions remain... stable. Unchanged. Safe.',
      { speaker: 'Preserver Scout' },
    );
    await player.showText("Lira: You call this safe? You've frozen an entire watchtower.", {
      speaker: 'Lira',
    });
    await player.showText(
      "Preserver Scout: We've preserved it. This tower was built by a civilization that chose to dissolve. In a generation, their work would have crumbled. Now it will endure forever. Every stone, every chisel mark. Exactly as it was.",
      { speaker: 'Preserver Scout' },
    );
    await player.showText('Lira: Exactly as it was. And never anything more.', { speaker: 'Lira' });
    await player.showText('Preserver Scout: That is the point.', { speaker: 'Preserver Scout' });

    // Scout turns away
    const scoutEvent = player.map.getEventByName('npc_preserver_scout');
    if (scoutEvent) {
      await scoutEvent.moveRoutes([
        Move.changeDirection(2), // Face away (north)
        Move.stop(),
      ]);
    }

    await player.showText(
      "Lira: The Preservers. That's who made the clearing in Heartfield. That's who's doing this.",
      { speaker: 'Lira' },
    );
    await player.showText(
      "Lira: They're not monsters. That scout was polite, even reasonable. But they want to freeze the whole world. Every stone, every river, every person — 'exactly as it was.'",
      { speaker: 'Lira' },
    );
    await player.showText(
      "Lira: We need to go back to Heartfield. I think it's time you learned to break a stagnation zone.",
      { speaker: 'Lira' },
    );

    // --- Quest Updates ---
    player.updateQuest('MQ-03', 'complete');
    player.updateQuest('MQ-04', 'activate');
    await player.showText(
      "QUEST: 'Break the Stagnation Clearing' — Return to Heartfield's Stagnation Clearing and broadcast a memory fragment into the crystallized Resonance Stone.",
    );

    // Clean up dynamic Lira if she was spawned for the scene
    if (liraEvent) {
      // Lira might have a persistent event, so we just move her to her default position or despawn if she's temporary
      // For now, let's assume she'll roam or move to a specific spot after the scene.
      // If she's a dynamic event for this scene only, we can remove her.
      // For this example, let's assume she's a persistent NPC that just moved for the scene.
      // If she was dynamically created for this scene, we'd remove her.
      // For now, let's just make her visible and let her follow her normal AI.
      liraEvent.setGraphic('npc_lira'); // Ensure correct graphic
      liraEvent.setDirection(0); // Default direction
      liraEvent.setSpeed(1); // Default speed
    }
    if (scoutEvent) {
      // The scout remains at the outpost, but can revert to a default state
      scoutEvent.setGraphic('npc_preserver_scout');
      scoutEvent.setDirection(0); // Default direction
      scoutEvent.setSpeed(0); // Static
    }
  }
}
