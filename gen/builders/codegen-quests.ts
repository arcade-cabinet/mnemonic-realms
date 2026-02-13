/** Builds code generation manifest for quest chain files. */

import type { CodeGenEntry, CodeGenManifest } from '../schemas/codegen';
import type { QuestDdl } from '../schemas/codegen-ddl';
import { loadQuests } from './ddl-loader';
import { slugify, timestamp } from './manifest-io';

const SYSTEM_PROMPT = `You are an RPG-JS 4.3.0 TypeScript code generator.
Generate a single RPG-JS server-side quest file.
Output ONLY valid TypeScript code. No markdown fences. No explanatory text.
The file must define a quest with objectives, rewards, completion checks, and dialogue.
Use RpgPlayer hooks for quest state tracking.
Use player.getVariable() and player.setVariable() for quest progress.
Export the quest definition as default.`;

export function buildQuestCodeManifest(): CodeGenManifest {
  console.log('Building quest code generation manifest...');
  const ddl = loadQuests();
  const assets: CodeGenEntry[] = [];

  for (const quest of ddl) {
    const slug = slugify(quest.name);
    const prompt = buildQuestPrompt(quest);
    assets.push({
      id: quest.id,
      name: quest.name,
      category: 'event-quests',
      filename: `${slug}.ts`,
      targetPath: quest.targetPath,
      prompt,
      docRefs: [
        { path: 'docs/story/quest-chains.md', heading: quest.name, purpose: 'content' },
        { path: 'docs/design/items-catalog.md', heading: 'Items', purpose: 'reference' },
      ],
      status: 'pending',
    });
  }

  console.log(`  Total quest entries: ${assets.length}`);
  return {
    schemaVersion: '1.0.0',
    description: 'Quest chain code generation manifest',
    updatedAt: timestamp(),
    category: 'event-quests',
    systemPrompt: SYSTEM_PROMPT,
    assets,
  };
}

function buildQuestPrompt(quest: QuestDdl): string {
  const objectives = quest.objectives.map((o) => `${o.index}. ${o.description}`).join('\n');
  const rewards = quest.rewards
    .map(
      (r) => `${r.type}: ${r.name}${r.amount ? ` (${r.amount})` : ''}${r.id ? ` [${r.id}]` : ''}`,
    )
    .join(', ');
  const deps = quest.dependencies.length ? quest.dependencies.join(', ') : 'None';
  const unlocks = quest.unlocks.length ? quest.unlocks.join(', ') : 'None';

  return `Generate an RPG-JS quest file for "${quest.name}" (ID: ${quest.id}).

Category: ${quest.category} | Act: ${quest.act} | Level: ${quest.levelRange}
Giver: ${quest.giver} at ${quest.giverLocation}
Trigger: ${quest.triggerCondition}

Objectives:
${objectives}

Rewards: ${rewards}

Completion Dialogue: ${quest.completionDialogue}
Failure Conditions: ${quest.failureConditions}
Dependencies: ${deps}
Unlocks: ${unlocks}

Create a quest definition that:
1. Checks trigger conditions (dependencies, level, location)
2. Tracks objective progress via player variables
3. Awards rewards on completion
4. Shows completion dialogue
5. Updates quest log and unlocks dependent quests
Export the quest definition as default.`;
}
