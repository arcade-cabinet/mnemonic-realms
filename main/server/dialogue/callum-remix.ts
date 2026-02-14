import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  const questId = 'MQ-10';
  const requiredMapId = 'first-memory-chamber'; // Assuming 'first-memory-chamber' is the ID for the First Memory Chamber map

  // Check if the player is on the correct map and the quest MQ-10 is active
  if (player.map.id !== requiredMapId || player.getQuest(questId)?.state !== 'started') {
    // Dialogue conditions not met, do not proceed
    return;
  }

  await player.showText(`The question changed. It's not 'Why do things change?' anymore.`, {
    speaker: 'Callum',
    graphic: 'callum', // Assuming 'callum' is the graphic ID for Callum
  });

  await player.showText(`The world has grown beyond that question. It needs a new one.`, {
    speaker: 'Callum',
    graphic: 'callum',
  });

  // Optionally, update quest state or set a flag after this dialogue
  // player.set  QuestStep(questId, 'remix-dialogue-completed');
}
