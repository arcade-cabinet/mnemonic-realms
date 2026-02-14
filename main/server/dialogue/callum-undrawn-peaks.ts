import type { RpgPlayer } from '@rpgjs/server';

// Artun's portrait character ID (matches artun-*.webp portrait files)
const _ARTUN_PORTRAIT_GRAPHIC = 'artun';

export default async function (player: RpgPlayer) {
  // This dialogue is triggered as part of the "Undrawn Peaks — Fortress layout (Scene 3)".
  // No specific in-dialogue quest state or flag checks are required for this particular sequence,
  // as its display is managed by the scene's event logic.

  await player.showText(`The Preserver Fortress. Three floors of crystallized perfection.`, {
    speaker: 'Artun',
  });

  await player.showText(
    `The First Memory is on the lowest floor. We need to go through the Fortress to reach it.`,
    {
      speaker: 'Artun',
    },
  );
}
