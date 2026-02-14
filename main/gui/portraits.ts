/**
 * Portrait path resolver for dialogue system.
 *
 * Named NPCs: {characterId}-{expression}.webp
 * Gods: god-{godName}.webp (single expression only)
 *
 * All portraits are 256x256 webp in main/client/gui/portraits/.
 */

const NAMED_CHARACTERS = ['protagonist', 'lira', 'callum', 'petra', 'elder-torin'] as const;

const GODS = ['resonance', 'verdance', 'luminos', 'kinesis'] as const;

type Expression = 'neutral' | 'happy' | 'sad' | 'determined';

// Eagerly import all portrait images so Vite resolves them at build time.
// Using import.meta.glob with eager: true returns resolved URLs.
const allPortraits: Record<string, { default: string }> = import.meta.glob(
  '../client/gui/portraits/*.webp',
  { eager: true },
);

/** Build a lookup from "filename-without-ext" to resolved URL. */
const portraitMap: Record<string, string> = {};
for (const [path, mod] of Object.entries(allPortraits)) {
  const filename = path.split('/').pop()?.replace('.webp', '') ?? '';
  portraitMap[filename] = mod.default;
}

/**
 * Resolve a portrait URL for a character + expression.
 * Returns undefined if no portrait exists for the given combination.
 */
export function getPortraitUrl(
  characterId: string,
  expression: Expression = 'neutral',
): string | undefined {
  // Gods have a single portrait (no expression variants)
  if (characterId.startsWith('god-')) {
    return portraitMap[characterId];
  }

  // Named characters: try exact expression, fall back to neutral
  const key = `${characterId}-${expression}`;
  return portraitMap[key] ?? portraitMap[`${characterId}-neutral`];
}

export type { Expression };
export { NAMED_CHARACTERS, GODS };
