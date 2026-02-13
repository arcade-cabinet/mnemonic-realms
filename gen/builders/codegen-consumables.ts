/** Builds code generation manifest for consumable item database files. */

import type { CodeGenEntry, CodeGenManifest } from '../schemas/codegen';
import { loadConsumablesStats } from './ddl-loader';
import { slugify, timestamp } from './manifest-io';

const SYSTEM_PROMPT = `You are an RPG-JS 4.3.0 TypeScript code generator.
Generate a single RPG-JS item database file using @rpgjs/database decorators.
Output ONLY valid TypeScript code. No markdown fences. No explanatory text.
The file must export the item class as the default export.
Import from '@rpgjs/database'.

=== RPG-JS 4.3.0 @Item API Reference ===
import { Item } from '@rpgjs/database';

Valid @Item decorator params (ItemOptions):
  id?: string              — Unique ID. Defaults to lowercased class name.
  name?: string            — Display name.
  description?: string     — Flavor text.
  price?: number           — Shop price. Omit or undefined = cannot buy/sell.
  hpValue?: number         — HP restored on use.
  hitRate?: number         — Success rate (0 to 1). Failed use still consumes the item. Default: 1.
  consumable?: boolean     — Whether the item is consumed on use. Default: true.
  paramsModifier?: object  — Stat modifiers: { [paramName]: { value?: number, rate?: number } }
  elements?: array         — Element affinities.
  addStates?: array        — States to apply: [StateClass] or [{ rate: number, state: StateClass }]
  removeStates?: array     — States to cure: [StateClass] or [{ rate: number, state: StateClass }]

INVALID properties (do NOT use): spValue, mpValue, stackMax, tier, category, type, target.
RPG-JS items do not have a native spValue property — SP restoration must use paramsModifier on 'maxsp'.

Example (HP potion):
@Item({
  id: 'C-HP-01',
  name: 'Minor Salve',
  description: 'Restores a small amount of HP.',
  price: 25,
  hpValue: 50,
  consumable: true,
})
export default class MinorSalve {}

Example (status cure):
import { Item } from '@rpgjs/database';
import Poison from '../states/poison';
@Item({
  id: 'C-SC-01',
  name: 'Antidote',
  description: 'Cures poison.',
  price: 30,
  consumable: true,
  removeStates: [Poison],
})
export default class Antidote {}
=== End API Reference ===`;

export function buildConsumableCodeManifest(): CodeGenManifest {
  console.log('Building consumable code generation manifest...');
  const ddl = loadConsumablesStats();
  const assets: CodeGenEntry[] = [];

  for (const item of ddl) {
    const slug = slugify(item.name);
    assets.push({
      id: item.id,
      name: item.name,
      category: 'database-consumables',
      filename: `${slug}.ts`,
      targetPath: `main/database/items/${slug}.ts`,
      prompt: buildConsumablePrompt(item),
      docRefs: [
        { path: 'docs/design/items-catalog.md', heading: 'Consumables', purpose: 'content' },
      ],
      status: 'pending',
    });
  }

  console.log(`  Total consumable code entries: ${assets.length}`);
  return {
    schemaVersion: '1.0.0',
    description: 'Consumable item code generation manifest',
    updatedAt: timestamp(),
    category: 'database-consumables',
    systemPrompt: SYSTEM_PROMPT,
    assets,
  };
}

function buildConsumablePrompt(item: {
  id: string;
  name: string;
  category: string;
  effect: string;
  price: number;
  stackMax: number;
  tier: number;
}): string {
  return `Generate an RPG-JS consumable item file for "${item.name}" (ID: ${item.id}).

Properties:
- Effect: ${item.effect}
- Price: ${item.price === 0 ? '0 (omit price or set undefined — not purchasable)' : `${item.price}`}
- Category: ${item.category} (add as comment only — not a decorator property)
- Max stack: ${item.stackMax} (add as comment only — not a decorator property)
- Tier: ${item.tier} (add as comment only — not a decorator property)

Use the @Item decorator from '@rpgjs/database'.
Set id, name, description, consumable: true.${item.price > 0 ? ` Set price: ${item.price}.` : ''}
For HP restoration: use hpValue.
For SP restoration: there is no spValue — use paramsModifier: { maxsp: { value: N } } or add as a comment.
For status cures: use removeStates with imported State classes (or leave as TODO comment).
Do NOT use: spValue, mpValue, stackMax, tier, category, type, target — none of these exist.
Export the class as default.`;
}
