/**
 * Simple start map for Mnemonic Realms
 * This will be enhanced with procedural generation
 */

import { RpgMap, MapData } from '@rpgjs/server';

@MapData({
  id: 'start',
  file: require('./start-map.tmx'),
  name: 'Starting Area',
})
export class StartMap extends RpgMap {
  onLoad() {
    console.log('🗺️  Start map loaded');
  }
  
  onJoin(player: any) {
    console.log(`👤 ${player.name} joined the starting area`);
    player.showText('Welcome to Mnemonic Realms!', {
      autoClose: true,
    });
  }
}
