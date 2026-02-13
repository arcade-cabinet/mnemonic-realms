/** Builds code generation manifest for map TMX files, @MapData classes, and event spawners. */

import type { CodeGenEntry, CodeGenManifest } from '../schemas/codegen';
import type { MapDdl } from '../schemas/ddl-maps';
import { loadMaps } from './ddl-loader';
import { slugify, timestamp } from './manifest-io';

const SYSTEM_PROMPT_TMX = `You are a Tiled TMX map generator for RPG-JS 4.3.0.
Generate a valid TMX XML file with the exact dimensions and layers specified.
Output ONLY valid XML. No markdown fences. No explanatory text.
Use 6 layers: ground, ground2, objects, objects_upper, collision, events.
Tile GIDs reference the tileset in firstgid order.
Object layer entries use Tiled object format for NPC spawns and event triggers.
Mark collision tiles on the collision layer for walls, water, and obstacles.
Place event triggers on the events layer as point objects with type and properties.`;

/** System prompt injected into each @MapData entry's prompt text. */
const MAPDATA_CONTEXT = `[SYSTEM: You are an RPG-JS 4.3.0 TypeScript code generator.
Generate a single RPG-JS map module file using @MapData decorator.
Output ONLY valid TypeScript code. No markdown fences. No explanatory text.
Import from '@rpgjs/server'. Use the exact map ID and file path provided.
Include onInit, onJoin hooks for event spawning.
Use createDynamicEvent for NPCs and enemies per the spawn data.]`;

/** System prompt injected into each event spawner entry's prompt text. */
const EVENTS_CONTEXT = `[SYSTEM: You are an RPG-JS 4.3.0 TypeScript code generator.
Generate map event spawner functions for createDynamicEvent calls.
Output ONLY valid TypeScript code. No markdown fences.
Each event gets a createDynamicEvent call with proper position, graphics, and hooks.
NPC events use onAction for dialogue. Transition events use onPlayerInput.
Enemy zone events use onChanges with random encounter checks.]`;

export function buildMapCodeManifest(): CodeGenManifest {
  console.log('Building map code generation manifest...');
  const maps = loadMaps();
  const assets: CodeGenEntry[] = [];

  for (const map of maps) {
    const slug = slugify(map.name);

    // TMX file entry
    assets.push({
      id: `tmx-${map.id}`,
      name: `${map.name} TMX`,
      category: 'database-maps',
      filename: map.filename,
      targetPath: `main/server/maps/tmx/${map.filename}`,
      prompt: buildTmxPrompt(map),
      docRefs: getMapDocRefs(map),
      status: 'pending',
    });

    // @MapData TypeScript class
    assets.push({
      id: `mapdata-${map.id}`,
      name: `${map.name} MapData`,
      category: 'database-maps',
      filename: `${slug}.ts`,
      targetPath: `main/server/maps/${slug}.ts`,
      prompt: buildMapDataPrompt(map),
      docRefs: getMapDocRefs(map),
      status: 'pending',
    });

    // Event spawner (only for maps with events/NPCs)
    if (map.npcSpawns.length > 0 || map.eventTriggers.length > 0) {
      assets.push({
        id: `events-${map.id}`,
        name: `${map.name} Events`,
        category: 'database-maps',
        filename: `${slug}-events.ts`,
        targetPath: `main/server/maps/events/${slug}-events.ts`,
        prompt: buildEventsPrompt(map),
        docRefs: getMapDocRefs(map),
        status: 'pending',
      });
    }
  }

  console.log(`  Total map code entries: ${assets.length}`);
  return {
    schemaVersion: '1.0.0',
    description: 'Map TMX, MapData, and event spawner code generation manifest',
    updatedAt: timestamp(),
    category: 'database-maps',
    systemPrompt: SYSTEM_PROMPT_TMX,
    assets,
  };
}

function getMapDocRefs(map: MapDdl) {
  const docPath =
    map.category === 'overworld' ? 'docs/maps/overworld-layout.md' : 'docs/maps/dungeon-depths.md';
  return [
    { path: docPath, heading: map.name, purpose: 'content' as const },
    {
      path: 'docs/design/tileset-spec.md',
      heading: `Biome: ${map.biome}`,
      purpose: 'style' as const,
    },
  ];
}

function buildTmxPrompt(map: MapDdl): string {
  const tilesets = map.tilesetRefs
    .map((ref, i) => `  - ${ref} (firstgid: ${i * 256 + 1})`)
    .join('\n');

  const connections = map.connections
    .map(
      (c) => `  - ${c.direction}: tile ${c.fromTile} -> ${c.toMap} at ${c.toTile} (${c.condition})`,
    )
    .join('\n');

  return `Generate a Tiled TMX map for "${map.name}" (${map.filename}).

Dimensions: ${map.width}x${map.height} tiles, ${map.tileSize}px per tile.
Biome: ${map.biome} | Vibrancy: ${map.startVibrancy} | Category: ${map.category}

Tilesets:
${tilesets}

Layers (6 total): ground, ground2, objects, objects_upper, collision, events.

Connections:
${connections}

NPC spawn positions: ${map.npcSpawns.map((n) => `${n.name} at (${n.position})`).join(', ') || 'none'}

Enemy zones: ${map.enemyZones.map((z) => `${z.zone}: ${z.bounds}`).join('; ') || 'none'}

Resonance Stones: ${map.resonanceStones.map((r) => `${r.id} at (${r.position})`).join(', ') || 'none'}

Chests: ${map.treasureChests.map((c) => `${c.id} at (${c.position})`).join(', ') || 'none'}

Fill ground layer with appropriate biome base tiles.
Place collision on map edges, building walls, water boundaries, and obstacle tiles.
Place objects (trees, rocks, buildings, furniture) per the map layout doc.
Mark event trigger positions on events layer as Tiled point objects.`;
}

function buildMapDataPrompt(map: MapDdl): string {
  const transitionLines = map.connections
    .filter((c) => c.direction !== 'up' || !c.condition.includes('Memory lift'))
    .map(
      (c) =>
        `  - From (${c.fromTile}) ${c.direction} to "${c.toMap}" at (${c.toTile}), condition: ${c.condition}`,
    )
    .join('\n');

  return `${MAPDATA_CONTEXT}

Generate an RPG-JS @MapData class for "${map.name}".

Map ID: "${map.id}"
TMX file: "./tmx/${map.filename}"
Dimensions: ${map.width}x${map.height}
Biome: ${map.biome}

Transitions:
${transitionLines || '  - None'}

NPC count: ${map.npcSpawns.length}
Enemy zones: ${map.enemyZones.length}
Event triggers: ${map.eventTriggers.length}

Use @MapData decorator with id and file properties.
Import event spawner from './events/${slugify(map.name)}-events' if NPCs/events exist.
Call spawnMapEvents(player) in onJoin hook.
Set up map transitions in onInit using player.changeMap().`;
}

function buildEventsPrompt(map: MapDdl): string {
  const npcLines = map.npcSpawns
    .map(
      (n) =>
        `  - ${n.name} (${n.npcId}): pos=${n.position}, graphic=${n.graphic}, move=${n.movement}${n.quests?.length ? `, quests=[${n.quests.join(',')}]` : ''}`,
    )
    .join('\n');

  const eventLines = map.eventTriggers
    .map(
      (e) =>
        `  - ${e.id}: pos=${e.position}, type=${e.type}, ${e.description}${e.linkedQuest ? ` [${e.linkedQuest}]` : ''}`,
    )
    .join('\n');

  const enemyLines = map.enemyZones
    .map(
      (z) =>
        `  - ${z.zone}: bounds=${z.bounds}, enemies=[${z.enemies.join(',')}], levels=${z.levelRange}`,
    )
    .join('\n');

  return `${EVENTS_CONTEXT}

Generate event spawner functions for map "${map.name}" (${map.id}).

NPCs:
${npcLines || '  - None'}

Events:
${eventLines || '  - None'}

Enemy Zones:
${enemyLines || '  - None'}

Export a function spawnMapEvents(player: RpgPlayer) that:
1. Creates NPC events via createDynamicEvent with graphics and movement
2. Sets up touch/action event triggers at specified positions
3. Registers enemy encounter zones with random encounter checks
4. Handles map transitions via player.changeMap()
5. Checks quest flags before spawning conditional events`;
}
