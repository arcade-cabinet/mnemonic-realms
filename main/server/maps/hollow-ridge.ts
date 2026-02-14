import { MapData, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { spawnMapEvents } from './events/hollow-ridge-events';

@MapData({
  id: 'hollow-ridge',
  file: require('./tmx/hollow-ridge.tmx'),
})
export class HollowRidgeMap extends RpgMap {
  override onJoin(player: RpgPlayer) {
    spawnMapEvents(player);
  }
}
