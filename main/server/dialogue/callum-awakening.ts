import type { RpgMap, RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  const DIALOGUE_FLAG = 'dlg-callum-awakening-played';
  const TARGET_MAP_ID = 'village-hub-elders-house'; // Assuming this is the map ID for Elder's House
  const TARGET_X = 18;
  const TARGET_Y = 10;
  const COORD_TOLERANCE = 2; // Allow player to be within a small radius of the target coordinates

  // Trigger Conditions:
  // 1. This dialogue has not been played before for this player.
  // 2. The player is currently on the specified map.
  // 3. The player is at or near the specified coordinates.
  // 4. (Optional, but good practice) Check if Quest MQ-01 is in a state where this dialogue should occur.
  //    For this initial scene, we'll assume it's meant to happen early, so the flag and location are primary.

  if (player.getVariable(DIALOGUE_FLAG)) {
    return; // Dialogue already played, exit
  }

  const currentMap: RpgMap | undefined = player.map;
  if (!currentMap || currentMap.id !== TARGET_MAP_ID) {
    return; // Not on the correct map
  }

  const playerX = player.position.x;
  const playerY = player.position.y;

  if (
    Math.abs(playerX - TARGET_X) > COORD_TOLERANCE ||
    Math.abs(playerY - TARGET_Y) > COORD_TOLERANCE
  ) {
    return; // Not at the correct coordinates
  }

  // Set the flag to true so this dialogue doesn't play again
  player.setVariable(DIALOGUE_FLAG, true);

  // Dialogue Sequence
  await player.showText('There you are. Come in, come in — careful of the stack by the door.', {
    speaker: 'Artun',
  });
  await player.showText(
    "This passage describes a talent the Dissolved called 'Mnemonic Architecture.'",
    { speaker: 'Artun' },
  );
  await player.showText(
    "You're a Mnemonic Architect, and we just didn't have a word for it until now.",
    { speaker: 'Artun' },
  );
  await player.showText(
    'A traveler came through last month — a woman named Hana. She recognized it in you immediately.',
    { speaker: 'Artun' },
  );
  await player.showText(
    "This is a memory fragment. My first lesson. It's a joyful memory. I'd like you to have it.",
    { speaker: 'Artun' },
  );

  // Example: Granting a quest item or updating quest state for MQ-01
  // player.addItem('memory-fragment-joyful', 1);
  // player.updateQuest('MQ-01', 'received_first_fragment');

  await player.showText('Now go find Hana. Her workshop is south of the square.', {
    speaker: 'Artun',
  });

  // Example: Set a new quest objective or flag to guide the player
  // player.setVariable('objective_find_lira', true);
}
