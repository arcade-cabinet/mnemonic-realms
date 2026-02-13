/** Builds code generation manifest for class database files. */

import type { CodeGenEntry, CodeGenManifest } from '../schemas/codegen';
import { loadClassStats } from './ddl-loader';
import { timestamp } from './manifest-io';

const SYSTEM_PROMPT = `You are an RPG-JS 4.3.0 TypeScript code generator.
Generate a single RPG-JS class database file using @rpgjs/database decorators.
Output ONLY valid TypeScript code. No markdown fences. No explanatory text.
The file must export the class as the default export.
Import from '@rpgjs/database'.

=== RPG-JS 4.3.0 @Class API Reference ===
import { Class } from '@rpgjs/database';

IMPORTANT: @Class in RPG-JS does NOT have a "parameters" property.
The parameters property belongs to @Actor (and @Enemy), not @Class.
@Class is for skill learning and efficiency modifiers only.

Valid @Class decorator params (ClassOptions):
  id?: string              — Unique ID. Defaults to lowercased class name.
  name?: string            — Display name.
  description?: string     — Class description.
  skillsToLearn?: array    — Skills to learn at specific levels.
                             MUST use imported class references, NOT string IDs.
                             Format: [{ level: number, skill: ImportedSkillClass }]
  statesEfficiency?: array — Vulnerability to states.
  elementsEfficiency?: array — Vulnerability to elements.

INVALID properties on @Class (do NOT use): parameters, startingEquipment, expCurve, initialLevel, finalLevel.
These belong to @Actor, not @Class.

For skillsToLearn, each skill MUST be imported as a class reference:
  import OathStrike from '../skills/knight/oath-strike';
  skillsToLearn: [{ level: 1, skill: OathStrike }]

Do NOT use string IDs like: { level: 1, skill: 'SK-KN-01' } — this will fail at runtime.

Since skill files may not exist yet, use placeholder TODO imports with the expected paths:
  // TODO: import when skill files are generated
  // import OathStrike from '../skills/knight/oath-strike';

And leave skillsToLearn as an empty array with a comment listing the planned skills:
  skillsToLearn: [],
  // Planned skills (import when generated):
  // level 1: OathStrike (SK-KN-01) from '../skills/knight/oath-strike'

Example:
import { Class } from '@rpgjs/database';
// TODO: import skill classes when generated
@Class({
  id: 'knight',
  name: 'Knight',
  description: 'Frontline tank and physical damage dealer.',
  skillsToLearn: [],
  // Planned skills:
  // { level: 1, skill: OathStrike } from '../skills/knight/oath-strike'
  // { level: 3, skill: GuardiansShield } from '../skills/knight/guardian-s-shield'
})
export default class Knight {}
=== End API Reference ===`;

export function buildClassCodeManifest(): CodeGenManifest {
  console.log('Building class code generation manifest...');
  const ddl = loadClassStats();
  const assets: CodeGenEntry[] = [];

  for (const cls of ddl) {
    assets.push({
      id: cls.id,
      name: cls.name,
      category: 'database-classes',
      filename: `${cls.id}.ts`,
      targetPath: `main/database/classes/${cls.id}.ts`,
      prompt: buildClassPrompt(cls),
      docRefs: [
        { path: 'docs/design/progression.md', heading: 'Stat Growth Formulas', purpose: 'content' },
        { path: 'docs/design/classes.md', heading: classDocHeading(cls.name), purpose: 'content' },
      ],
      status: 'pending',
    });
  }

  console.log(`  Total class code entries: ${assets.length}`);
  return {
    schemaVersion: '1.0.0',
    description: 'Class database code generation manifest',
    updatedAt: timestamp(),
    category: 'database-classes',
    systemPrompt: SYSTEM_PROMPT,
    assets,
  };
}

const CLASS_MECHANIC_SUFFIX: Record<string, string> = {
  Knight: 'Oathweave',
  Cleric: 'Euphoric Recall',
  Mage: 'Inspired Casting',
  Rogue: 'Foreshadow Strike',
};

function classDocHeading(className: string): string {
  const suffix = CLASS_MECHANIC_SUFFIX[className];
  return suffix ? `${className} \u2014 ${suffix}` : className;
}

function buildClassPrompt(cls: {
  id: string;
  name: string;
  hp: { base: number; growthRate: number };
  sp: { base: number; growthRate: number };
  atk: { base: number; growthRate: number };
  int: { base: number; growthRate: number };
  def: { base: number; growthRate: number };
  agi: { base: number; growthRate: number };
  description: string;
  skillIds: string[];
}): string {
  const statLine = (name: string, s: { base: number; growthRate: number }) =>
    `- ${name}: base ${s.base}, growth +${s.growthRate}/level`;

  return `Generate an RPG-JS class file for the "${cls.name}" class (ID: ${cls.id}).

Description: ${cls.description}

Stat progression (for reference in comments only — stats go on @Actor, not @Class):
${statLine('HP', cls.hp)}
${statLine('SP', cls.sp)}
${statLine('ATK', cls.atk)}
${statLine('INT', cls.int)}
${statLine('DEF', cls.def)}
${statLine('AGI', cls.agi)}
Level cap: 30

Skill unlock IDs: ${cls.skillIds.join(', ')}

IMPORTANT: @Class does NOT have a "parameters" property. Stat curves belong to @Actor.
Set id, name, description on the @Class decorator.
Set skillsToLearn as an empty array (skill files are generated separately).
Add TODO comments listing each skill with its unlock level and import path.
Do NOT use string IDs for skills — they must be class imports (leave as TODOs).
Do NOT use: parameters, startingEquipment, expCurve, initialLevel, finalLevel — these belong to @Actor.
Include the stat progression as a comment block for documentation purposes.
Export the class as default.`;
}
