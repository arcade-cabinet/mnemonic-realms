/**
 * Main Server Module for Mnemonic Realms
 * Dynamically generates worlds from seeds using RPG-JS v4 API
 */

import { RpgModule, RpgServer, RpgServerEngine, RpgPlayer } from '@rpgjs/server';
import { ProceduralWorld } from '../../../ecs/world';

/**
 * Server module configuration
 */
@RpgModule<RpgServer>({
  player: {
    onConnected(player: RpgPlayer) {
      console.log(`👤 Player ${player.id} connected`);
      
      // Get seed from player data or use default
      const seed = player.getVariable('worldSeed') || 'dark ancient forest';
      console.log(`🌱 Player world seed: "${seed}"`);
      
      // Generate procedural character from seed
      const world = new ProceduralWorld();
      const charId = world.createCharacter(seed);
      world.update();
      const character = world.exportEntity(charId);
      
      // Apply generated character data
      if (character && character.Name) {
        player.name = (character.Name as any).value || `Hero-${player.id}`;
        player.setGraphic('male');
        
        // Set class and stats
        const className = (character.CharacterClass as any)?.name || 'Wanderer';
        const alignment = (character.Alignment as any)?.type || 'neutral';
        
        console.log(`🎭 ${player.name} - ${className} (${alignment})`);
        
        // Store character data
        player.setVariable('class', className);
        player.setVariable('alignment', alignment);
      }
    },
    
    onJoinMap(player: RpgPlayer, map: any) {
      console.log(`🗺️  ${player.name} entered map ${map.id}`);
    },
  },
  maps: [], // Maps generated dynamically
})
export default class MainServerModule {}
