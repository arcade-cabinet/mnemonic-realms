import { Dialogue, type Player } from '@rpgjs/server';

// Assuming 'callum' is a registered graphic ID for Callum's portrait
const CALLUM_PORTRAIT_GRAPHIC = 'callum';

export default async function (player: Player) {
  // This dialogue is triggered as part of the "Undrawn Peaks — Fortress layout (Scene 3)".
  // No specific in-dialogue quest state or flag checks are required for this particular sequence,
  // as its display is managed by the scene's event logic.

  await player.showText(`The Preserver Fortress. Three floors of crystallized perfection.`, {
    speaker: {
      name: 'Callum',
      graphic: CALLUM_PORTRAIT_GRAPHIC,
    },
  });

  await player.showText(
    `The First Memory is on the lowest floor. We need to go through the Fortress to reach it.`,
    {
      speaker: {
        name: 'Callum',
        graphic: CALLUM_PORTRAIT_GRAPHIC,
      },
    },
  );
}
