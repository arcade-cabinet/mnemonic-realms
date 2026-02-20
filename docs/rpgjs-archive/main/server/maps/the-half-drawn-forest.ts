import { MapData, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { spawnMapEvents } from './events/the-half-drawn-forest-events';

@MapData({
  id: 'half-drawn-forest',
  file: require('./tmx/half-drawn-forest.tmx'),
})
export class HalfDrawnForestMap extends RpgMap {
  override onJoin(player: RpgPlayer) {
    spawnMapEvents(player);
  }
}
