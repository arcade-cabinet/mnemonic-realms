/**
 * Main Client Module for Mnemonic Realms  
 * Handles client-side rendering and UI
 */

import { RpgModule, RpgClient } from '@rpgjs/client';

/**
 * Client module configuration
 */
@RpgModule<RpgClient>({
  engine: {
    onStart(engine: any) {
      console.log('🎮 Mnemonic Realms Client Starting...');
      console.log('🖼️  Rendering engine initialized');
    },
  },
  spritesheets: [], // Will be added as we create sprites
  sounds: [], // Will be added for sound effects
})
export default class MainClientModule {}
