import type { RpgPlayer } from '@rpgjs/server';

export default async function dialogue(player: RpgPlayer) {
  const quest = player.getQuest('MQ-09');
  const mapId = player.getMapId();
  const hasPlayed = player.getVariable('dlg_callum_curator_confront_played');

  // Trigger conditions: Quest MQ-09 is active and at the specific confrontation stage,
  // player is on Preserver Fortress Floor 3, and this dialogue hasn't played yet.
  if (
    quest &&
    quest.state === 'active' &&
    quest.stage === 'confrontCurator' &&
    mapId === 'preserver_fortress_floor3' &&
    !hasPlayed
  ) {
    player.setVariable('dlg_callum_curator_confront_played', true);

    await player.showText({
      text: 'You want to silence the question. But the question IS the world.',
      speaker: {
        name: 'Callum',
        graphic: 'callum_portrait', // Placeholder for Callum's graphic ID
      },
    });

    // Optionally, advance the quest stage after this dialogue
    // player.updateQuest('MQ-09', 'postConfrontation');
  }
}
