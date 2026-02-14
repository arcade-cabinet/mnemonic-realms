import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // This dialogue is intended to be triggered under specific conditions:
  // - Trigger: Kinesis recall — Fury
  // - Quest: GQ-04 is active or completed in a specific way
  // - Condition: 'fury emotion chosen' flag is set
  // - Location: Hollow Ridge — Kinesis Spire (24, 10)
  //
  // In RPG-JS, these triggering conditions are typically configured on the event
  // that initiates this dialogue (e.g., an event on the map, an interaction,
  // or a system-triggered dialogue). The dialogue function itself primarily
  // focuses on the sequence of lines and choices.

  // Tecton's introductory line
  await player.showText('Everything moves. Nothing resists me forever. I am Tecton.', {
    speaker: 'Tecton',
    portrait: 'tecton', // Assuming 'tecton' is the graphic ID for Tecton's portrait
  });
}
