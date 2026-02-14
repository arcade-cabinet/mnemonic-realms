import { Move, RpgEvent, RpgMap, type RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  const LIRA_GRAPHIC = 'lira_portrait'; // Assuming 'lira_portrait' is the graphic ID for Lira

  // Trigger condition: Entering the Half-Drawn Forest (Scene 1)
  // This dialogue is designed to play once when the player enters the specific map.
  // We can use a player flag to ensure it only plays once.
  if (player.getVariable('HALF_DRAWN_FOREST_INTRO_PLAYED')) {
    return;
  }

  // Set the flag so this dialogue doesn't repeat
  player.setVariable('HALF_DRAWN_FOREST_INTRO_PLAYED', true);

  await player.showText(
    "It's... incomplete. Like someone started drawing a forest and walked away.",
    {
      speaker: LIRA_GRAPHIC,
    },
  );

  await player.showText(
    "The world wants to be finished. It's reaching toward detail and just... can't quite hold it.",
    {
      speaker: LIRA_GRAPHIC,
    },
  );
}
