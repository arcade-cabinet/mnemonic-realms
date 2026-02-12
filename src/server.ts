/**
 * Mnemonic Realms - Main Server Entry
 * RPG-JS Server with Dynamic Procedural Generation
 */

import { entryPoint } from '@rpgjs/server';
import mainModule from './modules/main/server';

// No pre-defined maps - everything generated on-demand from seeds
export default entryPoint({
  basePath: __dirname,
  modules: [mainModule],
  maps: [], // Maps created dynamically when players connect with seeds
  globalConfig: {
    inputs: {
      up: 'up',
      down: 'down',
      left: 'left',
      right: 'right',
      action: 'space',
      back: 'escape',
    },
    startMap: 'dynamic', // Dynamic map ID
  },
});
