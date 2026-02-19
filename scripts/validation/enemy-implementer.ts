import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { logger } from './logger.js';

interface EnemyStats {
  hp: number;
  atk: number;
  int: number;
  def: number;
  agi: number;
  baseLevel: number;
}

interface Ability {
  name: string;
  description: string;
}

interface DropItem {
  item: string;
  chance: number;
}

interface EnemyCatalogEntry {
  id: string;
  name: string;
  spawnZone: string;
  flavor: string;
  stats: EnemyStats;
  abilities: Ability[];
  rewards: {
    xp: number;
    gold: number;
  };
  dropTable: DropItem[];
  fragmentAffinity: {
    emotion: string;
    element: string;
  };
}

interface EnemyImplementation {
  id: string;
  name: string;
  description: string;
  stats: EnemyStats;
  abilities: Ability[];
  rewards: {
    xp: number;
    gold: number;
  };
  dropTable: DropItem[];
  fragmentAffinity: {
    emotion: string;
    element: string;
  };
  spawnZone: string;
  className: string;
  filePath: string;
}

export class EnemyImplementer {
  private catalogPath: string;
  private outputDir: string;

  constructor(catalogPath: string, outputDir: string) {
    this.catalogPath = catalogPath;
    this.outputDir = outputDir;
  }

  /**
   * Parse enemies catalog markdown to extract enemy entries
   */
  parseCatalog(): EnemyCatalogEntry[] {
    const content = readFileSync(this.catalogPath, 'utf-8');
    const enemies: EnemyCatalogEntry[] = [];

    // Split by enemy sections (### E-XX-XX: Name)
    const sections = content.split(/^### (E-[A-Z]{2}-\d{2}): (.+)$/gm);

    for (let i = 1; i < sections.length; i += 3) {
      const id = sections[i];
      const name = sections[i + 1];
      const body = sections[i + 2];

      try {
        const enemy = this.parseEnemySection(id, name, body);
        enemies.push(enemy);
      } catch (error) {
        logger.warn(`Failed to parse enemy ${id}: ${error}`);
      }
    }

    return enemies;
  }

  private parseEnemySection(id: string, name: string, body: string): EnemyCatalogEntry {
    // Extract spawn zone
    const spawnZoneMatch = body.match(/\*\*Spawn zone\*\*:\s*(.+)/);
    const spawnZone = spawnZoneMatch ? spawnZoneMatch[1].trim() : 'unknown';

    // Extract flavor text
    const flavorMatch = body.match(/\*\*Flavor\*\*:\s*(.+?)(?=\n\n|\n\|)/s);
    const flavor = flavorMatch ? flavorMatch[1].trim() : '';

    // Extract stats table
    const stats = this.parseStatsTable(body);

    // Extract abilities
    const abilities = this.parseAbilities(body);

    // Extract rewards
    const rewardsMatch = body.match(/\*\*Rewards\*\*:\s*(\d+)\s*XP\s*\|\s*(\d+)\s*gold/);
    const rewards = rewardsMatch
      ? { xp: Number.parseInt(rewardsMatch[1]), gold: Number.parseInt(rewardsMatch[2]) }
      : { xp: 0, gold: 0 };

    // Extract drop table
    const dropTable = this.parseDropTable(body);

    // Extract fragment affinity
    const affinityMatch = body.match(/\*\*Fragment affinity\*\*:\s*(.+?)\s*\/\s*(.+)/);
    const fragmentAffinity = affinityMatch
      ? { emotion: affinityMatch[1].trim(), element: affinityMatch[2].trim() }
      : { emotion: 'unknown', element: 'unknown' };

    return {
      id,
      name,
      spawnZone,
      flavor,
      stats,
      abilities,
      rewards,
      dropTable,
      fragmentAffinity,
    };
  }

  private parseStatsTable(body: string): EnemyStats {
    const hpMatch = body.match(/\|\s*HP\s*\|\s*(\d+)\s*\|/);
    const atkMatch = body.match(/\|\s*ATK\s*\|\s*(\d+)\s*\|/);
    const intMatch = body.match(/\|\s*INT\s*\|\s*(\d+)\s*\|/);
    const defMatch = body.match(/\|\s*DEF\s*\|\s*(\d+)\s*\|/);
    const agiMatch = body.match(/\|\s*AGI\s*\|\s*(\d+)\s*\|/);
    const levelMatch = body.match(/\|\s*Base Level\s*\|\s*(\d+)\s*\|/);

    return {
      hp: hpMatch ? Number.parseInt(hpMatch[1]) : 0,
      atk: atkMatch ? Number.parseInt(atkMatch[1]) : 0,
      int: intMatch ? Number.parseInt(intMatch[1]) : 0,
      def: defMatch ? Number.parseInt(defMatch[1]) : 0,
      agi: agiMatch ? Number.parseInt(agiMatch[1]) : 0,
      baseLevel: levelMatch ? Number.parseInt(levelMatch[1]) : 1,
    };
  }

  private parseAbilities(body: string): Ability[] {
    const abilities: Ability[] = [];
    const abilitySection = body.match(/\*\*Abilities\*\*:\s*([\s\S]+?)(?=\n\*\*|$)/);

    if (abilitySection) {
      const abilityLines = abilitySection[1].split(/\n\d+\.\s+/);
      for (const line of abilityLines) {
        if (!line.trim()) continue;

        const match = line.match(/\*\*(.+?)\*\*\s*—\s*(.+)/s);
        if (match) {
          abilities.push({
            name: match[1].trim(),
            description: match[2].trim().replace(/\n/g, ' '),
          });
        }
      }
    }

    return abilities;
  }

  private parseDropTable(body: string): DropItem[] {
    const dropTable: DropItem[] = [];
    const dropSection = body.match(/\*\*Drop table\*\*:\s*([\s\S]+?)(?=\n\*\*|$)/);

    if (dropSection) {
      const lines = dropSection[1].split('\n');
      for (const line of lines) {
        const match = line.match(/\|\s*(.+?)\s*\(([^)]+)\)\s*\|\s*(\d+)%\s*\|/);
        if (match) {
          dropTable.push({
            item: match[2].trim(),
            chance: Number.parseInt(match[3]) / 100,
          });
        }
      }
    }

    return dropTable;
  }

  /**
   * Generate enemy implementation from catalog entry
   */
  generateImplementation(entry: EnemyCatalogEntry): EnemyImplementation {
    const className = this.generateClassName(entry.name);
    const fileName = this.generateFileName(entry.name);
    const filePath = join(this.outputDir, `${fileName}.ts`);

    return {
      id: entry.id,
      name: entry.name,
      description: entry.flavor,
      stats: entry.stats,
      abilities: entry.abilities,
      rewards: entry.rewards,
      dropTable: entry.dropTable,
      fragmentAffinity: entry.fragmentAffinity,
      spawnZone: entry.spawnZone,
      className,
      filePath,
    };
  }

  private generateClassName(name: string): string {
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  private generateFileName(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-');
  }

  /**
   * Create enemy TypeScript file
   */
  createEnemyFile(impl: EnemyImplementation): void {
    const template = this.generateTemplate(impl);

    // Ensure output directory exists
    if (!existsSync(this.outputDir)) {
      mkdirSync(this.outputDir, { recursive: true });
    }

    writeFileSync(impl.filePath, template, 'utf-8');
    logger.info(`Created enemy file: ${impl.filePath}`);
  }

  private generateTemplate(impl: EnemyImplementation): string {
    const drops = impl.dropTable
      .map((drop) => `    // - ${drop.item}: ${(drop.chance * 100).toFixed(0)}% chance`)
      .join('\n');

    const abilities = impl.abilities
      .map((ability) => `  // - ${ability.name}: ${ability.description}`)
      .join('\n');

    return `import { Enemy } from '@rpgjs/database';

@Enemy({
  id: '${impl.id}',
  name: '${impl.name}',
  description: '${impl.description.replace(/'/g, "\\'")}',
  parameters: {
    maxhp: { start: ${impl.stats.hp}, end: ${impl.stats.hp} },
    str: { start: ${impl.stats.atk}, end: ${impl.stats.atk} },
    int: { start: ${impl.stats.int}, end: ${impl.stats.int} },
    dex: { start: ${impl.stats.def}, end: ${impl.stats.def} },
    agi: { start: ${impl.stats.agi}, end: ${impl.stats.agi} },
  },
  gain: {
    exp: ${impl.rewards.xp},
    gold: ${impl.rewards.gold},
  },
})
export default class ${impl.className} {
  // Context:
  // - Zone: ${impl.spawnZone}
  // - Fragment affinity: ${impl.fragmentAffinity.emotion} / ${impl.fragmentAffinity.element}
  // Abilities:
${abilities}
  // Drop table:
${drops}
}
`;
  }

  /**
   * Validate generated implementation matches catalog
   */
  validateImplementation(impl: EnemyImplementation, catalog: EnemyCatalogEntry): boolean {
    const mismatches: string[] = [];

    if (impl.stats.hp !== catalog.stats.hp) {
      mismatches.push(`HP: expected ${catalog.stats.hp}, got ${impl.stats.hp}`);
    }
    if (impl.stats.atk !== catalog.stats.atk) {
      mismatches.push(`ATK: expected ${catalog.stats.atk}, got ${impl.stats.atk}`);
    }
    if (impl.stats.int !== catalog.stats.int) {
      mismatches.push(`INT: expected ${catalog.stats.int}, got ${impl.stats.int}`);
    }
    if (impl.stats.def !== catalog.stats.def) {
      mismatches.push(`DEF: expected ${catalog.stats.def}, got ${impl.stats.def}`);
    }
    if (impl.stats.agi !== catalog.stats.agi) {
      mismatches.push(`AGI: expected ${catalog.stats.agi}, got ${impl.stats.agi}`);
    }
    if (impl.rewards.xp !== catalog.rewards.xp) {
      mismatches.push(`XP: expected ${catalog.rewards.xp}, got ${impl.rewards.xp}`);
    }
    if (impl.rewards.gold !== catalog.rewards.gold) {
      mismatches.push(`Gold: expected ${catalog.rewards.gold}, got ${impl.rewards.gold}`);
    }

    if (mismatches.length > 0) {
      logger.error(`Validation failed for ${impl.id}:`);
      for (const mismatch of mismatches) {
        logger.error(`  - ${mismatch}`);
      }
      return false;
    }

    return true;
  }
}
