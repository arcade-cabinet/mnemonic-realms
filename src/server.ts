/**
 * Mnemonic Realms - Main Server Entry
 * RPG-JS v4 Server with Dynamic Procedural Generation
 */

import { expressServer } from '@rpgjs/server/express';
import modules from './modules';

// Start Express server with RPG-JS
expressServer(modules, {
  basePath: __dirname,
  globalConfig: {
    inputs: {
      up: { repeat: true, bind: 'up' },
      down: { repeat: true, bind: 'down' },
      left: { repeat: true, bind: 'left' },
      right: { repeat: true, bind: 'right' },
      action: { bind: 'space' },
      back: { bind: 'escape' },
    },
  },
});
