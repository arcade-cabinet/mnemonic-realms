import type { RpgEvent, RpgMap, RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer, event: RpgEvent | null, map: RpgMap) {
  const DIALOGUE_FLAG = 'SOLEN_FIRST_VISIT_DONE';
  const TARGET_MAP_ID = 'map001_flickerveil'; // Placeholder for Flickerveil map ID
  const TARGET_X = 35;
  const TARGET_Y = 30;

  // Check if this dialogue has already been played (First visit trigger)
  if (player.getVariable(DIALOGUE_FLAG)) {
    return;
  }

  // Check location conditions
  // This dialogue is specifically for Flickerveil — The Flickering Village (35, 30)
  const currentMapId = player.getMapId();
  const playerPosition = player.getPosition();

  if (
    currentMapId !== TARGET_MAP_ID ||
    playerPosition.x !== TARGET_X ||
    playerPosition.y !== TARGET_Y
  ) {
    return;
  }

  // Solen's first dialogue line
  await player.showText(
    "Hello, dear. I'm Solen. I've been studying the grove — Luminos Grove, they call it — since I was a girl. The light there is... patient. It's been waiting for someone who can see it properly.",
    {
      speaker: 'Solen',
      portrait: 'solen', // Assuming 'solen' is the ID for Solen's portrait
    },
  );

  // Solen's second dialogue line and item bestowal
  await player.showText(
    "Take this. A Light Lens — I polished it from a crystal I found at the grove's edge. Without it, the light is too bright to approach. With it, you'll see the path.",
    {
      speaker: 'Solen',
      portrait: 'solen',
    },
  );

  // Give the player the "Light Lens" item
  player.addItem('item_light_lens', 1); // Assuming 'item_light_lens' is the ID for the Light Lens item

  // [SYSTEM] notification for item received
  await player.gui('rpg-notification', {
    message: 'Received: Light Lens',
    icon: 'item_light_lens_icon', // Assuming an icon ID for the item
  });

  // Set the flag to true so this dialogue doesn't play again on subsequent visits
  player.setVariable(DIALOGUE_FLAG, true);
}
