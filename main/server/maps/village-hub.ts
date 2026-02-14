import { MapData, RpgMap } from '@rpgjs/server';

@MapData({
  id: 'village-hub',
  file: require('./tmx/village-hub.tmx'),
})
export class VillageHubMap extends RpgMap {}
