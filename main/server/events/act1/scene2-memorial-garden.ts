import { Direction, EventData, MoveType, RpgEvent, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { addItem } from '../../systems/inventory';
import { advanceObjective, isQuestActive } from '../../systems/quests';

@EventData({
  id: 'act1-scene2-memorial-garden',
  name: 'The Memorial Garden Scene',
  hitbox: { width: 32, height: 32 },
  // This event is triggered by area-enter on the map, so it doesn't need a graphic or explicit position here.
  // Its logic will be called by the map's onPlayerTouch or a custom area trigger.
})
export class MemorialGardenEvent extends RpgEvent {
  onInit() {
    this.set({
      name: 'Memorial Garden Scene Trigger',
      // This event itself doesn't have a graphic, it's a scene controller.
      // Individual Resonance Stones will be dynamic events.
      graphic: '',
      width: 32,
      height: 32,
    });
  }

  async onPlayerTouch(player: RpgPlayer) {
    // Check if the player is on the specific map and coordinates for the scene trigger
    if (
      player.map.id === 'village-hub' &&
      player.position.x === 8 * 16 &&
      player.position.y === 16 * 16
    ) {
      // Check if MQ-01 is active and objective 2 is not yet completed
      if (isQuestActive(player, 'MQ-01') && player.getVariable('QUEST_MQ-01_OBJ') === 'obj1') {
        await this.startMemorialGardenScene(player);
      }
    }
  }

  private async startMemorialGardenScene(player: RpgPlayer) {
    // Prevent re-triggering the scene if already in progress or completed
    if (player.getVariable('MEMORIAL_GARDEN_SCENE_COMPLETED')) {
      return;
    }
    player.setVariable('MEMORIAL_GARDEN_SCENE_COMPLETED', true);

    // --- Scene Start ---
    await player.showText(
      'The Resonance Stone pulses with warmth. Something lingers here — a memory, waiting to be noticed.',
      {
        talkWith: this,
      },
    );

    // Create dynamic Resonance Stone events
    const stone1Id = 'RS-VH-02-dynamic'; // Calm/Neutral
    const stone2Id = 'RS-VH-03-dynamic'; // Joy/Light
    const stone3Id = 'RS-VH-01-dynamic'; // Joy/Neutral (from reference, but using the one from the script for the 3rd stone)

    // Resonance Stone 1: Calm/Neutral
    const stone1 = await player.map.createDynamicEvent({
      x: 9,
      y: 16,
      name: 'Resonance Stone 1',
      graphic: '',
      width: 16,
      height: 16,
      id: stone1Id,
      onAction: async (p: RpgPlayer) => {
        if (p.getVariable('MEMORIAL_GARDEN_STONE1_COLLECTED')) return;
        p.setVariable('MEMORIAL_GARDEN_STONE1_COLLECTED', true);

        await p.showText(
          'You reach toward the stone. A faint image surfaces: a child placing wildflowers between the stones, humming a wordless tune. The memory crystallizes in your hand.',
          {
            talkWith: this,
          },
        );
        await p.showText(
          'You collected a Memory Fragment! (Joy, Earth, ★)\nMemory fragments hold emotions and elements. You can view your collection in the Memory menu.',
          {
            talkWith: this,
          },
        );
        addItem(p, 'frag-joy-earth-1', 1); // Joy/Earth/Potency 1
        await p.gui('memory-menu').open(); // Teach menu navigation
        await p.map.removeEvent(stone1Id); // Stone collected, remove dynamic event
        await this.checkSceneCompletion(p);
      },
    });

    // Resonance Stone 2: Joy/Light
    const stone2 = await player.map.createDynamicEvent({
      x: 10,
      y: 17,
      name: 'Resonance Stone 2',
      graphic: '',
      width: 16,
      height: 16,
      id: stone2Id,
      onAction: async (p: RpgPlayer) => {
        if (p.getVariable('MEMORIAL_GARDEN_STONE2_COLLECTED')) return;
        p.setVariable('MEMORIAL_GARDEN_STONE2_COLLECTED', true);

        await p.showText(
          'Another memory: an old woman sitting beside this stone in the rain, speaking to it like a friend. Her words are too faint to hear, but the feeling is clear.',
          {
            talkWith: this,
          },
        );
        addItem(p, 'frag-calm-neutral-1', 1); // Calm/Neutral/Potency 1
        await p.map.removeEvent(stone2Id); // Stone collected, remove dynamic event
        await this.checkSceneCompletion(p);
      },
    });

    // Resonance Stone 3: Awe/Wind (using the reference's fragment, not the RS-VH-01 from the table)
    const stone3 = await player.map.createDynamicEvent({
      x: 11,
      y: 16, // Adjusted position to be distinct from others
      name: 'Resonance Stone 3',
      graphic: '',
      width: 16,
      height: 16,
      id: stone3Id,
      onAction: async (p: RpgPlayer) => {
        if (p.getVariable('MEMORIAL_GARDEN_STONE3_COLLECTED')) return;
        p.setVariable('MEMORIAL_GARDEN_STONE3_COLLECTED', true);

        await p.showText(
          'This stone holds something deeper. A brief flash: a group of people, hands joined around these very stones, singing a song that makes the garden bloom. You feel the song more than hear it.',
          {
            talkWith: this,
          },
        );
        addItem(p, 'frag-awe-wind-2', 1); // Awe/Wind/Potency 2
        await p.map.removeEvent(stone3Id); // Stone collected, remove dynamic event
        await this.checkSceneCompletion(p);
      },
    });

    // Store dynamic event IDs for later cleanup if needed
    player.setVariable('MEMORIAL_GARDEN_STONES', [stone1Id, stone2Id, stone3Id]);
  }

  private async checkSceneCompletion(player: RpgPlayer) {
    const stone1Collected = player.getVariable('MEMORIAL_GARDEN_STONE1_COLLECTED');
    const stone2Collected = player.getVariable('MEMORIAL_GARDEN_STONE2_COLLECTED');
    const stone3Collected = player.getVariable('MEMORIAL_GARDEN_STONE3_COLLECTED');

    if (stone1Collected && stone2Collected && stone3Collected) {
      // All fragments collected, advance quest and show final message
      await player.showText(
        "You now carry 4 memory fragments. Artun mentioned Hana's Workshop — she can teach you what to do with them.",
        {
          talkWith: this,
        },
      );
      advanceObjective(player, 'MQ-01'); // Advance MQ-01 to objective 2
      await player.call('system-message', { text: 'You now carry 4 memory fragments.' });

      // Clean up dynamic events
      const stoneIds = player.getVariable('MEMORIAL_GARDEN_STONES') as string[];
      if (stoneIds) {
        for (const id of stoneIds) {
          player.map.removeEvent(id);
        }
        player.setVariable('MEMORIAL_GARDEN_STONES', null);
      }

      // Optional: Trigger subtle bloom animation (client-side effect, not directly handled here)
      // This would typically be a client-side event listening for a server-side broadcast or map property change.
      // Example: player.map.setTileProperty(8, 16, 'vibrancy', 62); // If vibrancy affects client-side visuals
    }
  }
}

export default MemorialGardenEvent;
