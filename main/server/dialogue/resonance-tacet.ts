import type { RpgEvent, RpgPlayer } from '@rpgjs/server';
import { isQuestActive } from '../systems/quests';

export default async function (player: RpgPlayer, event: RpgEvent) {
  // Trigger Conditions:
  // 1. Quest 'GQ-01' is active.
  // 2. Quest 'GQ-01' has 'sorrow emotion chosen'.
  // 3. The triggering event (Tacet) is at the specified location.

  const questActive = isQuestActive(player, 'GQ-01');
  const hasSorrowChosen = player.getVariable('GQ-01_emotionChosen') === 'sorrow';

  const isAtAmphitheater =
    event.map.id === 'Resonance Fields — Amphitheater' && event.x === 25 && event.y === 25;

  if (!questActive || !hasSorrowChosen || !isAtAmphitheater) {
    return;
  }

  // SYSTEM: Tacet speaks through a notification
  await player.gui('rpg-notification').open({
    text: 'I am Tacet. The Necessary Silence. Listen to what you cannot hear. That is where truth lives.',
    type: 'info',
  });
}
