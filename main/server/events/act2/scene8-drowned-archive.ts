import { Direction } from '@rpgjs/common';
import {
  EventData,
  RpgCommonEvent,
  RpgEvent,
  type RpgMap,
  type RpgPlayer,
  RpgSceneMap,
} from '@rpgjs/server';

@EventData({
  name: 'act2-scene8-drowned-archive',
  hitbox: { width: 32, height: 32 },
})
export default class DrownedArchiveEvent extends RpgEvent {
  onInit() {
    this.set({
      name: 'Drowned Archive Scene Trigger',
      // This event is invisible, it's just a trigger
      graphic: '',
      width: 1,
      height: 1,
      // Auto-trigger on map enter
      syncWithPlayer: false,
      priority: 0,
      through: true,
      speed: 0,
      canChangeMap: false,
      is: 'object',
      visible: false,
    });
  }

  async onChanges(player: RpgPlayer) {
    // Check if the player has entered 'depths-l2' map
    if (
      player.map.id === 'depths-l2' &&
      !player.getVariable('ACT2_SCENE8_DROWNED_ARCHIVE_TRIGGERED')
    ) {
      await this.triggerScene(player);
      player.setVariable('ACT2_SCENE8_DROWNED_ARCHIVE_TRIGGERED', true);
    }
  }

  private async triggerScene(player: RpgPlayer) {
    const map = player.map as RpgMap;

    // --- Scene Start ---
    await player.showText(
      'The Drowned Archive. A vast submerged hall. The water is knee-deep, clear, and luminous — amber light radiates from dissolved memory deposits embedded in the floor. Bookshelves line the walls, their contents dissolved into amber-gold smears that glow faintly.',
      {
        wait: true,
        type: 'cutscene',
      },
    );

    // 1. Spawn Callum
    const callum = await map.createDynamicEvent({
      x: 10,
      y: 5,
      event: 'npc_callum',
      properties: {
        graphic: 'npc_callum',
        direction: Direction.DOWN,
        name: 'Callum',
      },
    });

    await player.showText(
      'Callum: A library. Submerged, but intact. The books are gone — dissolved into memory — but the shelves, the architecture... this civilization valued knowledge above everything.',
      {
        speaker: callum,
        wait: true,
        type: 'cutscene',
      },
    );

    // 2. Initial combat encounter (Room 1)
    await player.showText(
      'Enemies: 2 Echo Toads guard the entrance. Standard Depths-tier encounter.',
      {
        wait: true,
        type: 'cutscene',
      },
    );
    await player.battle('E-D2-01'); // Assuming E-D2-01 is the ID for 2 Echo Toads

    // --- Room 3: The Reading Room — Key Lore ---
    // Player moves to (15,15) and interacts with a Resonance Stone
    // This part would typically be triggered by an 'action' event on a specific tile (15,15)
    // For this auto-trigger, we'll simulate the interaction after some implied movement.
    // In a real game, this would be a separate event on the map.
    await player.showText(
      'You find a circular chamber with a central podium. On the podium, a Resonance Stone holds a concentrated memory. When you interact with it, a dissolved memory echo appears — a librarian, calm and precise.',
      {
        wait: true,
        type: 'cutscene',
      },
    );

    // Simulate Dissolved Librarian dialogue
    await player.showText(
      "Dissolved Librarian: You've come to understand why we chose to leave. Good. Most people assume we died. We didn't.",
      {
        speaker: { name: 'Dissolved Librarian', graphic: 'npc_ghost_f1' }, // Assuming a generic ghost graphic
        wait: true,
        type: 'cutscene',
      },
    );
    await player.showText(
      'Dissolved Librarian: Our civilization — the Archivists of the Deep Current — spent centuries cataloging every memory, every idea, every emotion we encountered. We built this library to hold it all.',
      {
        speaker: { name: 'Dissolved Librarian', graphic: 'npc_ghost_f1' },
        wait: true,
        type: 'cutscene',
      },
    );
    await player.showText(
      "Dissolved Librarian: And then we realized: a library isn't the memories. It's just a building. The memories themselves — the real knowledge — exists in the connections between people. In the way a mother tells her child a story. In the way a friend hears your grief.",
      {
        speaker: { name: 'Dissolved Librarian', graphic: 'npc_ghost_f1' },
        wait: true,
        type: 'cutscene',
      },
    );
    await player.showText(
      'Dissolved Librarian: We could keep the library forever. Or we could become the knowledge. We dissolved our memories into the water, the soil, the air — into the world itself, so that anyone who walks this land carries our wisdom whether they know it or not.',
      {
        speaker: { name: 'Dissolved Librarian', graphic: 'npc_ghost_f1' },
        wait: true,
        type: 'cutscene',
      },
    );
    await player.showText(
      'Dissolved Librarian: The Preservers call that destruction. We called it graduation.',
      {
        speaker: { name: 'Dissolved Librarian', graphic: 'npc_ghost_f1' },
        wait: true,
        type: 'cutscene',
      },
    );

    // Effect: item-give: {"itemId":"MF-06","name":"Dissolution Is a Choice"}
    await player.showText(
      'The echo yields a fragment: MF-06: Dissolution Is a Choice (Calm / Water / Potency 4).',
      {
        wait: true,
        type: 'cutscene',
      },
    );
    player.addItem('MF-06', 1); // Assuming MF-06 is the item ID for the fragment

    await player.showText(
      "Callum (shaken): Graduation. They didn't fail — they finished. They chose to become something larger than themselves.",
      {
        speaker: callum,
        wait: true,
        type: 'cutscene',
      },
    );
    await player.showText(
      "Callum: That changes everything I thought I knew about the Dissolved. They weren't victims. They were... completed.",
      {
        speaker: callum,
        wait: true,
        type: 'cutscene',
      },
    );

    // --- Room 6: The Archive's Heart — Boss Encounter ---
    // Player moves to the final room (implied)
    await player.showText(
      "You reach the final room. It contains a massive Resonance Stone and a guardian: the Drowned Archivist. The Archivist is a dissolved memory given temporary form by your presence — it fights to test whether you are worthy of the archive's deepest knowledge.",
      {
        wait: true,
        type: 'cutscene',
      },
    );

    // Effect: combat-start: {"encounter":"boss-drowned-archivist","enemies":"B-03a"}
    await player.showText(
      'Boss fight: Drowned Archivist. HP 450, weak to fire, uses water magic + memory-drain attacks.',
      {
        wait: true,
        type: 'cutscene',
      },
    );
    await player.battle('B-03a'); // Assuming B-03a is the ID for Drowned Archivist

    // After victory
    await player.showText(
      "SYSTEM: The Archive's deepest memory surfaces: an image of every dissolved civilization, at the moment of their choice. Hundreds of groups — musicians, gardeners, explorers, scholars, artists — all making the same decision at different times, in different places, for different reasons. All choosing to become something larger.",
      {
        wait: true,
        type: 'cutscene',
      },
    );
    await player.showText(
      'SYSTEM: One constant: none of them were forced. None of them were afraid. They chose.',
      {
        wait: true,
        type: 'cutscene',
      },
    );

    // Clean up Callum
    if (callum) {
      map.removeEvent(callum.id);
    }

    // --- Scene End ---
    await player.showText(
      'You have completed The Drowned Archive. The nature of dissolution is now clear.',
      {
        wait: true,
        type: 'cutscene',
      },
    );
  }
}
