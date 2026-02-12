import seedrandom from 'seedrandom';

/**
 * Seeded Random Number Generator
 * Provides deterministic random generation based on a seed string
 */
export class SeededRandom {
  private rng: seedrandom.PRNG;
  public readonly seed: string;

  constructor(seed: string) {
    this.seed = seed;
    this.rng = seedrandom(seed);
  }

  /**
   * Generate a random number between 0 (inclusive) and 1 (exclusive)
   */
  random(): number {
    return this.rng();
  }

  /**
   * Generate a random integer between min (inclusive) and max (inclusive)
   */
  randomInt(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  /**
   * Pick a random element from an array
   */
  pick<T>(array: T[]): T {
    return array[this.randomInt(0, array.length - 1)];
  }

  /**
   * Shuffle an array deterministically
   */
  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = this.randomInt(0, i);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Generate a random boolean with optional probability
   */
  boolean(probability = 0.5): boolean {
    return this.random() < probability;
  }
}

/**
 * Parse "adjective adjective noun" seed format
 */
export function parseSeed(seed: string): { adjectives: string[]; noun: string } {
  const parts = seed.trim().split(/\s+/);
  if (parts.length < 2) {
    throw new Error('Seed must contain at least two words');
  }
  const noun = parts[parts.length - 1];
  const adjectives = parts.slice(0, -1);
  return { adjectives, noun };
}
