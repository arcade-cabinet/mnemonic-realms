import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // Dialogue ID: dlg-hana-hearthstone
  // Trigger: Hearthstone Circle (Scene 7)
  // Location: Ambergrove — Hearthstone Circle (20, 10)

  await player.showText(
    'This is a Hearthstone Circle. Before the Dissolved chose to let go, they gathered in places like this.',
    { speaker: 'Hana' },
  );

  await player.showText("Three fragments from a single site — that's a rich deposit.", {
    speaker: 'Hana',
  });
}
