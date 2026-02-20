import { MapData, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { spawnMapEvents } from './events/resonance-fields-events';

@MapData({
  id: 'resonance-fields',
  file: require('./tmx/resonance-fields.tmx'),
})
export class ResonanceFieldsMap extends RpgMap {
  override onJoin(player: RpgPlayer) {
    spawnMapEvents(player);
  }
}
