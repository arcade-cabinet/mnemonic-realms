import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  const _npc = player.getVariable('vortis_npc'); // Reference to the Vortis NPC object

  // Trigger condition: Kinesis recall — Awe
  // Checks if Quest GQ-04 is started and if the 'awe' emotion was chosen previously.
  if (player.getVariable('GQ-04_started') && player.getVariable('aweEmotionChosen')) {
    // SYSTEM: "EVERYTHING IS IN ORBIT. NOTHING TRULY STOPS. I am Vortis."
    await player.showText('EVERYTHING IS IN ORBIT. NOTHING TRULY STOPS. I am Vortis.');
  }
}
