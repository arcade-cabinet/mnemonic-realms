import { MapData, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { spawnMapEvents } from './events/heartfield-events';

@MapData({
  id: 'heartfield',
  file: require('./tmx/heartfield.tmx'),
})
export class HeartfieldMap extends RpgMap {
  override onJoin(player: RpgPlayer) {
    spawnMapEvents(player);
  }
}
