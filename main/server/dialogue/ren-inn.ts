import type { Event, Player } from '@rpgjs/server';

export default async function (player: Player, event: Event) {
  // Check for a condition that might indicate the player has "earned" the 'rest-late' dialogue.
  // For this example, let's use a hypothetical player variable.
  // In a real game, this could be tied to quest completion, a specific flag, or game progression.
  const hasEarnedSpecialRest = player.getVariable('has_completed_major_quest_arc') === true;

  if (hasEarnedSpecialRest) {
    // Dialogue for [rest-late] condition
    await player.showText("Rest well. You've earned it more than most.", { speaker: 'Ren' });
  } else {
    // Default dialogue for [rest] condition
    await player.showText('Sweet dreams. The beds are soft and the walls keep out the worry.', {
      speaker: 'Ren',
    });
  }
}
