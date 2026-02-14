import { MapData, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { spawnMapEvents } from './events/depths-level-1-memory-cellar-events';

@MapData({
  id: 'depths-l1',
  file: require('./tmx/depths-l1.tmx'),
})
export class DepthsLevel1Map extends RpgMap {
  override onJoin(player: RpgPlayer) {
    spawnMapEvents(player);
  }
}
