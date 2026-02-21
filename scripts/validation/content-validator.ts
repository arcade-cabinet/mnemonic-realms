import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { ValidationReport, Issue } from './types.js';
import { logger } from './logger.js';
import { formatTimestamp, calculateDuration } from './utils.js';

// --- DDL JSON shapes ---

interface EnemyDdl {
  id: string;
  name: string;
  zone: string;
  hp: number;
  atk: number;
  int: number;
  def: number;
  agi: number;
  xp: number;
  gold: number;
  abilities: { name: string }[];
  drops: { itemId: string; chance: number }[];
}

interface EncounterDdl {
  id: string;
  name: string;
  enemies: { enemyId: string; count: number }[];
}

interface EncounterFile {
  encounters: EncounterDdl[];
}

interface WeaponDdl {
  id: string;
  name: string;
}

interface ArmorDdl {
  id: string;
  name: string;
}

interface ConsumableDdl {
  id: string;
  name: string;
}

interface QuestDdl {
  id: string;
  name: string;
  category: string;
  dependencies: string[];
  rewards?: { type: string; id?: string }[];
}

// --- Paths ---

const ENEMIES_DIR = 'gen/ddl/enemies';
const ENCOUNTERS_DIR = 'gen/ddl/encounters';
const WEAPONS_DIR = 'gen/ddl/weapons';
const ARMOR_DIR = 'gen/ddl/armor';
const CONSUMABLES_DIR = 'gen/ddl/consumables';
const QUESTS_DIR = 'gen/ddl/quests';

export class ContentValidator {
  constructor() {
    // No configuration needed — all paths are constants
  }

  async validate(): Promise<ValidationReport> {
    const startTime = Date.now();
    logger.info('Starting content validation...');

    const allIssues: Issue[] = [];
    let totalChecks = 0;

    // Validate enemies + cross-reference with encounters
    const enemyResult = this.validateEnemies();
    allIssues.push(...enemyResult.issues);
    totalChecks += enemyResult.checks;

    // Validate equipment (weapons, armor, consumables)
    const equipResult = this.validateEquipment();
    allIssues.push(...equipResult.issues);
    totalChecks += equipResult.checks;

    // Validate quests + dependency graph
    const questResult = this.validateQuests();
    allIssues.push(...questResult.issues);
    totalChecks += questResult.checks;

    const errors = allIssues.filter((i) => i.severity === 'error').length;
    const warnings = allIssues.filter((i) => i.severity === 'warning').length;

    logger.info(
      `Content validation complete: ${errors} errors, ${warnings} warnings out of ${totalChecks} checks`,
    );

    return {
      reportType: 'content',
      timestamp: formatTimestamp(new Date()),
      summary: {
        totalChecks,
        passed: totalChecks - errors,
        failed: errors,
        warnings,
      },
      issues: allIssues,
      metadata: {
        validator: 'ContentValidator',
        version: '2.0.0',
        duration: calculateDuration(startTime),
      },
    };
  }

  // --- Helpers ---

  private loadJsonDir<T>(dir: string): { items: T[]; files: string[] } {
    const items: T[] = [];
    const files: string[] = [];
    if (!existsSync(dir)) return { items, files };

    for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
      const filePath = join(dir, file);
      try {
        const raw = JSON.parse(readFileSync(filePath, 'utf-8'));
        // Some DDL files are arrays, some are objects with an array property
        if (Array.isArray(raw)) {
          items.push(...raw);
        } else if (raw.encounters && Array.isArray(raw.encounters)) {
          items.push(...raw.encounters);
        }
        files.push(filePath);
      } catch (err) {
        logger.warn(`Failed to parse ${filePath}: ${err}`);
      }
    }
    return { items, files };
  }

  // --- Enemy validation ---

  private validateEnemies(): { issues: Issue[]; checks: number } {
    const issues: Issue[] = [];
    let checks = 0;

    // Load all enemy DDL
    const { items: enemies, files: enemyFiles } =
      this.loadJsonDir<EnemyDdl>(ENEMIES_DIR);

    if (enemies.length === 0) {
      issues.push({
        id: 'no-enemy-ddl',
        severity: 'warning',
        category: 'missing-data',
        description: 'No enemy DDL files found in gen/ddl/enemies/',
        location: { file: ENEMIES_DIR },
      });
      return { issues, checks: 1 };
    }

    // Load all encounter DDL
    const { items: encounters } =
      this.loadJsonDir<EncounterDdl>(ENCOUNTERS_DIR);

    // Collect all enemy IDs referenced by encounters
    const referencedEnemyIds = new Set<string>();
    for (const enc of encounters) {
      for (const entry of enc.enemies) {
        referencedEnemyIds.add(entry.enemyId);
      }
    }

    // Check each enemy has required fields
    const seenIds = new Set<string>();
    for (const enemy of enemies) {
      checks++;

      // Duplicate ID check
      if (seenIds.has(enemy.id)) {
        issues.push({
          id: `dup-enemy-${enemy.id}`,
          severity: 'error',
          category: 'duplicate-id',
          description: `Duplicate enemy ID: ${enemy.id} (${enemy.name})`,
          location: { file: ENEMIES_DIR },
        });
      }
      seenIds.add(enemy.id);

      // Required fields
      if (!enemy.name) {
        issues.push({
          id: `enemy-no-name-${enemy.id}`,
          severity: 'error',
          category: 'missing-field',
          description: `Enemy ${enemy.id} is missing a name`,
          location: { file: ENEMIES_DIR },
        });
      }
      if (enemy.hp == null || enemy.hp <= 0) {
        issues.push({
          id: `enemy-bad-hp-${enemy.id}`,
          severity: 'error',
          category: 'invalid-stat',
          description: `Enemy ${enemy.id} (${enemy.name}) has invalid HP: ${enemy.hp}`,
          location: { file: ENEMIES_DIR },
        });
      }

      // Cross-reference: is this enemy used in any encounter?
      checks++;
      if (!referencedEnemyIds.has(enemy.id)) {
        issues.push({
          id: `enemy-unused-${enemy.id}`,
          severity: 'warning',
          category: 'unused-content',
          description: `Enemy ${enemy.id} (${enemy.name}) is not referenced by any encounter`,
          location: { file: ENEMIES_DIR },
          suggestion: 'Add this enemy to an encounter in gen/ddl/encounters/',
        });
      }
    }

    // Check encounters don't reference non-existent enemies
    for (const enc of encounters) {
      for (const entry of enc.enemies) {
        checks++;
        if (!seenIds.has(entry.enemyId)) {
          issues.push({
            id: `enc-missing-enemy-${enc.id}-${entry.enemyId}`,
            severity: 'error',
            category: 'broken-reference',
            description: `Encounter ${enc.id} (${enc.name}) references non-existent enemy ${entry.enemyId}`,
            location: { file: ENCOUNTERS_DIR },
            suggestion: `Add enemy ${entry.enemyId} to gen/ddl/enemies/`,
          });
        }
      }
    }

    return { issues, checks };
  }

  // --- Equipment validation ---

  private validateEquipment(): { issues: Issue[]; checks: number } {
    const issues: Issue[] = [];
    let checks = 0;

    // Load all equipment DDL
    const { items: weapons } = this.loadJsonDir<WeaponDdl>(WEAPONS_DIR);
    const { items: armor } = this.loadJsonDir<ArmorDdl>(ARMOR_DIR);
    const { items: consumables } = this.loadJsonDir<ConsumableDdl>(CONSUMABLES_DIR);

    const allItems = [
      ...weapons.map((w) => ({ ...w, source: WEAPONS_DIR })),
      ...armor.map((a) => ({ ...a, source: ARMOR_DIR })),
      ...consumables.map((c) => ({ ...c, source: CONSUMABLES_DIR })),
    ];

    // Check for duplicate IDs across all item types
    const seenIds = new Set<string>();
    for (const item of allItems) {
      checks++;
      if (seenIds.has(item.id)) {
        issues.push({
          id: `dup-item-${item.id}`,
          severity: 'error',
          category: 'duplicate-id',
          description: `Duplicate item ID: ${item.id} (${item.name})`,
          location: { file: item.source },
        });
      }
      seenIds.add(item.id);

      // Required fields
      if (!item.name) {
        issues.push({
          id: `item-no-name-${item.id}`,
          severity: 'error',
          category: 'missing-field',
          description: `Item ${item.id} is missing a name`,
          location: { file: item.source },
        });
      }
    }

    // Cross-reference: check item IDs referenced in encounter rewards exist
    const { items: encounters } =
      this.loadJsonDir<EncounterDdl & { rewards?: { items?: { itemId: string }[] } }>(
        ENCOUNTERS_DIR,
      );
    for (const enc of encounters) {
      const rewardItems = (enc as { rewards?: { items?: { itemId: string }[] } }).rewards?.items;
      if (rewardItems) {
        for (const reward of rewardItems) {
          checks++;
          if (!seenIds.has(reward.itemId)) {
            issues.push({
              id: `enc-missing-item-${enc.id}-${reward.itemId}`,
              severity: 'warning',
              category: 'broken-reference',
              description: `Encounter ${enc.id} rewards reference non-existent item ${reward.itemId}`,
              location: { file: ENCOUNTERS_DIR },
              suggestion: `Add item ${reward.itemId} to gen/ddl/weapons/, gen/ddl/armor/, or gen/ddl/consumables/`,
            });
          }
        }
      }
    }

    if (allItems.length === 0) {
      issues.push({
        id: 'no-equipment-ddl',
        severity: 'warning',
        category: 'missing-data',
        description: 'No equipment DDL files found',
        location: { file: WEAPONS_DIR },
      });
    }

    return { issues, checks: Math.max(checks, 1) };
  }

  // --- Quest validation ---

  private validateQuests(): { issues: Issue[]; checks: number } {
    const issues: Issue[] = [];
    let checks = 0;

    const { items: quests } = this.loadJsonDir<QuestDdl>(QUESTS_DIR);

    if (quests.length === 0) {
      issues.push({
        id: 'no-quest-ddl',
        severity: 'warning',
        category: 'missing-data',
        description: 'No quest DDL files found in gen/ddl/quests/',
        location: { file: QUESTS_DIR },
      });
      return { issues, checks: 1 };
    }

    const questIds = new Set(quests.map((q) => q.id));

    for (const quest of quests) {
      checks++;

      // Required fields
      if (!quest.name) {
        issues.push({
          id: `quest-no-name-${quest.id}`,
          severity: 'error',
          category: 'missing-field',
          description: `Quest ${quest.id} is missing a name`,
          location: { file: QUESTS_DIR },
        });
      }

      // Validate dependency references
      if (quest.dependencies) {
        for (const dep of quest.dependencies) {
          checks++;
          if (!questIds.has(dep)) {
            issues.push({
              id: `quest-bad-dep-${quest.id}-${dep}`,
              severity: 'error',
              category: 'broken-reference',
              description: `Quest ${quest.id} (${quest.name}) depends on non-existent quest ${dep}`,
              location: { file: QUESTS_DIR },
              suggestion: `Add quest ${dep} to gen/ddl/quests/ or fix the dependency`,
            });
          }
        }
      }

      // Check for circular dependencies (simple 1-hop check)
      if (quest.dependencies) {
        for (const dep of quest.dependencies) {
          const depQuest = quests.find((q) => q.id === dep);
          if (depQuest?.dependencies?.includes(quest.id)) {
            issues.push({
              id: `quest-circular-${quest.id}-${dep}`,
              severity: 'error',
              category: 'circular-dependency',
              description: `Circular dependency: ${quest.id} <-> ${dep}`,
              location: { file: QUESTS_DIR },
            });
          }
        }
      }
    }

    return { issues, checks: Math.max(checks, 1) };
  }
}
