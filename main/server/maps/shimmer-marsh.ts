import { MapData, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { spawnMapEvents } from './events/shimmer-marsh-events';

@MapData({
  id: 'shimmer-marsh',
  file: require('./tmx/shimmer-marsh.tmx'),
})
export class ShimmerMarshMap extends RpgMap {
  override onJoin(player: RpgPlayer) {
    spawnMapEvents(player);
  }
}
