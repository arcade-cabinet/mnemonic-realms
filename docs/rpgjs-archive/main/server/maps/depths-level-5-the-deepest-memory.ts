import { MapData, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { spawnMapEvents } from './events/depths-level-5-the-deepest-memory-events';

@MapData({
  id: 'depths-l5',
  file: require('./tmx/depths-l5.tmx'),
})
export class DepthsLevel5Map extends RpgMap {
  override onJoin(player: RpgPlayer) {
    spawnMapEvents(player);
  }
}
