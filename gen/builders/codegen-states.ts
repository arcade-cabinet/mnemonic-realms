/** Builds code generation manifest for status effect (state) database files. */

import type { CodeGenEntry, CodeGenManifest } from '../schemas/codegen';
import { loadStatusEffects } from './ddl-loader';
import { slugify, timestamp } from './manifest-io';

const SYSTEM_PROMPT = `You are an RPG-JS 4.3.0 TypeScript code generator.
Generate a single RPG-JS state database file using @rpgjs/database decorators.
Output ONLY valid TypeScript code. No markdown fences. No explanatory text.
The file must export the state class as the default export.
Import from '@rpgjs/database'.

=== RPG-JS 4.3.0 @State API Reference ===
import { State, Effect } from '@rpgjs/database';

Valid @State decorator params (StateOptions):
  id?: string              — Unique ID. Defaults to lowercased class name.
  name?: string            — Display name.
  description?: string     — Flavor text.
  paramsModifier?: object  — Runtime stat changes while state is active:
                             { [paramName]: { value?: number, rate?: number } }
                             Valid param names: 'maxhp', 'maxsp', 'str', 'int', 'dex', 'agi'
                             value = flat add/subtract, rate = percentage multiplier (0.2 = +20%, -0.3 = -30%)
  effects?: Effect[]       — Built-in engine effects from the Effect enum:
                             Effect.CAN_NOT_SKILL    — Cannot use skills
                             Effect.CAN_NOT_ITEM     — Cannot use items
                             Effect.GUARD             — Reduced damage (damageGuard formula)
                             Effect.SUPER_GUARD       — Damage / 4
                             Effect.HALF_SP_COST      — SP costs halved
                             Effect.SLIP_DAMAGE       — Lose 10% HP each turn (poison-like)
                             Effect.CAN_NOT_EVADE     — Cannot dodge
                             Effect.DUAL_ATTACK       — Attack twice
                             Effect.FAST_ATTACK       — Always acts first
                             Effect.CRITICAL_BONUS    — Increased crit chance
                             Effect.AUTO_HP_RECOVER   — Regen HP each turn
                             Effect.DOUBLE_EXP_GAIN   — Double XP
  statesEfficiency?: array — Vulnerability to other states.
  elementsEfficiency?: array — Vulnerability to elements.

INVALID properties (do NOT use): duration, stackable, turns, maxStack, removeOnDeath, onTick, onApply.
State duration is managed by game logic calling player.removeState(), not by the decorator.

Example (stat debuff):
import { State } from '@rpgjs/database';
@State({
  id: 'ST-SLOW',
  name: 'Slow',
  description: 'Agility is halved.',
  paramsModifier: { agi: { rate: -0.5 } },
})
export default class Slow {}

Example (poison with Effect):
import { State, Effect } from '@rpgjs/database';
@State({
  id: 'ST-POISON',
  name: 'Poison',
  description: 'Lose HP each turn.',
  effects: [Effect.SLIP_DAMAGE],
})
export default class Poison {}

Example (stun):
import { State, Effect } from '@rpgjs/database';
@State({
  id: 'ST-STUN',
  name: 'Stun',
  description: 'Cannot act.',
  effects: [Effect.CAN_NOT_SKILL, Effect.CAN_NOT_ITEM],
})
export default class Stun {}

Example (buff):
import { State } from '@rpgjs/database';
@State({
  id: 'ST-INSPIRED',
  name: 'Inspired',
  description: 'All stats increased by 20%.',
  paramsModifier: {
    str: { rate: 0.2 },
    int: { rate: 0.2 },
    dex: { rate: 0.2 },
    agi: { rate: 0.2 },
    maxhp: { rate: 0.2 },
    maxsp: { rate: 0.2 },
  },
})
export default class Inspired {}
=== End API Reference ===`;

export function buildStateCodeManifest(): CodeGenManifest {
  console.log('Building state code generation manifest...');
  const ddl = loadStatusEffects();
  const assets: CodeGenEntry[] = [];

  for (const status of ddl) {
    const slug = slugify(status.name);
    assets.push({
      id: status.id,
      name: status.name,
      category: 'database-states',
      filename: `${slug}.ts`,
      targetPath: `main/database/states/${slug}.ts`,
      prompt: buildStatePrompt(status),
      docRefs: [
        {
          path: 'docs/design/skills-catalog.md',
          heading: 'Status Effects Applied by Skills',
          purpose: 'content',
        },
      ],
      status: 'pending',
    });
  }

  console.log(`  Total state code entries: ${assets.length}`);
  return {
    schemaVersion: '1.0.0',
    description: 'Status effect (state) code generation manifest',
    updatedAt: timestamp(),
    category: 'database-states',
    systemPrompt: SYSTEM_PROMPT,
    assets,
  };
}

function buildStatePrompt(status: {
  id: string;
  name: string;
  effect: string;
  duration: number;
  stackable: boolean;
}): string {
  return `Generate an RPG-JS state file for "${status.name}" (ID: ${status.id}).

Properties:
- Effect: ${status.effect}
- Duration: ${status.duration} turns (add as comment — duration is managed by game logic, not the decorator)
- Stackable: ${status.stackable} (add as comment — not a decorator property)

Use the @State decorator from '@rpgjs/database'.
Set id, name, description.
Implement the effect using paramsModifier (for stat changes) and/or effects: [Effect.X] (for engine effects).
- For stat buffs/debuffs: use paramsModifier with rate (percentage) or value (flat).
  e.g. DEF +40% = paramsModifier: { dex: { rate: 0.4 } } (note: DEF maps to 'dex' in RPG-JS params)
  e.g. AGI halved = paramsModifier: { agi: { rate: -0.5 } }
  e.g. +20% all stats = paramsModifier with rate: 0.2 on str, int, dex, agi, maxhp, maxsp
- For poison (HP loss per turn): use effects: [Effect.SLIP_DAMAGE]
- For stun (cannot act): use effects: [Effect.CAN_NOT_SKILL, Effect.CAN_NOT_ITEM]
- For cannot-evade: use effects: [Effect.CAN_NOT_EVADE]
Do NOT use: duration, stackable, turns, maxStack, onTick, onApply — none of these are decorator params.
Import Effect from '@rpgjs/database' if you use effects.
Export the class as default.`;
}
