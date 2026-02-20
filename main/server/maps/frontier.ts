import { MapData, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { spawnMapEvents } from './events/frontier-events';

@MapData({
  id: 'frontier',
  file: require('./tmx/frontier.tmx'),
})
export class FrontierMap extends RpgMap {
  override onJoin(player: RpgPlayer) {
    spawnMapEvents(player, this);
  }
}
