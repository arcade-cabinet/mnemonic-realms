import type { RpgPlayer } from '@rpgjs/server';
import { startQuest } from '../systems/quests';

/**
 * Awakening Intro Event
 *
 * Triggers automatically when a new game starts. The player wakes in
 * Artun's study — they've lived in Everwick their whole life, and this
 * morning the village elder asked them to come by. This is not a stranger
 * arriving; this is a local kid learning something extraordinary about
 * themselves.
 *
 * Per Act 1 Script, Scene 1: "The player spawns inside Elder's House.
 * Artun stands by his desk, a leather-bound journal open before him."
 */
export async function triggerAwakeningIntro(player: RpgPlayer): Promise<void> {
  const AWAKENING_FLAG = 'awakening-intro-played';

  if (player.getVariable(AWAKENING_FLAG)) {
    return;
  }

  player.setVariable(AWAKENING_FLAG, true);

  // The player wakes in a familiar place — not disoriented, but expectant.
  // Morning light. Bookshelves. The smell of old paper and cedar.
  await player.showText(
    "Morning light streams through Artun's window. The elder's study is warm — bookshelves floor to ceiling, journals stacked on every surface, the faint scent of cedar ink.",
    { talkWith: player },
  );

  await player.showText(
    "You've been here a hundred times before, but today something feels different. The air hums faintly, like a tuning fork struck just below hearing. The Resonance Stones outside are louder than usual.",
    { talkWith: player },
  );

  await player.showText(
    'Artun asked you to come by this morning. He said he found something in his journals — something about you.',
    { talkWith: player },
  );

  // Start the quest. The notification should feel like an in-world moment,
  // not a design doc header.
  const questStarted = startQuest(player, 'MQ-01');

  if (questStarted) {
    await player.showText(
      "Something stirs at the edge of your awareness — a pull, gentle but persistent, toward the old man's desk and the journal lying open upon it. Whatever he's found, it's been waiting for you.",
      { talkWith: player },
    );
  }
}
