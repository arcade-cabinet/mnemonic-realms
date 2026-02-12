/**
 * Main Server Module for Mnemonic Realms
 * Dynamically generates worlds from seeds
 */

import { RpgModule, RpgServerEngine, RpgServer, RpgPlayer } from '@rpgjs/server';
import { ProceduralWorld } from '../../../ecs/world';
import { getMapForSeed } from '../../../game/maps/ProceduralMap';

/**
 * Server module configuration
 */
@RpgModule<RpgServer>({
  engine: {
    onStart(engine: RpgServerEngine) {
      console.log('🎮 Mnemonic Realms Server Starting...');
      console.log('📍 Procedural generation engine initialized');
      console.log('🌍 Ready to generate worlds from seeds');
    },
  },
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
      if (character) {
        player.name = character.Name?.value || `Hero-${player.id}`;
        player.setGraphic('male');
        
        // Set class and stats
        const className = character.CharacterClass?.name || 'Wanderer';
        const alignment = character.Alignment?.type || 'neutral';
        
        console.log(`🎭 ${player.name} - ${className} (${alignment})`);
        
        // Store character data
        player.setVariable('class', className);
        player.setVariable('alignment', alignment);
      }
      
      // Load player into dynamically generated map
      const mapData = getMapForSeed(seed);
      player.changeMap(mapData.id);
    },
    
    onJoinMap(player: RpgPlayer, map: any) {
      console.log(`🗺️  ${player.name} entered ${map.name}`);
    },
  },
  maps: [], // Maps generated dynamically, not pre-defined
})
export default class MainServerModule {}
