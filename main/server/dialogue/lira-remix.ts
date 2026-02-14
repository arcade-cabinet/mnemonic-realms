import { RpgSceneMap } from '@rpgjs/client';
import { Move, RpgEvent, RpgMap, type RpgPlayer } from '@rpgjs/server';

export default async function dlgLiraRemix(player: RpgPlayer) {
  const LIRA_GRAPHIC = 'lira_portrait'; // Assuming 'lira_portrait' is the graphic ID for Lira's portrait

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
    speaker: {
      name: 'Lira',
      graphic: LIRA_GRAPHIC,
    },
  });

  // Assuming there's an implicit action or another character's line here
  // before Lira's next line, as per the story context.
  // For this exercise, we'll just proceed with Lira's next line.

  await player.showText('What do you mean?', {
    speaker: {
      name: 'Lira',
      graphic: LIRA_GRAPHIC,
    },
  });

  // End of dialogue
}
