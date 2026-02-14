import { RpgMap, type RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // Dialogue ID: dlg-lira-hearthstone
  // Trigger: Hearthstone Circle (Scene 7)
  // Location: Ambergrove — Hearthstone Circle (20, 10)

  // Check if Lira is in the party and if the player is at the correct location
  // For simplicity, we'll assume Lira is always present for her dialogue triggers in Act I
  // and that the dialogue is triggered by an event at the specific map coordinates.
  // A more robust check might involve player.getVariable('LIRA_IN_PARTY') or similar.

  // Lira's portrait is assumed to be 'lira_portrait' based on common RPG-JS asset naming.
  const liraPortrait = 'lira_portrait';

  await player.showText(
    'This is a Hearthstone Circle. Before the Dissolved chose to let go, they gathered in places like this.',
    {
      speaker: 'Lira',
      portrait: liraPortrait,
    },
  );

  // The second line is context-dependent: "after collecting 3 fragments"
  // For this specific dialogue file, we'll assume the player has already collected the fragments
  // or that this dialogue is triggered *after* the collection event.
  // If this were a branching dialogue, we might check player.getVariable('HEARTHSTONE_FRAGMENTS_COLLECTED') >= 3
  // and offer different lines. For this request, we play it directly.
  await player.showText("Three fragments from a single site — that's a rich deposit.", {
    speaker: 'Lira',
    portrait: liraPortrait,
  });
}
