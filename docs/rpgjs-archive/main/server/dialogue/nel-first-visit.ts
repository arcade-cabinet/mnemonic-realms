import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // Check if this 'first visit' dialogue has already been played
  if (player.getVariable('dialogue_nel_firstVisit')) {
    return;
  }

  await player.showText(
    "Welcome to the edge of the map! I'm Nel — we Ridgewalkers live here because we like watching new land form.",
    { speaker: 'Nel' },
  );

  await player.showText("You're the Architect from the village? Artun sent a letter ahead.", {
    speaker: 'Nel',
  });

  await player.showText('Need supplies? Rest? Directions?', { speaker: 'Nel' });

  player.setVariable('dialogue_nel_firstVisit', true);
}
