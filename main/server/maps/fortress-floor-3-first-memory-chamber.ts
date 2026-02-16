import { MapData, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { spawnMapEvents } from './events/fortress-floor-3-first-memory-chamber-events';

@MapData({
  id: 'fortress-f3',
  file: require('./tmx/fortress-f3.tmx'),
})
export class FortressF3Map extends RpgMap {
  override onJoin(player: RpgPlayer) {
    spawnMapEvents(player);
  }
}
