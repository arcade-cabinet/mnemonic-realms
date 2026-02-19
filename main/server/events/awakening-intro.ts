import type { RpgPlayer } from '@rpgjs/server';
import { startQuest } from '../systems/quests';

/**
 * Awakening Intro Event
 *
 * Triggers automatically when a new game starts. Provides:
 * - Clear initial objectives
 * - Introduction to core mechanics (movement, interaction, memory collection)
 * - Activation of the first main quest (MQ-01)
 *
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */
export async function triggerAwakeningIntro(player: RpgPlayer): Promise<void> {
  const AWAKENING_FLAG = 'awakening-intro-played';

  // Check if awakening has already been played
  if (player.getVariable(AWAKENING_FLAG)) {
    return;
  }

  // Mark awakening as played
  player.setVariable(AWAKENING_FLAG, true);

  // Awakening dialogue sequence
  await player.showText(
    'You wake in the village square. The world feels... incomplete. Muted. Like a sketch waiting for color.',
    { talkWith: player },
  );

  await player.showText(
    'A memory stirs — someone mentioned your name. Artun, the village elder. He wanted to see you.',
    { talkWith: player },
  );

  await player.showText(
    'His house is to the north, past the fountain. You should find him there.',
    { talkWith: player },
  );

  // Tutorial hints for core mechanics
  await player.showText(
    '[Tutorial] Use arrow keys or WASD to move. Press SPACE or ENTER to interact with people and objects.',
    { talkWith: player },
  );

  await player.showText(
    '[Tutorial] Memory fragments are scattered throughout the world. Collecting them will restore vibrancy and unlock new abilities.',
    { talkWith: player },
  );

  // Start the first main quest
  const questStarted = startQuest(player, 'MQ-01');

  if (questStarted) {
    await player.showText(
      "Quest Started: The Architect's Awakening — Speak with Artun at Elder's House",
      { talkWith: player },
    );
  }
}
