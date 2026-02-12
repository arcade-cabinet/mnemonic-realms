/**
 * Module registry for RPG-JS v4
 */

import mainServerModule from './main/server';
import mainClientModule from './main/client';

// Export as array for v4 API
const modules = [
  { server: mainServerModule, client: mainClientModule },
];

export default modules;
