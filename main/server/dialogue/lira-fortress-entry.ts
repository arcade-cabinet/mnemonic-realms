import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // Trigger condition: Entering the Preserver Fortress entrance (Scene 5)
  // This dialogue is designed to play once upon entering the specific map.
  // We can use a player flag to ensure it only plays the first time.
  const dialogueFlag = 'dlg-lira-fortress-entry-played';

  if (player.getVariable(dialogueFlag)) {
    return; // Dialogue already played
  }

  // Ensure Hana is in the party and visible if needed, though for a map entry
  // dialogue, it's usually assumed she's present if the player reaches this point.
  // For this specific dialogue, it's Hana's reaction, so her presence is key.

  // Hana's portrait (assuming 'lira' is the ID for her character graphic)
  const liraPortrait = 'lira';

  await player.showText(
    `I recognize this feeling. The crystal. The cold. The way everything is perfectly still.`,
    {
      speaker: liraPortrait,
    },
  );

  await player.showText(
    `I was frozen in crystal like this. For weeks. From my perspective, it was a single moment — one heartbeat between consciousness and nothing. But I remember the nothing. A perfect, silent, beautiful nothing.`,
    {
      speaker: liraPortrait,
    },
  );

  await player.showText(`I don't want the world to feel that.`, {
    speaker: liraPortrait,
  });

  // Set the flag so this dialogue doesn't repeat
  player.setVariable(dialogueFlag, true);
}
