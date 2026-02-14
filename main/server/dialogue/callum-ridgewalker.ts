import type { RpgMap, RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer, map: RpgMap) {
  // Dialogue ID: dlg-callum-ridgewalker
  // Trigger: Callum joins party at Ridgewalker Camp (Scene 2)
  // Location: Hollow Ridge — Ridgewalker Camp (15, 25)

  const CALLUM_ACTOR_ID = 'callum'; // Assuming 'callum' is the actor ID for Callum
  const CALLUM_GRAPHIC_ID = 'callum'; // Assuming 'callum' is the graphic ID for Callum

  // --- Trigger Conditions ---
  // This dialogue should only play once when Callum joins the party at the specific location.
  if (player.getVariable('CALLUM_JOINED_PARTY')) {
    // Callum has already joined, so this specific dialogue should not re-trigger.
    return;
  }

  // Ensure the player is on the correct map for this event.
  if (map.id !== 'act2-scene2-ridgewalker-camp') {
    // This dialogue is tied to a specific map event.
    return;
  }

  // --- Dialogue Sequence ---

  // Callum: "I'm too old to stay behind and too curious to let you go alone."
  await player.showText("I'm too old to stay behind and too curious to let you go alone.", {
    speaker: CALLUM_GRAPHIC_ID,
    name: 'Callum',
  });

  // Callum: "I won't be much use in a fight — my knees aren't what they were. But I know things about the Dissolved that might save your life."
  await player.showText(
    "I won't be much use in a fight — my knees aren't what they were. But I know things about the Dissolved that might save your life.",
    {
      speaker: CALLUM_GRAPHIC_ID,
      name: 'Callum',
    },
  );

  // Callum: "Lead on. I'll try to keep up."
  await player.showText("Lead on. I'll try to keep up.", {
    speaker: CALLUM_GRAPHIC_ID,
    name: 'Callum',
  });

  // --- Post-Dialogue Actions ---

  // Add Callum to the player's party
  player.addActor(CALLUM_ACTOR_ID);

  // Set a variable to prevent this dialogue from re-triggering
  player.setVariable('CALLUM_JOINED_PARTY', true);

  // [SYSTEM] Callum has joined your party.
  await player.gui('rpg-notification', {
    text: 'Callum has joined your party.',
    type: 'info', // 'info', 'success', 'warning', 'error'
  });

  // Note: The "Lira meets Callum" dialogue is described as a separate trigger
  // and would typically be handled by a different dialogue file or a conditional
  // branch within a more general "talk to Callum" dialogue, not this specific
  // "Callum joins party" event.
}
