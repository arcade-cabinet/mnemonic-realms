import type { RpgPlayer } from '@rpgjs/server';

export default async function dialogue(player: RpgPlayer) {
  const dialogueId = 'dlg-aric-first-encounter';
  const hasPlayed = player.getVariable(dialogueId);

  // Trigger condition: This dialogue plays only once per player.
  if (hasPlayed) {
    // Serek might have a generic line if talked to again after the first encounter,
    // but for this specific prompt, we'll just end the dialogue.
    return;
  }

  // Mark this dialogue as played for the current player
  player.setVariable(dialogueId, true);

  // Serek: "Halt. You're entering Preserver-monitored territory. State your purpose."
  await player.showText(
    "Halt. You're entering Preserver-monitored territory. State your purpose.",
    { speaker: 'Serek' },
  );

  // Serek: "A Mnemonic Architect. The Curator warned us one might come."
  await player.showText('A Mnemonic Architect. The Curator warned us one might come.', {
    speaker: 'Serek',
  });

  // Serek: "A word of advice: the Frontier is not the Settled Lands. Be careful what you remember into existence."
  await player.showText(
    'A word of advice: the Frontier is not the Settled Lands. Be careful what you remember into existence.',
    { speaker: 'Serek' },
  );

  // No [SYSTEM] or [NARRATION] lines specified for this particular dialogue.
  // No branching choices specified for this particular dialogue.
}
