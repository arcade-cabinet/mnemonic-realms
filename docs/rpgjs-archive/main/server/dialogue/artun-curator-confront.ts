import type { RpgPlayer } from '@rpgjs/server';
import { isQuestActive } from '../systems/quests';

export default async function dialogue(player: RpgPlayer) {
  const mapId = (player.map as { id?: string })?.id;
  const hasPlayed = player.getVariable('dlg_callum_curator_confront_played');
  const atConfrontStage = player.getVariable('MQ09_STAGE') === 'confrontCurator';

  // Trigger conditions: Quest MQ-09 is active and at the specific confrontation stage,
  // player is on Preserver Fortress Floor 3, and this dialogue hasn't played yet.
  if (
    isQuestActive(player, 'MQ-09') &&
    atConfrontStage &&
    mapId === 'preserver_fortress_floor3' &&
    !hasPlayed
  ) {
    player.setVariable('dlg_callum_curator_confront_played', true);

    await player.showText('You want to silence the question. But the question IS the world.', {
      speaker: 'Artun',
    });

    // Optionally, advance the quest stage after this dialogue
    // player.updateQuest('MQ-09', 'postConfrontation');
  }
}
