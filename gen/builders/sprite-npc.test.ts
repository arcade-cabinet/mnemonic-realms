import { describe, expect, it, vi } from 'vitest';

// Mock the DDL loader
vi.mock('./ddl-loader', () => ({
  loadNpcs: vi.fn(),
}));

// Mock config
vi.mock('../config/index', () => ({
  DIMENSIONS: {
    spriteWalk: { width: 96, height: 256, genWidth: 384, genHeight: 1024 },
  },
  MASTER_NEGATIVE_PROMPT: 'test-negative',
  SPRITE_STYLE: { npc: 'test-npc-style' },
}));

import { loadNpcs } from './ddl-loader';
import { buildNpcSprites } from './sprite-npc';

const mockLoadNpcs = vi.mocked(loadNpcs);

describe('buildNpcSprites', () => {
  it('separates named and template NPCs', () => {
    mockLoadNpcs.mockReturnValue([
      { id: 'elder', name: 'Elder Sage', heading: 'Elder', type: 'named', desc: 'A wise sage' },
      { id: 'villager', name: 'Villager', heading: 'Villager', type: 'template', desc: 'Generic' },
    ]);

    const result = buildNpcSprites();
    const namedAssets = result.filter((a) => a.id.startsWith('sprite-npc-'));
    const templateAssets = result.filter((a) => a.id.startsWith('sprite-npt-'));

    expect(namedAssets).toHaveLength(1);
    expect(templateAssets).toHaveLength(1);
  });

  it('uses correct ID prefix for named NPCs', () => {
    mockLoadNpcs.mockReturnValue([
      { id: 'elder', name: 'Elder Sage', heading: 'Elder', type: 'named', desc: 'A wise sage' },
    ]);

    const result = buildNpcSprites();
    expect(result[0].id).toBe('sprite-npc-elder');
  });

  it('uses correct ID prefix for template NPCs', () => {
    mockLoadNpcs.mockReturnValue([
      { id: 'villager', name: 'Villager', heading: 'Villager', type: 'template', desc: 'Generic' },
    ]);

    const result = buildNpcSprites();
    expect(result[0].id).toBe('sprite-npt-villager');
  });

  it('includes NPC desc in prompt', () => {
    mockLoadNpcs.mockReturnValue([
      { id: 'elder', name: 'Elder Sage', heading: 'Elder', type: 'named', desc: 'A wise sage' },
    ]);

    const result = buildNpcSprites();
    expect(result[0].prompt).toContain('A wise sage');
  });

  it('uses config style and negative prompt', () => {
    mockLoadNpcs.mockReturnValue([
      { id: 'elder', name: 'Elder Sage', heading: 'Elder', type: 'named', desc: 'desc' },
    ]);

    const result = buildNpcSprites();
    expect(result[0].prompt).toContain('test-npc-style');
    expect(result[0].negativePrompt).toBe('test-negative');
  });

  it('sets all assets to pending status', () => {
    mockLoadNpcs.mockReturnValue([
      { id: 'a', name: 'A', heading: 'A', type: 'named', desc: 'd' },
      { id: 'b', name: 'B', heading: 'B', type: 'template', desc: 'd' },
    ]);

    const result = buildNpcSprites();
    expect(result.every((a) => a.status === 'pending')).toBe(true);
  });

  it('sets spriteSize to 32x32 for all', () => {
    mockLoadNpcs.mockReturnValue([{ id: 'a', name: 'A', heading: 'A', type: 'named', desc: 'd' }]);

    const result = buildNpcSprites();
    expect(result[0].spriteSize).toBe('32x32');
  });

  it('assigns walk and idle animations only', () => {
    mockLoadNpcs.mockReturnValue([{ id: 'a', name: 'A', heading: 'A', type: 'named', desc: 'd' }]);

    const result = buildNpcSprites();
    expect(result[0].animations).toEqual({
      walk: true,
      idle: true,
      attack: false,
      cast: false,
      hit: false,
      death: false,
    });
  });

  it('creates docRefs with correct headings for named vs template', () => {
    mockLoadNpcs.mockReturnValue([
      { id: 'elder', name: 'Elder Sage', heading: 'Elder Sage', type: 'named', desc: 'd' },
      { id: 'villager', name: 'Villager', heading: 'Villager', type: 'template', desc: 'd' },
    ]);

    const result = buildNpcSprites();
    const namedRefs = result.find((a) => a.id.startsWith('sprite-npc-'))!.docRefs;
    const templateRefs = result.find((a) => a.id.startsWith('sprite-npt-'))!.docRefs;

    expect(namedRefs[1].heading).toBe('Named NPC Sprites (5 Characters)');
    expect(templateRefs[1].heading).toBe('NPC Template Sprites (6 Types)');
  });

  it('places named before template in output array', () => {
    mockLoadNpcs.mockReturnValue([
      { id: 'b', name: 'B', heading: 'B', type: 'template', desc: 'd' },
      { id: 'a', name: 'A', heading: 'A', type: 'named', desc: 'd' },
    ]);

    const result = buildNpcSprites();
    expect(result[0].id).toBe('sprite-npc-a');
    expect(result[1].id).toBe('sprite-npt-b');
  });

  it('returns empty array when no NPCs', () => {
    mockLoadNpcs.mockReturnValue([]);
    expect(buildNpcSprites()).toEqual([]);
  });
});
