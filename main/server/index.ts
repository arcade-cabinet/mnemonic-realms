import { RpgModule, type RpgServer } from '@rpgjs/server';
import { database } from '../database';
import { player } from './player';

// Maps are registered dynamically from generated map modules.
// If no maps are generated yet, the game will error on player.changeMap()
// rather than silently loading a placeholder. Run `pnpm gen generate maps`
// to generate map files from bible specs.

@RpgModule<RpgServer>({
  player,
  maps: [],
  database,
})
export default class RpgServerModule {}
