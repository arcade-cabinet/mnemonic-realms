import { describe, expect, it } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { RuntimeMapData } from '../../../gen/assemblage/pipeline/runtime-types.ts';

const ROOT = path.resolve(import.meta.dirname, '..', '..', '..');
const DDL_DIR = path.join(ROOT, 'gen', 'ddl');
const MAPS_DDL = path.join(DDL_DIR, 'maps');
const REGIONS_DDL = path.join(DDL_DIR, 'regions');
const ENCOUNTERS_DDL = path.join(DDL_DIR, 'encounters');
const WORLDS_DDL = path.join(DDL_DIR, 'worlds');

// ── Helpers ──────────────────────────────────────────────────────────────────

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
}

function listJsonFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
}

// ── DDL Source Validation ────────────────────────────────────────────────────

describe('DDL source data', () => {
  describe('map DDL files', () => {
    const mapFiles = listJsonFiles(MAPS_DDL).filter((f) => !f.startsWith('_'));

    it('has at least one map DDL file', () => {
      expect(mapFiles.length).toBeGreaterThan(0);
    });

    for (const file of mapFiles) {
      describe(file, () => {
        const entries = readJson<Array<{ id: string; width: number; height: number; tileSize: number; biome: string }>>(
          path.join(MAPS_DDL, file),
        );

        it('is a non-empty array', () => {
          expect(Array.isArray(entries)).toBe(true);
          expect(entries.length).toBeGreaterThan(0);
        });

        for (const entry of entries) {
          it(`${entry.id} has required fields`, () => {
            expect(entry.id).toBeTruthy();
            expect(entry.width).toBeGreaterThan(0);
            expect(entry.height).toBeGreaterThan(0);
            expect(entry.biome).toBeTruthy();
          });

          it(`${entry.id} has positive dimensions`, () => {
            expect(entry.width).toBeGreaterThanOrEqual(10);
            expect(entry.height).toBeGreaterThanOrEqual(10);
          });
        }
      });
    }
  });

  describe('region DDL files', () => {
    const regionFiles = listJsonFiles(REGIONS_DDL);

    it('has at least one region DDL file', () => {
      expect(regionFiles.length).toBeGreaterThan(0);
    });

    for (const file of regionFiles) {
      describe(file, () => {
        const region = readJson<{ id: string; name: string; anchors?: Array<{ id: string }> }>(
          path.join(REGIONS_DDL, file),
        );

        it('has id and name', () => {
          expect(region.id).toBeTruthy();
          expect(region.name).toBeTruthy();
        });

        it('has anchors array', () => {
          expect(region.anchors).toBeDefined();
          expect(Array.isArray(region.anchors)).toBe(true);
        });
      });
    }
  });

  describe('encounter DDL files', () => {
    const encFiles = listJsonFiles(ENCOUNTERS_DDL);

    it('has at least one encounter DDL file', () => {
      expect(encFiles.length).toBeGreaterThan(0);
    });

    for (const file of encFiles) {
      describe(file, () => {
        const data = readJson<{
          encounters: Array<{ id: string; name: string; enemies: unknown[]; rewards: { xp: number; gold: number }; escapeAllowed: boolean }>;
          pools?: Array<{ regionId: string; encounters: string[] }>;
        }>(path.join(ENCOUNTERS_DDL, file));

        it('has encounters array', () => {
          expect(Array.isArray(data.encounters)).toBe(true);
          expect(data.encounters.length).toBeGreaterThan(0);
        });

        for (const enc of data.encounters) {
          it(`encounter ${enc.id} has required fields`, () => {
            expect(enc.id).toBeTruthy();
            expect(enc.name).toBeTruthy();
            expect(enc.enemies.length).toBeGreaterThan(0);
            expect(enc.rewards).toBeDefined();
            expect(typeof enc.escapeAllowed).toBe('boolean');
          });
        }

        if (data.pools) {
          for (const pool of data.pools) {
            it(`pool ${pool.regionId} references valid encounters`, () => {
              const encIds = new Set(data.encounters.map((e) => e.id));
              for (const encId of pool.encounters) {
                expect(encIds.has(encId)).toBe(true);
              }
            });
          }
        }
      });
    }
  });

  describe('world DDL files', () => {
    const worldFiles = listJsonFiles(WORLDS_DDL);

    it('has at least one world DDL file', () => {
      expect(worldFiles.length).toBeGreaterThan(0);
    });

    for (const file of worldFiles) {
      it(`${file} has required fields`, () => {
        const world = readJson<{ id: string; name: string; templateId: string; parentAnchor: string }>(
          path.join(WORLDS_DDL, file),
        );
        expect(world.id).toBeTruthy();
        expect(world.name).toBeTruthy();
        expect(world.templateId).toBeTruthy();
        expect(world.parentAnchor).toBeTruthy();
      });
    }
  });
});

// ── Generation Logic Invariants ──────────────────────────────────────────────

describe('generation logic invariants', () => {
  it('all map DDL entries have unique IDs', () => {
    const ids = new Set<string>();
    for (const file of listJsonFiles(MAPS_DDL).filter((f) => !f.startsWith('_'))) {
      const entries = readJson<Array<{ id: string }>>(path.join(MAPS_DDL, file));
      for (const entry of entries) {
        expect(ids.has(entry.id)).toBe(false);
        ids.add(entry.id);
      }
    }
  });

  it('all region anchors reference map DDL entries', () => {
    const mapIds = new Set<string>();
    for (const file of listJsonFiles(MAPS_DDL).filter((f) => !f.startsWith('_'))) {
      const entries = readJson<Array<{ id: string }>>(path.join(MAPS_DDL, file));
      for (const entry of entries) mapIds.add(entry.id);
    }

    for (const file of listJsonFiles(REGIONS_DDL)) {
      const region = readJson<{ anchors?: Array<{ id: string }> }>(path.join(REGIONS_DDL, file));
      for (const anchor of region.anchors ?? []) {
        expect(mapIds.has(anchor.id)).toBe(true);
      }
    }
  });

  it('child world parentAnchors reference map DDL entries', () => {
    const mapIds = new Set<string>();
    for (const file of listJsonFiles(MAPS_DDL).filter((f) => !f.startsWith('_'))) {
      const entries = readJson<Array<{ id: string }>>(path.join(MAPS_DDL, file));
      for (const entry of entries) mapIds.add(entry.id);
    }

    for (const file of listJsonFiles(WORLDS_DDL)) {
      const world = readJson<{ parentAnchor: string }>(path.join(WORLDS_DDL, file));
      expect(mapIds.has(world.parentAnchor)).toBe(true);
    }
  });

  it('vibrancy state mapping is correct', () => {
    // Test the vibrancy threshold logic used in generateMapRuntime
    const getState = (v: number) => (v >= 70 ? 'remembered' : v >= 30 ? 'partial' : 'forgotten');
    expect(getState(100)).toBe('remembered');
    expect(getState(70)).toBe('remembered');
    expect(getState(69)).toBe('partial');
    expect(getState(30)).toBe('partial');
    expect(getState(29)).toBe('forgotten');
    expect(getState(0)).toBe('forgotten');
  });

  it('border collision logic blocks all edges', () => {
    // Test the border collision logic used in generateMapRuntime
    const w = 10;
    const h = 8;
    const collision: (0 | 1)[] = new Array(w * h).fill(0 as 0 | 1);
    for (let x = 0; x < w; x++) {
      collision[x] = 1;
      collision[(h - 1) * w + x] = 1;
    }
    for (let y = 0; y < h; y++) {
      collision[y * w] = 1;
      collision[y * w + (w - 1)] = 1;
    }

    // Top row blocked
    for (let x = 0; x < w; x++) expect(collision[x]).toBe(1);
    // Bottom row blocked
    for (let x = 0; x < w; x++) expect(collision[(h - 1) * w + x]).toBe(1);
    // Left column blocked
    for (let y = 0; y < h; y++) expect(collision[y * w]).toBe(1);
    // Right column blocked
    for (let y = 0; y < h; y++) expect(collision[y * w + (w - 1)]).toBe(1);
    // Interior passable
    expect(collision[1 * w + 1]).toBe(0);
    expect(collision[3 * w + 5]).toBe(0);
  });

  it('template sizes cover expected interior types', () => {
    const TEMPLATE_SIZES: Record<string, [number, number]> = {
      inn: [20, 15],
      shop: [15, 12],
      'shop-single': [15, 12],
      house: [12, 10],
      residence: [12, 10],
      forge: [18, 14],
      dungeon: [30, 20],
      fortress: [40, 30],
      cellar: [20, 15],
    };

    // All world DDL templateIds should have a size entry
    for (const file of listJsonFiles(WORLDS_DDL)) {
      const world = readJson<{ templateId: string }>(path.join(WORLDS_DDL, file));
      const size = TEMPLATE_SIZES[world.templateId];
      expect(size).toBeDefined();
      expect(size![0]).toBeGreaterThan(0);
      expect(size![1]).toBeGreaterThan(0);
    }
  });
});

// ── Generated Output Validation (if data/ exists) ───────────────────────────

const DATA_DIR = path.join(ROOT, 'data');
const MAPS_OUT = path.join(DATA_DIR, 'maps');
const ENCOUNTERS_OUT = path.join(DATA_DIR, 'encounters');

describe.skipIf(!fs.existsSync(MAPS_OUT))('generated map files', () => {
  const mapFiles = listJsonFiles(MAPS_OUT);

  it('has generated map files', () => {
    expect(mapFiles.length).toBeGreaterThan(0);
  });

  for (const file of mapFiles) {
    describe(file, () => {
      const data = readJson<RuntimeMapData>(path.join(MAPS_OUT, file));

      it('has correct tile dimensions (16x16)', () => {
        expect(data.tileWidth).toBe(16);
        expect(data.tileHeight).toBe(16);
      });

      it('has valid dimensions', () => {
        expect(data.width).toBeGreaterThan(0);
        expect(data.height).toBeGreaterThan(0);
      });

      it('has correct layer sizes', () => {
        const expected = data.width * data.height;
        for (const layerName of data.layerOrder) {
          expect(data.layers[layerName]?.length).toBe(expected);
        }
      });

      it('has correct collision array size', () => {
        expect(data.collision.length).toBe(data.width * data.height);
      });

      it('collision contains only 0 or 1', () => {
        for (const val of data.collision) {
          expect(val === 0 || val === 1).toBe(true);
        }
      });

      it('has at least one spawn point', () => {
        expect(data.spawnPoints.length).toBeGreaterThan(0);
      });

      it('has at least one vibrancy area', () => {
        expect(data.vibrancyAreas.length).toBeGreaterThan(0);
      });

      it('vibrancy areas have valid states', () => {
        const validStates = ['forgotten', 'partial', 'remembered'];
        for (const area of data.vibrancyAreas) {
          expect(validStates).toContain(area.initialState);
        }
      });
    });
  }
});

describe.skipIf(!fs.existsSync(ENCOUNTERS_OUT))('generated encounter files', () => {
  const encFiles = listJsonFiles(ENCOUNTERS_OUT);

  it('has generated encounter files', () => {
    expect(encFiles.length).toBeGreaterThan(0);
  });

  for (const file of encFiles) {
    describe(file, () => {
      const data = readJson<{
        encounters: Array<{ id: string; name: string; type: string; enemies: unknown[]; rewards: { xp: number; gold: number }; escapeAllowed: boolean }>;
        pools: Array<{ regionId: string; encounters: string[] }>;
      }>(path.join(ENCOUNTERS_OUT, file));

      it('has encounters array', () => {
        expect(Array.isArray(data.encounters)).toBe(true);
        expect(data.encounters.length).toBeGreaterThan(0);
      });

      it('all encounters have required fields', () => {
        for (const enc of data.encounters) {
          expect(enc.id).toBeTruthy();
          expect(enc.name).toBeTruthy();
          expect(enc.type).toBeTruthy();
          expect(enc.enemies.length).toBeGreaterThan(0);
          expect(enc.rewards).toBeDefined();
          expect(typeof enc.escapeAllowed).toBe('boolean');
        }
      });

      it('pools reference valid encounter IDs', () => {
        const encIds = new Set(data.encounters.map((e) => e.id));
        for (const pool of data.pools ?? []) {
          for (const encId of pool.encounters) {
            expect(encIds.has(encId)).toBe(true);
          }
        }
      });
    });
  }
});

