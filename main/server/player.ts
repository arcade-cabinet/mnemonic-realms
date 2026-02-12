/**
 * Procedural Player Class
 * Generates player stats from seed using ECS procedural generation
 */

import { RpgPlayer, RpgPlayerHooks, Control } from '@rpgjs/server';
import { ProceduralWorld } from '../../lib/ecs/world';
import { Name, CharacterClass, Alignment } from '../../lib/ecs/components';

export class ProceduralPlayer extends RpgPlayer implements RpgPlayerHooks {
  private proceduralWorld: ProceduralWorld;
  private currentSeed: string = 'brave ancient warrior'; // Default seed

  /**
   * Set the world seed for this player
   * Called from client or game initialization
   */
  setWorldSeed(seed: string) {
    this.currentSeed = seed;
    this.generatePlayerStats();
  }

  /**
   * Generate player stats from current seed
   * Uses ECS procedural world to create character
   */
  private generatePlayerStats() {
    // Create procedural world
    this.proceduralWorld = new ProceduralWorld();
    
    // Generate character from seed
    const charId = this.proceduralWorld.createCharacter(this.currentSeed);
    this.proceduralWorld.update();
    
    // Get generated entity
    const entity = this.proceduralWorld.getEntity(charId);
    if (!entity) return;
    
    // Extract components
    const nameComp = entity.getComponent(Name as any);
    const classComp = entity.getComponent(CharacterClass as any);
    const alignmentComp = entity.getComponent(Alignment as any);
    
    // Apply to player
    if (nameComp) {
      this.name = nameComp.value;
    }
    
    if (classComp) {
      // Set player class-based stats
      this.setProceduralClass(classComp.value);
    }
    
    if (alignmentComp) {
      // Store alignment for gameplay effects
      this.setVariable('alignment', alignmentComp.value);
    }
    
    console.log(`Generated player from seed "${this.currentSeed}":`, {
      name: this.name,
      class: classComp?.value,
      alignment: alignmentComp?.value
    });
  }

  /**
   * Set player stats based on procedurally generated class
   */
  private setProceduralClass(className: string) {
    // Base stats
    let hp = 100;
    let str = 10;
    let mag = 10;
    let def = 10;
    
    // Adjust based on class
    switch (className.toLowerCase()) {
      case 'warrior':
      case 'paladin':
        hp += 50;
        str += 5;
        def += 5;
        break;
      case 'mage':
      case 'necromancer':
        hp += 20;
        mag += 10;
        break;
      case 'rogue':
      case 'ranger':
        hp += 30;
        str += 3;
        break;
      case 'cleric':
        hp += 40;
        mag += 5;
        def += 3;
        break;
      default:
        // Adventurer/Bard/default
        hp += 35;
        str += 2;
        mag += 2;
    }
    
    // Set RPG-JS player stats
    this.hp = hp;
    this.setVariable('str', str);
    this.setVariable('mag', mag);
    this.setVariable('def', def);
    this.setVariable('class', className);
  }

  /**
   * Called when player connects to server
   */
  onConnected() {
    // Generate initial player from seed
    this.generatePlayerStats();
  }

  /**
   * Called when player joins a map
   */
  onJoinMap() {
    console.log(`Player ${this.name} joined map`);
  }

  /**
   * Called when player inputs movement
   */
  onInput(control: Control) {
    // Default movement handling
    // RPG-JS handles this automatically
  }
}
