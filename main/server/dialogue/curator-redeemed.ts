import type { Player } from '@rpgjs/server';

export default async function (player: Player) {
  // Define the speaker for The Curator
  const curatorSpeaker = {
    name: 'The Curator',
    // Assuming 'curator' is the graphic ID for The Curator NPC
    // This graphic should be defined in client/src/modules/main/client.ts or similar
    graphic: 'curator',
  };

  // --- Trigger Conditions ---
  // This dialogue is intended to be triggered after the Endgame Bloom (Scene 11)
  // and at the Preserver Fortress Gate (exterior).
  // We check for a quest variable indicating the completion of the Endgame Bloom.
  // The location check is typically handled by the event placement on the map.
  const endgameBloomCompleted = player.getVariable('quest_endgame_bloom_completed');
  const dialogueAlreadyPlayed = player.getVariable('dialogue_curator_redeemed_played');

  if (!endgameBloomCompleted || dialogueAlreadyPlayed) {
    // If the Endgame Bloom is not completed, or this dialogue has already played,
    // the dialogue will not proceed.
    return;
  }

  // --- Dialogue Sequence ---

  await player.showText('I spent years building a perfect museum.', curatorSpeaker);
  await player.showText(
    'And you turned the whole world into something more beautiful than anything I ever froze.',
    curatorSpeaker,
  );
  await player.showText(
    'I was wrong. Not about the moments being beautiful — but about what to do with beauty.',
    curatorSpeaker,
  );
  await player.showText(
    "Perhaps it's time we became librarians instead — not freezing memories, but keeping them. An archive, not a prison.",
    curatorSpeaker,
  );

  // Mark this dialogue as played to prevent it from repeating
  player.setVariable('dialogue_curator_redeemed_played', true);
}
