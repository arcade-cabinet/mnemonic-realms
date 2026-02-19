import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { ValidationReport, ValidationIssue } from './types.js';
import { Logger } from './logger.js';

interface EnemyCatalogEntry {
  id: string;
  name: string;
  hp: number;
  str: number;
  int: number;
  dex: number;
  agi: number;
  exp: number;
  gold: number;
  abilities: string[];
  drops: string[];
}

interface EnemyImplementation {
  id: string;
  name: string;
  hp: number;
  str: number;
  int: number;
  dex: number;
  agi: number;
  exp: number;
  gold: number;
  filePath: string;
}

interface EquipmentCatalogEntry {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'consumable';
  obtainableVia: string[];
}

interface EquipmentImplementation {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'consumable';
  filePath: string;
}

interface QuestCatalogEntry {
  id: string;
  name: string;
  type: 'main' | 'side' | 'god-recall';
  prerequisites: string[];
}

interface QuestImplementation {
  id: string;
  name: string;
  filePath: string;
}

export class ContentValidator {
  private logger: Logger;
  private docsPath: string;
  private databasePath: string;
  private questsPath: string;

  constructor() {
    this.logger = new Logger('ContentValidator');
    this.docsPath = 'docs';
    this.databasePath = 'main/database';
    this.questsPath = 'main/server/quests';
  }

  async validate(): Promise<ValidationReport> {
    this.logger.info('Starting content validation...');

    const issues: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];

    // Validate enemies
    const enemyIssues = await this.validateEnemies();
    issues.push(...enemyIssues.filter((i) => i.severity === 'error'));
    warnings.push(...enemyIssues.filter((i) => i.severity === 'warning'));

    // Validate equipment
    const equipmentIssues = await this.validateEquipment();
    issues.push(...equipmentIssues.filter((i) => i.severity === 'error'));
    warnings.push(...equipmentIssues.filter((i) => i.severity === 'warning'));

    // Validate quests
    const questIssues = await this.validateQuests();
    issues.push(...questIssues.filter((i) => i.severity === 'error'));
    warnings.push(...questIssues.filter((i) => i.severity === 'warning'));

    this.logger.info(
      `Content validation complete: ${issues.length} errors, ${warnings.length} warnings`,
    );

    return {
      validator: 'ContentValidator',
      timestamp: new Date().toISOString(),
      summary: {
        totalChecks: issues.length + warnings.length,
        passed: 0,
        failed: issues.length,
        warnings: warnings.length,
      },
      issues,
      warnings,
    };
  }

  private async validateEnemies(): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];

    try {
      // Parse enemy catalog
      const catalogPath = join(this.docsPath, 'design', 'enemies-catalog.md');
      const catalogContent = readFileSync(catalogPath, 'utf-8');
      const catalogEnemies = this.parseEnemyCatalog(catalogContent);

      // Parse enemy implementations
      const enemiesDir = join(this.databasePath, 'enemies');
      const implementedEnemies = this.parseEnemyImplementations(enemiesDir);

      // Check for missing implementations
      for (const catalogEnemy of catalogEnemies) {
        const impl = implementedEnemies.find((e) => e.id === catalogEnemy.id);
        if (!impl) {
          issues.push({
            severity: 'error',
            category: 'missing_content',
            message: `Enemy ${catalogEnemy.id} (${catalogEnemy.name}) is documented but not implemented`,
            location: catalogPath,
          });
          continue;
        }

        // Validate stats match
        if (impl.hp !== catalogEnemy.hp) {
          issues.push({
            severity: 'error',
            category: 'stat_mismatch',
            message: `Enemy ${catalogEnemy.id}: HP mismatch (catalog: ${catalogEnemy.hp}, impl: ${impl.hp})`,
            location: impl.filePath,
          });
        }
        if (impl.str !== catalogEnemy.str) {
          issues.push({
            severity: 'error',
            category: 'stat_mismatch',
            message: `Enemy ${catalogEnemy.id}: STR mismatch (catalog: ${catalogEnemy.str}, impl: ${impl.str})`,
            location: impl.filePath,
          });
        }
        if (impl.int !== catalogEnemy.int) {
          issues.push({
            severity: 'error',
            category: 'stat_mismatch',
            message: `Enemy ${catalogEnemy.id}: INT mismatch (catalog: ${catalogEnemy.int}, impl: ${impl.int})`,
            location: impl.filePath,
          });
        }
        if (impl.dex !== catalogEnemy.dex) {
          issues.push({
            severity: 'error',
            category: 'stat_mismatch',
            message: `Enemy ${catalogEnemy.id}: DEX mismatch (catalog: ${catalogEnemy.dex}, impl: ${impl.dex})`,
            location: impl.filePath,
          });
        }
        if (impl.agi !== catalogEnemy.agi) {
          issues.push({
            severity: 'error',
            category: 'stat_mismatch',
            message: `Enemy ${catalogEnemy.id}: AGI mismatch (catalog: ${catalogEnemy.agi}, impl: ${impl.agi})`,
            location: impl.filePath,
          });
        }
        if (impl.exp !== catalogEnemy.exp) {
          issues.push({
            severity: 'warning',
            category: 'stat_mismatch',
            message: `Enemy ${catalogEnemy.id}: EXP mismatch (catalog: ${catalogEnemy.exp}, impl: ${impl.exp})`,
            location: impl.filePath,
          });
        }
        if (impl.gold !== catalogEnemy.gold) {
          issues.push({
            severity: 'warning',
            category: 'stat_mismatch',
            message: `Enemy ${catalogEnemy.id}: Gold mismatch (catalog: ${catalogEnemy.gold}, impl: ${impl.gold})`,
            location: impl.filePath,
          });
        }
      }

      // Check for undocumented implementations
      for (const impl of implementedEnemies) {
        const catalogEntry = catalogEnemies.find((e) => e.id === impl.id);
        if (!catalogEntry) {
          issues.push({
            severity: 'warning',
            category: 'undocumented_content',
            message: `Enemy ${impl.id} (${impl.name}) is implemented but not documented in catalog`,
            location: impl.filePath,
          });
        }
      }
    } catch (error) {
      issues.push({
        severity: 'error',
        category: 'parse_error',
        message: `Failed to validate enemies: ${error}`,
        location: 'scripts/validation/content-validator.ts',
      });
    }

    return issues;
  }

  private parseEnemyCatalog(content: string): EnemyCatalogEntry[] {
    const enemies: EnemyCatalogEntry[] = [];
    const lines = content.split('\n');

    let currentEnemy: Partial<EnemyCatalogEntry> | null = null;
    let inStatsSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Detect enemy header (### E-XX-YY: Enemy Name)
      if (line.startsWith('###') && !line.includes('Overview') && !line.includes('Stat') && !line.includes('Summary')) {
        if (currentEnemy && currentEnemy.id) {
          enemies.push(currentEnemy as EnemyCatalogEntry);
        }
        // Extract ID from header like "### E-SL-01: Meadow Sprite" or "### B-01: Stagnation Heart"
        const headerMatch = line.match(/^###\s*([A-Z]-[A-Z0-9]+-\d+|B-\d+[a-z]?):\s*(.+)/);
        if (headerMatch) {
          currentEnemy = {
            id: headerMatch[1],
            name: headerMatch[2].trim(),
            abilities: [],
            drops: [],
          };
        } else {
          currentEnemy = null;
        }
        inStatsSection = false;
      }

      // Skip ID parsing from **ID:** lines (not used in this catalog format)
      if (line.startsWith('**ID:**') && currentEnemy) {
        // Catalog uses ID in header, not separate line
      }

      // Parse stats table (vertical format: | Stat | Value | with rows for HP, ATK, INT, DEF, AGI)
      if (line.startsWith('| Stat | Value |') && currentEnemy) {
        inStatsSection = true;
        // Skip the separator line
        i++;
        // Parse the next 6 lines (HP, ATK, INT, DEF, AGI, Base Level)
        for (let j = 0; j < 6 && i + 1 < lines.length; j++) {
          i++;
          const statLine = lines[i].trim();
          if (statLine.startsWith('|')) {
            const parts = statLine.split('|').map((p) => p.trim()).filter(Boolean);
            if (parts.length >= 2) {
              const statName = parts[0];
              const statValue = Number.parseInt(parts[1], 10);
              if (statName === 'HP') currentEnemy.hp = statValue;
              else if (statName === 'ATK') currentEnemy.str = statValue; // ATK in catalog = str in impl
              else if (statName === 'INT') currentEnemy.int = statValue;
              else if (statName === 'DEF') currentEnemy.dex = statValue; // DEF in catalog = dex in impl
              else if (statName === 'AGI') currentEnemy.agi = statValue;
              // Skip Base Level - not used in validation
            }
          }
        }
      }

      // Parse rewards (format: **Rewards**: 18 XP | 8 gold)
      if (line.startsWith('**Rewards**:') && currentEnemy) {
        const rewardsMatch = line.match(/(\d+)\s*XP\s*\|\s*(\d+)\s*gold/);
        if (rewardsMatch) {
          currentEnemy.exp = Number.parseInt(rewardsMatch[1], 10);
          currentEnemy.gold = Number.parseInt(rewardsMatch[2], 10);
        }
      }

      // Parse abilities (numbered list format: 1. **Name** — Description)
      if (/^\d+\.\s*\*\*/.test(line) && currentEnemy) {
        const abilityName = line.match(/\*\*([^*]+)\*\*/)?.[1];
        if (abilityName) {
          currentEnemy.abilities?.push(abilityName);
        }
      }

      // Parse drops
      if (line.startsWith('- ') && line.includes('%') && currentEnemy) {
        const dropMatch = line.match(/([A-Z]-[A-Z]+-\d+)/);
        if (dropMatch) {
          currentEnemy.drops?.push(dropMatch[1]);
        }
      }
    }

    if (currentEnemy && currentEnemy.id) {
      enemies.push(currentEnemy as EnemyCatalogEntry);
    }

    return enemies;
  }

  private parseEnemyImplementations(enemiesDir: string): EnemyImplementation[] {
    const implementations: EnemyImplementation[] = [];

    try {
      const files = readdirSync(enemiesDir).filter((f) => f.endsWith('.ts'));

      for (const file of files) {
        const filePath = join(enemiesDir, file);
        const content = readFileSync(filePath, 'utf-8');

        const idMatch = content.match(/id:\s*['"]([^'"]+)['"]/);
        const nameMatch = content.match(/name:\s*['"]([^'"]+)['"]/);
        const hpMatch = content.match(/maxhp:\s*{\s*start:\s*(\d+)/);
        const strMatch = content.match(/str:\s*{\s*start:\s*(\d+)/);
        const intMatch = content.match(/int:\s*{\s*start:\s*(\d+)/);
        const dexMatch = content.match(/dex:\s*{\s*start:\s*(\d+)/);
        const agiMatch = content.match(/agi:\s*{\s*start:\s*(\d+)/);
        const expMatch = content.match(/exp:\s*(\d+)/);
        const goldMatch = content.match(/gold:\s*(\d+)/);

        if (idMatch && nameMatch) {
          implementations.push({
            id: idMatch[1],
            name: nameMatch[1],
            hp: hpMatch ? Number.parseInt(hpMatch[1], 10) : 0,
            str: strMatch ? Number.parseInt(strMatch[1], 10) : 0,
            int: intMatch ? Number.parseInt(intMatch[1], 10) : 0,
            dex: dexMatch ? Number.parseInt(dexMatch[1], 10) : 0,
            agi: agiMatch ? Number.parseInt(agiMatch[1], 10) : 0,
            exp: expMatch ? Number.parseInt(expMatch[1], 10) : 0,
            gold: goldMatch ? Number.parseInt(goldMatch[1], 10) : 0,
            filePath,
          });
        }
      }
    } catch (error) {
      this.logger.error(`Failed to parse enemy implementations: ${error}`);
    }

    return implementations;
  }

  private async validateEquipment(): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];

    try {
      // Parse equipment catalog
      const catalogPath = join(this.docsPath, 'design', 'items-catalog.md');
      const catalogContent = readFileSync(catalogPath, 'utf-8');
      const catalogEquipment = this.parseEquipmentCatalog(catalogContent);

      // Parse equipment implementations
      const weaponsDir = join(this.databasePath, 'weapons');
      const armorDir = join(this.databasePath, 'armor');
      const itemsDir = join(this.databasePath, 'items');

      const implementedEquipment = [
        ...this.parseEquipmentImplementations(weaponsDir, 'weapon'),
        ...this.parseEquipmentImplementations(armorDir, 'armor'),
        ...this.parseEquipmentImplementations(itemsDir, 'consumable'),
      ];

      // Check for missing implementations
      for (const catalogItem of catalogEquipment) {
        const impl = implementedEquipment.find((e) => e.id === catalogItem.id);
        if (!impl) {
          issues.push({
            severity: 'error',
            category: 'missing_content',
            message: `Equipment ${catalogItem.id} (${catalogItem.name}) is documented but not implemented`,
            location: catalogPath,
          });
        }
      }

      // Check for undocumented implementations
      for (const impl of implementedEquipment) {
        const catalogEntry = catalogEquipment.find((e) => e.id === impl.id);
        if (!catalogEntry) {
          issues.push({
            severity: 'warning',
            category: 'undocumented_content',
            message: `Equipment ${impl.id} (${impl.name}) is implemented but not documented in catalog`,
            location: impl.filePath,
          });
        }
      }
    } catch (error) {
      issues.push({
        severity: 'warning',
        category: 'parse_error',
        message: `Failed to validate equipment: ${error}`,
        location: 'scripts/validation/content-validator.ts',
      });
    }

    return issues;
  }

  private parseEquipmentCatalog(content: string): EquipmentCatalogEntry[] {
    const equipment: EquipmentCatalogEntry[] = [];
    const lines = content.split('\n');

    let currentItem: Partial<EquipmentCatalogEntry> | null = null;
    let currentType: 'weapon' | 'armor' | 'consumable' | null = null;

    for (const line of lines) {
      const trimmed = line.trim();

      // Detect section headers
      if (trimmed.startsWith('## Weapons')) {
        currentType = 'weapon';
      } else if (trimmed.startsWith('## Armor')) {
        currentType = 'armor';
      } else if (trimmed.startsWith('## Consumables')) {
        currentType = 'consumable';
      }

      // Detect item header
      if (trimmed.startsWith('###') && currentType) {
        if (currentItem && currentItem.id) {
          equipment.push(currentItem as EquipmentCatalogEntry);
        }
        currentItem = {
          name: trimmed.replace(/^###\s*/, '').trim(),
          type: currentType,
          obtainableVia: [],
        };
      }

      // Parse ID
      if (trimmed.startsWith('**ID:**') && currentItem) {
        currentItem.id = trimmed.replace(/\*\*ID:\*\*\s*/, '').replace(/`/g, '').trim();
      }

      // Parse obtainability
      if (trimmed.startsWith('**Obtained:**') && currentItem) {
        const obtainText = trimmed.replace(/\*\*Obtained:\*\*\s*/, '').toLowerCase();
        if (obtainText.includes('shop')) currentItem.obtainableVia?.push('shop');
        if (obtainText.includes('quest')) currentItem.obtainableVia?.push('quest');
        if (obtainText.includes('treasure') || obtainText.includes('chest'))
          currentItem.obtainableVia?.push('treasure');
        if (obtainText.includes('drop')) currentItem.obtainableVia?.push('drop');
      }
    }

    if (currentItem && currentItem.id) {
      equipment.push(currentItem as EquipmentCatalogEntry);
    }

    return equipment;
  }

  private parseEquipmentImplementations(
    dir: string,
    type: 'weapon' | 'armor' | 'consumable',
  ): EquipmentImplementation[] {
    const implementations: EquipmentImplementation[] = [];

    try {
      const files = readdirSync(dir).filter((f) => f.endsWith('.ts'));

      for (const file of files) {
        const filePath = join(dir, file);
        const content = readFileSync(filePath, 'utf-8');

        const idMatch = content.match(/id:\s*['"]([^'"]+)['"]/);
        const nameMatch = content.match(/name:\s*['"]([^'"]+)['"]/);

        if (idMatch && nameMatch) {
          implementations.push({
            id: idMatch[1],
            name: nameMatch[1],
            type,
            filePath,
          });
        }
      }
    } catch (error) {
      this.logger.error(`Failed to parse ${type} implementations: ${error}`);
    }

    return implementations;
  }

  private async validateQuests(): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];

    try {
      // Parse quest catalog
      const catalogPath = join(this.docsPath, 'story', 'quest-chains.md');
      const catalogContent = readFileSync(catalogPath, 'utf-8');
      const catalogQuests = this.parseQuestCatalog(catalogContent);

      // Parse quest implementations
      const implementedQuests = this.parseQuestImplementations(this.questsPath);

      // Check for missing implementations
      for (const catalogQuest of catalogQuests) {
        const impl = implementedQuests.find((q) => q.id === catalogQuest.id);
        if (!impl) {
          issues.push({
            severity: 'error',
            category: 'missing_content',
            message: `Quest ${catalogQuest.id} (${catalogQuest.name}) is documented but not implemented`,
            location: catalogPath,
          });
        }
      }

      // Check for undocumented implementations
      for (const impl of implementedQuests) {
        const catalogEntry = catalogQuests.find((q) => q.id === impl.id);
        if (!catalogEntry) {
          issues.push({
            severity: 'warning',
            category: 'undocumented_content',
            message: `Quest ${impl.id} (${impl.name}) is implemented but not documented in catalog`,
            location: impl.filePath,
          });
        }
      }
    } catch (error) {
      issues.push({
        severity: 'warning',
        category: 'parse_error',
        message: `Failed to validate quests: ${error}`,
        location: 'scripts/validation/content-validator.ts',
      });
    }

    return issues;
  }

  private parseQuestCatalog(content: string): QuestCatalogEntry[] {
    const quests: QuestCatalogEntry[] = [];
    const lines = content.split('\n');

    let currentQuest: Partial<QuestCatalogEntry> | null = null;
    let currentType: 'main' | 'side' | 'god-recall' | null = null;

    for (const line of lines) {
      const trimmed = line.trim();

      // Detect section headers
      if (trimmed.startsWith('## Main Quest')) {
        currentType = 'main';
      } else if (trimmed.startsWith('## Side Quest')) {
        currentType = 'side';
      } else if (trimmed.startsWith('## God Recall')) {
        currentType = 'god-recall';
      }

      // Detect quest header
      if (trimmed.startsWith('###') && currentType) {
        if (currentQuest && currentQuest.id) {
          quests.push(currentQuest as QuestCatalogEntry);
        }
        currentQuest = {
          name: trimmed.replace(/^###\s*/, '').trim(),
          type: currentType,
          prerequisites: [],
        };
      }

      // Parse ID
      if (trimmed.startsWith('**ID:**') && currentQuest) {
        currentQuest.id = trimmed.replace(/\*\*ID:\*\*\s*/, '').replace(/`/g, '').trim();
      }

      // Parse prerequisites
      if (trimmed.startsWith('**Prerequisites:**') && currentQuest) {
        const prereqText = trimmed.replace(/\*\*Prerequisites:\*\*\s*/, '');
        const prereqMatches = prereqText.match(/[A-Z]+-\d+/g);
        if (prereqMatches) {
          currentQuest.prerequisites = prereqMatches;
        }
      }
    }

    if (currentQuest && currentQuest.id) {
      quests.push(currentQuest as QuestCatalogEntry);
    }

    return quests;
  }

  private parseQuestImplementations(questsDir: string): QuestImplementation[] {
    const implementations: QuestImplementation[] = [];

    try {
      const files = readdirSync(questsDir).filter((f) => f.endsWith('.ts'));

      for (const file of files) {
        const filePath = join(questsDir, file);
        const content = readFileSync(filePath, 'utf-8');

        const idMatch = content.match(/id:\s*['"]([^'"]+)['"]/);
        const nameMatch = content.match(/name:\s*['"]([^'"]+)['"]/);

        if (idMatch && nameMatch) {
          implementations.push({
            id: idMatch[1],
            name: nameMatch[1],
            filePath,
          });
        }
      }
    } catch (error) {
      this.logger.error(`Failed to parse quest implementations: ${error}`);
    }

    return implementations;
  }
}
