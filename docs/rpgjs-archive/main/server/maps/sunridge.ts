import { MapData, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { spawnMapEvents } from './events/sunridge-events';

@MapData({
  id: 'sunridge',
  file: require('./tmx/sunridge.tmx'),
})
export class SunridgeMap extends RpgMap {
  override onJoin(player: RpgPlayer) {
    spawnMapEvents(player);
  }
}
