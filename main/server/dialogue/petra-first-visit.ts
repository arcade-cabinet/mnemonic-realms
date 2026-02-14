import type { Player } from '@rpgjs/server';

export default async function (player: Player) {
  // Check if this 'first visit' dialogue has already been played
  if (player.get('dialogue.petra.firstVisit')) {
    return; // Dialogue already played, exit
  }

  // Petra's dialogue lines
  await player.showText(
    "Welcome to the edge of the map! I'm Petra — we Ridgewalkers live here because we like watching new land form.",
    {
      speaker: 'Petra',
      portrait: 'petra', // Assuming 'petra' is the ID for Petra's portrait graphic
    },
  );

  await player.showText("You're the Architect from the village? Callum sent a letter ahead.", {
    speaker: 'Petra',
    portrait: 'petra',
  });

  await player.showText('Need supplies? Rest? Directions?', {
    speaker: 'Petra',
    portrait: 'petra',
  });

  // Mark the 'first visit' dialogue as played for this player
  player.set('dialogue.petra.firstVisit', true);
}
