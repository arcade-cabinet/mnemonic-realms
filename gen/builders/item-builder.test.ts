import { describe, expect, it, vi } from 'vitest';

// Mock DDL loader
vi.mock('./ddl-loader', () => ({
  loadItems: vi.fn(),
}));

// Mock config
vi.mock('../config/index', () => ({
  DIMENSIONS: {
    itemIcon: { width: 64, height: 64, genWidth: 256, genHeight: 256 },
  },
  MASTER_NEGATIVE_PROMPT: 'test-neg',
  MASTER_STYLE_PROMPT: 'test-style',
  DEFAULT_DOC_REFS: {
    globalStyle: [],
  },
}));

// Mock manifest-io
vi.mock('./manifest-io', () => ({
  timestamp: () => '2025-01-01T00:00:00.000Z',
}));

import { loadItems } from './ddl-loader';
import { buildItemIconManifest } from './item-builder';

const mockLoadItems = vi.mocked(loadItems);

describe('buildItemIconManifest', () => {
  const _consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

  it('filters weapons by category prefix', () => {
    mockLoadItems.mockReturnValue([
      { id: 'iron-sword', name: 'Iron Sword', category: 'weapon-sword', desc: 'A sword' },
      { id: 'fire-staff', name: 'Fire Staff', category: 'weapon-staff', desc: 'A staff' },
      { id: 'potion', name: 'Potion', category: 'consumable', desc: 'Heals' },
    ]);

    const result = buildItemIconManifest();
    const weapons = result.assets.filter((a) => a.category.startsWith('weapon'));
    expect(weapons).toHaveLength(2);
  });

  it('filters consumables by exact category', () => {
    mockLoadItems.mockReturnValue([
      { id: 'potion', name: 'Potion', category: 'consumable', desc: 'Heals' },
      { id: 'elixir', name: 'Elixir', category: 'consumable', desc: 'Full heal' },
    ]);

    const result = buildItemIconManifest();
    const consumables = result.assets.filter((a) => a.category === 'consumable');
    expect(consumables).toHaveLength(2);
  });

  it('filters memory fragments by exact category', () => {
    mockLoadItems.mockReturnValue([
      { id: 'frag-joy', name: 'Joy Fragment', category: 'memory-fragment', desc: 'Glowing' },
    ]);

    const result = buildItemIconManifest();
    const fragments = result.assets.filter((a) => a.category === 'memory-fragment');
    expect(fragments).toHaveLength(1);
  });

  it('memory fragments have glowEffect', () => {
    mockLoadItems.mockReturnValue([
      { id: 'frag-joy', name: 'Joy Fragment', category: 'memory-fragment', desc: 'Glowing' },
    ]);

    const result = buildItemIconManifest();
    const frag = result.assets.find((a) => a.category === 'memory-fragment')!;
    expect((frag as any).glowEffect).toBe(true);
  });

  it('weapons do not have glowEffect', () => {
    mockLoadItems.mockReturnValue([
      { id: 'sword', name: 'Sword', category: 'weapon-sword', desc: 'Sharp' },
    ]);

    const result = buildItemIconManifest();
    expect((result.assets[0] as any).glowEffect).toBeUndefined();
  });

  it('excludes items not matching any category', () => {
    mockLoadItems.mockReturnValue([
      { id: 'key', name: 'Key', category: 'key-item', desc: 'A key' },
      { id: 'sword', name: 'Sword', category: 'weapon-sword', desc: 'Sharp' },
    ]);

    const result = buildItemIconManifest();
    expect(result.assets).toHaveLength(1);
    expect(result.assets[0].id).toBe('sword');
  });

  it('includes item desc in prompt', () => {
    mockLoadItems.mockReturnValue([
      { id: 'sword', name: 'Sword', category: 'weapon-sword', desc: 'A gleaming blade' },
    ]);

    const result = buildItemIconManifest();
    expect(result.assets[0].prompt).toContain('A gleaming blade');
  });

  it('sets correct docRefs per category', () => {
    mockLoadItems.mockReturnValue([
      { id: 'sword', name: 'Sword', category: 'weapon-sword', desc: 'd' },
      { id: 'potion', name: 'Potion', category: 'consumable', desc: 'd' },
      { id: 'frag', name: 'Frag', category: 'memory-fragment', desc: 'd' },
    ]);

    const result = buildItemIconManifest();
    const wpn = result.assets.find((a) => a.id === 'sword')!;
    const con = result.assets.find((a) => a.id === 'potion')!;
    const frag = result.assets.find((a) => a.id === 'frag')!;

    expect(wpn.docRefs[0].heading).toBe('Weapons');
    expect(con.docRefs[0].heading).toBe('Consumables');
    expect(frag.docRefs[0].heading).toBe('Memory Fragments');
  });

  it('memory fragments have two docRefs (content + style)', () => {
    mockLoadItems.mockReturnValue([
      { id: 'frag', name: 'Frag', category: 'memory-fragment', desc: 'd' },
    ]);

    const result = buildItemIconManifest();
    expect(result.assets[0].docRefs).toHaveLength(2);
    expect(result.assets[0].docRefs[0].purpose).toBe('content');
    expect(result.assets[0].docRefs[1].purpose).toBe('style');
  });

  it('lowercases ID for filename', () => {
    mockLoadItems.mockReturnValue([
      { id: 'Iron-Sword', name: 'Iron Sword', category: 'weapon-sword', desc: 'd' },
    ]);

    const result = buildItemIconManifest();
    expect(result.assets[0].filename).toBe('iron-sword.png');
  });

  it('all assets are pending', () => {
    mockLoadItems.mockReturnValue([
      { id: 'sword', name: 'Sword', category: 'weapon-sword', desc: 'd' },
      { id: 'potion', name: 'Potion', category: 'consumable', desc: 'd' },
    ]);

    const result = buildItemIconManifest();
    expect(result.assets.every((a) => a.status === 'pending')).toBe(true);
  });

  it('returns empty assets for empty items', () => {
    mockLoadItems.mockReturnValue([]);

    const result = buildItemIconManifest();
    expect(result.assets).toHaveLength(0);
  });

  it('includes manifest metadata', () => {
    mockLoadItems.mockReturnValue([]);

    const result = buildItemIconManifest();
    expect(result.schemaVersion).toBe('1.0.0');
    expect(result.updatedAt).toBe('2025-01-01T00:00:00.000Z');
    expect(result.styleGuide).toContain('test-style');
  });
});
