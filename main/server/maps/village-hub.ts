import { MapData, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { spawnMapEvents } from './events/village-hub-events';

@MapData({
  id: 'village-hub',
  file: require('./tmx/village-hub.tmx'),
})
export class VillageHubMap extends RpgMap {
  override onJoin(player: RpgPlayer) {
    spawnMapEvents(player, this);
  }
}
