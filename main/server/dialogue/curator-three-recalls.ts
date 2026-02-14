import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // Trigger condition: After 3 god recalls
  // Assuming 'god-recalls-completed' is a quest or variable tracking the number of recalls.
  if (player.getQuest('god-recalls-completed') < 3) {
    return; // Dialogue does not trigger yet
  }

  // Dialogue lines from The Curator
  await player.showText(
    "You've recalled three of them now. The dormant gods. Unfinished things, completed by force.",
    {
      speaker: 'The Curator',
      portrait: 'curator', // Assuming 'curator' is the ID for The Curator's portrait graphic
    },
  );

  await player.showText(
    "Did you ask them if they wanted to wake? Did the Choir's prototype choose to become a storm? Did the Rootwalkers' seed choose to bloom?",
    {
      speaker: 'The Curator',
      portrait: 'curator',
    },
  );

  await player.showText(
    'You impose your vision on the world and call it growth. I preserve what already exists and you call it stagnation. We are not so different, Architect.',
    {
      speaker: 'The Curator',
      portrait: 'curator',
    },
  );

  // Optional: Set a flag to prevent this specific ambient dialogue from repeating
  // if (player.getVariable('curator_three_recalls_dialogue_played') !== true) {
  //     player.setVariable('curator_three_recalls_dialogue_played', true);
  // }
}
