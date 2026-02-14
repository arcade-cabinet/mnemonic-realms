import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // Trigger condition: After 3 god recalls
  if (player.getQuest('god-recalls-completed') < 3) {
    return;
  }

  await player.showText(
    "You've recalled three of them now. The dormant gods. Unfinished things, completed by force.",
    { speaker: 'Grym' },
  );

  await player.showText(
    "Did you ask them if they wanted to wake? Did the Choir's prototype choose to become a storm? Did the Rootwalkers' seed choose to bloom?",
    { speaker: 'Grym' },
  );

  await player.showText(
    'You impose your vision on the world and call it growth. I preserve what already exists and you call it stagnation. We are not so different, Architect.',
    { speaker: 'Grym' },
  );
}
