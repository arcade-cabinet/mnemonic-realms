/** Builds code generation manifest for enemy actor database files. */

import type { CodeGenEntry, CodeGenManifest } from '../schemas/codegen';
import { loadEnemiesStats } from './ddl-loader';
import { slugify, timestamp } from './manifest-io';

const SYSTEM_PROMPT = `You are an RPG-JS 4.3.0 TypeScript code generator.
Generate a single RPG-JS enemy database file using @rpgjs/database decorators.
Output ONLY valid TypeScript code. No markdown fences. No explanatory text.
The file must export the enemy class as the default export.
Import from '@rpgjs/database'.
Include enemy abilities as comments in the class body.

=== RPG-JS 4.3.0 @Enemy API Reference ===
import { Enemy } from '@rpgjs/database';

Use the @Enemy decorator (NOT @Actor) for enemies.

Valid @Enemy decorator params (EnemyOptions extends ActorGlobalOptions):
  id?: string              — Unique ID.
  name?: string            — Display name.
  description?: string     — Flavor text.
  graphic?: string         — Spritesheet reference for the enemy.
  parameters?: object      — Stats as { start, end } pairs (interpolated from initialLevel to finalLevel).
                             Format: { [paramName]: { start: number, end: number } }
                             Valid param names: 'maxhp', 'maxsp', 'str', 'int', 'dex', 'agi'
                             For fixed-level enemies, set start === end.
  startingEquipment?: array — Default equipment (imported class references).
  startingItems?: array    — Starting items: [{ nb: number, item: ImportedItemClass }]
  class?: any              — Assign a class (imported class reference).
  gain?: object            — Rewards for defeating:
                             { exp?: number, gold?: number, items?: [{ nb: number, item: ImportedItemClass, chance?: number }] }
  statesEfficiency?: array — Vulnerability to states.
  elementsEfficiency?: array — Vulnerability to elements.

INVALID properties (do NOT use): hp, sp, atk, def, agi, int (flat numbers — must use parameters with {start,end}).
Also invalid: exp, gold, xp (use gain: { exp, gold } instead), expCurve, initialLevel, finalLevel.

Example:
import { Enemy } from '@rpgjs/database';
@Enemy({
  id: 'E-SL-01',
  name: 'Grass Serpent',
  description: 'A small snake lurking in tall grass.',
  parameters: {
    maxhp: { start: 30, end: 30 },
    str: { start: 6, end: 6 },
    int: { start: 2, end: 2 },
    dex: { start: 4, end: 4 },
    agi: { start: 8, end: 8 },
  },
  gain: {
    exp: 15,
    gold: 8,
  },
})
export default class GrassSerpent {
  // Abilities:
  // - Bite: Physical ATK * 1.2
}
=== End API Reference ===`;

export function buildEnemyCodeManifest(): CodeGenManifest {
  console.log('Building enemy code generation manifest...');
  const ddl = loadEnemiesStats();
  const assets: CodeGenEntry[] = [];

  for (const enemy of ddl) {
    const slug = slugify(enemy.name);
    assets.push({
      id: enemy.id,
      name: enemy.name,
      category: 'database-enemies',
      filename: `${slug}.ts`,
      targetPath: `main/database/enemies/${slug}.ts`,
      prompt: buildEnemyPrompt(enemy),
      docRefs: [
        {
          path: 'docs/design/enemies-catalog.md',
          heading: `${enemy.id}: ${enemy.name}`,
          purpose: 'content',
        },
      ],
      status: 'pending',
    });
  }

  console.log(`  Total enemy code entries: ${assets.length}`);
  return {
    schemaVersion: '1.0.0',
    description: 'Enemy actor code generation manifest',
    updatedAt: timestamp(),
    category: 'database-enemies',
    systemPrompt: SYSTEM_PROMPT,
    assets,
  };
}

function buildEnemyPrompt(enemy: {
  id: string;
  name: string;
  zone: string;
  category: string;
  hp: number;
  atk: number;
  int: number;
  def: number;
  agi: number;
  baseLevel: number;
  xp: number;
  gold: number;
  abilities: { name: string; formula: string; effect: string }[];
  drops: { itemId: string; chance: number }[];
  fragmentAffinity: string;
}): string {
  const abilityLines = enemy.abilities
    .map((a) => `  - ${a.name}: ${a.formula} (${a.effect})`)
    .join('\n');

  const dropLines =
    enemy.drops.length > 0
      ? enemy.drops.map((d) => `  - ${d.itemId}: ${(d.chance * 100).toFixed(0)}% chance`).join('\n')
      : '  - No drops';

  return `Generate an RPG-JS enemy file for "${enemy.name}" (ID: ${enemy.id}).

Stats (use these as { start: N, end: N } in parameters):
- maxhp: { start: ${enemy.hp}, end: ${enemy.hp} }
- str: { start: ${enemy.atk}, end: ${enemy.atk} }  (ATK maps to 'str' in RPG-JS)
- int: { start: ${enemy.int}, end: ${enemy.int} }
- dex: { start: ${enemy.def}, end: ${enemy.def} }   (DEF maps to 'dex' in RPG-JS)
- agi: { start: ${enemy.agi}, end: ${enemy.agi} }

Rewards (use gain object):
- gain: { exp: ${enemy.xp}, gold: ${enemy.gold} }

Context (add as comments):
- Zone: ${enemy.zone}
- Category: ${enemy.category}
- Fragment affinity: ${enemy.fragmentAffinity}

Abilities:
${abilityLines}

Drop table:
${dropLines}

Use the @Enemy decorator from '@rpgjs/database' (NOT @Actor).
Set id, name, description.
Set parameters with { start, end } format for each stat.
Set gain: { exp, gold } for rewards.
Include abilities, drops, and context as structured comments.
Do NOT use: flat number stats, exp/gold/xp as top-level props, @Actor, initialLevel, finalLevel, expCurve.
Export the class as default.`;
}
