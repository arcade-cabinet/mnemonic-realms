import { MapData, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { spawnMapEvents } from './events/sketch-realm-events';

@MapData({
  id: 'sketch-realm',
  file: require('./tmx/sketch-realm.tmx'),
})
export class SketchRealmMap extends RpgMap {
  override onJoin(player: RpgPlayer) {
    spawnMapEvents(player, this);
  }
}
