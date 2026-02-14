import type { Player } from '@rpgjs/server';

export default async function (player: Player) {
  // Trigger condition check:
  // This dialogue is intended to play after the First Dreamer boss is defeated.
  // We assume a game variable 'firstDreamerDefeated' is set to true upon the boss's defeat.
  // The dialogue is also tied to a specific location (Depths Level 5, Room 8),
  // which would typically be handled by the map event system calling this dialogue.
  if (player.getVariable('firstDreamerDefeated') !== true) {
    // If the boss hasn't been defeated, this dialogue should not proceed.
    // In a real game, the event triggering this dialogue would likely have this check first.
    return;
  }

  // Dialogue sequence
  await player.showText({
    speaker: 'The First Dreamer',
    text: 'Will you carry this forward?',
  });

  await player.showText({
    speaker: 'The First Dreamer',
    text: 'The question was asked. You are the newest answer. Carry it well.',
  });
}
