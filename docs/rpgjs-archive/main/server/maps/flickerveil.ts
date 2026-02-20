import { MapData, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { spawnMapEvents } from './events/flickerveil-events';

@MapData({
  id: 'flickerveil',
  file: require('./tmx/flickerveil.tmx'),
})
export class FlickerveilMap extends RpgMap {
  override onJoin(player: RpgPlayer) {
    spawnMapEvents(player);
  }
}
