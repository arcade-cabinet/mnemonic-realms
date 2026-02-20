import { MapData, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { spawnMapEvents } from './events/depths-level-3-resonant-caverns-events';

@MapData({
  id: 'depths-l3',
  file: require('./tmx/depths-l3.tmx'),
})
export class DepthsLevel3Map extends RpgMap {
  override onJoin(player: RpgPlayer) {
    spawnMapEvents(player);
  }
}
