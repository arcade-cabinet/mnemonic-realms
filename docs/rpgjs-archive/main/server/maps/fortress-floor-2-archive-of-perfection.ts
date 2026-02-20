import { MapData, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { spawnMapEvents } from './events/fortress-floor-2-archive-of-perfection-events';

@MapData({
  id: 'fortress-f2',
  file: require('./tmx/fortress-f2.tmx'),
})
export class FortressF2Map extends RpgMap {
  override onJoin(player: RpgPlayer) {
    spawnMapEvents(player);
  }
}
