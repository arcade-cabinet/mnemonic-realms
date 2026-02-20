import { MapData, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { spawnMapEvents } from './events/settled-lands-events';

@MapData({
  id: 'settled-lands',
  file: require('./tmx/settled-lands.tmx'),
})
export class SettledLandsMap extends RpgMap {
  override onJoin(player: RpgPlayer) {
    spawnMapEvents(player, this);
  }
}
