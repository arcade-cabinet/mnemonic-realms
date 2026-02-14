import type { RpgPlayer } from '@rpgjs/server';

const LIGHT_NPC_GRAPHIC = 'light_entity'; // Placeholder for The Light's graphic ID

export default async function (player: RpgPlayer) {
  // Trigger condition: Ensure the player is on the correct map for this dialogue.
  if (player.map.id !== 'act3-scene4-deepest-memory') {
    return;
  }

  // Optional quest state check:
  // For example, to ensure this dialogue only plays once or under specific quest conditions:
  // if (player.getVariable('QUEST_THE_LIGHT_MET') === true) {
  //     return; // Dialogue already played
  // }

  await player.showText('Why do things change?', { speaker: LIGHT_NPC_GRAPHIC });
  await player.showText(
    'I am old. Older than the stone you stand on. I was the first question anyone ever asked.',
    { speaker: LIGHT_NPC_GRAPHIC },
  );
  await player.showText(
    "The crystal-maker's answer is: 'Things shouldn't change.' That is the only answer that would silence the question forever.",
    { speaker: LIGHT_NPC_GRAPHIC },
  );
  await player.showText('You will need to offer your own answer. Not with words. With memory.', {
    speaker: LIGHT_NPC_GRAPHIC,
  });

  // Optional: Set a flag or update quest state after the dialogue.
  // player.setVariable('QUEST_THE_LIGHT_MET', true);
}
