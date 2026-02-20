import type { RpgPlayer } from '@rpgjs/server';

// Assuming 'npc_hana' is the graphic ID for Hana's speaker portrait.
// This would typically be defined in your client-side assets or a shared constant file.
const HANA_GRAPHIC = 'npc_hana';

export default async function (player: RpgPlayer) {
  // Trigger conditions:
  // This dialogue is intended for "The Edge — final scene (Scene 12)"
  // at Location: Luminous Wastes — The Edge (5, 20).
  // In a full game, you might check player.getVariable('currentScene') or player.map.id
  // to ensure the dialogue only plays in the correct context.
  // For this exercise, we assume the calling mechanism (e.g., a map event or scene manager)
  // ensures these conditions are met before invoking this dialogue function.

  // Hana: "It's not stopping. It's still growing."
  await player.showText("It's not stopping. It's still growing.", { speaker: HANA_GRAPHIC });

  // Hana: "What will YOU create next?"
  await player.showText('What will YOU create next?', { speaker: HANA_GRAPHIC });

  // End of dialogue.
}
