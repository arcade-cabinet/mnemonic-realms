/**
 * Integration tests for the gen/ pipeline.
 *
 * Tests the full build pipeline (DDL -> manifest), manifest idempotency,
 * CLI dispatching, and DDL schema validation — all without calling Gemini.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const PROJECT_ROOT = resolve(import.meta.dirname, '../..');
const MANIFESTS_DIR = resolve(PROJECT_ROOT, 'gen/manifests');

function readManifest(subpath: string) {
  const full = resolve(MANIFESTS_DIR, subpath, 'manifest.json');
  return JSON.parse(readFileSync(full, 'utf-8'));
}

function cli(args: string): string {
  const argv = args.trim().split(/\s+/).filter(Boolean);
  return execFileSync('pnpm', ['gen', ...argv], {
    cwd: PROJECT_ROOT,
    encoding: 'utf-8',
    timeout: 30_000,
    env: { ...process.env, NODE_NO_WARNINGS: '1' },
  });
}

// ────────────────────────────────────────────────────────────
// 1. Build all manifests
// ────────────────────────────────────────────────────────────

describe('pnpm gen build all', () => {
  beforeAll(() => {
    cli('build all');
  }, 30_000);

  const codeCategories = [
    'weapons',
    'armor',
    'consumables',
    'skills',
    'enemies',
    'classes',
    'states',
  ];

  it.each(codeCategories)('creates code/%s manifest', (cat) => {
    const path = resolve(MANIFESTS_DIR, 'code', cat, 'manifest.json');
    expect(existsSync(path), `code/${cat}/manifest.json should exist`).toBe(true);
  });

  it('each code manifest has non-empty assets array', () => {
    for (const cat of codeCategories) {
      const m = readManifest(`code/${cat}`);
      expect(m.assets.length, `code/${cat} should have assets`).toBeGreaterThan(0);
    }
  });

  it('code manifest asset counts match DDL entry counts', async () => {
    const { loadDdlDirectory } = await import('../builders/ddl-directory');
    const {
      WeaponStatsDdlSchema,
      ArmorStatsDdlSchema,
      ConsumableStatsDdlSchema,
      SkillStatsDdlSchema,
      EnemyStatsDdlSchema,
      ClassStatsDdlSchema,
      StatusEffectDdlSchema,
    } = await import('../schemas/codegen-ddl');

    const ddlSchemaMap: Record<string, { schema: any; ddlDir: string }> = {
      weapons: { schema: WeaponStatsDdlSchema, ddlDir: 'weapons' },
      armor: { schema: ArmorStatsDdlSchema, ddlDir: 'armor' },
      consumables: { schema: ConsumableStatsDdlSchema, ddlDir: 'consumables' },
      skills: { schema: SkillStatsDdlSchema, ddlDir: 'skills' },
      enemies: { schema: EnemyStatsDdlSchema, ddlDir: 'enemies' },
      classes: { schema: ClassStatsDdlSchema, ddlDir: 'classes' },
      states: { schema: StatusEffectDdlSchema, ddlDir: 'status-effects' },
    };

    for (const [cat, { schema, ddlDir }] of Object.entries(ddlSchemaMap)) {
      const ddlEntries = loadDdlDirectory(ddlDir, schema);
      const manifest = readManifest(`code/${cat}`);
      expect(
        manifest.assets.length,
        `code/${cat} manifest (${manifest.assets.length}) should match DDL (${ddlEntries.length})`,
      ).toBe(ddlEntries.length);
    }
  });

  it('code manifests have required fields', () => {
    for (const cat of codeCategories) {
      const m = readManifest(`code/${cat}`);
      expect(m.schemaVersion).toBeDefined();
      expect(m.description).toBeDefined();
      expect(m.updatedAt).toBeDefined();
      expect(m.category).toBeDefined();
      expect(m.systemPrompt).toBeDefined();
      expect(typeof m.systemPrompt).toBe('string');
      expect(m.systemPrompt.length).toBeGreaterThan(0);
    }
  });

  it('every code manifest asset has id, name, prompt, filename, targetPath', () => {
    for (const cat of codeCategories) {
      const m = readManifest(`code/${cat}`);
      for (const asset of m.assets) {
        expect(asset.id, `${cat} asset missing id`).toBeDefined();
        expect(asset.name, `${cat}/${asset.id} missing name`).toBeDefined();
        expect(asset.prompt, `${cat}/${asset.id} missing prompt`).toBeDefined();
        expect(asset.prompt.length, `${cat}/${asset.id} empty prompt`).toBeGreaterThan(0);
        expect(asset.filename, `${cat}/${asset.id} missing filename`).toBeDefined();
        expect(asset.targetPath, `${cat}/${asset.id} missing targetPath`).toBeDefined();
      }
    }
  });

  it('no duplicate IDs within any code manifest', () => {
    const allManifests = codeCategories.map((c) => ({
      name: `code/${c}`,
      manifest: readManifest(`code/${c}`),
    }));
    for (const { name, manifest } of allManifests) {
      const ids = manifest.assets.map((a: any) => a.id);
      const unique = new Set(ids);
      expect(unique.size, `${name} has duplicate IDs`).toBe(ids.length);
    }
  });
});

// ────────────────────────────────────────────────────────────
// 2. Manifest idempotency
// ────────────────────────────────────────────────────────────

describe('manifest idempotency', () => {
  const testCat = 'code/weapons';
  let firstBuild: any;
  let secondBuild: any;

  beforeAll(() => {
    // First build
    cli('build weapons');
    firstBuild = readManifest(testCat);

    // Simulate that the first asset was generated by injecting metadata
    const modified = { ...firstBuild };
    modified.assets = modified.assets.map((a: any, i: number) => {
      if (i === 0) {
        return {
          ...a,
          status: 'generated',
          metadata: {
            promptHash: 'test-hash-abc123',
            generatedAt: '2026-01-01T00:00:00.000Z',
            generationTimeMs: 1500,
            fileSizeBytes: 2048,
            model: 'gemini-2.5-flash',
          },
        };
      }
      return a;
    });
    writeFileSync(
      resolve(MANIFESTS_DIR, testCat, 'manifest.json'),
      JSON.stringify(modified, null, 2),
    );

    // Second build — should preserve metadata
    cli('build weapons');
    secondBuild = readManifest(testCat);
  }, 30_000);

  it('preserves status for assets with metadata', () => {
    const first = secondBuild.assets[0];
    expect(first.status).toBe('generated');
  });

  it('preserves metadata.promptHash across rebuilds', () => {
    const first = secondBuild.assets[0];
    expect(first.metadata).toBeDefined();
    expect(first.metadata.promptHash).toBe('test-hash-abc123');
  });

  it('preserves metadata.generatedAt across rebuilds', () => {
    const first = secondBuild.assets[0];
    expect(first.metadata.generatedAt).toBe('2026-01-01T00:00:00.000Z');
  });

  it('preserves metadata.model across rebuilds', () => {
    const first = secondBuild.assets[0];
    expect(first.metadata.model).toBe('gemini-2.5-flash');
  });

  it('does not reset status for pending assets without metadata', () => {
    const pending = secondBuild.assets.filter((a: any) => !a.metadata);
    for (const a of pending) {
      expect(a.status).toBe('pending');
    }
  });

  it('updatedAt changes on rebuild', () => {
    expect(secondBuild.updatedAt).not.toBe(firstBuild.updatedAt);
  });

  it('asset count stays the same across rebuilds', () => {
    expect(secondBuild.assets.length).toBe(firstBuild.assets.length);
  });
});

// ────────────────────────────────────────────────────────────
// 3. CLI dispatching
// ────────────────────────────────────────────────────────────

describe('CLI dispatching', () => {
  it('build code builds code manifests', () => {
    const output = cli('build code');
    expect(output).toContain('weapons');
  });

  it('status subcommand runs without errors', () => {
    const output = cli('status');
    expect(output).toContain('Generation Status');
  });

  it('status output reports code and audio sections', () => {
    const output = cli('status');
    expect(output).toContain('Code Generation');
    expect(output).toContain('Audio Assets');
  });

  it('unknown subcommand shows usage and exits non-zero', () => {
    expect(() => cli('nonexistent')).toThrow();
  });

  it('no arguments shows usage without error', () => {
    const output = execFileSync('pnpm', ['gen'], {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
      timeout: 15_000,
      env: { ...process.env, NODE_NO_WARNINGS: '1' },
    });
    expect(output).toContain('Usage');
  });

  it('generate --dry-run does not require API key', () => {
    const output = cli('generate code --dry-run');
    expect(output).toBeDefined();
  });
});

// ────────────────────────────────────────────────────────────
// 4. DDL validation
// ────────────────────────────────────────────────────────────

describe('DDL schema validation', () => {
  describe('image DDL directories', () => {
    it('biomes DDL validates', async () => {
      const { loadBiomes, loadBiomesMeta } = await import('../builders/ddl-loader');
      const biomes = loadBiomes();
      expect(biomes.length).toBeGreaterThan(0);
      const meta = loadBiomesMeta();
      expect(meta.tierColumnMap).toBeDefined();
    });

    it('transitions DDL validates', async () => {
      const { loadTransitions, loadTransitionsMeta } = await import('../builders/ddl-loader');
      const transitions = loadTransitions();
      expect(transitions.length).toBeGreaterThan(0);
      const meta = loadTransitionsMeta();
      expect(meta.gridCols).toBeGreaterThan(0);
    });

    it('stagnation DDL validates', async () => {
      const { loadStagnation } = await import('../builders/ddl-loader');
      const meta = loadStagnation();
      expect(meta.gridCols).toBeGreaterThan(0);
      expect(meta.zones.length).toBeGreaterThan(0);
    });

    it('player-classes DDL validates', async () => {
      const { loadPlayerClasses } = await import('../builders/ddl-loader');
      const classes = loadPlayerClasses();
      expect(classes.length).toBe(4);
      for (const c of classes) {
        expect(c.id).toBeDefined();
        expect(c.name).toBeDefined();
        expect(c.color).toBeDefined();
      }
    });

    it('NPCs DDL validates', async () => {
      const { loadNpcs } = await import('../builders/ddl-loader');
      const npcs = loadNpcs();
      expect(npcs.length).toBeGreaterThan(0);
      for (const npc of npcs) {
        expect(['named', 'template']).toContain(npc.type);
      }
    });

    it('portraits DDL validates', async () => {
      const { loadPortraits, loadPortraitsMeta } = await import('../builders/ddl-loader');
      const portraits = loadPortraits();
      expect(portraits.length).toBeGreaterThan(0);
      const meta = loadPortraitsMeta();
      expect(meta.expressions.length).toBeGreaterThan(0);
    });

    it('items DDL validates', async () => {
      const { loadItems } = await import('../builders/ddl-loader');
      const items = loadItems();
      expect(items.length).toBeGreaterThan(0);
    });

    it('UI elements DDL validates', async () => {
      const { loadUIElements, loadUIElementsMeta } = await import('../builders/ddl-loader');
      const elements = loadUIElements();
      expect(elements.length).toBeGreaterThan(0);
      const meta = loadUIElementsMeta();
      expect(meta.styleNote).toBeDefined();
    });
  });

  describe('code DDL directories', () => {
    it('weapons DDL validates', async () => {
      const { loadWeaponsStats } = await import('../builders/ddl-loader');
      const weapons = loadWeaponsStats();
      expect(weapons.length).toBe(32);
      for (const w of weapons) {
        expect(w.id).toMatch(/^W-/);
        expect(w.statBonus).toBeGreaterThan(0);
        expect(['knight', 'cleric', 'mage', 'rogue']).toContain(w.classRestriction);
      }
    });

    it('armor DDL validates', async () => {
      const { loadArmorStats } = await import('../builders/ddl-loader');
      const armor = loadArmorStats();
      expect(armor.length).toBe(14);
      for (const a of armor) {
        expect(a.id).toMatch(/^A-/);
        expect(a.def).toBeGreaterThan(0);
        expect(a.tier).toBeGreaterThanOrEqual(1);
        expect(a.tier).toBeLessThanOrEqual(3);
      }
    });

    it('consumables DDL validates', async () => {
      const { loadConsumablesStats } = await import('../builders/ddl-loader');
      const consumables = loadConsumablesStats();
      expect(consumables.length).toBe(24);
      for (const c of consumables) {
        expect(c.id).toMatch(/^C-/);
        expect(c.stackMax).toBeGreaterThan(0);
      }
    });

    it('skills DDL validates', async () => {
      const { loadSkillsStats } = await import('../builders/ddl-loader');
      const skills = loadSkillsStats();
      expect(skills.length).toBe(44);
      for (const s of skills) {
        expect(s.id).toMatch(/^SK-/);
        expect(['knight', 'cleric', 'mage', 'rogue']).toContain(s.classId);
        expect(s.level).toBeGreaterThanOrEqual(1);
      }
    });

    it('enemies DDL validates', async () => {
      const { loadEnemiesStats } = await import('../builders/ddl-loader');
      const enemies = loadEnemiesStats();
      expect(enemies.length).toBe(8);
      for (const e of enemies) {
        expect(e.id).toMatch(/^E-/);
        expect(e.hp).toBeGreaterThan(0);
        expect(e.abilities.length).toBeGreaterThan(0);
      }
    });

    it('classes DDL validates', async () => {
      const { loadClassStats } = await import('../builders/ddl-loader');
      const classes = loadClassStats();
      expect(classes.length).toBe(4);
      const ids = classes.map((c: any) => c.id).sort();
      expect(ids).toEqual(['cleric', 'knight', 'mage', 'rogue']);
      for (const c of classes) {
        expect(c.hp.base).toBeGreaterThan(0);
        expect(c.skillIds.length).toBeGreaterThan(0);
      }
    });

    it('status-effects DDL validates', async () => {
      const { loadStatusEffects } = await import('../builders/ddl-loader');
      const effects = loadStatusEffects();
      expect(effects.length).toBe(10);
      for (const e of effects) {
        expect(e.duration).toBeGreaterThan(0);
        expect(typeof e.stackable).toBe('boolean');
      }
    });
  });

  describe('audio DDL directories', () => {
    it('SFX DDL validates', async () => {
      const { loadSfxEntries } = await import('../builders/ddl-loader');
      const sfx = loadSfxEntries();
      expect(sfx.length).toBeGreaterThan(0);
      for (const s of sfx) {
        expect(['ui', 'combat', 'memory', 'environment']).toContain(s.category);
        expect(s.durationSec).toBeGreaterThan(0);
      }
    });

    it('BGM DDL validates', async () => {
      const { loadBgmEntries, loadBgmMeta } = await import('../builders/ddl-loader');
      const bgm = loadBgmEntries();
      expect(bgm.length).toBeGreaterThan(0);
      for (const b of bgm) {
        expect(['zone', 'combat', 'event']).toContain(b.type);
        expect(b.stems.length).toBeGreaterThan(0);
      }
      const meta = loadBgmMeta();
      expect(meta.format).toBeDefined();
    });

    it('ambient DDL validates', async () => {
      const { loadAmbientEntries } = await import('../builders/ddl-loader');
      const ambient = loadAmbientEntries();
      expect(ambient.length).toBeGreaterThan(0);
      for (const a of ambient) {
        expect(a.defaultVolume).toBeGreaterThanOrEqual(0);
        expect(a.defaultVolume).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('cross-DDL consistency', () => {
    it('all skill classIds reference valid class IDs', async () => {
      const { loadSkillsStats, loadClassStats } = await import('../builders/ddl-loader');
      const skills = loadSkillsStats();
      const classes = loadClassStats();
      const classIds = new Set(classes.map((c: any) => c.id));
      for (const skill of skills) {
        expect(
          classIds.has(skill.classId),
          `Skill ${skill.id} references unknown class ${skill.classId}`,
        ).toBe(true);
      }
    });

    it('all class skillIds reference actual skill IDs', async () => {
      const { loadSkillsStats, loadClassStats } = await import('../builders/ddl-loader');
      const skills = loadSkillsStats();
      const classes = loadClassStats();
      const skillIds = new Set(skills.map((s: any) => s.id));
      for (const cls of classes) {
        for (const sid of cls.skillIds) {
          expect(skillIds.has(sid), `Class ${cls.id} references unknown skill ${sid}`).toBe(true);
        }
      }
    });

    it('weapon class restrictions match actual class IDs', async () => {
      const { loadWeaponsStats, loadClassStats } = await import('../builders/ddl-loader');
      const weapons = loadWeaponsStats();
      const classes = loadClassStats();
      const classIds = new Set(classes.map((c: any) => c.id));
      for (const w of weapons) {
        expect(
          classIds.has(w.classRestriction),
          `Weapon ${w.id} references unknown class ${w.classRestriction}`,
        ).toBe(true);
      }
    });
  });
});
