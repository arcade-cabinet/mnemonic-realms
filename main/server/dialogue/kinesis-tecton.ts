import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // Trigger: Kinesis recall — Fury
  // Quest: GQ-04, Condition: 'fury emotion chosen'
  // Location: Hollow Ridge — Kinesis Spire (24, 10)

  await player.showText('Everything moves. Nothing resists me forever. I am Tecton.', {
    speaker: 'Tecton',
  });
}
