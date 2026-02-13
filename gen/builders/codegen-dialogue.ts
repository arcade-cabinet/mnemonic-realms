/** Builds code generation manifest for NPC dialogue files. */

import type { CodeGenEntry, CodeGenManifest } from '../schemas/codegen';
import type { DialogueEntryDdl } from '../schemas/codegen-ddl';
import { loadDialogueEntries } from './ddl-loader';
import { slugify, timestamp } from './manifest-io';

const SYSTEM_PROMPT = `You are an RPG-JS 4.3.0 TypeScript code generator.
Generate a single RPG-JS server-side dialogue file.
Output ONLY valid TypeScript code. No markdown fences. No explanatory text.
The file must use player.showText() for NPC speech lines.
Use player.showChoices() for branching dialogue.
Wire trigger conditions and quest state checks.
Lines marked [SYSTEM] use player.gui('rpg-notification') or system overlay.
Lines marked [NARRATION] use showText with no speaker portrait.
Export the dialogue function as default.`;

export function buildDialogueCodeManifest(): CodeGenManifest {
  console.log('Building dialogue code generation manifest...');
  const ddl = loadDialogueEntries();
  const assets: CodeGenEntry[] = [];

  for (const entry of ddl) {
    const slug = slugify(`${entry.npcId}-${entry.id.replace('dlg-', '')}`);
    const prompt = buildDialoguePrompt(entry);
    assets.push({
      id: entry.id,
      name: `${entry.npcName}: ${entry.trigger}`,
      category: 'event-dialogue',
      filename: `${slug}.ts`,
      targetPath: entry.targetPath,
      prompt,
      docRefs: [
        { path: 'docs/story/dialogue-bank.md', heading: entry.npcName, purpose: 'content' },
        { path: 'docs/story/characters.md', heading: entry.npcName, purpose: 'reference' },
      ],
      status: 'pending',
    });
  }

  console.log(`  Total dialogue entries: ${assets.length}`);
  return {
    schemaVersion: '1.0.0',
    description: 'NPC dialogue code generation manifest',
    updatedAt: timestamp(),
    category: 'event-dialogue',
    systemPrompt: SYSTEM_PROMPT,
    assets,
  };
}

function buildDialoguePrompt(entry: DialogueEntryDdl): string {
  const lineList = entry.lines
    .map((l) => {
      const emotion = l.emotion ? ` [${l.emotion}]` : '';
      return `- ${l.speaker}: "${l.text}"${emotion}`;
    })
    .join('\n');

  const refs = [
    entry.linkedScene ? `Scene: ${entry.linkedScene}` : null,
    entry.linkedQuest ? `Quest: ${entry.linkedQuest}` : null,
    entry.condition ? `Condition: ${entry.condition}` : null,
  ]
    .filter(Boolean)
    .join(' | ');

  return `Generate an RPG-JS dialogue file for "${entry.npcName}" (ID: ${entry.id}).

Trigger: ${entry.trigger}
Location: ${entry.location}
${refs ? `References: ${refs}` : ''}

Lines:
${lineList}

Create a dialogue function that:
1. Checks any trigger conditions (quest state, location, flags)
2. Plays each line in sequence via player.showText()
3. Uses the NPC's graphic as speaker portrait
4. For [SYSTEM] speakers, use system overlay instead of showText
5. For [NARRATION], use showText with no portrait
Export the dialogue function as default.`;
}
