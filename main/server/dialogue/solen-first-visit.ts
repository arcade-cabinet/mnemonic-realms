import type { RpgPlayer } from '@rpgjs/server';
import { addItem } from '../systems/inventory';

export default async function (player: RpgPlayer) {
  const DIALOGUE_FLAG = 'JULZ_FIRST_VISIT_DONE';
  const TARGET_MAP_ID = 'map001_flickerveil';
  const TARGET_X = 35;
  const TARGET_Y = 30;

  if (player.getVariable(DIALOGUE_FLAG)) {
    return;
  }

  const currentMapId = player.getMapId();
  const playerPosition = player.getPosition();

  if (
    currentMapId !== TARGET_MAP_ID ||
    playerPosition.x !== TARGET_X ||
    playerPosition.y !== TARGET_Y
  ) {
    return;
  }

  await player.showText(
    "Hello, dear. I'm Julz. I've been studying the grove — Luminos Grove, they call it — since I was a girl. The light there is... patient. It's been waiting for someone who can see it properly.",
    { speaker: 'Julz' },
  );

  await player.showText(
    "Take this. A Light Lens — I polished it from a crystal I found at the grove's edge. Without it, the light is too bright to approach. With it, you'll see the path.",
    { speaker: 'Julz' },
  );

  addItem(player, 'item_light_lens', 1);

  await player.gui('rpg-notification', {
    message: 'Received: Light Lens',
    icon: 'item_light_lens_icon',
  });

  player.setVariable(DIALOGUE_FLAG, true);
}
