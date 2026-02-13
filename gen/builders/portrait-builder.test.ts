import { describe, expect, it, vi } from 'vitest';

// Mock DDL loader
vi.mock('./ddl-loader', () => ({
  loadPortraits: vi.fn(),
  loadPortraitsMeta: vi.fn(),
}));

// Mock config
vi.mock('../config/index', () => ({
  DIMENSIONS: {
    portrait: { width: 256, height: 256, genWidth: 512, genHeight: 512 },
  },
  MASTER_NEGATIVE_PROMPT: 'test-neg',
  MASTER_STYLE_PROMPT: 'test-style',
  PALETTE: { memoryEnergy: '#FFD700' },
  DEFAULT_DOC_REFS: {
    globalStyle: [{ path: 'docs/design/visual-direction.md', heading: 'Style', purpose: 'style' }],
  },
}));

// Mock manifest-io
vi.mock('./manifest-io', () => ({
  timestamp: () => '2025-01-01T00:00:00.000Z',
}));

import { loadPortraits, loadPortraitsMeta } from './ddl-loader';
import { buildPortraitManifest } from './portrait-builder';

const mockLoadPortraits = vi.mocked(loadPortraits);
const mockLoadPortraitsMeta = vi.mocked(loadPortraitsMeta);

describe('buildPortraitManifest', () => {
  const _consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

  it('filters characters from gods', () => {
    mockLoadPortraits.mockReturnValue([
      { id: 'aria', name: 'Aria', appearance: 'Silver hair', type: 'named' },
      { id: 'resonance', name: 'Resonance', appearance: 'Sound waves', type: 'god' },
    ]);
    mockLoadPortraitsMeta.mockReturnValue({ expressions: ['neutral'] });

    const result = buildPortraitManifest();
    const charAssets = result.assets.filter((a) => a.type === 'named');
    const godAssets = result.assets.filter((a) => a.type === 'god');

    expect(charAssets).toHaveLength(1);
    expect(godAssets).toHaveLength(1);
  });

  it('multiplies characters by expressions (N chars x M expressions)', () => {
    mockLoadPortraits.mockReturnValue([
      { id: 'aria', name: 'Aria', appearance: 'Silver hair', type: 'named' },
      { id: 'kael', name: 'Kael', appearance: 'Dark cloak', type: 'named' },
    ]);
    mockLoadPortraitsMeta.mockReturnValue({
      expressions: ['neutral', 'happy', 'angry'],
    });

    const result = buildPortraitManifest();
    const charAssets = result.assets.filter((a) => a.type === 'named');
    // 2 characters x 3 expressions = 6 assets
    expect(charAssets).toHaveLength(6);
  });

  it('gods get single neutral expression only', () => {
    mockLoadPortraits.mockReturnValue([
      { id: 'resonance', name: 'Resonance', appearance: 'Sound waves', type: 'god' },
    ]);
    mockLoadPortraitsMeta.mockReturnValue({
      expressions: ['neutral', 'happy', 'angry'],
    });

    const result = buildPortraitManifest();
    expect(result.assets).toHaveLength(1);
    expect(result.assets[0].expression).toBe('neutral');
  });

  it('generates correct IDs for character portraits', () => {
    mockLoadPortraits.mockReturnValue([
      { id: 'aria', name: 'Aria', appearance: 'Silver', type: 'named' },
    ]);
    mockLoadPortraitsMeta.mockReturnValue({ expressions: ['neutral', 'happy'] });

    const result = buildPortraitManifest();
    const ids = result.assets.map((a) => a.id);
    expect(ids).toContain('portrait-aria-neutral');
    expect(ids).toContain('portrait-aria-happy');
  });

  it('generates correct IDs for god portraits', () => {
    mockLoadPortraits.mockReturnValue([
      { id: 'resonance', name: 'Resonance', appearance: 'Sound', type: 'god' },
    ]);
    mockLoadPortraitsMeta.mockReturnValue({ expressions: ['neutral'] });

    const result = buildPortraitManifest();
    expect(result.assets[0].id).toBe('portrait-god-resonance');
  });

  it('includes appearance in prompt', () => {
    mockLoadPortraits.mockReturnValue([
      { id: 'aria', name: 'Aria', appearance: 'Silver-haired elven woman', type: 'named' },
    ]);
    mockLoadPortraitsMeta.mockReturnValue({ expressions: ['neutral'] });

    const result = buildPortraitManifest();
    expect(result.assets[0].prompt).toContain('Silver-haired elven woman');
  });

  it('includes expression in character prompt', () => {
    mockLoadPortraits.mockReturnValue([
      { id: 'aria', name: 'Aria', appearance: 'Silver', type: 'named' },
    ]);
    mockLoadPortraitsMeta.mockReturnValue({ expressions: ['angry'] });

    const result = buildPortraitManifest();
    expect(result.assets[0].prompt).toContain('angry expression');
  });

  it('includes heading in docRefs when present', () => {
    mockLoadPortraits.mockReturnValue([
      {
        id: 'aria',
        name: 'Aria',
        heading: 'Aria the Wanderer',
        appearance: 'Silver',
        type: 'named',
      },
    ]);
    mockLoadPortraitsMeta.mockReturnValue({ expressions: ['neutral'] });

    const result = buildPortraitManifest();
    const refs = result.assets[0].docRefs;
    expect(refs.some((r) => r.heading === 'Aria the Wanderer')).toBe(true);
  });

  it('omits heading docRef when heading is missing', () => {
    mockLoadPortraits.mockReturnValue([
      { id: 'aria', name: 'Aria', appearance: 'Silver', type: 'named' },
    ]);
    mockLoadPortraitsMeta.mockReturnValue({ expressions: ['neutral'] });

    const result = buildPortraitManifest();
    const refs = result.assets[0].docRefs;
    // Should only have the style ref, not a content ref with character heading
    expect(refs.filter((r) => r.purpose === 'content')).toHaveLength(0);
  });

  it('includes PALETTE.memoryEnergy in god prompts', () => {
    mockLoadPortraits.mockReturnValue([
      { id: 'resonance', name: 'Resonance', appearance: 'Sound waves', type: 'god' },
    ]);
    mockLoadPortraitsMeta.mockReturnValue({ expressions: ['neutral'] });

    const result = buildPortraitManifest();
    expect(result.assets[0].prompt).toContain('#FFD700');
  });

  it('sets all assets to pending status', () => {
    mockLoadPortraits.mockReturnValue([
      { id: 'aria', name: 'Aria', appearance: 'Silver', type: 'named' },
      { id: 'resonance', name: 'Resonance', appearance: 'Sound', type: 'god' },
    ]);
    mockLoadPortraitsMeta.mockReturnValue({ expressions: ['neutral'] });

    const result = buildPortraitManifest();
    expect(result.assets.every((a) => a.status === 'pending')).toBe(true);
  });

  it('includes manifest metadata', () => {
    mockLoadPortraits.mockReturnValue([]);
    mockLoadPortraitsMeta.mockReturnValue({ expressions: ['neutral'] });

    const result = buildPortraitManifest();
    expect(result.schemaVersion).toBe('1.0.0');
    expect(result.updatedAt).toBe('2025-01-01T00:00:00.000Z');
    expect(result.styleGuide).toContain('test-style');
    expect(result.styleDocRefs).toBeDefined();
  });
});
