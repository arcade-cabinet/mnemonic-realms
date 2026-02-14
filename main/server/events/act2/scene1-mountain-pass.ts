import {
  EventData,
  MapData,
  RpgCommonPlayer,
  RpgEvent,
  RpgMap,
  type RpgPlayer,
  RpgScene,
} from '@rpgjs/server';

@EventData({
  id: 'act2-scene1-mountain-pass',
  name: 'The Mountain Pass',
  hitbox: { width: 32, height: 32 },
})
export class MountainPassEvent extends RpgEvent {
  onInit() {
    this.set
      .graphic('event_invisible') // Invisible event, triggered by map entry
      .setHitbox(32, 32);
  }

  async onPlayerTouch(player: RpgPlayer) {
    // Trigger condition: Player enters map 'sunridge' at (20,2) and act2-unlocked is true
    // This event is placed at (20,2) on the 'sunridge' map.
    // The check for 'act2-unlocked' is done here.
    const act2Unlocked = player.getVariable('act2-unlocked');
    const questMQ05Status = player.getQuest('MQ-05')?.state;

    if (act2Unlocked && questMQ05Status !== 'activated' && questMQ05Status !== 'completed') {
      // Prevent re-triggering if quest is already active or completed
      player.setVariable('act2-unlocked', false); // Consume the trigger

      // 1. Dialogue: Player approaches the Threshold.
      await player.showText(
        'The player approaches the Threshold. Where a solid cliff face stood before, a narrow mountain pass now cuts through the rock. The stone is rough-hewn and new — no moss, no weathering. Morning light streams through the gap.',
      );

      // 2. Spawn Artun
      const callum = await this.map.createDynamicEvent({
        x: player.x - 1, // Spawn Artun slightly behind the player
        y: player.y,
        event: 'npc_artun', // Assuming 'npc_artun' is a registered RpgEvent class
        properties: {
          graphic: 'npc_artun',
          direction: 2, // Facing up
          speed: 100,
        },
      });

      // Ensure Artun is an RpgEvent instance to call its methods
      if (callum instanceof RpgEvent) {
        // Artun moves to the pass entrance
        await callum.moveRoutes([
          {
            x: player.x,
            y: player.y,
            time: 1000,
            speed: 100,
          },
          {
            x: player.x,
            y: player.y - 1,
            time: 500,
            speed: 100,
          },
        ]);
      }

      // Dialogue: Artun catches up
      await player.showText("Wait — wait for me. These old legs aren't what they were.", {
        speaker: 'Artun',
      });
      await player.showText(
        'The world opened this. Not you, not me — the world itself. It felt what happened to Hana and decided the Frontier needed reaching.',
        { speaker: 'Artun' },
      );
      await player.showText(
        "I told you I'd stay in the village, but I've been studying the Dissolved from my desk for forty years. If I'm ever going to see what's out there with my own eyes, it's now.",
        { speaker: 'Artun' },
      );

      // 3. Effects: Artun joins the party
      player.addCompanion('callum', { class: 'scholar' });
      await player.showText(
        'Artun joins the party! (Scholar — support moveset: Dissolved Insight, Memory Ward, Lore Pulse)',
        { type: 'system' },
      );

      await player.showText(
        "I won't be much use in a fight. But I know things about the Frontier that might keep you alive. And I brought these —",
        { speaker: 'Artun' },
      );
      await player.showText(
        "One letter per zone. I'll read them when we arrive. Think of it as... a traveler's guide, written by someone who's never actually traveled.",
        { speaker: 'Artun' },
      );

      // 4. Update quest state
      player.setQuest('MQ-05', 'activated');

      // Player and Artun enter the mountain pass.
      await player.showText(
        'The player and Artun enter the mountain pass. The path climbs steeply. The ambient audio shifts — wind intensifies, birdsong fades. The color palette begins to desaturate as they ascend.',
      );

      // First Frontier vista
      await player.showText(
        'Before you stretches a vast, shimmering expanse. Mountains, marshes, forests, and plains — but all of it softer than the Settled Lands. Colors are muted. Edges shimmer. The sky fades from blue to pale luminous white at the horizon. This is the Frontier — where the world is still being written.',
        { type: 'system' },
      );

      await player.showText(
        "I've dreamed about this view for thirty years. It's exactly as beautiful as I imagined. And exactly as unfinished.",
        { speaker: 'Artun' },
      );
      await player.showText(
        "Look there — see how those trees to the east flicker between solid and outline? And those marshlands to the south — the water doesn't quite sparkle. It's all waiting. Waiting for someone to remember it into fullness.",
        { speaker: 'Artun' },
      );
      await player.showText("That's your job now.", { speaker: 'Artun' });

      // Transition to Hollow Ridge
      await player.changeMap('hollow-ridge', { x: 25, y: 49 }); // Assuming Hollow Ridge southern entrance is (25,49)
    }
  }
}

// You would also need to define the npc_artun event if it's not already global
@EventData({
  id: 'npc_artun',
  name: 'Artun',
  graphic: 'npc_artun',
  hitbox: { width: 32, height: 32 },
})
export class NpcArtun extends RpgEvent {
  onInit() {
    this.setGraphic('npc_artun');
  }
}

export default function mountainPassSetup() {
  return [
    MountainPassEvent,
    NpcArtun, // Include Artun's NPC definition if it's not already globally available
  ];
}
