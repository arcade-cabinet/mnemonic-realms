/** Builds code generation manifest for skill database files. */

import type { CodeGenEntry, CodeGenManifest } from '../schemas/codegen';
import { loadSkillsStats } from './ddl-loader';
import { slugify, timestamp } from './manifest-io';

const SYSTEM_PROMPT = `You are an RPG-JS 4.3.0 TypeScript code generator.
Generate a single RPG-JS skill database file using @rpgjs/database decorators.
Output ONLY valid TypeScript code. No markdown fences. No explanatory text.
The file must export the skill class as the default export.
Import from '@rpgjs/database'.
Include the damage formula as a comment in the class body.

=== RPG-JS 4.3.0 @Skill API Reference ===
import { Skill } from '@rpgjs/database';

Valid @Skill decorator params (SkillOptions):
  id?: string              — Unique ID. Defaults to lowercased class name.
  name?: string            — Display name.
  description?: string     — Skill description.
  spCost?: number          — SP consumed on use.
  power?: number           — Base power multiplier.
  hitRate?: number         — Chance to hit (0 to 1). Default: 1.
  variance?: number        — Damage variance (e.g. 20 means +/- 20 HP around calculated damage).
  coefficient?: object     — Stat scaling: { [paramName]: multiplier }
                             e.g. { int: 2 } means INT * 2 is added to damage.
                             Default if omitted: { int: 1 }.
                             Valid param names: 'str', 'int', 'dex', 'agi', 'maxhp', 'maxsp'
  elements?: array         — Element affinities for the skill.
  addStates?: array        — States to inflict: [StateClass] or [{ rate: number, state: StateClass }]
  removeStates?: array     — States to cure: [StateClass] or [{ rate: number, state: StateClass }]

INVALID properties (do NOT use): target, type, elementId, unlockLevel, passive, scope,
  SkillTarget, SkillType (these enums do NOT exist in @rpgjs/database).

Example (damage skill):
@Skill({
  id: 'SK-KN-01',
  name: 'Oath Strike',
  description: 'Basic attack scaling with active oaths.',
  spCost: 0,
  power: 120,
  hitRate: 1,
  coefficient: { str: 1 },
})
export default class OathStrike {
  // Formula: floor((ATK * 1.2 * (1 + 0.05 * active_oaths) - targetDEF * 0.8) * variance * elementMod)
}

Example (heal skill):
@Skill({
  id: 'SK-CL-01',
  name: 'Joyful Mending',
  description: 'ST heal scaling with joy charges.',
  spCost: 6,
  power: 120,
  hitRate: 1,
  coefficient: { int: 1 },
})
export default class JoyfulMending {
  // Formula: floor(INT * 1.2 * (1 + joy_charges * 0.03) * variance)
}
=== End API Reference ===`;

export function buildSkillCodeManifest(): CodeGenManifest {
  console.log('Building skill code generation manifest...');
  const ddl = loadSkillsStats();
  const assets: CodeGenEntry[] = [];

  for (const skill of ddl) {
    const slug = slugify(skill.name);
    const subDir = skill.isSubclass ? `${skill.classId}/subclass` : skill.classId;

    assets.push({
      id: skill.id,
      name: skill.name,
      category: 'database-skills',
      filename: `${skill.classId}/${slug}.ts`,
      targetPath: `main/database/skills/${subDir}/${slug}.ts`,
      prompt: buildSkillPrompt(skill),
      docRefs: [
        {
          path: 'docs/design/skills-catalog.md',
          heading: skillDocHeading(skill),
          purpose: 'content',
        },
        { path: 'docs/design/combat.md', heading: 'Damage Formula', purpose: 'constraints' },
      ],
      status: 'pending',
    });
  }

  console.log(`  Total skill code entries: ${assets.length}`);
  return {
    schemaVersion: '1.0.0',
    description: 'Skill database code generation manifest',
    updatedAt: timestamp(),
    category: 'database-skills',
    systemPrompt: SYSTEM_PROMPT,
    assets,
  };
}

function skillDocHeading(skill: { id: string; name: string; isPassive: boolean }): string {
  return skill.isPassive ? `${skill.id}: ${skill.name} (Passive)` : `${skill.id}: ${skill.name}`;
}

function buildSkillPrompt(skill: {
  id: string;
  name: string;
  classId: string;
  level: number;
  spCost: number;
  target: string;
  element: string;
  formula: string;
  description: string;
  isPassive: boolean;
  isSubclass: boolean;
  subclassPath: string;
}): string {
  const lines = [
    `Generate an RPG-JS skill file for "${skill.name}" (ID: ${skill.id}).`,
    '',
    'Properties:',
    `- Class: ${skill.classId}`,
    `- Unlock level: ${skill.level}`,
    `- SP cost: ${skill.spCost}`,
    `- Target type: ${skill.target}`,
    `- Element: ${skill.element}`,
    `- Passive: ${skill.isPassive}`,
    `- Formula: ${skill.formula}`,
    `- Description: ${skill.description}`,
  ];

  if (skill.isSubclass) {
    lines.push(`- Subclass path: ${skill.subclassPath}`);
  }

  lines.push(
    '',
    "Use the @Skill decorator from '@rpgjs/database'.",
    'Set id, name, description, spCost, power, hitRate, and coefficient.',
    'Use coefficient to indicate which stat scales the skill (e.g. { str: 1 } for physical, { int: 1 } for magical).',
    'Do NOT use: target, type, elementId, unlockLevel, passive, scope, SkillTarget, or SkillType — none of these exist.',
    'Include the damage formula as a comment in the class body.',
    "Only import { Skill } from '@rpgjs/database'. No other named imports.",
    'Export the class as default.',
  );

  return lines.join('\n');
}
