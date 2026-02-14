import { MapData, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { spawnMapEvents } from './events/depths-level-4-the-songline-events';

@MapData({
  id: 'depths-l4',
  file: require('./tmx/depths-l4.tmx'),
})
export class DepthsLevel4Map extends RpgMap {
  override onJoin(player: RpgPlayer) {
    spawnMapEvents(player);
  }
}
