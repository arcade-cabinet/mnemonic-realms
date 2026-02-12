/**
 * Mnemonic Realms - Main Client Entry  
 * RPG-JS v4 Client Renderer
 */

import { entryPoint } from '@rpgjs/client';
import io from 'socket.io-client';
import modules from './modules';

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎮 Initializing Mnemonic Realms Client...');
  
  // Start RPG-JS client
  entryPoint(modules, {
    io,
    globalConfig: {
      // Client configuration
    },
  }).start();
});
