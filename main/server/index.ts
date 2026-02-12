/**
 * Main Server Module for Mnemonic Realms
 * Integrates procedural generation with RPG-JS server hooks
 */

import { RpgModule, RpgServerEngine } from '@rpgjs/server';
import { ProceduralPlayer } from './player';
import { ProceduralWorldMap } from './maps/proceduralWorld';

@RpgModule<RpgServerEngine>({
  player: ProceduralPlayer,
  maps: [ProceduralWorldMap],
})
export default class ServerModule {}
