import { ControlType, type RpgPlayer, RpgPlayerHooks } from '@rpgjs/server';

// Assuming 'lira_portrait' is the graphic ID for Lira's speaker portrait.
// This would typically be defined in your client-side assets or a shared constant file.
const LIRA_GRAPHIC = 'lira_portrait';

export default async function (player: RpgPlayer) {
  // Trigger conditions:
  // This dialogue is intended for "The Edge — final scene (Scene 12)"
  // at Location: Luminous Wastes — The Edge (5, 20).
  // In a full game, you might check player.getVariable('currentScene') or player.map.id
  // to ensure the dialogue only plays in the correct context.
  // For this exercise, we assume the calling mechanism (e.g., a map event or scene manager)
  // ensures these conditions are met before invoking this dialogue function.

  // Lira: "It's not stopping. It's still growing."
  await player.showText("It's not stopping. It's still growing.", { speaker: LIRA_GRAPHIC });

  // Lira: "What will YOU create next?"
  await player.showText('What will YOU create next?', { speaker: LIRA_GRAPHIC });

  // End of dialogue.
}
