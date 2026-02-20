import { MapData, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { spawnMapEvents } from './events/ambergrove-events';

@MapData({
  id: 'ambergrove',
  file: require('./tmx/ambergrove.tmx'),
})
export class AmbergroveMap extends RpgMap {
  override onJoin(player: RpgPlayer) {
    spawnMapEvents(player);
  }
}
