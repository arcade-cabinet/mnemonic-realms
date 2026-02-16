/** Builds code generation manifest for armor database files. */

import type { CodeGenEntry, CodeGenManifest } from '../schemas/codegen';
import { loadArmorStats } from './ddl-loader';
import { slugify, timestamp } from './manifest-io';

const SYSTEM_PROMPT = `You are an RPG-JS 4.3.0 TypeScript code generator.
Generate a single RPG-JS armor database file using @rpgjs/database decorators.
Output ONLY valid TypeScript code. No markdown fences. No explanatory text.
The file must export the armor class as the default export.
Import from '@rpgjs/database'.

=== RPG-JS 4.3.0 @Armor API Reference ===
import { Armor } from '@rpgjs/database';

Valid @Armor decorator params (ArmorOptions extends EquipmentOptions):
  id?: string              — Unique ID. Defaults to lowercased class name.
  name?: string            — Display name.
  description?: string     — Flavor text.
  price?: number           — Shop price. Omit or undefined = cannot buy/sell.
  pdef?: number            — Physical defense bonus. THIS IS THE CORRECT NAME (not pdefense).
  sdef?: number            — Special/magic defense bonus.
  paramsModifier?: object  — Stat modifiers: { [paramName]: { value?: number, rate?: number } }
                             Valid param names: 'maxhp', 'maxsp', 'str', 'int', 'dex', 'agi'
  elements?: array         — Element affinities.
  addStates?: array        — States to inflict on equip.
  removeStates?: array     — States to cure on equip.
  statesDefense?: array    — Resistance to states when equipped.
  elementsDefense?: array  — Resistance to elements when equipped.

INVALID properties (do NOT use): pdefense, mdefense, defense, def, tier, equipable, class, type, slot, armor.

Example:
@Armor({
  id: 'leather-armor',
  name: 'Leather Armor',
  description: 'Basic leather protection.',
  price: 100,
  pdef: 8,
})
export default class LeatherArmor {}

Example with stat modifier:
@Armor({
  id: 'hermit-robe',
  name: "Hermit's Robe",
  description: 'A robe that boosts magical power.',
  price: 300,
  pdef: 5,
  sdef: 10,
  paramsModifier: { maxhp: { value: 50 } },
})
export default class HermitRobe {}
=== End API Reference ===`;

export function buildArmorCodeManifest(): CodeGenManifest {
  console.log('Building armor code generation manifest...');
  const ddl = loadArmorStats();
  const assets: CodeGenEntry[] = [];

  for (const armor of ddl) {
    const slug = slugify(armor.name);
    assets.push({
      id: armor.id,
      name: armor.name,
      category: 'database-armor',
      filename: `${slug}.ts`,
      targetPath: `main/database/armor/${slug}.ts`,
      prompt: buildArmorPrompt(armor),
      docRefs: [{ path: 'docs/design/items-catalog.md', heading: 'Armor', purpose: 'content' }],
      status: 'pending',
    });
  }

  console.log(`  Total armor code entries: ${assets.length}`);
  return {
    schemaVersion: '1.0.0',
    description: 'Armor database code generation manifest',
    updatedAt: timestamp(),
    category: 'database-armor',
    systemPrompt: SYSTEM_PROMPT,
    assets,
  };
}

function buildArmorPrompt(armor: {
  id: string;
  name: string;
  def: number;
  price: number;
  tier: number;
  specialEffect: string;
}): string {
  return `Generate an RPG-JS armor file for "${armor.name}" (ID: ${armor.id}).

Stats:
- pdef: ${armor.def} (physical defense — use the property name "pdef", NOT "pdefense" or "def")
- Price: ${armor.price === 0 ? '0 (omit price or set undefined — not purchasable)' : `${armor.price}`}
- Tier: ${armor.tier} (add as comment only — no tier property exists in @Armor)
- Special effect: ${armor.specialEffect}

Set id, name, description, pdef: ${armor.def}.${armor.price > 0 ? ` Set price: ${armor.price}.` : ''}
Add the special effect as a comment above the class if it is not "None".
Do NOT use any of these invalid properties: pdefense, mdefense, defense, def, tier, equipable, class, type.
Export the class as default.`;
}
