import { describe, expect, it } from 'vitest';
import {
  BiomeConfigSchema,
  BiomesMetaSchema,
  ItemEntrySchema,
  NpcSchema,
  PlayerClassSchema,
  PortraitCharSchema,
  PortraitsMetaSchema,
  StagnationMetaSchema,
  TransitionSchema,
  TransitionsMetaSchema,
} from './ddl';

describe('BiomeConfigSchema', () => {
  const valid = {
    biome: 'forest',
    heading: 'Forest Biome',
    zones: ['clearing', 'deep-woods'],
    gridCols: 4,
    gridRows: 3,
  };

  it('accepts valid biome config', () => {
    expect(BiomeConfigSchema.parse(valid)).toEqual(valid);
  });

  it('rejects empty zones array', () => {
    expect(() => BiomeConfigSchema.parse({ ...valid, zones: [] })).toThrow();
  });

  it('rejects non-positive gridCols', () => {
    expect(() => BiomeConfigSchema.parse({ ...valid, gridCols: 0 })).toThrow();
    expect(() => BiomeConfigSchema.parse({ ...valid, gridCols: -1 })).toThrow();
  });

  it('rejects non-positive gridRows', () => {
    expect(() => BiomeConfigSchema.parse({ ...valid, gridRows: 0 })).toThrow();
  });

  it('rejects non-integer grid dimensions', () => {
    expect(() => BiomeConfigSchema.parse({ ...valid, gridCols: 2.5 })).toThrow();
  });

  it('rejects missing required fields', () => {
    expect(() => BiomeConfigSchema.parse({ biome: 'forest' })).toThrow();
    expect(() => BiomeConfigSchema.parse({})).toThrow();
  });

  it('rejects wrong types', () => {
    expect(() => BiomeConfigSchema.parse({ ...valid, biome: 123 })).toThrow();
    expect(() => BiomeConfigSchema.parse({ ...valid, zones: 'not-array' })).toThrow();
    expect(() => BiomeConfigSchema.parse({ ...valid, gridCols: 'three' })).toThrow();
  });
});

describe('BiomesMetaSchema', () => {
  const valid = {
    tierColumnMap: { muted: 'col1', normal: 'col2', vivid: 'col3' },
    sketchTierColumnMap: { sketch: 'col1' },
  };

  it('accepts valid biomes meta', () => {
    expect(BiomesMetaSchema.parse(valid)).toEqual(valid);
  });

  it('accepts empty tier maps', () => {
    expect(BiomesMetaSchema.parse({ tierColumnMap: {}, sketchTierColumnMap: {} })).toEqual({
      tierColumnMap: {},
      sketchTierColumnMap: {},
    });
  });

  it('rejects missing fields', () => {
    expect(() => BiomesMetaSchema.parse({ tierColumnMap: {} })).toThrow();
    expect(() => BiomesMetaSchema.parse({})).toThrow();
  });
});

describe('TransitionSchema', () => {
  const valid = { from: 'forest', to: 'village', usedAt: 'biome-boundary' };

  it('accepts valid transition', () => {
    expect(TransitionSchema.parse(valid)).toEqual(valid);
  });

  it('rejects missing fields', () => {
    expect(() => TransitionSchema.parse({ from: 'forest', to: 'village' })).toThrow();
  });

  it('rejects wrong types', () => {
    expect(() => TransitionSchema.parse({ ...valid, from: 42 })).toThrow();
  });
});

describe('TransitionsMetaSchema', () => {
  it('accepts valid meta', () => {
    expect(TransitionsMetaSchema.parse({ gridCols: 2, gridRows: 3 })).toEqual({
      gridCols: 2,
      gridRows: 3,
    });
  });

  it('rejects zero values', () => {
    expect(() => TransitionsMetaSchema.parse({ gridCols: 0, gridRows: 1 })).toThrow();
  });
});

describe('StagnationMetaSchema', () => {
  const valid = { gridCols: 4, gridRows: 2, zones: ['zone-a'] };

  it('accepts valid stagnation meta', () => {
    expect(StagnationMetaSchema.parse(valid)).toEqual(valid);
  });

  it('rejects empty zones', () => {
    expect(() => StagnationMetaSchema.parse({ ...valid, zones: [] })).toThrow();
  });

  it('rejects negative dimensions', () => {
    expect(() => StagnationMetaSchema.parse({ ...valid, gridCols: -1 })).toThrow();
  });
});

describe('PlayerClassSchema', () => {
  const valid = {
    id: 'warrior',
    name: 'Warrior',
    heading: 'Warrior Class',
    color: '#ff0000',
    accent: '#cc0000',
  };

  it('accepts valid player class', () => {
    expect(PlayerClassSchema.parse(valid)).toEqual(valid);
  });

  it('rejects missing id', () => {
    const { id, ...rest } = valid;
    expect(() => PlayerClassSchema.parse(rest)).toThrow();
  });

  it('rejects wrong types', () => {
    expect(() => PlayerClassSchema.parse({ ...valid, id: 123 })).toThrow();
  });
});

describe('NpcSchema', () => {
  const valid = {
    id: 'elder',
    name: 'Elder Sage',
    heading: 'Elder Sage NPC',
    type: 'named' as const,
    desc: 'A wise old sage.',
  };

  it('accepts named NPC', () => {
    expect(NpcSchema.parse(valid)).toEqual(valid);
  });

  it('accepts template NPC', () => {
    expect(NpcSchema.parse({ ...valid, type: 'template' })).toEqual({
      ...valid,
      type: 'template',
    });
  });

  it('rejects invalid type enum', () => {
    expect(() => NpcSchema.parse({ ...valid, type: 'boss' })).toThrow();
    expect(() => NpcSchema.parse({ ...valid, type: '' })).toThrow();
  });

  it('rejects missing desc', () => {
    const { desc, ...rest } = valid;
    expect(() => NpcSchema.parse(rest)).toThrow();
  });
});

describe('PortraitCharSchema', () => {
  const valid = {
    id: 'aria',
    name: 'Aria',
    appearance: 'Silver-haired young woman',
    type: 'named' as const,
  };

  it('accepts named character without optional heading', () => {
    expect(PortraitCharSchema.parse(valid)).toEqual(valid);
  });

  it('accepts character with heading', () => {
    const withHeading = { ...valid, heading: 'Aria the Wanderer' };
    expect(PortraitCharSchema.parse(withHeading)).toEqual(withHeading);
  });

  it('accepts god type', () => {
    expect(PortraitCharSchema.parse({ ...valid, type: 'god' })).toEqual({ ...valid, type: 'god' });
  });

  it('rejects invalid type', () => {
    expect(() => PortraitCharSchema.parse({ ...valid, type: 'monster' })).toThrow();
  });

  it('rejects missing appearance', () => {
    const { appearance, ...rest } = valid;
    expect(() => PortraitCharSchema.parse(rest)).toThrow();
  });
});

describe('PortraitsMetaSchema', () => {
  it('accepts valid meta with expressions', () => {
    expect(PortraitsMetaSchema.parse({ expressions: ['neutral', 'happy'] })).toEqual({
      expressions: ['neutral', 'happy'],
    });
  });

  it('rejects empty expressions array', () => {
    expect(() => PortraitsMetaSchema.parse({ expressions: [] })).toThrow();
  });

  it('rejects missing expressions', () => {
    expect(() => PortraitsMetaSchema.parse({})).toThrow();
  });
});

describe('ItemEntrySchema', () => {
  const valid = {
    id: 'iron-sword',
    name: 'Iron Sword',
    category: 'weapon-sword',
    desc: 'A sturdy iron sword.',
  };

  it('accepts valid item', () => {
    expect(ItemEntrySchema.parse(valid)).toEqual(valid);
  });

  it('allows any category string', () => {
    expect(ItemEntrySchema.parse({ ...valid, category: 'consumable' }).category).toBe('consumable');
    expect(ItemEntrySchema.parse({ ...valid, category: 'memory-fragment' }).category).toBe(
      'memory-fragment',
    );
  });

  it('rejects missing fields', () => {
    expect(() => ItemEntrySchema.parse({ id: 'x' })).toThrow();
  });

  it('rejects non-string values', () => {
    expect(() => ItemEntrySchema.parse({ ...valid, id: 42 })).toThrow();
  });
});
