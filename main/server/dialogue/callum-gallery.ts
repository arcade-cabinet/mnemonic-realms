import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  const dialogueFlag = 'dlg_callum_gallery_scene6_played';

  if (player.get(dialogueFlag)) {
    return;
  }

  // Example of a quest state check if needed:
  // const questState = player.get('quest_act3_scene6_gallery_of_moments_state');
  // if (questState !== 'active') {
  //     return;
  // }

  const speaker = {
    name: 'Callum',
    character: 'callum', // Assumes 'callum' is the character ID for his graphic
  };

  await player.showText('This one... this one is hard.', speaker);

  await player.showText(
    'That child learned to walk. And the Curator froze it because it was the most perfect moment.',
    speaker,
  );

  await player.showText(
    "Perfect moments aren't meant to last. They're meant to lead somewhere.",
    speaker,
  );

  player.set(dialogueFlag, true);
}
