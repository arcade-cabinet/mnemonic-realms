import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // Trigger condition: Stagnation expansion — Hana rescues farmer (Scene 11)
  // This dialogue is part of the main quest MQ-04, specifically the climax of Act I.
  const isQuestActive = player.getQuest('MQ-04')?.state === 'active';
  const isCorrectScene = player.getVariable('ACT1_SCENE11_HANAS_FREEZING_ACTIVE') === true;

  if (!isQuestActive || !isCorrectScene) {
    return;
  }

  await player.showText("No. No, no — it's bigger. Much bigger. They're reinforcing it.", {
    speaker: 'Hana',
  });

  await player.showText("I'll get her. You — stay back.", { speaker: 'Hana' });

  await player.showText('Run. Get to the village. Everyone, GO.', { speaker: 'Hana' });

  await player.showText("I'm going to break through. Stay here and —", { speaker: 'Hana' });

  // SYSTEM: "Hana is frozen mid-stride."
  await player.gui('rpg-notification', {
    message: 'Hana is frozen mid-stride.',
    type: 'system',
    position: 'center',
  });

  player.setVariable('HANA_IS_FROZEN', true);
  player.updateQuest('MQ-04', 'hana_frozen');
}
