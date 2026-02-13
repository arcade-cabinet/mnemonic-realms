/** Builds code generation manifest for weapon database files. */

import type { CodeGenEntry, CodeGenManifest } from '../schemas/codegen';
import { loadWeaponsStats } from './ddl-loader';
import { slugify, timestamp } from './manifest-io';

const SYSTEM_PROMPT = `You are an RPG-JS 4.3.0 TypeScript code generator.
Generate a single RPG-JS weapon database file using @rpgjs/database decorators.
Output ONLY valid TypeScript code. No markdown fences. No explanatory text.
The file must export the weapon class as the default export.
Import from '@rpgjs/database'.

=== RPG-JS 4.3.0 @Weapon API Reference ===
import { Weapon } from '@rpgjs/database';

Valid @Weapon decorator params (WeaponOptions):
  id?: string              — Unique ID. Defaults to lowercased class name.
  name?: string            — Display name.
  description?: string     — Flavor text.
  price?: number           — Shop price. Omit or undefined = cannot buy/sell.
  atk?: number             — Attack bonus (weapon-specific stat).
  pdef?: number            — Physical defense bonus.
  sdef?: number            — Special/magic defense bonus.
  paramsModifier?: object  — Stat modifiers: { [paramName]: { value?: number, rate?: number } }
                             Valid param names: 'maxhp', 'maxsp', 'str', 'int', 'dex', 'agi'
  elements?: array         — Element affinities: [ElementClass] or [{ rate: number, element: ElementClass }]
  addStates?: array        — States to inflict: [StateClass] or [{ rate: number, state: StateClass }]
  removeStates?: array     — States to cure: [StateClass] or [{ rate: number, state: StateClass }]
  statesDefense?: array    — Resistance to states when equipped.
  elementsDefense?: array  — Resistance to elements when equipped.

INVALID properties (do NOT use): equipable, class, type, tier, weaponType, damage, hitRate, critical.
For INT-based weapons (staves, wands): use paramsModifier: { int: { value: N } } instead of a nonexistent 'int' property.

Example:
@Weapon({
  id: 'training-sword',
  name: 'Training Sword',
  description: 'A simple blade for beginners.',
  price: 50,
  atk: 5,
})
export default class TrainingSword {}

Example with INT bonus (staff):
import { Weapon } from '@rpgjs/database';
@Weapon({
  id: 'W-ST-01',
  name: 'Wooden Staff',
  description: 'A basic wooden staff.',
  price: 0,
  atk: 1,
  paramsModifier: { int: { value: 4 } },
})
export default class WoodenStaff {}
=== End API Reference ===`;

export function buildWeaponCodeManifest(): CodeGenManifest {
  console.log('Building weapon code generation manifest...');
  const ddl = loadWeaponsStats();
  const assets: CodeGenEntry[] = [];

  for (const wpn of ddl) {
    const slug = slugify(wpn.name);
    const prompt = buildWeaponPrompt(wpn);
    assets.push({
      id: wpn.id,
      name: wpn.name,
      category: 'database-weapons',
      filename: `${slug}.ts`,
      targetPath: `main/database/weapons/${slug}.ts`,
      prompt,
      docRefs: [{ path: 'docs/design/items-catalog.md', heading: 'Weapons', purpose: 'content' }],
      status: 'pending',
    });
  }

  console.log(`  Total weapon code entries: ${assets.length}`);
  return {
    schemaVersion: '1.0.0',
    description: 'Weapon database code generation manifest',
    updatedAt: timestamp(),
    category: 'database-weapons',
    systemPrompt: SYSTEM_PROMPT,
    assets,
  };
}

function buildWeaponPrompt(wpn: {
  id: string;
  name: string;
  classRestriction: string;
  weaponType: string;
  statType: string;
  statBonus: number;
  price: number;
  tier: number;
  specialEffect: string;
}): string {
  const isInt = wpn.statType !== 'atk';
  const statProp = isInt ? 'int' : 'atk';
  const statInstruction = isInt
    ? `Use paramsModifier: { int: { value: ${wpn.statBonus} } } for the INT bonus.\nSet atk to 1 (minimum for a weapon).`
    : `Set atk: ${wpn.statBonus}.`;
  return `Generate an RPG-JS weapon file for "${wpn.name}" (ID: ${wpn.id}).

Stats:
- Primary stat: ${statProp} +${wpn.statBonus}
- Price: ${wpn.price === 0 ? '0 (omit price or set undefined — not purchasable)' : `${wpn.price}`}
- Intended for: ${wpn.classRestriction} (add as comment only — no equipable/class property exists)
- Weapon category: ${wpn.weaponType} (add as comment only — no type property exists)
- Tier: ${wpn.tier} (add as comment only — no tier property exists)
- Special effect: ${wpn.specialEffect}

${statInstruction}
Set id, name, description.${wpn.price > 0 ? ` Set price: ${wpn.price}.` : ''}
Add the special effect as a comment above the class if it is not "None".
Do NOT use any of these invalid properties: equipable, class, type, tier, weaponType.
Export the class as default.`;
}
