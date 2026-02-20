import type { RpgPlayer } from '@rpgjs/server';
import { isQuestComplete } from '../systems/quests';

export default async function dialogue(player: RpgPlayer) {
  // Trigger condition: MQ-04 must be complete
  const mq04Complete = isQuestComplete(player, 'MQ-04');

  // Optional: Check if player is in the Elder's House at the specified coordinates
  // This dialogue is triggered *after* Scene 11, so the location check might be handled by the event system.
  // However, including it here makes the dialogue more robust if triggered manually.
  const _isInEldersHouse =
    (player.map as { id?: string })?.id === 'everwick' &&
    player.position.x === 18 &&
    player.position.y === 10;

  if (mq04Complete) {
    await player.showText('I heard. Hana...', { speaker: 'Artun' });
    await player.showText("She's alive. The crystal doesn't kill.", { speaker: 'Artun' });
    await player.showText(
      "You'll need to go north. Into the Frontier — where the dormant gods sleep.",
      { speaker: 'Artun' },
    );
    await player.showText(
      "The mountain pass north of here — it's been closed for as long as I can remember. But I don't think anything's stopping you anymore.",
      { speaker: 'Artun' },
    );

    // Optionally, set a flag or advance a quest state after this dialogue
    // For example, to mark that Artun has given this information
    // await player.setVariable('artun_info_after_hana_freezing', true);
    // await player.updateQuest('MQ-05', 'started'); // Assuming MQ-05 starts here
  } else {
    // If the condition is not met, Artun might say something else or nothing at all.
    // For this specific dialogue, we assume it only triggers when MQ-04 is complete.
    // await player.showText('Hello, adventurer.', { speaker: 'Artun' });
  }
}
