/** Builds code generation manifest for scene event files. */

import type { CodeGenEntry, CodeGenManifest } from '../schemas/codegen';
import type { SceneEventDdl } from '../schemas/codegen-ddl';
import { loadSceneEvents } from './ddl-loader';
import { slugify, timestamp } from './manifest-io';

const SYSTEM_PROMPT = `You are an RPG-JS 4.3.0 TypeScript code generator.
Generate a single RPG-JS server-side event file for a scene.
Output ONLY valid TypeScript code. No markdown fences. No explanatory text.
Output must be syntactically complete — all braces must be balanced.
Keep the file CONCISE — under 300 lines. Do NOT generate excessive imports.
Valid RPG-JS imports: { RpgEvent, RpgPlayer, RpgMap, RpgServer, RpgWorld, RpgSceneMap } from '@rpgjs/server'.
Do NOT invent types that don't exist. Only import what you actually use.
Use createDynamicEvent() for NPC placement. Use player.showText() for dialogue.
Use player.gui() for GUI overlays. Export the event setup function as default.`;

export function buildSceneCodeManifest(): CodeGenManifest {
  console.log('Building scene event code generation manifest...');
  const ddl = loadSceneEvents();
  const assets: CodeGenEntry[] = [];

  for (const scene of ddl) {
    const slug = slugify(scene.name);
    const prompt = buildScenePrompt(scene);
    assets.push({
      id: scene.id,
      name: scene.name,
      category: 'event-scenes',
      filename: `${slug}.ts`,
      targetPath: scene.targetPath,
      prompt,
      docRefs: [
        { path: `docs/story/${scene.act}-script.md`, heading: scene.name, purpose: 'content' },
        { path: 'docs/maps/event-placement.md', heading: 'Event Placement', purpose: 'content' },
      ],
      status: 'pending',
    });
  }

  console.log(`  Total scene event entries: ${assets.length}`);
  return {
    schemaVersion: '1.0.0',
    description: 'Scene event code generation manifest',
    updatedAt: timestamp(),
    category: 'event-scenes',
    systemPrompt: SYSTEM_PROMPT,
    assets,
  };
}

function buildScenePrompt(scene: SceneEventDdl): string {
  const npcList = scene.npcs
    .map((n) => `${n.name} (${n.graphic}, dialogue: ${n.dialogueKey})`)
    .join(', ');
  const effectList = scene.effects
    .map((e) => `${e.type}: ${JSON.stringify(e.params)}`)
    .join('\n- ');
  const questList = scene.questChanges
    .map(
      (q) =>
        `${q.questId} → ${q.action}${q.objectiveIndex !== undefined ? ` (obj ${q.objectiveIndex})` : ''}`,
    )
    .join(', ');

  return `Generate an RPG-JS scene event file for "${scene.name}" (ID: ${scene.id}).

Scene: Act ${scene.act.replace('act', '')}, Scene ${scene.sceneNumber}
Location: ${scene.location}
Level Range: ${scene.levelRange}
Summary: ${scene.summary}

Trigger: ${scene.trigger.type}${scene.trigger.map ? `, map: ${scene.trigger.map}` : ''}${scene.trigger.position ? `, pos: ${scene.trigger.position}` : ''}${scene.trigger.condition ? `, condition: ${scene.trigger.condition}` : ''}

NPCs: ${npcList || 'None'}

Effects:
- ${effectList || 'None'}

Quest Changes: ${questList || 'None'}

Create the event handler that:
1. Checks trigger conditions
2. Spawns NPCs at appropriate positions using createDynamicEvent()
3. Plays dialogue sequences via player.showText()
4. Fires effects (combat, GUI, screen effects, music)
5. Updates quest state
Export the setup function as default.`;
}
