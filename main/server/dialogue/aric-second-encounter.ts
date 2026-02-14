import type { RpgPlayer } from '@rpgjs/server';

const Aric = {
  name: 'Aric',
  graphic: 'actor_aric.png', // Assuming 'actor_aric.png' is the graphic ID for Aric
};

export default async function dialogue(player: RpgPlayer) {
  // Condition: Check if at least one god recall has been completed
  if (player.getVariable('godRecallsCompleted') < 1) {
    return; // Dialogue does not trigger if no gods have been recalled yet
  }

  // Ensure this dialogue plays only once
  if (player.getVariable('dlg_aric_second_encounter_played')) {
    return; // Dialogue has already been played
  }

  await player.showText(
    'You recalled a god. I felt it — we all did. The whole Frontier shuddered.',
    Aric,
  );
  await player.showText(
    "The Curator's lieutenants are panicking. I'm not panicking. I'm thinking.",
    Aric,
  );
  await player.showText(
    "Does being stronger make you right? Honest question. I don't know the answer. But I think you should ask it before you recall another one.",
    Aric,
  );

  // Mark this dialogue as played to prevent it from triggering again
  player.setVariable('dlg_aric_second_encounter_played', true);
}
