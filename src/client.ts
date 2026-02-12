/**
 * Mnemonic Realms - Main Client Entry  
 * RPG-JS Client Renderer
 */

import { entryPoint } from '@rpgjs/client';
import mainModule from './modules/main/client';

// Register client modules
export default entryPoint({
  basePath: __dirname,
  modules: [mainModule],
  spritesheets: [],
  sounds: [],
  gui: [],
});
