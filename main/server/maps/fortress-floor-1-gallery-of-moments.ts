import { MapData, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { spawnMapEvents } from './events/fortress-floor-1-gallery-of-moments-events';

@MapData({
  id: 'fortress-f1',
  file: require('./tmx/fortress-f1.tmx'),
})
export class FortressF1Map extends RpgMap {
  override onJoin(player: RpgPlayer) {
    spawnMapEvents(player);
  }
}
