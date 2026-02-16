import { MapData, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { spawnMapEvents } from './events/luminous-wastes-events';

@MapData({
  id: 'luminous-wastes',
  file: require('./tmx/luminous-wastes.tmx'),
})
export class LuminousWastesMap extends RpgMap {
  override onJoin(player: RpgPlayer) {
    spawnMapEvents(player);
  }
}
