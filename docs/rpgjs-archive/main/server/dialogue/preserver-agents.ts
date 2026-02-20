import type { RpgEvent, RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer, event: RpgEvent) {
  // Trigger conditions: Act II and Any Frontier zone
  // These are placeholder checks. In a real game, 'act' and 'current_zone_type'
  // would be set as player variables or derived from the current map.
  const currentAct = player.getVariable('act');
  const currentLocationType = player.getVariable('current_zone_type');

  // If the conditions are not met, the dialogue will not proceed with these specific lines.
  // You might implement fallback dialogue here or simply return.
  if (currentAct !== 2 || currentLocationType !== 'frontier') {
    return;
  }

  // Use the event's name as the speaker. RPG-JS will attempt to find a graphic
  // associated with this name for the portrait.
  const speakerName = event.name || 'Preserver Agent';

  // Line 1: [encounter]
  await player.showText('This zone is under Preserver protection. Turn back, Architect.', {
    speaker: speakerName,
  });

  // Line 2: [pre-combat]
  await player.showText("We don't want to fight. But we will.", { speaker: speakerName });

  // Line 3: [defeated]
  await player.showText(
    "The Curator's will is crystal. You can shatter us, but you cannot shatter that.",
    { speaker: speakerName },
  );
}
