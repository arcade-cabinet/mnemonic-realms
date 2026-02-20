import { describe, expect, it } from 'vitest';
import {
  CLASS_DATA,
  confirmClassSelection,
  createTitleState,
  getMenuOptions,
  selectClass,
  selectMenuOption,
} from '../../../../ui/title-screen/title-logic';

// ---------------------------------------------------------------------------
// createTitleState
// ---------------------------------------------------------------------------

describe('createTitleState', () => {
  it('returns correct initial state without save data', () => {
    const state = createTitleState(false);
    expect(state).toEqual({
      phase: 'logo',
      selectedMenu: 0,
      selectedClass: 0,
      hasSaveData: false,
    });
  });

  it('returns correct initial state with save data', () => {
    const state = createTitleState(true);
    expect(state.hasSaveData).toBe(true);
    expect(state.phase).toBe('logo');
  });
});

// ---------------------------------------------------------------------------
// getMenuOptions
// ---------------------------------------------------------------------------

describe('getMenuOptions', () => {
  it('includes only new-journey and settings when no save exists', () => {
    const options = getMenuOptions(false);
    expect(options).toEqual(['new-journey', 'settings']);
  });

  it('includes continue when save exists', () => {
    const options = getMenuOptions(true);
    expect(options).toEqual(['new-journey', 'continue', 'settings']);
  });

  it('always has new-journey first', () => {
    expect(getMenuOptions(false)[0]).toBe('new-journey');
    expect(getMenuOptions(true)[0]).toBe('new-journey');
  });

  it('always has settings last', () => {
    const noSave = getMenuOptions(false);
    const withSave = getMenuOptions(true);
    expect(noSave[noSave.length - 1]).toBe('settings');
    expect(withSave[withSave.length - 1]).toBe('settings');
  });
});

// ---------------------------------------------------------------------------
// selectMenuOption
// ---------------------------------------------------------------------------

describe('selectMenuOption', () => {
  it('transitions to class-select on new-journey', () => {
    const state = createTitleState(false);
    const next = selectMenuOption({ ...state, phase: 'menu' }, 'new-journey');
    expect(next.phase).toBe('class-select');
    expect(next.selectedClass).toBe(0);
  });

  it('transitions to starting on continue', () => {
    const state = createTitleState(true);
    const next = selectMenuOption({ ...state, phase: 'menu' }, 'continue');
    expect(next.phase).toBe('starting');
  });

  it('stays on menu for settings (no-op)', () => {
    const state = { ...createTitleState(false), phase: 'menu' as const };
    const next = selectMenuOption(state, 'settings');
    expect(next.phase).toBe('menu');
    expect(next).toBe(state); // same reference — no mutation
  });
});

// ---------------------------------------------------------------------------
// selectClass
// ---------------------------------------------------------------------------

describe('selectClass', () => {
  it('updates selectedClass to the given index', () => {
    const state = { ...createTitleState(false), phase: 'class-select' as const };
    const next = selectClass(state, 2);
    expect(next.selectedClass).toBe(2);
  });

  it('clamps to 0 when index is negative', () => {
    const state = { ...createTitleState(false), phase: 'class-select' as const };
    const next = selectClass(state, -1);
    expect(next.selectedClass).toBe(0);
  });

  it('clamps to max index when index exceeds class count', () => {
    const state = { ...createTitleState(false), phase: 'class-select' as const };
    const next = selectClass(state, 99);
    expect(next.selectedClass).toBe(CLASS_DATA.length - 1);
  });

  it('does not mutate the original state', () => {
    const state = { ...createTitleState(false), phase: 'class-select' as const };
    const next = selectClass(state, 1);
    expect(state.selectedClass).toBe(0);
    expect(next.selectedClass).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// confirmClassSelection
// ---------------------------------------------------------------------------

describe('confirmClassSelection', () => {
  it('returns className when in class-select phase', () => {
    const state = {
      ...createTitleState(false),
      phase: 'class-select' as const,
      selectedClass: 1,
    };
    const result = confirmClassSelection(state);
    expect(result).toEqual({ className: 'Mage' });
  });

  it('returns null when not in class-select phase', () => {
    const state = { ...createTitleState(false), phase: 'menu' as const };
    expect(confirmClassSelection(state)).toBeNull();
  });

  it('returns correct class for each index', () => {
    for (let i = 0; i < CLASS_DATA.length; i++) {
      const state = {
        ...createTitleState(false),
        phase: 'class-select' as const,
        selectedClass: i,
      };
      const result = confirmClassSelection(state);
      expect(result).toEqual({ className: CLASS_DATA[i].name });
    }
  });
});

// ---------------------------------------------------------------------------
// CLASS_DATA
// ---------------------------------------------------------------------------

describe('CLASS_DATA', () => {
  it('has exactly 4 entries', () => {
    expect(CLASS_DATA).toHaveLength(4);
  });

  it('each entry has required fields', () => {
    for (const cls of CLASS_DATA) {
      expect(cls.id).toBeTruthy();
      expect(cls.name).toBeTruthy();
      expect(cls.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(cls.accent).toBeTruthy();
      expect(cls.quote).toBeTruthy();
    }
  });

  it('contains knight, mage, rogue, cleric', () => {
    const ids = CLASS_DATA.map((c) => c.id);
    expect(ids).toContain('knight');
    expect(ids).toContain('mage');
    expect(ids).toContain('rogue');
    expect(ids).toContain('cleric');
  });
});

