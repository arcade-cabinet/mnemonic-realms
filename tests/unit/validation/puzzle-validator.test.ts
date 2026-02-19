import { describe, it, expect } from 'vitest';
import { PuzzleValidator } from '../../../scripts/validation/puzzle-validator.js';

describe('PuzzleValidator', () => {
  it('should parse puzzle documentation', () => {
    const validator = new PuzzleValidator();
    const puzzles = validator.getPuzzles();

    expect(puzzles.length).toBeGreaterThan(0);
  });

  it('should categorize puzzles correctly', () => {
    const validator = new PuzzleValidator();
    const puzzles = validator.getPuzzles();

    const dungeonPuzzles = puzzles.filter((p) => p.category === 'dungeon');
    const stagnationPuzzles = puzzles.filter((p) => p.category === 'stagnation');
    const overworldPuzzles = puzzles.filter((p) => p.category === 'overworld');

    expect(dungeonPuzzles.length).toBe(7);
    expect(stagnationPuzzles.length).toBe(7);
    expect(overworldPuzzles.length).toBe(5);
  });

  it('should validate all puzzles have required fields', () => {
    const validator = new PuzzleValidator();
    const report = validator.validate();

    expect(report.totalChecked).toBe(19);
    expect(report.failed).toBe(0);
  });

  it('should identify dungeon puzzles with events', () => {
    const validator = new PuzzleValidator();
    const puzzles = validator.getPuzzles();

    const dungeonPuzzles = puzzles.filter((p) => p.category === 'dungeon');
    const puzzlesWithEvents = dungeonPuzzles.filter((p) => p.events.length > 0);

    expect(puzzlesWithEvents.length).toBeGreaterThan(0);
  });

  it('should parse puzzle mechanics', () => {
    const validator = new PuzzleValidator();
    const puzzles = validator.getPuzzles();

    for (const puzzle of puzzles) {
      expect(puzzle.mechanic).toBeTruthy();
      expect(puzzle.mechanic).not.toBe('—');
    }
  });

  it('should parse fail penalties for dungeon puzzles', () => {
    const validator = new PuzzleValidator();
    const puzzles = validator.getPuzzles();

    const dungeonPuzzles = puzzles.filter((p) => p.category === 'dungeon');

    for (const puzzle of dungeonPuzzles) {
      expect(puzzle.failPenalty).toBeDefined();
    }
  });

  it('should generate validation report with metadata', () => {
    const validator = new PuzzleValidator();
    const report = validator.validate();

    expect(report.validator).toBe('PuzzleValidator');
    expect(report.timestamp).toBeTruthy();
    expect(report.metadata).toBeDefined();
    expect(report.metadata?.dungeonPuzzles).toBe(7);
    expect(report.metadata?.stagnationPuzzles).toBe(7);
    expect(report.metadata?.overworldPuzzles).toBe(5);
  });

  it('should validate Water Valves puzzle', () => {
    const validator = new PuzzleValidator();
    const puzzles = validator.getPuzzles();

    const waterValves = puzzles.find((p) => p.name === 'Water Valves');

    expect(waterValves).toBeDefined();
    expect(waterValves?.map).toBe('Depths L2 R5');
    expect(waterValves?.events).toContain('EV-D2-009');
    expect(waterValves?.mechanic).toContain('Turn 3 valves in order');
  });

  it('should validate Sound Puzzle', () => {
    const validator = new PuzzleValidator();
    const puzzles = validator.getPuzzles();

    const soundPuzzle = puzzles.find((p) => p.name === 'Sound Puzzle');

    expect(soundPuzzle).toBeDefined();
    expect(soundPuzzle?.map).toBe('Depths L3 R4');
    expect(soundPuzzle?.mechanic).toContain('Strike 5 crystal pillars');
  });

  it('should validate Singing Stones puzzle', () => {
    const validator = new PuzzleValidator();
    const puzzles = validator.getPuzzles();

    const singingStones = puzzles.find((p) => p.name === 'Singing Stones');

    expect(singingStones).toBeDefined();
    expect(singingStones?.map).toContain('Resonance Fields');
    expect(singingStones?.category).toBe('overworld');
  });

  it('should validate Tutorial Break stagnation puzzle', () => {
    const validator = new PuzzleValidator();
    const puzzles = validator.getPuzzles();

    const tutorialBreak = puzzles.find((p) => p.name === 'Tutorial Break');

    expect(tutorialBreak).toBeDefined();
    expect(tutorialBreak?.map).toContain('Heartfield');
    expect(tutorialBreak?.category).toBe('stagnation');
  });

  it('should validate Sequential Broadcasts puzzle', () => {
    const validator = new PuzzleValidator();
    const puzzles = validator.getPuzzles();

    const sequentialBroadcasts = puzzles.find((p) => p.name === 'Sequential Broadcasts');

    expect(sequentialBroadcasts).toBeDefined();
    expect(sequentialBroadcasts?.mechanic).toContain('Earth → Fire → Wind');
  });
});
