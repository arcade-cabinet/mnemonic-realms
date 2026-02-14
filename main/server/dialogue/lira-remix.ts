import type { RpgPlayer } from '@rpgjs/server';

export default async function dlgHanaRemix(player: RpgPlayer) {
  const _HANA_GRAPHIC = 'npc_hana'; // Assuming 'npc_hana' is the graphic ID for Hana's portrait

  // Trigger conditions: Quest MQ-10 must be active and player must be in 'act3-scene9-the-remix'
  const questState = player.getQuest('MQ-10');
  const currentMap = player.map;

  if (!questState || questState.state !== 'started') {
    // [SYSTEM] Quest MQ-10 is not active.
    player.gui('rpg-notification', { message: 'Quest "MQ-10" is not active.', type: 'error' });
    return;
  }

  if (currentMap !== 'act3-scene9-the-remix') {
    // [SYSTEM] Player is not in the First Memory Chamber.
    player.gui('rpg-notification', {
      message: 'You are not in the First Memory Chamber.',
      type: 'error',
    });
    return;
  }

  await player.showText("This is it. The first question. 'Why do things change?'", {
    speaker: 'Hana',
  });

  // Assuming there's an implicit action or another character's line here
  // before Hana's next line, as per the story context.
  // For this exercise, we'll just proceed with Hana's next line.

  await player.showText('What do you mean?', {
    speaker: 'Hana',
  });

  // End of dialogue
}
