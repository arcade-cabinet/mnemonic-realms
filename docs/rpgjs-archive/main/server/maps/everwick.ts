import { MapData, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { spawnMapEvents } from './events/everwick-events';

@MapData({
  id: 'everwick',
  file: require('./tmx/everwick.tmx'),
})
export class EverwickMap extends RpgMap {
  override onJoin(player: RpgPlayer) {
    spawnMapEvents(player, this);
  }
}
