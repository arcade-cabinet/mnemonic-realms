import type { Player } from '@rpgjs/server';

export default async function (player: Player) {
  const NPC_NAME = "Curator's Right Hand";
  // Placeholder graphic. Replace with the actual graphic ID for Curator's Right Hand.
  const NPC_GRAPHIC = 'actor1_1';

  // --- Trigger Conditions Check ---
  // This dialogue is intended for 'Preserver Fortress Floor 1' (map ID)
  // and specifically for the 'act3-scene6-gallery-of-moments' context.
  const requiredMapId = 'preserver_fortress_floor_1'; // Example map ID for Preserver Fortress Floor 1
  const sceneQuestFlag = 'act3_scene6_gallery_of_moments_active'; // Example quest flag for the scene context

  // Check if the player is on the correct map
  if (player.getMapId() !== requiredMapId) {
    console.log(
      `[Dialogue: ${NPC_NAME}] Skipped: Player not on map '${requiredMapId}'. Current: '${player.getMapId()}'.`,
    );
    return;
  }

  // Check if the specific scene quest flag is active.
  // This flag would typically be set by a preceding quest step or event that initiates Scene 6.
  if (!player.getVariable(sceneQuestFlag)) {
    console.log(`[Dialogue: ${NPC_NAME}] Skipped: Scene flag '${sceneQuestFlag}' is not active.`);
    return;
  }

  // --- Dialogue Sequence ---
  // Line 1: Curator's Right Hand
  await player.showText(
    'The Curator weeps for every battle. So do I. But these moments are worth protecting.',
    {
      speaker: NPC_NAME,
      graphic: NPC_GRAPHIC,
    },
  );

  // Line 2: Curator's Right Hand (marked as '[defeated]' in source, interpreted as pre-combat tone)
  await player.showText("The Curator is below. They know you're coming. They've always known.", {
    speaker: NPC_NAME,
    graphic: NPC_GRAPHIC,
  });

  // After this dialogue, the game event that triggered it would typically proceed to initiate combat.
}
