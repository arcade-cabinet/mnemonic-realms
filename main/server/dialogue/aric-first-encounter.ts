import type { RpgEvent, RpgPlayer } from '@rpgjs/server';

export default async function dialogue(player: RpgPlayer, event: RpgEvent) {
  const dialogueId = 'dlg-aric-first-encounter';
  const hasPlayed = player.getVariable(dialogueId);

  // Trigger condition: This dialogue plays only once per player.
  if (hasPlayed) {
    // Aric might have a generic line if talked to again after the first encounter,
    // but for this specific prompt, we'll just end the dialogue.
    return;
  }

  // Mark this dialogue as played for the current player
  player.setVariable(dialogueId, true);

  // Aric: "Halt. You're entering Preserver-monitored territory. State your purpose."
  await player.showText({
    text: "Halt. You're entering Preserver-monitored territory. State your purpose.",
    speaker: 'Aric',
    graphic: 'Aric', // Assuming 'Aric' is the graphic ID for Aric's portrait
  });

  // Aric: "A Mnemonic Architect. The Curator warned us one might come."
  await player.showText({
    text: 'A Mnemonic Architect. The Curator warned us one might come.',
    speaker: 'Aric',
    graphic: 'Aric',
  });

  // Aric: "A word of advice: the Frontier is not the Settled Lands. Be careful what you remember into existence."
  await player.showText({
    text: 'A word of advice: the Frontier is not the Settled Lands. Be careful what you remember into existence.',
    speaker: 'Aric',
    graphic: 'Aric',
  });

  // No [SYSTEM] or [NARRATION] lines specified for this particular dialogue.
  // No branching choices specified for this particular dialogue.
}
