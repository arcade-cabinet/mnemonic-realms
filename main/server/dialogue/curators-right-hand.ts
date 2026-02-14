import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  const NPC_NAME = "Curator's Right Hand";

  const requiredMapId = 'preserver_fortress_floor_1';
  const sceneQuestFlag = 'act3_scene6_gallery_of_moments_active';

  if (player.getMapId() !== requiredMapId) {
    return;
  }

  if (!player.getVariable(sceneQuestFlag)) {
    return;
  }

  await player.showText(
    'The Curator weeps for every battle. So do I. But these moments are worth protecting.',
    { speaker: NPC_NAME },
  );

  await player.showText("The Curator is below. They know you're coming. They've always known.", {
    speaker: NPC_NAME,
  });
}
