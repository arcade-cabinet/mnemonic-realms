import { MapData, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { spawnMapEvents } from './events/millbrook-events';

@MapData({
  id: 'millbrook',
  file: require('./tmx/millbrook.tmx'),
})
export class MillbrookMap extends RpgMap {
  override onJoin(player: RpgPlayer) {
    spawnMapEvents(player);
  }
}
