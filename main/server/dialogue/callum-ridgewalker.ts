import type { RpgMap, RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer, map: RpgMap) {
  // Dialogue ID: dlg-callum-ridgewalker
  // Trigger: Artun joins party at Ridgewalker Camp (Scene 2)
  // Location: Hollow Ridge — Ridgewalker Camp (15, 25)

  const ARTUN_ACTOR_ID = 'callum'; // Assuming 'callum' is the actor ID for Artun
  const ARTUN_GRAPHIC_ID = 'callum'; // Assuming 'callum' is the graphic ID for Callum

  // --- Trigger Conditions ---
  // This dialogue should only play once when Artun joins the party at the specific location.
  if (player.getVariable('ARTUN_JOINED_PARTY')) {
    // Artun has already joined, so this specific dialogue should not re-trigger.
    return;
  }

  // Ensure the player is on the correct map for this event.
  if (map.id !== 'act2-scene2-ridgewalker-camp') {
    // This dialogue is tied to a specific map event.
    return;
  }

  // --- Dialogue Sequence ---

  // Artun: "I'm too old to stay behind and too curious to let you go alone."
  await player.showText("I'm too old to stay behind and too curious to let you go alone.", {
    speaker: ARTUN_GRAPHIC_ID,
    name: 'Artun',
  });

  // Artun: "I won't be much use in a fight — my knees aren't what they were. But I know things about the Dissolved that might save your life."
  await player.showText(
    "I won't be much use in a fight — my knees aren't what they were. But I know things about the Dissolved that might save your life.",
    {
      speaker: ARTUN_GRAPHIC_ID,
      name: 'Artun',
    },
  );

  // Artun: "Lead on. I'll try to keep up."
  await player.showText("Lead on. I'll try to keep up.", {
    speaker: ARTUN_GRAPHIC_ID,
    name: 'Artun',
  });

  // --- Post-Dialogue Actions ---

  // Add Callum to the player's party
  player.addActor(ARTUN_ACTOR_ID);

  // Set a variable to prevent this dialogue from re-triggering
  player.setVariable('ARTUN_JOINED_PARTY', true);

  // [SYSTEM] Callum has joined your party.
  await player.gui('rpg-notification', {
    text: 'Artun has joined your party.',
    type: 'info', // 'info', 'success', 'warning', 'error'
  });

  // Note: The "Hana meets Callum" dialogue is described as a separate trigger
  // and would typically be handled by a different dialogue file or a conditional
  // branch within a more general "talk to Callum" dialogue, not this specific
  // "Artun joins party" event.
}
