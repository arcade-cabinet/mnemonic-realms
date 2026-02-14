import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // Trigger: Endgame Bloom — Serek at Fortress Gate (Scene 11)
  // Location: Preserver Fortress Gate (exterior)
  // This dialogue is assumed to be triggered by a specific event or quest state
  // related to the endgame bloom, rather than a general interaction.
  // No explicit quest checks are provided for this specific line,
  // so it will play directly when this dialogue function is called.

  await player.showText(
    "Curator. The Gallery subjects are waking up. They're confused but alive. Someone needs to help them adjust.",
    { speaker: 'Serek' },
  );
}
