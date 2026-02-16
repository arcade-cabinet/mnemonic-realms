import { MapData, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { spawnMapEvents } from './events/the-undrawn-peaks-events';

@MapData({
  id: 'undrawn-peaks',
  file: require('./tmx/undrawn-peaks.tmx'),
})
export class UndrawnPeaksMap extends RpgMap {
  override onJoin(player: RpgPlayer) {
    spawnMapEvents(player);
  }
}
