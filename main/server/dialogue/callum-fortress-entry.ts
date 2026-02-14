import { RpgEvent, RpgMap, type RpgPlayer, RpgSceneMap } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // No specific trigger conditions (quest state, location, flags) are provided for this dialogue,
  // so we assume it's triggered externally when the player enters the fortress.
  // If conditions were needed, they would go here, e.g.:
  // if (player.getQuest('mainQuest').state !== 'completed') {
  //     return;
  // }

  await player.showText('The god recall fractures — look.', {
    speaker: 'Callum',
    graphic: 'callum_portrait', // Assuming 'callum_portrait' is the graphic ID for Callum
  });

  await player.showText(
    'The gods are here. Their influence has been eroding this crystal since the moment you recalled them.',
    {
      speaker: 'Callum',
      graphic: 'callum_portrait',
    },
  );

  // End of dialogue
}
