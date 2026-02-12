/**
 * Main Client Module for Mnemonic Realms  
 * Handles client-side rendering and UI using RPG-JS v4 API
 */

import { RpgModule, RpgClient } from '@rpgjs/client';

/**
 * Client module configuration
 */
@RpgModule<RpgClient>({
  scenes: {
    map: {
      onAfterLoading() {
        console.log('🗺️  Map loaded and rendered');
      },
    },
  },
  spritesheets: [], // Will be added as we create sprites
  sounds: [], // Will be added for sound effects
})
export default class MainClientModule {}
