import { RpgMap as RpgMapClient } from '@rpgjs/client';
import {
  EventData,
  MapData,
  RpgCommonPlayer,
  RpgEvent,
  type RpgMap,
  type RpgPlayer,
  RpgScene,
} from '@rpgjs/server';

@EventData({
  id: 'act3-scene4-deepest-memory',
  name: 'The Deepest Memory Scene Event',
  hitbox: { width: 32, height: 32 },
})
export default class TheDeepestMemoryEvent extends RpgEvent {
  onInit() {
    this.set({
      name: 'The Deepest Memory Scene Event',
      graphic: 'invisible', // Invisible event, triggers on map enter
      width: 32,
      height: 32,
      collision: false,
    });
  }

  async onPlayerTouch(player: RpgPlayer) {
    // This event is designed to trigger on map-enter, so we'll use onInit for initial setup
    // and onPlayerTouch for specific room triggers if needed.
    // For the main scene trigger, we'll rely on the map-enter condition.
  }

  async onChanges(player: RpgPlayer) {
    // This event is primarily for map-enter, so onChanges might not be strictly necessary
    // unless there are continuous checks or parallel effects.
    // For this scene, we'll assume the main narrative flow happens once on entry.
  }

  async onMapInit(player: RpgPlayer, map: RpgMap) {
    // Check if the scene has already been completed to prevent re-triggering
    if (player.getVariable('ACT3_SCENE4_DEEPEST_MEMORY_COMPLETED')) {
      return;
    }

    // Ensure this event only triggers on the correct map
    if (map.id !== 'depths-l5') {
      return;
    }

    // --- Scene Setup: Spawning NPCs ---
    // Hana and Artun are companions, so they should already be in the player's party
    // or follow the player. If they need to appear at specific spots for dialogue,
    // we can create dynamic events for them.

    // For this scene, Hana and Artun are assumed to be with the player.
    // If they need to be placed at specific coordinates for a cutscene:
    const hana = player.getOtherPlayerById('npc_hana');
    const artun = player.getOtherPlayerById('npc_artun');

    if (!hana) {
      // Create Hana if not already present (e.g., if she's a dynamic follower)
      // For a scene, it's more likely they are already part of the party.
      // This is a placeholder if they need to be spawned as independent NPCs.
      map.createDynamicEvent({
        x: 10,
        y: 3,
        name: 'Hana',
        event: 'npc_hana', // Assuming 'npc_hana' is an existing RpgEvent class
        properties: {
          graphic: 'npc_hana',
          direction: 2,
          speed: 1,
        },
      });
    } else {
      // Move Hana to the starting position for the scene
      await hana.teleport(map.id, 10, 3);
      hana.setDirection(2); // Face down
    }

    if (!artun) {
      map.createDynamicEvent({
        x: 11,
        y: 3,
        name: 'Artun',
        event: 'npc_artun', // Assuming 'npc_artun' is an existing RpgEvent class
        properties: {
          graphic: 'npc_artun',
          direction: 2,
          speed: 1,
        },
      });
    } else {
      // Move Artun to the starting position for the scene
      await artun.teleport(map.id, 11, 3);
      artun.setDirection(2); // Face down
    }

    // --- Narrative Sequence: Room 1: The Surface Memory ---
    await player.showText(
      "A room that looks like a village — but not the player's village. An older village, from a dissolved civilization. The buildings are amber-tinted, translucent, made of solidified memory. NPCs walk through their routines, unaware of the player.",
      {
        wait: true,
        speaker: 'SYSTEM',
      },
    );
    await player.showText(
      "These are surface memories. Recent by the Depths' standards — maybe a few hundred years old. A civilization going about its daily life. They haven't dissolved yet. They're still deciding.",
      {
        wait: true,
        speaker: 'Artun',
      },
    );

    // --- Narrative Sequence: Room 3: The Middle Memory (simulate movement) ---
    // Player moves to a new area, NPCs follow or are moved.
    // For simplicity, we'll just trigger the dialogue here.
    await player.teleport(map.id, 15, 10); // Simulate moving to Room 3
    if (hana) await hana.teleport(map.id, 14, 10);
    if (artun) await artun.teleport(map.id, 16, 10);

    await player.showText(
      'The rooms have become more abstract. The walls show geological cross-sections — layers of memory stacked like sediment. Each layer is a different civilization, a different era. The player walks through compressed time.',
      {
        wait: true,
        speaker: 'SYSTEM',
      },
    );
    await player.showText(
      "We're going deeper. Each layer is older. Look — that stratum is the Rootwalkers. Below it, the Choir. Below that... civilizations I don't have names for. Older than anything in my journals.",
      {
        wait: true,
        speaker: 'Artun',
      },
    );
    await player.showText('How many civilizations have dissolved?', {
      wait: true,
      speaker: 'Hana',
    });
    await player.showText(
      'Dozens. Maybe hundreds. Each one completing its purpose and choosing to become part of the world.',
      {
        wait: true,
        speaker: 'Artun',
      },
    );

    // --- Narrative Sequence: Room 5: The Deep Memory — The First Question ---
    await player.teleport(map.id, 10, 15); // Simulate moving to Room 5
    if (hana) await hana.teleport(map.id, 9, 15);
    if (artun) await artun.teleport(map.id, 11, 15);

    await player.showText(
      'The room is vast and dark, except for a single point of amber light at its center. The light is warm and steady — not flickering, not pulsing. Just present. Approaching it, the player hears a voice — not from a speaker, but from the light itself.',
      {
        wait: true,
        speaker: 'SYSTEM',
      },
    );
    await player.showText('Why do things change?', {
      wait: true,
      speaker: 'The Light',
    });
    await player.showText('It spoke. The memory spoke.', {
      wait: true,
      speaker: 'Artun',
      style: { fontStyle: 'italic' },
    });
    await player.showText(
      'I am old. Older than the stone you stand on. I was the first question anyone ever asked. "Why do things change?" And the attempt to answer that question — that act of wondering — created the first memory. Which created the world.',
      {
        wait: true,
        speaker: 'The Light',
      },
    );
    await player.showText("The First Memory isn't a thing. It's a question.", {
      wait: true,
      speaker: 'Hana',
    });
    await player.showText(
      'I am the echo of that question. The question itself is in the chamber above — the place the crystal-maker calls their fortress. The question is: "Why do things change?" And every civilization since has tried to answer it.',
      {
        wait: true,
        speaker: 'The Light',
      },
    );
    await player.showText(
      'Some answered with music. Some with gardens. Some with roads. Some with light. Each answer dissolved into the world when it was complete.',
      {
        wait: true,
        speaker: 'The Light',
      },
    );
    await player.showText(
      'The crystal-maker\'s answer is: "Things shouldn\'t change." That is the only answer that would silence the question forever.',
      {
        wait: true,
        speaker: 'The Light',
      },
    );
    await player.showText(
      'If the Curator crystallizes the First Memory — the first question — the world stops asking. It stops wondering. It stops changing.',
      {
        wait: true,
        speaker: 'Artun',
        style: { fontStyle: 'italic' },
      },
    );
    await player.showText(
      "You will need to offer your own answer. Not with words. With memory. With everything you've carried.",
      {
        wait: true,
        speaker: 'The Light',
      },
    );

    // --- Transition to Boss Room: Room 8: The First Dreamer ---
    await player.teleport(map.id, 10, 21); // Move player to boss room entrance
    if (hana) await hana.teleport(map.id, 9, 21);
    if (artun) await artun.teleport(map.id, 11, 21);

    await player.showText(
      'The final room. An immense cavern where the ceiling is invisible and the floor is a mosaic of every biome in the game, layered on top of each other. At the center: the First Dreamer — the oldest dissolved memory given temporary form.',
      {
        wait: true,
        speaker: 'SYSTEM',
      },
    );

    // --- Boss Encounter: The First Dreamer ---
    await player.showText('Show me what you remember.', {
      wait: true,
      speaker: 'The First Dreamer',
    });
    await player.callMapEvent('combat-start', {
      encounter: 'boss-first-dreamer',
      enemies: 'B-03d',
    });

    // After combat (assuming player wins)
    await player.showText('The question was asked. You are the newest answer. Carry it well.', {
      wait: true,
      speaker: 'The First Dreamer',
      style: { fontStyle: 'italic' },
    });
    await player.showText(
      'The Dreamer dissolves into a shower of amber particles. From the dissolution, two items crystallize:',
      {
        wait: true,
        speaker: 'SYSTEM',
      },
    );

    // --- Rewards ---
    await player.callMapEvent('item-give', {
      itemId: 'frag-awe-neutral-5',
      name: "World's Oldest Memory",
    });
    await player.addItem('frag-awe-neutral-5', 1); // Give the actual item
    await player.addItem('dissolved-essence', 2); // Give Dissolved Essence

    await player.showText(
      'A question. The world exists because someone asked a question. And the Curator wants to answer it with silence.',
      {
        wait: true,
        speaker: 'Artun',
        style: { fontStyle: 'italic' },
      },
    );
    await player.showText("Then we give a better answer. Let's go.", {
      wait: true,
      speaker: 'Hana',
    });

    // Mark scene as completed
    player.setVariable('ACT3_SCENE4_DEEPEST_MEMORY_COMPLETED', true);
  }
}
