import { MapData, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { spawnMapEvents } from './events/depths-level-2-drowned-archive-events';

@MapData({
  id: 'depths-l2',
  file: require('./tmx/depths-l2.tmx'),
})
export class DepthsLevel2Map extends RpgMap {
  override onJoin(player: RpgPlayer) {
    spawnMapEvents(player);
  }
}
