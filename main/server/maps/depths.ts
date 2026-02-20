import { MapData, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { spawnMapEvents } from './events/depths-events';

@MapData({
  id: 'depths',
  file: require('./tmx/depths.tmx'),
})
export class DepthsMap extends RpgMap {
  override onJoin(player: RpgPlayer) {
    spawnMapEvents(player, this);
  }
}
